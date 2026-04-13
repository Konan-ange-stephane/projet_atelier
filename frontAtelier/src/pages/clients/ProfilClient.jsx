// src/pages/client/Profil.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';

// ── Récupère l'auth selon ton hook ──────────────────────────────────────
// Adapte l'import selon ton projet :
// import { useAuth } from '../../hooks/useAuth';
// import { useAuth } from '../../context/AuthContext';

// Mock temporaire si pas de contexte dispo
const useAuthFallback = () => {
  const stored = localStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : { nom: 'Julien Koné', email: 'julien@email.com', telephone: '+225 07 00 00 00 00', role: 'CLIENT' };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  return { user, logout };
};

// ────────────────────────────────────────────────────────────────────────

const Profil = () => {
  const navigate = useNavigate();

  // Essaie d'utiliser ton vrai hook, sinon le fallback
  let user, logout;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const auth = useAuthFallback(); // ← remplace par useAuth() quand le backend est prêt
    user = auth.user;
    logout = auth.logout;
  } catch {
    const fb = useAuthFallback();
    user = fb.user;
    logout = fb.logout;
  }

  // ── États ──
  const [onglet, setOnglet] = useState('profil'); // 'profil' | 'securite'
  const [modeEdition, setModeEdition] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [confirmDeconnexion, setConfirmDeconnexion] = useState(false);

  const [formulaire, setFormulaire] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  });

  const [mdp, setMdp] = useState({
    actuel: '',
    nouveau: '',
    confirmer: '',
  });
  const [voirMdp, setVoirMdp] = useState({ actuel: false, nouveau: false, confirmer: false });
  const [erreurMdp, setErreurMdp] = useState('');
  const [succèsMdp, setSuccèsMdp] = useState(false);

  // ── Handlers ──
  const gererChangement = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const sauvegarderProfil = async () => {
    setSauvegarde(true);
    // TODO: appeler l'API de mise à jour du profil
    await new Promise(r => setTimeout(r, 800));
    setSauvegarde(false);
    setModeEdition(false);
  };

  const changerMotDePasse = async (e) => {
    e.preventDefault();
    setErreurMdp('');
    setSuccèsMdp(false);
    if (mdp.nouveau.length < 6) { setErreurMdp('Le nouveau mot de passe doit faire au moins 6 caractères.'); return; }
    if (mdp.nouveau !== mdp.confirmer) { setErreurMdp('Les mots de passe ne correspondent pas.'); return; }
    // TODO: appeler l'API
    await new Promise(r => setTimeout(r, 800));
    setSuccèsMdp(true);
    setMdp({ actuel: '', nouveau: '', confirmer: '' });
  };

  const handleDeconnexion = () => {
    logout();
    navigate('/connexion');
  };

  // ── Icônes ──
  const IconePerson = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
  const IconeEmail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
  const IconeTel = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.49 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
  const IconeLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
  const IconeOeil = ({ ouvert }) => ouvert
    ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

  const initiale = (formulaire.nom || user?.nom || 'U')[0].toUpperCase();

  return (
    <LayoutClient title="Mon profil">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── CARTE HERO PROFIL ── */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden shadow-xl shadow-blue-100">
          {/* Cercles déco */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full pointer-events-none" />

          {/* Avatar */}
          <div className="relative flex-shrink-0 z-10">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-lg">
              <span className="text-4xl font-black text-white">{initiale}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white shadow" title="En ligne" />
          </div>

          {/* Infos */}
          <div className="z-10 text-center sm:text-left flex-1">
            <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-1">Passager</p>
            <h2 className="text-2xl font-black text-white mb-1">{formulaire.nom || 'Mon profil'}</h2>
            <p className="text-blue-100 text-sm font-bold">{formulaire.email}</p>
            {formulaire.telephone && (
              <p className="text-blue-200 text-xs font-bold mt-1">{formulaire.telephone}</p>
            )}
          </div>

          {/* Bouton modifier */}
          <button
            onClick={() => { setModeEdition(true); setOnglet('profil'); }}
            className="z-10 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-2xl transition-all flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Modifier
          </button>
        </div>

        {/* ── ONGLETS ── */}
        <div className="flex gap-2">
          {[
            { key: 'profil',   label: '👤 Mes informations' },
            { key: 'securite', label: '🔒 Sécurité' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setOnglet(tab.key); setModeEdition(false); }}
              className={`px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                onglet === tab.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'bg-white text-slate-500 border border-slate-100 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══ ONGLET PROFIL ══════════════════════════════════════ */}
        {onglet === 'profil' && (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-50">
              <h3 className="font-black text-slate-900">Informations personnelles</h3>
              {!modeEdition && (
                <button
                  onClick={() => setModeEdition(true)}
                  className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                  Modifier →
                </button>
              )}
            </div>

            <div className="p-7 space-y-5">
              {/* Nom */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <IconePerson /> Nom complet
                </label>
                {modeEdition ? (
                  <input
                    type="text"
                    name="nom"
                    value={formulaire.nom}
                    onChange={gererChangement}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
                  />
                ) : (
                  <p className="font-bold text-slate-900 text-sm px-4 py-3.5 bg-slate-50 rounded-2xl">{formulaire.nom || '—'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <IconeEmail /> Adresse email
                </label>
                {modeEdition ? (
                  <input
                    type="email"
                    name="email"
                    value={formulaire.email}
                    onChange={gererChangement}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm"
                  />
                ) : (
                  <p className="font-bold text-slate-900 text-sm px-4 py-3.5 bg-slate-50 rounded-2xl">{formulaire.email || '—'}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <IconeTel /> Téléphone
                </label>
                {modeEdition ? (
                  <input
                    type="tel"
                    name="telephone"
                    value={formulaire.telephone}
                    onChange={gererChangement}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm placeholder-slate-300"
                  />
                ) : (
                  <p className="font-bold text-slate-900 text-sm px-4 py-3.5 bg-slate-50 rounded-2xl">{formulaire.telephone || 'Non renseigné'}</p>
                )}
              </div>

              {/* Rôle (lecture seule) */}
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Rôle
                </label>
                <div className="flex items-center gap-2 px-4 py-3.5 bg-blue-50 rounded-2xl">
                  <span className="text-sm font-black text-blue-700">{user?.role || 'CLIENT'}</span>
                  <span className="ml-auto text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded-lg">Non modifiable</span>
                </div>
              </div>

              {/* Boutons mode édition */}
              {modeEdition && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={sauvegarderProfil}
                    disabled={sauvegarde}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {sauvegarde ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Sauvegarde...
                      </>
                    ) : '✓ Sauvegarder'}
                  </button>
                  <button
                    onClick={() => { setModeEdition(false); setFormulaire({ nom: user?.nom || '', email: user?.email || '', telephone: user?.telephone || '' }); }}
                    className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all text-xs uppercase tracking-widest"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ ONGLET SÉCURITÉ ════════════════════════════════════ */}
        {onglet === 'securite' && (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-50">
              <h3 className="font-black text-slate-900">Changer le mot de passe</h3>
            </div>

            <form onSubmit={changerMotDePasse} className="p-7 space-y-4">
              {erreurMdp && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-bold flex items-center gap-2">
                  <span>⚠️</span> {erreurMdp}
                </div>
              )}
              {succèsMdp && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-sm font-bold flex items-center gap-2">
                  <span>✅</span> Mot de passe mis à jour avec succès !
                </div>
              )}

              {[
                { key: 'actuel',    label: 'Mot de passe actuel',     placeholder: '••••••••' },
                { key: 'nouveau',   label: 'Nouveau mot de passe',    placeholder: 'Au moins 6 caractères' },
                { key: 'confirmer', label: 'Confirmer le nouveau mot de passe', placeholder: 'Répétez le nouveau mot de passe' },
              ].map((champ) => (
                <div key={champ.key}>
                  <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    <IconeLock /> {champ.label}
                  </label>
                  <div className="relative">
                    <input
                      type={voirMdp[champ.key] ? 'text' : 'password'}
                      value={mdp[champ.key]}
                      onChange={e => setMdp({ ...mdp, [champ.key]: e.target.value })}
                      placeholder={champ.placeholder}
                      required
                      className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all text-sm placeholder-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setVoirMdp({ ...voirMdp, [champ.key]: !voirMdp[champ.key] })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <IconeOeil ouvert={voirMdp[champ.key]} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 uppercase tracking-widest text-xs mt-2"
              >
                🔒 Mettre à jour le mot de passe
              </button>
            </form>
          </div>
        )}

        {/* ── ZONE DÉCONNEXION ── */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-slate-900 text-sm mb-0.5">Se déconnecter</p>
            <p className="text-slate-400 text-xs">Vous serez redirigé vers la page de connexion</p>
          </div>

          {!confirmDeconnexion ? (
            <button
              onClick={() => setConfirmDeconnexion(true)}
              className="flex items-center gap-2 px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-2xl transition-all text-xs uppercase tracking-widest border border-rose-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
              Déconnexion
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-500 mr-1">Confirmer ?</p>
              <button
                onClick={handleDeconnexion}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Oui, partir
              </button>
              <button
                onClick={() => setConfirmDeconnexion(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Annuler
              </button>
            </div>
          )}
        </div>

      </div>
    </LayoutClient>
  );
};

export default Profil;