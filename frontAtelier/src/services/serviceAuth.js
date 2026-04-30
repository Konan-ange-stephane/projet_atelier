import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../config';

/** Mettre à `true` dans `.env` pour simuler l’auth sans backend : VITE_AUTH_MOCK=true */
const USE_MOCK = import.meta.env.VITE_AUTH_MOCK === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const path = config.url || '';
    const publicAuth =
      path.includes('/auth/login') ||
      path.includes('/auth/register') ||
      path.includes('/auth/forgot-password') ||
      path.includes('/auth/reset-password');
    if (!publicAuth) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = error.config?.url || '';
      const isTripCreation = path.includes('/trips') && error.config?.method === 'post';
      const isPayment = path.includes('/payment') && error.config?.method === 'post';
      const onLoginPage = window.location.pathname.startsWith('/connexion');
      if (!onLoginPage && !isTripCreation && !isPayment) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  }
);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function extractErrorMessage(error) {
  const status = error.response?.status;
  const d = error.response?.data;

  /** Spring Security : le profil JSON peut dire « agent » mais seul le JWT compte pour /api/agent/** */
  if (status === 403) {
    if (typeof d === 'string' && d.trim()) return d.trim();
    if (d && typeof d.detail === 'string') return d.detail;
    if (d && typeof d.message === 'string') return d.message;
    if (d && typeof d.title === 'string') return d.title;
    return "Accès refusé (403). Le serveur n'autorise pas cette ressource : vérifiez que le jeton JWT contient l'autorité attendue par Spring (souvent ROLE_AGENT) pour les routes /api/agent, et que Security autorise GET /api/agent/reservations pour ce rôle.";
  }

  if (!d) {
    if (status === 401) return 'Email ou mot de passe incorrect.';
    return error.message || 'Erreur réseau';
  }

  if (typeof d.detail === 'string') return d.detail;
  if (typeof d.title === 'string' && d.detail) return `${d.title}: ${d.detail}`;
  if (typeof d.message === 'string') return d.message;
  if (Array.isArray(d.message)) return d.message.join(', ');
  if (typeof d.error === 'string') {
    if (d.error === 'Unauthorized' || status === 401) {
      return typeof d.message === 'string' ? d.message : 'Email ou mot de passe incorrect.';
    }
    return d.error;
  }
  if (d.errors && typeof d.errors === 'object') {
    const vals = Object.values(d.errors).flat();
    if (vals.length) return vals.join(', ');
  }
  if (status === 401) return 'Email ou mot de passe incorrect.';
  return 'Une erreur est survenue';
}

/**
 * Corps JSON pour POST /auth/login.
 * VITE_AUTH_LOGIN_BODY=email (défaut) | username | both
 * — beaucoup de backends Spring attendent `username` + `password`.
 */
function buildLoginBody(credentials) {
  const email = String(credentials.email ?? '').trim();
  const password = credentials.password ?? '';
  const mode = import.meta.env.VITE_AUTH_LOGIN_BODY || 'email';

  if (mode === 'username') {
    return { username: email, password };
  }
  if (mode === 'both') {
    return { email, username: email, password };
  }
  return { email, password };
}

/** Extrait le jeton depuis les formes de réponse courantes */
function extractTokenFromLoginResponse(data) {
  if (!data || typeof data !== 'object') return null;
  return (
    data.token ??
    data.accessToken ??
    data.access_token ??
    (typeof data.data === 'object' && (data.data.token ?? data.data.accessToken)) ??
    null
  );
}

export { extractErrorMessage };

/** Une entrée Spring Security : chaîne ou { authority: "ROLE_AGENT" }. */
function authorityToString(entry) {
  if (entry == null) return null;
  if (typeof entry === 'string') return entry;
  if (typeof entry === 'object' && entry.authority != null) return String(entry.authority);
  if (typeof entry === 'object' && entry.role != null) return String(entry.role);
  if (typeof entry === 'object' && entry.name != null) return String(entry.name);
  return null;
}

/** Décode le payload JWT (sans vérifier la signature). */
function parseJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

/** Ajoute une chaîne rôle à la liste (dédoublonnage simple). */
function pushRoleTokens(target, value) {
  if (value == null || value === '') return;
  if (typeof value === 'string') {
    value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => target.push(s));
    return;
  }
  const s = authorityToString(value);
  if (s) pushRoleTokens(target, s);
}

/** Backend parfois envoie ROLES_AGENT au lieu de ROLE_AGENT — on canonise pour comparaison. */
function canonRoleToken(t) {
  return String(t).trim().toUpperCase().replace(/\s+/g, '').replace(/ROLES_/g, 'ROLE_');
}

/**
 * Rassemble tous les jetons de rôle possibles (profil API + JWT).
 * `roles` peut être un tableau **ou une chaîne** (ex. "ROLES_AGENT").
 */
function collectAllRoleTokens(raw, jwtPayload) {
  const tokens = [];
  if (raw && typeof raw === 'object') {
    if (raw.role != null) pushRoleTokens(tokens, raw.role);
    if (raw.roleName != null) pushRoleTokens(tokens, raw.roleName);
    if (raw.userRole != null) pushRoleTokens(tokens, raw.userRole);
    if (Array.isArray(raw.authorities)) raw.authorities.forEach((a) => pushRoleTokens(tokens, a));
    if (Array.isArray(raw.roles)) raw.roles.forEach((r) => pushRoleTokens(tokens, r));
    else if (typeof raw.roles === 'string' && raw.roles.trim() !== '') pushRoleTokens(tokens, raw.roles);
  }
  if (jwtPayload && typeof jwtPayload === 'object') {
    if (jwtPayload.role != null) pushRoleTokens(tokens, jwtPayload.role);
    if (Array.isArray(jwtPayload.authorities)) jwtPayload.authorities.forEach((a) => pushRoleTokens(tokens, a));
    if (Array.isArray(jwtPayload.roles)) jwtPayload.roles.forEach((r) => pushRoleTokens(tokens, r));
    else if (typeof jwtPayload.roles === 'string' && jwtPayload.roles.trim() !== '') {
      pushRoleTokens(tokens, jwtPayload.roles);
    }
    const realm = jwtPayload.realm_access?.roles;
    if (Array.isArray(realm)) realm.forEach((r) => pushRoleTokens(tokens, r));
    else if (typeof realm === 'string' && realm.trim() !== '') pushRoleTokens(tokens, realm);
  }
  return [...new Set(tokens.map((t) => String(t).trim()).filter(Boolean))];
}

/**
 * Une seule valeur de rôle (champ `role` ou un élément de `roles`) → rôle UI.
 * Ne renvoie pas « CLIENT » par défaut : null si non reconnu.
 */
function mapSpringTokenToUi(single) {
  if (single == null || String(single).trim() === '') return null;
  const u = canonRoleToken(single);
  if (u === 'ROLE_ADMIN' || u === 'ADMIN') return 'ADMIN';
  if (u === 'ROLE_AGENT' || u === 'AGENT' || u === 'COMPAGNIE') return 'AGENT';
  if (u === 'ROLE_USER' || u === 'USER' || u === 'ROLE_CLIENT' || u === 'CLIENT') return 'CLIENT';
  if (u === 'CLIENT' || u === 'AGENT' || u === 'ADMIN') return u;
  return null;
}

/** Priorité à partir d’autorités / listes : ADMIN > AGENT > CLIENT ; sinon null (pas de défaut CLIENT). */
function resolveUiRoleFromTokens(tokens) {
  let score = 0;
  for (const t of tokens) {
    const u = canonRoleToken(t);
    let s = 0;
    if (u === 'ROLE_ADMIN' || u === 'ADMIN' || u.includes('ROLE_ADMIN')) s = 3;
    else if (u === 'ROLE_AGENT' || u === 'AGENT' || u.includes('ROLE_AGENT') || u === 'COMPAGNIE') s = 2;
    else if (u.includes('AGENT') && !u.includes('USER')) s = 2;
    else if (u === 'ROLE_USER' || u === 'ROLE_CLIENT' || u === 'CLIENT' || u === 'USER') s = 1;
    if (s > score) score = s;
  }
  if (score >= 3) return 'ADMIN';
  if (score >= 2) return 'AGENT';
  if (score >= 1) return 'CLIENT';
  return null;
}

/** Mappe le profil API (+ JWT) : utilise d’abord les jetons agrégés, sinon `role`, sinon `roles[]` — sans forcer CLIENT. */
function normalizeUser(raw, bearerToken = null) {
  if (!raw || typeof raw !== 'object') return null;
  const token = bearerToken ?? localStorage.getItem(TOKEN_KEY);
  const jwtPayload = token ? parseJwtPayload(token) : null;
  const tokens = collectAllRoleTokens(raw, jwtPayload);

  let role = tokens.length ? resolveUiRoleFromTokens(tokens) : null;

  if (role == null && raw.role != null && String(raw.role).trim() !== '') {
    role = mapSpringTokenToUi(raw.role);
  }

  if (role == null && raw.roles != null) {
    const fromRoles = [];
    if (Array.isArray(raw.roles)) raw.roles.forEach((r) => pushRoleTokens(fromRoles, r));
    else if (typeof raw.roles === 'string') pushRoleTokens(fromRoles, raw.roles);
    const uniq = [...new Set(fromRoles.map((t) => String(t).trim()).filter(Boolean))];
    if (uniq.length) {
      role = resolveUiRoleFromTokens(uniq);
      if (role == null && uniq.length === 1) role = mapSpringTokenToUi(uniq[0]);
    }
  }

  return { ...raw, role: role ?? null };
}

/** Si le backend ne fournit pas GET /auth/me, profil depuis le JWT uniquement. */
function userFromJwt(token) {
  const payload = parseJwtPayload(token);
  if (!payload) return null;
  return normalizeUser(
    {
      id: payload.sub ?? payload.userId ?? payload.id,
      email: payload.email ?? payload.username,
      nom: payload.nom ?? payload.name ?? '',
      prenom: payload.prenom,
      role: payload.role,
      authorities: payload.authorities,
      roles: payload.roles != null ? payload.roles : payload.realm_access?.roles,
    },
    token
  );
}

/** « Prénom Nom » ou un seul token → utilisé inscription / profil. */
export function splitFullName(fullName) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { prenom: '', nom: '' };
  if (parts.length === 1) return { prenom: '', nom: parts[0] };
  return { prenom: parts[0], nom: parts.slice(1).join(' ') };
}

/**
 * POST /api/auth/register : inscription générale uniquement (ROLE_USER côté serveur).
 * Corps : nom, prenom, email, password, telephone (optionnel) — sans rôle ni champs agent/compagnie.
 */
export function buildRegisterPayload(userData) {
  const email = String(userData.email ?? '').trim();
  const password = userData.password ?? '';
  const fullName = userData.nom ?? userData.nomComplet ?? '';
  const { prenom, nom } = splitFullName(fullName);

  const body = {
    email,
    password,
    nom,
    prenom,
  };

  const tel = userData.telephone;
  if (tel && String(tel).trim()) {
    body.telephone = String(tel).trim();
  }

  return body;
}

export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  getCurrentUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  clearLocalSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * GET profil connecté (Bearer). Chemin par défaut : /auth/me (avec baseURL = /api → /api/auth/me).
   * Surcharge : VITE_AUTH_ME_PATH=/autre/chemin
   * Si 404 et token JWT : repli sur le payload du token (backend sans /me).
   */
  fetchCurrentUser: async () => {
    if (USE_MOCK) {
      const u = authService.getCurrentUser();
      if (u) return u;
      throw new Error('Non connecté');
    }

    const mePath = import.meta.env.VITE_AUTH_ME_PATH || '/auth/me';
    const token = authService.getToken();

    try {
      const { data } = await api.get(mePath);
      const user = normalizeUser(data, token);
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      return user;
    } catch (err) {
      const status = err.response?.status;
      if (status === 404 && token) {
        const fromJwt = userFromJwt(token);
        if (fromJwt) {
          localStorage.setItem(USER_KEY, JSON.stringify(fromJwt));
          return fromJwt;
        }
      }
      throw err;
    }
  },

  /**
   * Mise à jour du profil connecté (Bearer).
   * Défaut : PUT /api/auth/me — surcharge VITE_AUTH_UPDATE_PROFILE_PATH (ex. /users/me).
   * Corps typique Spring : nom, prenom, telephone, email (selon ce que le backend accepte).
   */
  updateProfile: async (fields) => {
    if (USE_MOCK) {
      const u = authService.getCurrentUser() || {};
      const merged = normalizeUser({ ...u, ...fields }, authService.getToken());
      if (merged) localStorage.setItem(USER_KEY, JSON.stringify(merged));
      return authService.getCurrentUser();
    }
    const updatePath = import.meta.env.VITE_AUTH_UPDATE_PROFILE_PATH || '/auth/me';
    await api.put(updatePath, fields);
    return await authService.fetchCurrentUser();
  },

  /**
   * Changement de mot de passe.
   * Défaut : POST /api/auth/change-password — surcharge VITE_AUTH_CHANGE_PASSWORD_PATH.
   * Corps : currentPassword, newPassword (adapter le backend si besoin).
   */
  changePassword: async ({ currentPassword, newPassword }) => {
    if (USE_MOCK) {
      await delay(400);
      return;
    }
    const path = import.meta.env.VITE_AUTH_CHANGE_PASSWORD_PATH || '/auth/change-password';
    await api.post(path, { currentPassword, newPassword });
  },
  forgotPassword: async (email) => {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await api.post('/auth/forgot-password', { email });
  },
  resetPassword: async (token, newPassword) => {
    if (USE_MOCK) {
      await delay(500);
      return;
    }
    await api.post('/auth/reset-password', { token, newPassword });
  },

  login: async (credentials) => {
    if (USE_MOCK) {
      await delay(500);
      if (credentials.email && credentials.password) {
        const fakeUser = {
          id: 1,
          nom: 'Test User',
          email: credentials.email,
          role: 'CLIENT',
        };
        const fakeToken = `fake-jwt-token-${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, fakeToken);
        localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
        return { token: fakeToken, user: fakeUser };
      }
      throw new Error('Email ou mot de passe invalide');
    }

    const { data } = await api.post('/auth/login', buildLoginBody(credentials));

    const token = extractTokenFromLoginResponse(data);
    if (!token) {
      throw new Error('Réponse serveur invalide : token manquant');
    }

    localStorage.setItem(TOKEN_KEY, token);

    const user = await authService.fetchCurrentUser();
    return { token, user };
  },

  register: async (userData) => {
    if (USE_MOCK) {
      await delay(500);
      if (userData.email && userData.password && userData.nom) {
        return {
          message: 'Inscription réussie',
          user: { nom: userData.nom, email: userData.email },
        };
      }
      throw new Error('Données invalides');
    }

    const body = buildRegisterPayload(userData);
    const { data } = await api.post('/auth/register', body);
    return data;
  },

  /**
   * POST /api/auth/logout puis suppression locale du token.
   * L’échec réseau n’empêche pas la déconnexion côté client.
   */
  logout: async () => {
    if (USE_MOCK) {
      authService.clearLocalSession();
      return;
    }
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    authService.clearLocalSession();
  },
};

export default api;
