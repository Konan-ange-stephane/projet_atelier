// src/config.js
// En dev : préférer /api → proxy Vite (vite.config.js) vers le backend, pour éviter le CORS.
// Voir aussi : VITE_PROXY_STRIP_API_PREFIX, VITE_AUTH_ME_PATH, VITE_AUTH_LOGIN_BODY,
// VITE_AUTH_UPDATE_PROFILE_PATH (PUT profil), VITE_AUTH_CHANGE_PASSWORD_PATH (serviceAuth.js)

function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (import.meta.env.DEV) {
    // Appels directs vers localhost:8080 depuis :5173 = CORS sauf si le backend autorise l’origine.
    // Le proxy Vite redirige /api → même chemin sur :8080, sans cross-origin.
    if (!envUrl || /^https?:\/\/(localhost|127\.0\.0\.1):8080\b/i.test(envUrl)) {
      return '/api';
    }
    return envUrl;
  }

  // Build production : URL complète du backend (définir VITE_API_URL au déploiement)
  return envUrl || 'http://localhost:8080/api';
}

export const API_BASE_URL = resolveApiBaseUrl();
export const TOKEN_KEY = 'smarttrip_token';
export const USER_KEY = 'smarttrip_user';
