// src/pages/MotDePasseOublie.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

const MotDePasseOublie = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const gererSoumission = async (e) => {
    e.preventDefault();
    setErreur('');
    setMessage('');
    setChargement(true);

    const result = await forgotPassword(email);

    setChargement(false);
    if (result.success) {
      setMessage('Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.');
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
                Mot de passe oublié ?
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Entrez votre email pour réinitialiser votre mot de passe
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
              {erreur && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{erreur}</span>
                </div>
              )}

              {message && (
                <div className="mb-5 bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <span>✅</span>
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={gererSoumission} className="space-y-5">
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-bleu-secondaire focus:outline-none focus:ring-2 focus:ring-bleu-secondaire/20 text-gray-800 placeholder-gray-400 transition text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={chargement}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all transform shadow-lg
                    bg-gradient-to-r from-bleu-secondaire to-cyan-accent text-white hover:shadow-2xl
                    ${chargement ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                  {chargement ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>

                <div className="text-center mt-6">
                  <Link to="/connexion" className="text-sm text-bleu-secondaire font-semibold hover:underline">
                    Retour à la connexion
                  </Link>
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

export default MotDePasseOublie;
