// src/pages/Connexion.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getPostLoginPath } from '../utils/postLoginRedirect';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

const Connexion = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);

  const gererConnexion = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const result = await login({ email, password: mdp });

    setChargement(false);

    if (result.success) {
      const role = result.data?.user?.role;
      navigate(getPostLoginPath(role));
    } else {
      setErreur(result.error || 'Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen bg-fond-clair font-sans">
      <BarreNav />

      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-bleu-secondaire to-cyan-accent rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-bleu-nuit mb-2">
                Bon retour !
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Connectez-vous à votre compte SmartTrip
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
              {erreur && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{erreur}</span>
                </div>
              )}

              <form onSubmit={gererConnexion} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErreur(''); }}
                      required
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-bleu-secondaire focus:outline-none focus:ring-2 focus:ring-bleu-secondaire/20 text-gray-800 placeholder-gray-400 transition text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      className="text-xs text-bleu-secondaire hover:underline font-medium"
                      onClick={() => alert('Fonctionnalité à venir')}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <input
                      type={afficherMotDePasse ? 'text' : 'password'}
                      value={mdp}
                      onChange={(e) => { setMdp(e.target.value); setErreur(''); }}
                      required
                      placeholder="Votre mot de passe"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-gray-200 focus:border-bleu-secondaire focus:outline-none focus:ring-2 focus:ring-bleu-secondaire/20 text-gray-800 placeholder-gray-400 transition text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {afficherMotDePasse ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577A11.217 11.217 0 0 1 12 3.75c5.25 0 9.875 3.51 11.374 8.803a11.176 11.176 0 0 1-.698 0ZM5.44 8.56 3.985 7.105a11.232 11.232 0 0 0-2.66 4.698 9.75 9.75 0 0 0 5.56 6.508l1.067-1.068A9.75 9.75 0 0 1 3.75 12c0-1.335.267-2.607.75-3.768l.94.94ZM8.61 11.73l3.66 3.66a5.25 5.25 0 0 1-3.66-3.66Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={chargement}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all transform shadow-lg
                    bg-gradient-to-r from-bleu-secondaire to-cyan-accent text-white hover:shadow-2xl
                    ${chargement ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {chargement ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8H4Z" />
                      </svg>
                      Connexion en cours...
                    </span>
                  ) : (
                    'Se connecter'
                  )}
                </button>

                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">OU</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-3">
                  <Link
                    to="/inscription"
                    className="block w-full py-3 rounded-xl border-2 border-bleu-secondaire/30 text-bleu-nuit text-sm font-semibold text-center hover:bg-bleu-secondaire/5 transition"
                  >
                    Créer un compte voyageur
                  </Link>
                  <p className="text-center text-xs text-gray-500">
                    Agent ou partenaire ? Les comptes sont créés par l’administrateur.{' '}
                    <Link to="/espace-agent" className="text-bleu-secondaire font-semibold hover:underline">
                      En savoir plus
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
};

export default Connexion;
