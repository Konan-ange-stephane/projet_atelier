// src/pages/Inscription.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

const Inscription = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();

  // Détermine l'onglet initial selon l'URL (?role=agent ou ?role=compagnie)
  const roleParam = searchParams.get('role');
  const ongletInitial = roleParam === 'agent' ? 'AGENT' : roleParam === 'compagnie' ? 'COMPAGNIE' : 'CLIENT';

  const [onglet, setOnglet] = useState(ongletInitial);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [afficherCode, setAfficherCode] = useState(false);

  const [formulaire, setFormulaire] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    // Champs COMPAGNIE
    nomCompagnie: '',
    codeAcces: '',        // code que la compagnie définit pour ses agents
    nomResponsable: '',
    // Champ AGENT
    codeCompagnie: '',    // code fourni par la compagnie à l'agent
  });

  // Réinitialiser les champs spécifiques au changement d'onglet
  useEffect(() => {
    setErreur('');
    setFormulaire(prev => ({
      ...prev,
      nomCompagnie: '',
      codeAcces: '',
      nomResponsable: '',
      codeCompagnie: '',
    }));
  }, [onglet]);

  const gererChangement = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
    setErreur('');
  };

  const validerFormulaire = () => {
    if (onglet !== 'COMPAGNIE' && !formulaire.nomComplet.trim()) return 'Le nom complet est obligatoire.';
    if (!formulaire.email.includes('@')) return 'Adresse email invalide.';
    if (onglet === 'COMPAGNIE' && formulaire.telephone.length < 8) return 'Numéro de téléphone invalide.';
    if (formulaire.motDePasse.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if (formulaire.motDePasse !== formulaire.confirmerMotDePasse) return 'Les mots de passe ne correspondent pas.';

    if (onglet === 'COMPAGNIE') {
      if (!formulaire.nomCompagnie.trim()) return 'Le nom de la compagnie est obligatoire.';
      if (!formulaire.codeAcces.trim()) return 'Vous devez définir un code d\'accès pour vos agents.';
      if (formulaire.codeAcces.length < 4) return 'Le code d\'accès doit contenir au moins 4 caractères.';
    }

    if (onglet === 'AGENT') {
      if (!formulaire.codeCompagnie.trim()) return 'Le code d\'accès de votre compagnie est obligatoire.';
    }

    return null;
  };

  const gererInscription = async (e) => {
    e.preventDefault();
    setErreur('');

    const erreurValidation = validerFormulaire();
    if (erreurValidation) {
      setErreur(erreurValidation);
      return;
    }

    setChargement(true);

    // Payload adapté selon le rôle — compatible avec ton useAuth register()
    const payload = {
      nom: formulaire.nomComplet,
      email: formulaire.email,
      password: formulaire.motDePasse,
      telephone: formulaire.telephone,
      role: onglet,
      ...(onglet === 'COMPAGNIE' && {
        nomCompagnie: formulaire.nomCompagnie,
        codeAcces: formulaire.codeAcces,  // sera stocké en base pour valider les agents
      }),
      ...(onglet === 'AGENT' && {
        codeCompagnie: formulaire.codeCompagnie, // validé côté backend
      }),
    };

    const result = await register(payload);
    setChargement(false);

    if (result.success) {
      if (onglet === 'COMPAGNIE') {
        alert(`Compte compagnie créé ! Votre code d'accès agents est : ${formulaire.codeAcces}\nPartagez-le à vos agents pour qu'ils puissent s'inscrire.`);
      } else {
        alert("Compte créé ! Connectez-vous maintenant.");
      }
      navigate('/connexion');
    } else {
      setErreur(result.error);
    }
  };

  // Configs des onglets
  const onglets = [
    {
      id: 'CLIENT',
      label: 'Voyageur',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
      ),
      actifClass: 'bg-gradient-to-r from-bleu-secondaire to-cyan-accent text-white',
    },
    {
      id: 'COMPAGNIE',
      label: 'Compagnie',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25h1.5V6h-9v13.5h3ZM8.25 13.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Zm.75-3.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9ZM9 7.5a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9ZM6 7.5a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H6Zm0 3a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H6Zm0 3a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5H6Z" clipRule="evenodd" />
          <path d="M18 6.75a.75.75 0 0 0-.75.75v12h1.5V9h1.5a.75.75 0 0 0 0-1.5h-.75v-.75a.75.75 0 0 0-.75-.75H18Z" />
        </svg>
      ),
      actifClass: 'bg-bleu-nuit text-cyan-accent',
    },
    {
      id: 'AGENT',
      label: 'Agent',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a3 3 0 1 1 6 0h.375c1.035 0 1.875-.84 1.875-1.875v-3.75a3 3 0 0 0-3-3H13.5v4.5Z" />
          <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
          <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
      ),
      actifClass: 'bg-emerald-600 text-white',
    },
  ];

  const ongletActif = onglets.find(o => o.id === onglet);

  // Messages contextuels par rôle
  const messages = {
    CLIENT: { emoji: '✈️', texte: 'Créez votre compte pour réserver vos trajets en quelques clics.' },
    COMPAGNIE: { emoji: '🏢', texte: 'Enregistrez votre compagnie et définissez un code d\'accès à partager à vos agents.' },
    AGENT: { emoji: '🎫', texte: 'Entrez le code d\'accès fourni par votre compagnie pour créer votre compte agent.' },
  };

  // Couleurs de focus selon onglet
  const focusClass = {
    CLIENT: 'focus:border-bleu-secondaire focus:ring-bleu-secondaire/20',
    COMPAGNIE: 'focus:border-cyan-accent focus:ring-cyan-accent/20',
    AGENT: 'focus:border-emerald-500 focus:ring-emerald-500/20',
  }[onglet];

  const champTexte = (label, name, type = 'text', placeholder = '', requis = true) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {requis && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formulaire[name]}
        onChange={gererChangement}
        placeholder={placeholder}
        required={requis}
        className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 ${focusClass} focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-fond-clair font-sans">
      <BarreNav />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-lg mx-auto">

            {/* Titre */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-bleu-nuit mb-2">
                Créer un compte
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Rejoignez SmartTrip et simplifiez vos déplacements
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">

              {/* --- ONGLETS 3 RÔLES --- */}
              <div className="flex rounded-2xl overflow-hidden border-2 border-gray-200 mb-6">
                {onglets.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOnglet(o.id)}
                    className={`flex-1 py-3 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5
                      ${onglet === o.id ? o.actifClass : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                  >
                    {o.icon}
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Message contextuel */}
              <div className={`rounded-xl px-4 py-3 mb-6 text-xs sm:text-sm flex items-start gap-2 border ${
                onglet === 'CLIENT' ? 'bg-bleu-secondaire/10 border-bleu-secondaire/20 text-bleu-nuit' :
                onglet === 'COMPAGNIE' ? 'bg-cyan-accent/10 border-cyan-accent/30 text-bleu-nuit' :
                'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <span className="text-base mt-0.5">{messages[onglet].emoji}</span>
                <span>{messages[onglet].texte}</span>
              </div>

              {/* Erreur globale */}
              {erreur && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{erreur}</span>
                </div>
              )}

              <form onSubmit={gererInscription} className="space-y-4">

                {/* ===== CHAMPS COMPAGNIE ===== */}
                {onglet === 'COMPAGNIE' && (
                  <>
                    {champTexte('Nom de la compagnie', 'nomCompagnie', 'text', 'Ex: CTM, UTB, GTI...')}

                    {/* Code d'accès agents */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Code d'accès pour vos agents <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={afficherCode ? 'text' : 'password'}
                          name="codeAcces"
                          value={formulaire.codeAcces}
                          onChange={gererChangement}
                          placeholder="Ex: CTM-2024 (à partager à vos agents)"
                          required
                          className={`w-full px-4 py-3 pr-12 rounded-xl border-2 border-cyan-accent/50 bg-cyan-accent/5 ${focusClass} focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm`}
                        />
                        <button type="button" onClick={() => setAfficherCode(!afficherCode)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {afficherCode
                            ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577A11.217 11.217 0 0 1 12 3.75c5.25 0 9.875 3.51 11.374 8.803a11.176 11.176 0 0 1-.698 0ZM5.44 8.56 3.985 7.105a11.232 11.232 0 0 0-2.66 4.698 9.75 9.75 0 0 0 5.56 6.508l1.067-1.068A9.75 9.75 0 0 1 3.75 12c0-1.335.267-2.607.75-3.768l.94.94ZM8.61 11.73l3.66 3.66a5.25 5.25 0 0 1-3.66-3.66Z" /></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" /></svg>
                          }
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        🔒 Ce code sera demandé à vos agents lors de leur inscription. Gardez-le confidentiel.
                      </p>
                    </div>
                  </>
                )}

                {/* ===== CHAMP CODE AGENT ===== */}
                {onglet === 'AGENT' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Code d'accès de votre compagnie <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="codeCompagnie"
                        value={formulaire.codeCompagnie}
                        onChange={gererChangement}
                        placeholder="Code fourni par votre compagnie"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-500/20 focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      📋 Ce code vous a été transmis par le responsable de votre compagnie.
                    </p>
                  </div>
                )}

                {/* ===== CHAMPS COMMUNS ===== */}

                {/* Nom complet — CLIENT et AGENT uniquement (pas COMPAGNIE) */}
                {onglet !== 'COMPAGNIE' && champTexte('Nom complet', 'nomComplet', 'text', 'Kofi Kouassi')}

                {champTexte('Email', 'email', 'email', 'exemple@email.com')}

                {/* Téléphone — COMPAGNIE uniquement */}
                {onglet === 'COMPAGNIE' && champTexte('Téléphone', 'telephone', 'tel', '+225 07 00 00 00 00')}

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Mot de passe <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={afficherMotDePasse ? 'text' : 'password'}
                      name="motDePasse"
                      value={formulaire.motDePasse}
                      onChange={gererChangement}
                      placeholder="Minimum 6 caractères"
                      required
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 ${focusClass} focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm`}
                    />
                    <button type="button" onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {afficherMotDePasse
                        ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577A11.217 11.217 0 0 1 12 3.75c5.25 0 9.875 3.51 11.374 8.803a11.176 11.176 0 0 1-.698 0ZM5.44 8.56 3.985 7.105a11.232 11.232 0 0 0-2.66 4.698 9.75 9.75 0 0 0 5.56 6.508l1.067-1.068A9.75 9.75 0 0 1 3.75 12c0-1.335.267-2.607.75-3.768l.94.94ZM8.61 11.73l3.66 3.66a5.25 5.25 0 0 1-3.66-3.66Z" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" /></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={afficherMotDePasse ? 'text' : 'password'}
                    name="confirmerMotDePasse"
                    value={formulaire.confirmerMotDePasse}
                    onChange={gererChangement}
                    placeholder="Répétez votre mot de passe"
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm ${
                      formulaire.confirmerMotDePasse && formulaire.motDePasse !== formulaire.confirmerMotDePasse
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                        : formulaire.confirmerMotDePasse && formulaire.motDePasse === formulaire.confirmerMotDePasse
                        ? 'border-green-400 focus:border-green-400 focus:ring-green-200'
                        : `border-gray-200 ${focusClass}`
                    }`}
                  />
                  {formulaire.confirmerMotDePasse && formulaire.motDePasse !== formulaire.confirmerMotDePasse && (
                    <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                  {formulaire.confirmerMotDePasse && formulaire.motDePasse === formulaire.confirmerMotDePasse && (
                    <p className="text-green-500 text-xs mt-1">✓ Les mots de passe correspondent</p>
                  )}
                </div>

                {/* Bouton soumettre */}
                <button
                  type="submit"
                  disabled={chargement}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg mt-2
                    ${onglet === 'CLIENT' ? 'bg-gradient-to-r from-bleu-secondaire to-cyan-accent text-white hover:shadow-2xl' :
                      onglet === 'COMPAGNIE' ? 'bg-bleu-nuit text-cyan-accent hover:bg-bleu-secondaire hover:text-white' :
                      'bg-emerald-600 text-white hover:bg-emerald-700'}
                    ${chargement ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 transform'}`}
                >
                  {chargement ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8H4Z" />
                      </svg>
                      Inscription en cours...
                    </span>
                  ) : (
                    onglet === 'CLIENT' ? 'Créer mon compte voyageur' :
                    onglet === 'COMPAGNIE' ? 'Enregistrer ma compagnie' :
                    'Créer mon compte agent'
                  )}
                </button>

                {/* Lien connexion */}
                <p className="text-center text-sm text-gray-500 pt-2">
                  Déjà un compte ?{' '}
                  <Link to="/connexion" className="text-bleu-secondaire font-semibold hover:underline">
                    Se connecter
                  </Link>
                </p>

              </form>
            </div>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
};

export default Inscription;