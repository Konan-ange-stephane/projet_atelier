/**
 * Redirection après connexion selon le rôle (déjà normalisé par `serviceAuth` : AGENT, CLIENT, ADMIN).
 * Accès manuel : `/agent/reservations` (agent), `/admin` (admin), `/client/trajets` (client).
 */
export function getPostLoginPath(role) {
  if (role == null) return '/';
  const r = String(role).toUpperCase();
  if (r === 'CLIENT' || r === 'USER' || r === 'ROLE_USER' || r === 'ROLE_CLIENT') return '/client/trajets';
  if (r === 'AGENT' || r === 'ROLE_AGENT' || r === 'COMPAGNIE') return '/agent/reservations';
  if (r === 'ADMIN' || r === 'ROLE_ADMIN') return '/admin';
  return '/';
}
