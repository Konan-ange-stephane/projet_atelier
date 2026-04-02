// src/config.js
// En dev sans VITE_API_URL : URL relative → proxy Vite (vite.config.js) vers :8080
// Voir aussi : VITE_PROXY_STRIP_API_PREFIX, VITE_AUTH_ME_PATH, VITE_AUTH_LOGIN_BODY (serviceAuth.js)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api' : 'http://localhost:8080/api');
export const TOKEN_KEY = 'smarttrip_token';
export const USER_KEY = 'smarttrip_user';
