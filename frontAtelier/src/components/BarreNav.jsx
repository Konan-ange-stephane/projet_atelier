// src/components/BarreNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './BarreNav.css';

/**
 * Barre de navigation principale
 */
const BarreNav = () => {
  return (
    <nav className="barre-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          SmartTrip
        </Link>
        <ul className="nav-menu">
          <li>
            <Link to="/connexion" className="nav-link">Connexion</Link>
          </li>
          <li>
            <Link to="/inscription" className="nav-link">Inscription</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BarreNav;
