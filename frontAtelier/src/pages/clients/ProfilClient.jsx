import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutClient from '../../components/LayoutClient';
import Chargeur from '../../components/Chargeur';
import { authService, splitFullName } from '../../services/serviceAuth';

function userToForm(u) {
  if (!u || typeof u !== 'object') {
    return { nom: '', email: '', telephone: '' };
  }
  const nomAffiche =
    [u.prenom, u.nom].filter(Boolean).join(' ').trim() ||
    u.nom ||
    u.name ||
    u.username ||
    '';
  return {
    nom: nomAffiche,
    email: u.email ?? u.username ?? '',
    telephone: u.telephone ?? u.phone ?? u.tel ?? '',
  };
}

const ProfilClient = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chargementProfil, setChargementProfil] = useState(true);
  const [erreurChargement, setErreurChargement] = useState('');

  const [onglet, setOnglet] = useState('profil');
  const [modeEdition, setModeEdition] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [confirmDeconnexion, setConfirmDeconnexion] = useState(false);

  const [formulaire, setFormulaire] = useState({ nom: '', email: '', telephone: '' });

  const [mdp, setMdp] = useState({ actuel: '', nouveau: '', confirmer: '' });
  const [voirMdp, setVoirMdp] = useState({ actuel: false, nouveau: false, confirmer: false });
  const [erreurMdp, setErreurMdp] = useState('');
  const [succèsMdp, setSuccèsMdp] = useState(false);
  const [mdpEnCours, setMdpEnCours] = useState(false);

  const rechargerProfil = useCallback(async () => {
    setErreurChargement('');
    try {
      const u = await authService.fetchCurrentUser();
      setUser(u);
      setFormulaire(userToForm(u));
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Impossible de charger le profil.';
      setErreurChargement(msg);
      const local = authService.getCurrentUser();
      if (local) {
        setUser(local);
        setFormulaire(userToForm(local));
      } else {
        setUser(null);
      }
    } finally {
      setChargementProfil(false);
    }
  }, []);

  useEffect(() => {
    rechargerProfil();
  }, [rechargerProfil]);

  const gererChangement = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const sauvegarderProfil = async () => {
    setSauvegarde(true);
    try {
      const { prenom, nom } = splitFullName(formulaire.nom);
      await authService.updateProfile({
        nom,
        prenom,
        telephone: formulaire.telephone.trim(),
        email: formulaire.email.trim(),
      });
      await rechargerProfil();
      setModeEdition(false);
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Enregistrement impossible.');
    } finally {
      setSauvegarde(false);
    }
  };

  const changerMotDePasse = async (e) => {
    e.preventDefault();
    setErreurMdp('');
    setSuccèsMdp(false);
    if (mdp.nouveau.length < 6) {
      setErreurMdp('Le nouveau mot de passe doit faire au moins 6 caractères.');
      return;
    }
    if (mdp.nouveau !== mdp.confirmer) {
      setErreurMdp('Les mots de passe ne correspondent pas.');
      return;
    }
    setMdpEnCours(true);
    try {
      await authService.changePassword({
        currentPassword: mdp.actuel,
        newPassword: mdp.nouveau,
      });
      setSuccèsMdp(true);
      setMdp({ actuel: '', nouveau: '', confirmer: '' });
    } catch (err) {
      setErreurMdp(err?.response?.data?.message || err?.message || 'Changement de mot de passe impossible.');
    } finally {
      setMdpEnCours(false);
    }
  };

  const handleDeconnexion = async () => {
    await authService.logout();
    navigate('/connexion');
  };

  const IconePerson = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  const IconeEmail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
  const IconeTel = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.49 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
  const IconeLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
  const IconeOeil = ({ ouvert }) =>
    ouvert ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  const initiale = (formulaire.nom || user?.nom || user?.email || 'U')[0].toUpperCase();
  const roleAffiche = user?.role ?? '—';

  if (chargementProfil) return <Chargeur fullScreen />;

  return (
    <LayoutClient title="Mon profil">
      <div className="mx-auto max-w-3xl space-y-6">
        {erreurChargement && !user && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {erreurChargement}
          </div>
        )}
        {erreurChargement && user && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
            Données locales affichées — rafraîchissement serveur : {erreurChargement}
          </div>
        )}

        <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-500 p-8 shadow-xl shadow-blue-100 sm:flex-row sm:items-start">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative z-10 flex-shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-white/30 bg-white/20 shadow-lg backdrop-blur-md">
              <span className="text-4xl font-black text-white">{initiale}</span>
            </div>
            <div
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white bg-green-400 shadow"
              title="Connecté"
            />
          </div>

          <div className="z-10 flex-1 text-center sm:text-left">
            <p className="mb-1 text-xs font-black uppercase tracking-widest text-blue-200">Passager</p>
            <h2 className="mb-1 text-2xl font-black text-white">{formulaire.nom || 'Mon profil'}</h2>
            <p className="text-sm font-bold text-blue-100">{formulaire.email || '—'}</p>
            {formulaire.telephone ? <p className="mt-1 text-xs font-bold text-blue-200">{formulaire.telephone}</p> : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setModeEdition(true);
              setOnglet('profil');
            }}
            className="z-10 flex flex-shrink-0 items-center gap-2 rounded-2xl border border-white/30 bg-white/20 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Modifier
          </button>
        </div>

        <div className="flex gap-2">
          {[
            { key: 'profil', label: '👤 Mes informations' },
            { key: 'securite', label: '🔒 Sécurité' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setOnglet(tab.key);
                setModeEdition(false);
              }}
              className={`rounded-2xl px-5 py-3 text-sm font-black uppercase tracking-wider transition-all ${
                onglet === tab.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'border border-slate-100 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {onglet === 'profil' && (
          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-50 px-7 py-5">
              <h3 className="font-black text-slate-900">Informations personnelles</h3>
              {!modeEdition && (
                <button
                  type="button"
                  onClick={() => setModeEdition(true)}
                  className="text-xs font-black uppercase tracking-widest text-blue-600 hover:underline"
                >
                  Modifier →
                </button>
              )}
            </div>

            <div className="space-y-5 p-7">
              <p className="text-xs text-slate-500">
                Données issues de <span className="font-mono">GET /api/auth/me</span> (ou repli JWT). Enregistrement :{' '}
                <span className="font-mono">PUT /api/auth/me</span> — chemins surchargeables via variables
                d’environnement (voir <span className="font-mono">config.js</span>).
              </p>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <IconePerson /> Nom complet
                </label>
                {modeEdition ? (
                  <input
                    type="text"
                    name="nom"
                    value={formulaire.nom}
                    onChange={gererChangement}
                    className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white"
                  />
                ) : (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900">{formulaire.nom || '—'}</p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <IconeEmail /> Adresse email
                </label>
                {modeEdition ? (
                  <input
                    type="email"
                    name="email"
                    value={formulaire.email}
                    onChange={gererChangement}
                    className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-blue-600 focus:bg-white"
                  />
                ) : (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900">{formulaire.email || '—'}</p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <IconeTel /> Téléphone
                </label>
                {modeEdition ? (
                  <input
                    type="tel"
                    name="telephone"
                    value={formulaire.telephone}
                    onChange={gererChangement}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full rounded-2xl border-2 border-transparent bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all placeholder-slate-300 focus:border-blue-600 focus:bg-white"
                  />
                ) : (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-900">
                    {formulaire.telephone || 'Non renseigné'}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Rôle
                </label>
                <div className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3.5">
                  <span className="text-sm font-black text-blue-700">{roleAffiche}</span>
                  <span className="ml-auto rounded-lg bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-400">
                    Non modifiable
                  </span>
                </div>
              </div>

              {modeEdition && (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={sauvegarderProfil}
                    disabled={sauvegarde}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60"
                  >
                    {sauvegarde ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Sauvegarde...
                      </>
                    ) : (
                      '✓ Sauvegarder'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModeEdition(false);
                      setFormulaire(userToForm(user));
                    }}
                    className="rounded-2xl bg-slate-100 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-200"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {onglet === 'securite' && (
          <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-50 px-7 py-5">
              <h3 className="font-black text-slate-900">Changer le mot de passe</h3>
              <p className="mt-1 text-xs text-slate-500">
                <span className="font-mono">POST /api/auth/change-password</span> — corps{' '}
                <span className="font-mono">currentPassword</span>, <span className="font-mono">newPassword</span> (ou
                surcharge <span className="font-mono">VITE_AUTH_CHANGE_PASSWORD_PATH</span>).
              </p>
            </div>

            <form onSubmit={changerMotDePasse} className="space-y-4 p-7">
              {erreurMdp && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                  <span>⚠️</span> {erreurMdp}
                </div>
              )}
              {succèsMdp && (
                <div className="flex items-center gap-2 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700">
                  <span>✅</span> Mot de passe mis à jour.
                </div>
              )}

              {[
                { key: 'actuel', label: 'Mot de passe actuel', placeholder: '••••••••' },
                { key: 'nouveau', label: 'Nouveau mot de passe', placeholder: 'Au moins 6 caractères' },
                { key: 'confirmer', label: 'Confirmer le nouveau mot de passe', placeholder: 'Répétez le nouveau mot de passe' },
              ].map((champ) => (
                <div key={champ.key}>
                  <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <IconeLock /> {champ.label}
                  </label>
                  <div className="relative">
                    <input
                      type={voirMdp[champ.key] ? 'text' : 'password'}
                      value={mdp[champ.key]}
                      onChange={(e) => setMdp({ ...mdp, [champ.key]: e.target.value })}
                      placeholder={champ.placeholder}
                      required
                      className="w-full rounded-2xl border-2 border-transparent bg-slate-50 py-3.5 pl-4 pr-12 text-sm font-bold text-slate-900 outline-none transition-all placeholder-slate-300 focus:border-blue-600 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setVoirMdp({ ...voirMdp, [champ.key]: !voirMdp[champ.key] })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-blue-600"
                    >
                      <IconeOeil ouvert={voirMdp[champ.key]} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={mdpEnCours}
                className="mt-2 w-full rounded-2xl bg-blue-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60"
              >
                {mdpEnCours ? 'Envoi…' : '🔒 Mettre à jour le mot de passe'}
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:flex-row">
          <div>
            <p className="mb-0.5 text-sm font-black text-slate-900">Se déconnecter</p>
            <p className="text-xs text-slate-400">Vous serez redirigé vers la page de connexion</p>
          </div>

          {!confirmDeconnexion ? (
            <button
              type="button"
              onClick={() => setConfirmDeconnexion(true)}
              className="flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-3 text-xs font-black uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Déconnexion
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <p className="mr-1 text-xs font-bold text-slate-500">Confirmer ?</p>
              <button
                type="button"
                onClick={handleDeconnexion}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-rose-700"
              >
                Oui, partir
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeconnexion(false)}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-200"
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

export default ProfilClient;
