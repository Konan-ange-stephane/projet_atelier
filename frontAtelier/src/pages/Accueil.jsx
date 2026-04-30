// src/pages/Accueil.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getPostLoginPath } from '../utils/postLoginRedirect';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';

// IMPORTANT: Importe ton image ici
import busImage from '../assets/images/bus.png';

// Logos des compagnies ivoiriennes
import logoCTM from '../assets/images/ctm.png';
import logoUTB from '../assets/images/utb.png';
import logoGTI from '../assets/images/gti.png';
import logoSTB from '../assets/images/stb.png';

// Composant Étoiles SVG réaliste
const EtoilesSVG = ({ note }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const pleine = note >= i;
        const demie = !pleine && note >= i - 0.5;
        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <defs>
              <linearGradient id={`demi-${i}`}>
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={
                pleine
                  ? "#FBBF24"
                  : demie
                    ? `url(#demi-${i})`
                    : "#D1D5DB"
              }
              stroke={pleine || demie ? "#F59E0B" : "#9CA3AF"}
              strokeWidth="0.5"
            />
          </svg>
        );
      })}
      <span className="ml-1.5 text-xs font-semibold text-gray-500">{note}/5</span>
    </div>
  );
};

// Composant Avatar SVG réutilisable
const AvatarSVG = ({ couleur, taille = "w-10 h-10 sm:w-12 sm:h-12" }) => (
  <div className={`${taille} bg-gradient-to-br ${couleur} rounded-full flex items-center justify-center shadow-md flex-shrink-0`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="white"
      className="w-5 h-5 sm:w-6 sm:h-6"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

const Accueil = () => {
  const { user } = useAuth();
  const naviguer = useNavigate();
  const [faqOuverte, setFaqOuverte] = useState(null);
  const [email, setEmail] = useState('');

  // Redirection supprimée pour permettre aux clients connectés de voir la page d'accueil

  const basculerFaq = (index) => {
    setFaqOuverte(faqOuverte === index ? null : index);
  };

  const soumettreNewsletter = (e) => {
    e.preventDefault();
    console.log('Email inscrit:', email);
    setEmail('');
    alert('Merci pour votre inscription !');
  };

  const temoignages = [
    {
      nom: "Kouassi Yao",
      role: "Voyageuse régulière",
      texte: "SmartTrip a transformé mes déplacements quotidiens. Rapide, fiable et tellement pratique !",
      note: 5,
      couleur: "from-violet-500 to-purple-600"
    },
    {
      nom: "Ahmed Diallo",
      role: "Agent de voyage",
      texte: "La gestion de ma flotte n'a jamais été aussi simple. Interface intuitive et support réactif.",
      note: 4.5,
      couleur: "from-bleu-secondaire to-cyan-accent"
    },
    {
      nom: "Sophie Yao",
      role: "Étudiante",
      texte: "Les tarifs sont compétitifs et le paiement sécurisé me rassure totalement. Je recommande !",
      note: 4,
      couleur: "from-emerald-400 to-teal-500"
    }
  ];

  const partenaires = [
    { nom: "CTM", logo: logoCTM },
    { nom: "UTB", logo: logoUTB },
    { nom: "GTI", logo: logoGTI },
    { nom: "STB", logo: logoSTB }
  ];

  const statistiques = [
    { chiffre: "50K+", label: "Voyageurs satisfaits" },
    { chiffre: "200+", label: "Destinations" },
    { chiffre: "98%", label: "Taux de satisfaction" },
    { chiffre: "24/7", label: "Support client" }
  ];

  return (
    <div className="min-h-screen bg-fond-clair font-sans">
      <BarreNav />

      {/* --- HERO SECTION AVEC IMAGE RESPONSIVE --- */}
      <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-bleu-nuit via-bleu-secondaire to-cyan-accent">
        {/* Effets de fond lumineux */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center relative z-10 gap-8 lg:gap-12">
          {/* TEXTE */}
          <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-6">
              SmartTrip <br />
              <span className="text-cyan-accent text-2xl sm:text-3xl lg:text-4xl">Votre voyage commence ici.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/90 mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0">
              Réservez vos trajets en quelques secondes. Une plateforme sécurisée, fluide et pensée pour vous simplifier la vie.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to="/connexion"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-bleu-nuit rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
                aria-label="Se connecter à SmartTrip"
              >
                Se Connecter
              </Link>
              <Link
                to="/inscription"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold hover:bg-white hover:text-bleu-nuit transition-all"
                aria-label="Créer un compte SmartTrip"
              >
                Créer un compte
              </Link>
            </div>
          </div>

          {/* IMAGE */}
          <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-cyan-accent/20 rounded-full blur-3xl animate-pulse"></div>

              <div className="relative aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                <img
                  src={busImage}
                  alt="Bus moderne SmartTrip"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    console.error("Erreur de chargement de l'image");
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bleu-secondaire/30 via-transparent to-white/10"></div>
              </div>

              <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 w-12 h-12 sm:w-20 sm:h-20 bg-cyan-accent/40 rounded-full animate-pulse backdrop-blur-md"></div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 w-16 h-16 sm:w-24 sm:h-24 bg-white/40 rounded-full animate-pulse backdrop-blur-md" style={{ animationDelay: '0.7s' }}></div>
              <div className="hidden lg:block absolute top-1/4 -right-8 w-16 h-16 bg-cyan-accent/30 rounded-full animate-pulse backdrop-blur-md" style={{ animationDelay: '1.4s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATISTIQUES --- */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {statistiques.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bleu-nuit mb-2">
                  {stat.chiffre}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CARACTÉRISTIQUES --- */}
      <section className="py-16 sm:py-20 bg-fond-clair">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-bleu-nuit mb-3 sm:mb-4">Pourquoi nous choisir ?</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-12 sm:mb-16 max-w-2xl mx-auto">
            Découvrez les avantages qui font de SmartTrip le choix numéro un pour vos déplacements
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-bleu-secondaire to-cyan-accent rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                🔍
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-bleu-nuit">Recherche Ultra-Rapide</h3>
              <p className="text-xs sm:text-sm text-gray-600">Trouvez votre destination parmi des centaines de trajets quotidiens en quelques clics.</p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 group border-t-4 border-bleu-secondaire">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-bleu-secondaire to-cyan-accent rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                💳
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-bleu-nuit">Paiement Sécurisé</h3>
              <p className="text-xs sm:text-sm text-gray-600">Réservez en toute confiance avec nos systèmes de protection et cryptage avancés.</p>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-bleu-secondaire to-cyan-accent rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-bleu-nuit">Expérience Mobile</h3>
              <p className="text-xs sm:text-sm text-gray-600">Gérez vos billets directement depuis votre téléphone, n'importe où, n'importe quand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TÉMOIGNAGES --- */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-bleu-nuit mb-3 sm:mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-12 sm:mb-16 max-w-2xl mx-auto">
            Des milliers de voyageurs nous font confiance chaque jour
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {temoignages.map((temoignage, index) => (
              <div key={index} className="bg-fond-clair p-6 sm:p-8 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="mb-3 sm:mb-4">
                  <EtoilesSVG note={temoignage.note} />
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 italic">"{temoignage.texte}"</p>
                <div className="flex items-center">
                  {/* Avatar SVG avec couleur unique par personne */}
                  <AvatarSVG couleur={temoignage.couleur} />
                  <div className="ml-3 sm:ml-4">
                    <div className="text-sm sm:text-base font-bold text-bleu-nuit">{temoignage.nom}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{temoignage.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PARTENAIRES --- */}
      <section className="py-12 sm:py-16 bg-fond-clair">
        <div className="container mx-auto px-4 sm:px-6">
          <h3 className="text-center text-gray-600 font-semibold mb-6 sm:mb-8 uppercase tracking-wider text-xs sm:text-sm">
            Ils nous font confiance
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {partenaires.map((partenaire, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                aria-label={`Partenaire ${partenaire.nom}`}
              >
                <img
                  src={partenaire.logo}
                  alt={`Logo ${partenaire.nom}`}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
                <span className="text-sm sm:text-base font-bold text-bleu-nuit">{partenaire.nom}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CHOIX DU RÔLE --- */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-bleu-nuit mb-3 sm:mb-4">
            Une plateforme pour tous
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-12 sm:mb-16 max-w-2xl mx-auto">
            Réservez en tant que voyageur, ou connectez-vous à l’espace agent si votre organisation vous a créé un compte.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">

            {/* Client */}
            <div className="bg-gradient-to-br from-bleu-secondaire to-cyan-accent p-6 sm:p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between transform hover:scale-105 transition-transform">
              <div>
                <span className="bg-white/20 backdrop-blur px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold inline-block">
                  Passager
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-3 sm:mt-4 mb-3 sm:mb-4">Je suis un Voyageur</h3>
                <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 italic">"Je souhaite voyager en toute sérénité."</p>
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-xs sm:text-sm">Réservation en quelques clics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-xs sm:text-sm">Billets électroniques instantanés</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-xs sm:text-sm">Support client réactif</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/inscription"
                className="w-full text-center py-3 sm:py-4 bg-white text-bleu-nuit rounded-xl font-bold hover:bg-gray-50 transition transform hover:scale-105 text-sm sm:text-base"
                aria-label="Commencer mon voyage en tant que voyageur"
              >
                Commencer mon voyage
              </Link>
            </div>

            {/* Agent */}
            <div className="bg-bleu-nuit p-6 sm:p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between transform hover:scale-105 transition-transform border-2 border-cyan-accent">
              <div>
                <span className="bg-cyan-accent/20 text-cyan-accent px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold inline-block">
                  Partenaire
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mt-3 sm:mt-4 mb-3 sm:mb-4">Espace agent</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 italic">
                  Compte fourni par l’administrateur — connexion uniquement.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <li className="flex items-start">
                    <span className="mr-2 text-cyan-accent">✓</span>
                    <span className="text-xs sm:text-sm">Tableau de bord intuitif</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cyan-accent">✓</span>
                    <span className="text-xs sm:text-sm">Gestion de flotte simplifiée</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-cyan-accent">✓</span>
                    <span className="text-xs sm:text-sm">Statistiques en temps réel</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/espace-agent"
                className="w-full text-center py-3 sm:py-4 bg-cyan-accent text-bleu-nuit rounded-xl font-bold hover:bg-white transition transform hover:scale-105 text-sm sm:text-base"
                aria-label="Informations espace agent et connexion"
              >
                Accéder à l’espace agent
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- NEWSLETTER --- */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-bleu-nuit to-bleu-secondaire rounded-3xl p-8 sm:p-12 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Restez informé de nos offres exclusives
            </h3>
            <p className="text-sm sm:text-base text-white/80 mb-6 sm:mb-8">
              Inscrivez-vous à notre newsletter et recevez des réductions jusqu'à 20%
            </p>
            <form onSubmit={soumettreNewsletter} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-800 bg-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-cyan-accent placeholder-gray-400 text-sm sm:text-base shadow-lg"
                aria-label="Adresse email pour la newsletter"
              />
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-cyan-accent text-bleu-nuit font-bold rounded-xl hover:bg-white transition transform hover:scale-105 text-sm sm:text-base"
              >
                S'inscrire
              </button>
            </form>
            <p className="text-white/60 text-xs sm:text-sm mt-3 sm:mt-4">
              Pas de spam. Désinscription possible à tout moment.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-16 sm:py-20 bg-fond-clair">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white p-8 sm:p-12 rounded-[40px] shadow-xl border-t-4 border-bleu-secondaire">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-bleu-nuit mb-4 sm:mb-6">
              Prêt à transformer vos trajets ?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Rejoignez SmartTrip aujourd'hui et facilitez vos déplacements avec la plateforme de réservation la plus moderne.
            </p>
            <Link
              to="/inscription"
              className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-bleu-secondaire to-cyan-accent text-white rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all transform hover:scale-105"
              aria-label="Créer un compte gratuitement"
            >
              Créer un compte gratuitement
            </Link>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
};

export default Accueil;