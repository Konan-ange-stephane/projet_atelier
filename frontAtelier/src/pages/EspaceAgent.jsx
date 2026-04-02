import React from 'react';
import { Link } from 'react-router-dom';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

/**
 * Les comptes agent ne s’inscrivent pas en ligne : ils sont créés côté serveur.
 * Connexion = même flux que les autres utilisateurs (POST /api/auth/login).
 */
const EspaceAgent = () => {
  return (
    <div className="min-h-screen bg-fond-clair font-sans">
      <BarreNav />

      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-xl">
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-bleu-nuit rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-cyan-accent">
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a3 3 0 1 1 6 0h.375c1.035 0 1.875-.84 1.875-1.875v-3.75a3 3 0 0 0-3-3H13.5v4.5Z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-bleu-nuit mb-3">
              Espace agent & partenaires
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-2">
              Les comptes avec accès aux outils agent ne peuvent pas être créés depuis ce site.
              Ils sont <strong>attribués par l’administrateur</strong> de la plateforme (ou via les procédures internes de votre organisation).
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Une fois votre compte créé, connectez-vous avec l’adresse e-mail et le mot de passe qui vous ont été communiqués — le même écran de connexion que pour tout utilisateur.
            </p>
            <Link
              to="/connexion"
              className="inline-flex w-full sm:w-auto justify-center px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-bleu-secondaire to-cyan-accent shadow-lg hover:shadow-xl transition"
            >
              Se connecter
            </Link>
            <p className="mt-8 text-sm text-gray-500">
              Voyageur ?{' '}
              <Link to="/inscription" className="text-bleu-secondaire font-semibold hover:underline">
                Créer un compte pour réserver
              </Link>
            </p>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
};

export default EspaceAgent;
