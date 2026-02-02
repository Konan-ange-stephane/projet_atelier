// src/components/PiedPage.jsx
import React from 'react';
import './PiedPage.css';

/**
 * Pied de page de l'application
 */
const PiedPage = () => {
  const anneeActuelle = new Date().getFullYear();

  return (
    <footer className="pied-page">
      <div className="footer-container">
        <div className="footer-content">
          <p>&copy; {anneeActuelle} SmartTrip. Tous droits réservés.</p>
          <p>Système de gestion numérique des réservations de trajets</p>
        </div>
      </div>
    </footer>
  );
};

export default PiedPage;
