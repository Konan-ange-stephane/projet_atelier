import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

const Inscription = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();

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
    telephone : '',
    motDePasse: '',
    confirmerMotDePasse: '',
    nomCompagnie: '',
    codeAcces: '', 
    codeCompagnie: '', 
  });

  useEffect(() => {
    setErreur('');
    setFormulaire(prev => ({
      ...prev,
      nomCompagnie: '',
      codeAcces : '',
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
    if (formulaire.motDePasse.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if (formulaire.motDePasse !== formulaire.confirmerMotDePasse) return 'Les mots de passe ne correspondent pas.';

    if (onglet === 'COMPAGNIE') {
      if (!formulaire.nomCompagnie.trim()) return 'Le nom de la compagnie est obligatoire.';
      if (!formulaire.codeAcces.trim()) return "Vous devez définir un code d'accès pour vos agents.";
    }

    if (onglet === 'AGENT') {
      if (!formulaire.codeCompagnie.trim()) return "Le code d'accès de votre compagnie est obligatoire.";
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

    const payload = {
      nom: formulaire.nomComplet,
      email: formulaire.email,
      password: formulaire.motDePasse,
      telephone: formulaire.telephone,
      role: onglet,
      ...(onglet === 'COMPAGNIE' && { nomCompagnie: formulaire.nomCompagnie, codeAcces: formulaire.codeAcces }),
      ...(onglet === 'AGENT' && { codeCompagnie: formulaire.codeCompagnie }),
    };

    const result = await register(payload);
    setChargement(false);

    if (result.success) {
      if (onglet === 'COMPAGNIE') {
        alert(`Compte créé ! Code agents : ${formulaire.codeAcces}`);
      } else {
        alert("Compte créé ! Connectez-vous.");
      }
      navigate('/connexion');
    } else {
      setErreur(result.error);
    }
  };

  const onglets = [
    { id: 'CLIENT', label: 'Voyageur', actifClass: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' },
    { id: 'COMPAGNIE', label: 'Compagnie', actifClass: 'bg-slate-900 text-cyan-400' },
    { id: 'AGENT', label: 'Agent', actifClass: 'bg-emerald-600 text-white' },
  ];

  const champTexte = (label, name, type = 'text', placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={formulaire[name]}
        onChange={gererChangement}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <BarreNav />
      <div className="max-w-lg mx-auto py-20 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-3xl font-extrabold text-center mb-6">Créer un compte</h1>
          
          <div className="flex rounded-2xl overflow-hidden border-2 border-gray-200 mb-6">
            {onglets.map((o) => (
              <button
                key={o.id}
                onClick={() => setOnglet(o.id)}
                className={`flex-1 py-3 text-sm font-bold transition ${onglet === o.id ? o.actifClass : 'bg-white text-gray-400'}`}
              >
                {o.label}
              </button>
            ))}
          </div>

          {erreur && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">⚠️ {erreur}</div>}

          <form onSubmit={gererInscription}>
            {onglet === 'COMPAGNIE' && champTexte('Nom de la compagnie', 'nomCompagnie', 'text', 'Ex: UTB')}
            {onglet === 'COMPAGNIE' && champTexte("Code d'accès agents", 'codeAcces', 'text', 'Créez un code pour vos agents')}
            {onglet === 'AGENT' && champTexte("Code de votre compagnie", 'codeCompagnie', 'text', 'Fourni par votre patron')}
            
            {onglet !== 'COMPAGNIE' && champTexte('Nom complet', 'nomComplet', 'text', 'Jean Dupont')}
            {champTexte('Email', 'email', 'email', 'jean@mail.com')}
            {onglet === 'COMPAGNIE' && champTexte('Téléphone', 'telephone', 'tel', '+225...')}
            
            {champTexte('Mot de passe', 'motDePasse', 'password', '******')}
            {champTexte('Confirmer mot de passe', 'confirmerMotDePasse', 'password', '******')}

            <button
              type="submit"
              disabled={chargement}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 transition mt-4"
            >
              {chargement ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;