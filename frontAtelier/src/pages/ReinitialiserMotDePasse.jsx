// src/pages/ReinitialiserMotDePasse.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

const ReinitialiserMotDePasse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const { resetPassword } = useAuth();
  
  const [mdp, setMdp] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);

  const gererSoumission = async (e) => {
    e.preventDefault();
    setErreur('');
    
    if (mdp !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!token) {
      setErreur('Jeton de réinitialisation manquant.');
      return;
    }

    setChargement(true);
    const result = await resetPassword(token, mdp);
    setChargement(false);

    if (result.success) {
      setSucces(true);
      setTimeout(() => navigate('/connexion'), 3000);
    } else {
      setErreur(result.error || 'Une erreur est survenue.');
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
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-bleu-nuit mb-2">
                Nouveau mot de passe
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Définissez votre nouveau mot de passe sécurisé
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
              {erreur && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{erreur}</span>
                </div>
              )}

              {succes && (
                <div className="mb-5 bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>✅</span>
                  <span>Mot de passe réinitialisé avec succès ! Redirection...</span>
                </div>
              )}

              <form onSubmit={gererSoumission} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Nouveau mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-bleu-secondaire focus:outline-none focus:ring-2 focus:ring-bleu-secondaire/20 text-gray-800 transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirmer le mot de passe <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-bleu-secondaire focus:outline-none focus:ring-2 focus:ring-bleu-secondaire/20 text-gray-800 transition text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={chargement || succes || !token}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all transform shadow-lg
                    bg-gradient-to-r from-bleu-secondaire to-cyan-accent text-white hover:shadow-2xl
                    ${(chargement || succes || !token) ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {chargement ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </button>

                {!token && (
                  <p className="text-center text-xs text-red-500 mt-4">
                    Jeton invalide ou manquant. Veuillez utiliser le lien reçu par email.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
};

export default ReinitialiserMotDePasse;
