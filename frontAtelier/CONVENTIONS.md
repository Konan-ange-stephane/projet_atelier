# 📐 Conventions de Développement - SmartTrip Frontend

## 🎯 Vue d'Ensemble

Ce document définit les conventions de développement pour le projet SmartTrip afin de maintenir une cohérence et une qualité élevée du code.

---

## 📝 1. Conventions de Nommage

### 1.1 Fichiers et Dossiers

| Type | Convention | Exemple | Notes |
|------|-----------|---------|-------|
| Composants | PascalCase | `BarreNav.jsx` | Réutilisables, tout fichier = un composant |
| Pages | PascalCase | `Statistiques.jsx` | Fichiers des pages/routes |
| Services | camelCase + Service | `serviceAuth.js` | API ou logique métier |
| Hooks | camelCase + use | `useAuth.jsx` | React Hooks |
| Dossiers | minuscule | `services/`, `contexte/` | En français, multiusage |
| Styles | kebab-case | `loader-fullscreen` | Classes CSS |

### 1.2 Variables et Constantes

```javascript
// Variables : camelCase
const utilisateurActuel = null;
let nombreReservations = 0;

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8080/api';
const TOKEN_KEY = 'token_jwt';

// Booléens : is/has prefix
const estConnecte = true;
const aDesReservations = false;
```

### 1.3 Fonctions et Méthodes

```javascript
// Fonctions : camelCase, verbe en début
const chargerUtilisateurs = () => {};
const validerFormulaire = (data) => {};
const recupererTrajetParId = (id) => {};

// Handlers : on + verbe
const gererClicBouton = () => {};
const gererChangementInput = (e) => {};
```

### 1.4 Composants React

```jsx
// Noms : PascalCase, verbe si action
const BarreNav = () => {};
const BoutonValider = ({ texte }) => {};

// Props : camelCase
const MonComposant = ({ utilisateur, onClique }) => {};
```

---

## 📂 2. Structure des Fichiers

### 2.1 Composant Standard

```jsx
// src/components/MaComposant.jsx

import React, { useState } from 'react';
import './MaComposant.css';

/**
 * Description du composant
 * @param {object} props - Propriétés
 * @returns {JSX.Element}
 */
const MaComposant = ({ titre, onClick }) => {
  const [etat, setEtat] = useState(false);

  const gererClick = () => {
    setEtat(!etat);
    onClick?.();
  };

  return (
    <div className="ma-composant">
      <h1>{titre}</h1>
      <button onClick={gererClick}>Cliquer</button>
    </div>
  );
};

export default MaComposant;
```

### 2.2 Page (Route)

```jsx
// src/pages/admin/Statistiques.jsx

import { useAuth } from '../../hooks/useAuth';
import { statisticsService } from '../../services/api';
import Chargeur from '../../components/Chargeur';

const Statistiques = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerStatistiques();
  }, []);

  const chargerStatistiques = async () => {
    try {
      const donnees = await statisticsService.getStatistics(token);
      setStats(donnees);
    } catch (erreur) {
      console.error('Erreur:', erreur);
    } finally {
      setChargement(false);
    }
  };

  if (chargement) return <Chargeur />;

  return (
    <section className="statistiques">
      {/* Contenu */}
    </section>
  );
};

export default Statistiques;
```

### 2.3 Service API

```javascript
// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const monService = {
  // Récupérer - GET
  obtenirTous: async (token) => {
    const response = await fetch(`${API_BASE_URL}/ressource`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  // Créer - POST
  creer: async (donnees, token) => {
    const response = await fetch(`${API_BASE_URL}/ressource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(donnees)
    });
    return response.json();
  },

  // Mettre à jour - PUT
  mettreAJour: async (id, donnees, token) => {
    const response = await fetch(`${API_BASE_URL}/ressource/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(donnees)
    });
    return response.json();
  },

  // Supprimer - DELETE
  supprimer: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/ressource/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};
```

### 2.4 Hook Personnalisé

```javascript
// src/hooks/useMaLogique.jsx

import { useState, useCallback } from 'react';

/**
 * Hook pour la gestion de [description]
 * @returns {object} État et fonctions
 */
export const useMaLogique = () => {
  const [donnees, setDonnees] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      // Logique
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }, []);

  return { donnees, chargement, erreur, charger };
};
```

---

## 🎨 3. CSS et Styles

### 3.1 Structure CSS

```css
/* src/components/MaComposant.css */

/* Conteneur principal */
.ma-composant {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f5f5f5;
}

/* Éléments enfants */
.ma-composant h1 {
  font-size: 1.5rem;
  color: #333;
}

.ma-composant button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

/* États */
.ma-composant.actif {
  background-color: #e3f2fd;
}

.ma-composant:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .ma-composant {
    padding: 0.5rem;
  }
}
```

### 3.2 Variables CSS Globales

```css
/* src/styles/variables.css */

:root {
  /* Couleurs */
  --primary: #007bff;
  --success: #28a745;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;

  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-main: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## 🔐 4. Authentification

### 4.1 Pattern d'Utilisation

```jsx
import { useAuth } from '../../hooks/useAuth';

const MaPage = () => {
  const { user, token, loading, login, logout } = useAuth();

  if (loading) return <Chargeur />;

  if (!user) {
    return <Navigate to="/connexion" />;
  }

  return (
    <div>
      <p>Bienvenue {user.nom}</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
};
```

### 4.2 Routes Protégées

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <Chargeur fullScreen />;
  if (!user) return <Navigate to="/connexion" />;
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Utilisation
<Route
  path="/admin"
  element={
    <ProtectedRoute roles={['ADMIN']}>
      <Admin />
    </ProtectedRoute>
  }
/>
```

---

## ✅ 5. Bonnes Pratiques

### 5.1 Gestion des Erreurs

```javascript
try {
  const donnees = await serviceApi.charger();
  setDonnees(donnees);
} catch (erreur) {
  console.error('Erreur lors du chargement:', erreur);
  setErreur(erreur.message || 'Une erreur est survenue');
  // Notifier l'utilisateur
}
```

### 5.2 Validations

```javascript
const validerEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validerMotDePasse = (mdp) => {
  return mdp && mdp.length >= 8;
};
```

### 5.3 Optimisation Performance

```javascript
// Utiliser useCallback pour les fonctions
const gererClick = useCallback(() => {
  // Logique
}, [dependencies]);

// Utiliser useMemo pour les calculs
const valeurCalculee = useMemo(() => {
  return effectuerCalcul(donnees);
}, [donnees]);

// Éviter les renders inutiles
const ComposantOptimise = React.memo(MaComposant);
```

### 5.4 Commentaires et Documentation

```javascript
/**
 * Récupère tous les trajets disponibles
 * @param {string} depart - Ville de départ
 * @param {string} arrivee - Ville d'arrivée
 * @param {string} token - Token d'authentification
 * @returns {Promise<Array>} Liste des trajets
 * @throws {Error} Si l'API échoue
 */
export const rechercherTrajets = async (depart, arrivee, token) => {
  // ...
};
```

---

## 🧪 6. Tests

### 6.1 Structure de Test

```javascript
// src/components/MaComposant.test.jsx

import { render, screen } from '@testing-library/react';
import MaComposant from './MaComposant';

describe('MaComposant', () => {
  test('affiche le titre', () => {
    render(<MaComposant titre="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  test('appelle onClick au clic', () => {
    const handleClick = jest.fn();
    render(<MaComposant onClick={handleClick} />);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## 🚀 7. Déploiement

### 7.1 Build et Optimisation

```bash
npm run build  # Build production
npm run preview  # Prévisualiser
```

### 7.2 Variables d'Environnement

```env
# .env (développement)
VITE_API_URL=http://localhost:8080/api

# .env.production (production)
VITE_API_URL=https://api.smarttrip.com/api
```

---

## 📋 Checklist Avant Push

- [ ] Tous les noms en français et suivent les conventions
- [ ] Pas de console.log() en production
- [ ] Les imports sont corrects et optimisés
- [ ] Les hooks sont utilisés correctement
- [ ] Les erreurs sont gérées
- [ ] Le code est commenté si nécessaire
- [ ] Le build passe sans warning
- [ ] Tests passent (si applicable)

---

**Dernière mise à jour** : Février 2026  
**Projet** : SmartTrip Frontend
