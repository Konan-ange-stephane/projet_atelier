import axios from 'axios';
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '../config';

/** Mettre à `true` dans `.env` pour simuler l’auth sans backend : VITE_AUTH_MOCK=true */
const USE_MOCK = import.meta.env.VITE_AUTH_MOCK === 'true';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const path = config.url || '';
    const publicAuth =
      path.includes('/auth/login') ||
      path.includes('/auth/register');
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
      const onLoginPage = window.location.pathname.startsWith('/connexion');
      if (!onLoginPage) {
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

/** Mappe le profil API vers un rôle UI (Spring : ROLE_USER → CLIENT, ROLE_AGENT → AGENT). */
function normalizeUser(raw) {
  if (!raw || typeof raw !== 'object') return null;
  let role = raw.role != null ? String(raw.role).toUpperCase() : 'CLIENT';
  if (role === 'ROLE_USER' || role === 'USER') role = 'CLIENT';
  else if (role === 'ROLE_AGENT') role = 'AGENT';
  else if (role === 'ROLE_ADMIN') role = 'ADMIN';
  return { ...raw, role };
}

/** Si le backend ne fournit pas GET /auth/me, tente de lire le profil depuis un JWT (sans vérifier la signature). */
function userFromJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64));
    const rawRole =
      payload.role ||
      (Array.isArray(payload.authorities) && payload.authorities[0]) ||
      (payload.realm_access?.roles && payload.realm_access.roles[0]);
    return normalizeUser({
      id: payload.sub ?? payload.userId ?? payload.id,
      email: payload.email ?? payload.username,
      nom: payload.nom ?? payload.name ?? '',
      prenom: payload.prenom,
      role: rawRole != null ? String(rawRole) : 'CLIENT',
    });
  } catch {
    return null;
  }
}

function splitFullName(fullName) {
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
      const user = normalizeUser(data);
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
