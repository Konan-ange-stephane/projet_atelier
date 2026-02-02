// src/pages/Accueil.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BarreNav from '../components/BarreNav';
import PiedPage from '../components/PiedPage';
import '../styles/Accueil.css';

/**
 * Page d'accueil publique de SmartTrip
 * Présente le service et guide les utilisateurs vers l'authentification
 */
const Accueil = () => {
  const { user } = useAuth();
  const naviguer = useNavigate();

  // Redirection si déjà connecté
  React.useEffect(() => {
    if (user) {
      const routes = {
        ADMIN: '/admin/statistics',
        AGENT: '/agent/trips',
        CLIENT: '/client/trips'
      };
      naviguer(routes[user.role] || '/');
    }
  }, [user, naviguer]);

  return (
    <div className="accueil-container">
      <BarreNav />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-contenu">
          <div className="hero-texte">
            <h1 className="titre-principal">
              SmartTrip
              <span className="sous-titre-hero">Votre solution numérique de réservation</span>
            </h1>
            <p className="description-hero">
              Réservez vos trajets en quelques clics. Une plateforme moderne, sécurisée et facile à utiliser.
            </p>
            <div className="boutons-action-hero">
              <Link to="/connexion" className="bouton bouton-primaire">
                Se Connecter
              </Link>
              <Link to="/inscription" className="bouton bouton-secondaire">
                S'Inscrire
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="illustration-hero">🚌</div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="section-fonctionnalites">
        <h2>Pourquoi choisir SmartTrip?</h2>
        <div className="grille-fonctionnalites">
          <div className="carte-fonctionnalite">
            <div className="icone">🔍</div>
            <h3>Recherche Facile</h3>
            <p>Trouvez les trajets qui vous conviennent en quelques secondes.</p>
          </div>

          <div className="carte-fonctionnalite">
            <div className="icone">💳</div>
            <h3>Réservation Simple</h3>
            <p>Réservez votre place en quelques clics, sans complications.</p>
          </div>

          <div className="carte-fonctionnalite">
            <div className="icone">🔐</div>
            <h3>Sécurisé</h3>
            <p>Vos données sont protégées avec les meilleures normes de sécurité.</p>
          </div>

          <div className="carte-fonctionnalite">
            <div className="icone">⏰</div>
            <h3>24/7 Disponible</h3>
            <p>Réservez vos trajets quand vous le souhaitez, jour et nuit.</p>
          </div>

          <div className="carte-fonctionnalite">
            <div className="icone">📱</div>
            <h3>Interface Moderne</h3>
            <p>Une plateforme intuitive et responsive sur tous les appareils.</p>
          </div>

          <div className="carte-fonctionnalite">
            <div className="icone">📞</div>
            <h3>Support Client</h3>
            <p>Une équipe prête à vous aider pour toute question.</p>
          </div>
        </div>
      </section>

      {/* Section Rôles Utilisateur */}
      <section className="section-roles">
        <h2>SmartTrip pour Tous</h2>
        <div className="grille-roles">
          {/* Rôle Client */}
          <div className="carte-role role-client">
            <div className="icone-role">👤</div>
            <h3>Clients</h3>
            <p className="description-role">
              Recherchez et réservez vos trajets facilement. Gérez vos réservations et consultez votre historique.
            </p>
            <ul className="liste-avantages">
              <li>✓ Recherche de trajets</li>
              <li>✓ Réservation en ligne</li>
              <li>✓ Annulation simple</li>
              <li>✓ Historique complet</li>
            </ul>
            <Link to="/inscription" className="bouton bouton-client">
              Inscrire en tant que Client
            </Link>
          </div>

          {/* Rôle Agent */}
          <div className="carte-role role-agent">
            <div className="icone-role">🚌</div>
            <h3>Agents</h3>
            <p className="description-role">
              Gérez vos trajets et véhicules. Suivez les réservations et les passagers en temps réel.
            </p>
            <ul className="liste-avantages">
              <li>✓ Gestion des trajets</li>
              <li>✓ Gestion des véhicules</li>
              <li>✓ Suivi des passagers</li>
              <li>✓ Tableau de bord</li>
            </ul>
            <Link to="/inscription" className="bouton bouton-agent">
              Inscrire en tant qu'Agent
            </Link>
          </div>

          {/* Rôle Admin */}
          <div className="carte-role role-admin">
            <div className="icone-role">🔧</div>
            <h3>Administrateurs</h3>
            <p className="description-role">
              Administrez la plateforme. Gérez les utilisateurs et consultez les statistiques.
            </p>
            <ul className="liste-avantages">
              <li>✓ Gestion des utilisateurs</li>
              <li>✓ Statistiques détaillées</li>
              <li>✓ Contrôle complet</li>
              <li>✓ Rapports avancés</li>
            </ul>
            <p className="texte-admin">Contact administrateur</p>
          </div>
        </div>
      </section>

      {/* Section Objectifs */}
      <section className="section-objectifs">
        <h2>Notre Mission</h2>
        <div className="contenu-objectifs">
          <p className="texte-mission">
            SmartTrip vise à <strong>digitaliser les réservations de trajets</strong> pour offrir une expérience meilleure à tous les acteurs.
          </p>
          <div className="grille-objectifs">
            <div className="objectif-item">
              <div className="numero">1</div>
              <h4>Réduire les Files d'Attente</h4>
              <p>Éliminez les longues attentes au guichet grâce à la réservation en ligne.</p>
            </div>
            <div className="objectif-item">
              <div className="numero">2</div>
              <h4>Optimiser la Gestion</h4>
              <p>Meilleure organisation des départs et suivi en temps réel.</p>
            </div>
            <div className="objectif-item">
              <div className="numero">3</div>
              <h4>Faciliter le Travail</h4>
              <p>Outils simples et efficaces pour les compagnies de transport.</p>
            </div>
            <div className="objectif-item">
              <div className="numero">4</div>
              <h4>Améliorer l'Expérience</h4>
              <p>Une plateforme intuitive et accessible pour tous.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="section-cta">
        <div className="contenu-cta">
          <h2>Prêt à Commencer?</h2>
          <p>Rejoignez des milliers d'utilisateurs satisfaits.</p>
          <div className="boutons-cta">
            <Link to="/inscription" className="bouton bouton-large bouton-primaire">
              Créer un Compte
            </Link>
            <Link to="/connexion" className="bouton bouton-large bouton-secondaire">
              Se Connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Section À Propos */}
      <section className="section-apropos">
        <h2>À Propos de SmartTrip</h2>
        <div className="contenu-apropos">
          <div className="colonne-apropos">
            <h3>Qui Sommes-nous?</h3>
            <p>
              SmartTrip est une solution moderne de gestion des réservations de trajets. 
              Notre mission est de transformer la façon dont les compagnies de transport 
              gèrent leurs opérations et comment les clients réservent leurs trajets.
            </p>
          </div>
          <div className="colonne-apropos">
            <h3>Nos Valeurs</h3>
            <ul className="liste-valeurs">
              <li><strong>Simplicité</strong> - Une plateforme facile à utiliser</li>
              <li><strong>Sécurité</strong> - Vos données sont protégées</li>
              <li><strong>Fiabilité</strong> - Un service stable et performant</li>
              <li><strong>Innovation</strong> - Toujours améliorer</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-faq">
        <h2>Questions Fréquentes</h2>
        <div className="grille-faq">
          <div className="question-reponse">
            <h4>Comment réserver un trajet?</h4>
            <p>
              Connectez-vous à votre compte, recherchez le trajet désiré, 
              et complétez votre réservation en quelques clics.
            </p>
          </div>

          <div className="question-reponse">
            <h4>Puis-je annuler ma réservation?</h4>
            <p>
              Oui! Vous pouvez annuler votre réservation directement depuis 
              votre historique, selon les conditions de la compagnie.
            </p>
          </div>

          <div className="question-reponse">
            <h4>Comment accéder au profil agent?</h4>
            <p>
              Vous devez d'abord vous inscrire en tant qu'agent. 
              Votre compte sera validé par un administrateur.
            </p>
          </div>

          <div className="question-reponse">
            <h4>SmartTrip est-il sécurisé?</h4>
            <p>
              Oui! SmartTrip utilise le chiffrement SSL et les meilleures 
              pratiques de sécurité pour protéger vos données.
            </p>
          </div>
        </div>
      </section>

      <PiedPage />
    </div>
  );
};

export default Accueil;
