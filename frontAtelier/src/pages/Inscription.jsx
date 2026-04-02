// src/pages/Inscription.jsx — Inscription publique : compte voyageur (ROLE_USER côté serveur)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

const Inscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'agent' || role === 'compagnie') {
      navigate('/espace-agent', { replace: true });
    }
  }, [searchParams, navigate]);

  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);

  const [formulaire, setFormulaire] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmerMotDePasse: '',
  });

  const gererChangement = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
    setErreur('');
  };

  const validerFormulaire = () => {
    if (!formulaire.nomComplet.trim()) return 'Le nom complet est obligatoire.';
    if (!formulaire.email.includes('@')) return 'Adresse email invalide.';
    if (formulaire.motDePasse.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    if (formulaire.motDePasse !== formulaire.confirmerMotDePasse) return 'Les mots de passe ne correspondent pas.';
    return null;
  };

  const gererInscription = async (e) => {
    e.preventDefault();
    setErreur('');

    const err = validerFormulaire();
    if (err) {
      setErreur(err);
      return;
    }

    setChargement(true);

    const payload = {
      nom: formulaire.nomComplet.trim(),
      email: formulaire.email.trim(),
      password: formulaire.motDePasse,
      telephone: formulaire.telephone.trim(),
    };

    const result = await register(payload);
    setChargement(false);

    if (result.success) {
      alert('Compte créé ! Vous pouvez maintenant vous connecter.');
      navigate('/connexion');
    } else {
      setErreur(result.error);
    }
  };

  const focusClass = 'focus:border-bleu-secondaire focus:ring-bleu-secondaire/20';

  return (
    <div className="min-h-screen bg-fond-clair font-sans">
      <BarreNav />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-bleu-nuit mb-2">
                Créer un compte
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Réservez vos trajets sur SmartTrip. Compte voyageur — pas d’inscription agent depuis ce formulaire.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
              <div className="rounded-xl px-4 py-3 mb-6 text-xs sm:text-sm flex items-start gap-2 border bg-bleu-secondaire/10 border-bleu-secondaire/20 text-bleu-nuit">
                <span className="text-base mt-0.5">ℹ️</span>
                <span>
                  Vous êtes <strong>agent</strong> ou <strong>partenaire transport</strong> ?{' '}
                  <Link to="/espace-agent" className="text-bleu-secondaire font-semibold underline">
                    Accédez à l’espace dédié
                  </Link>
                  {' '}(compte créé par l’administrateur).
                </span>
              </div>

              {erreur && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{erreur}</span>
                </div>
              )}

              <form onSubmit={gererInscription} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomComplet"
                    value={formulaire.nomComplet}
                    onChange={gererChangement}
                    placeholder="Prénom et nom"
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 ${focusClass} focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formulaire.email}
                    onChange={gererChangement}
                    placeholder="exemple@email.com"
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 ${focusClass} focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formulaire.telephone}
                    onChange={gererChangement}
                    placeholder="+225 07 00 00 00 00"
                    className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 ${focusClass} focus:outline-none focus:ring-2 text-gray-800 placeholder-gray-400 transition text-sm`}
                  />
                </div>

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
                    <button
                      type="button"
                      onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-xs font-medium"
                    >
                      {afficherMotDePasse ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                </div>

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
                        : `border-gray-200 ${focusClass}`
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={chargement}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg mt-2 bg-gradient-to-r from-bleu-secondaire to-cyan-accent text-white hover:shadow-2xl
                    ${chargement ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] transform'}`}
                >
                  {chargement ? 'Inscription en cours…' : 'Créer mon compte'}
                </button>

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
