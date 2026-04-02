/** Redirection après connexion selon le rôle renvoyé par le backend (Spring : ROLE_USER, ROLE_AGENT, etc.) */
export function getPostLoginPath(role) {
  if (role == null) return '/';
  const r = String(role).toUpperCase();
  if (r === 'CLIENT' || r === 'USER' || r === 'ROLE_USER') return '/client/trajets';
  if (r === 'AGENT' || r === 'ROLE_AGENT' || r === 'COMPAGNIE') return '/agent/trips';
  if (r === 'ADMIN' || r === 'ROLE_ADMIN') return '/admin/statistics';
  return '/';
}
