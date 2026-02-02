# Structure du Projet SmartTrip - Frontend

## Vue d'ensemble

SmartTrip est une application web de gestion des réservations de trajets. Cette structure organise le frontend React/Vite en modules cohérents et facilement maintenables.

## Arborescence du Projet

```
frontAtelier/
├── src/
│   ├── pages/                          # Pages principales de l'application
│   │   ├── Accueil.jsx                 # Page d'accueil publique
│   │   ├── Connexion.jsx               # Page de connexion
│   │   ├── Inscription.jsx             # Page d'inscription
│   │   ├── admin/                      # Pages administrateur
│   │   │   ├── Statistiques.jsx        # Tableau de bord des statistiques
│   │   │   └── Utilisateurs.jsx        # Gestion des utilisateurs
│   │   ├── agents/                     # Pages agent de compagnie
│   │   │   ├── GererTrajets.jsx        # Gestion des trajets
│   │   │   ├── Trajets.jsx             # Consultation des trajets
│   │   │   └── Passagers.jsx           # Consultation des passagers
│   │   └── clients/                    # Pages client
│   │       ├── Trajets.jsx             # Recherche et consultation des trajets
│   │       ├── Reservation.jsx         # Formulaire de réservation
│   │       └── Reservations.jsx        # Historique des réservations
│   │
│   ├── components/                     # Composants réutilisables
│   │   ├── BarreNav.jsx                # Barre de navigation
│   │   ├── PiedPage.jsx                # Pied de page
│   │   ├── Bouton.jsx                  # Composant bouton personnalisé
│   │   └── Chargeur.jsx                # Indicateur de chargement
│   │
│   ├── contexte/                       # Gestion d'état globale
│   │   └── ContexteAuth.jsx            # Contexte d'authentification
│   │
│   ├── hooks/                          # Hooks personnalisés
│   │   └── useAuth.jsx                 # Hook d'authentification
│   │
│   ├── services/                       # Services API et métier
│   │   ├── api.js                      # Services API complets
│   │   ├── serviceAuth.js              # Service d'authentification
│   │   └── config.js                   # Configuration API
│   │
│   ├── routes/                         # Configuration du routage
│   │   └── AppRoutes.jsx               # Routes et routes protégées
│   │
│   ├── styles/                         # Styles globaux
│   │   └── variables.css               # Variables CSS globales
│   │
│   ├── utils/                          # Utilitaires
│   ├── assets/                         # Ressources statiques
│   ├── App.jsx                         # Composant racine
│   ├── main.jsx                        # Point d'entrée
│   └── index.css                       # Styles globaux
│
├── public/                             # Fichiers statiques publics
├── vite.config.js                      # Configuration Vite
├── package.json                        # Dépendances du projet
└── README.md                           # Documentation du projet
```

## Description des Modules

### 📄 Pages (`pages/`)

Les pages sont organisées par rôle utilisateur :

- **Pages Publiques** : Accueil, Connexion, Inscription
- **Pages Administrateur** (`admin/`) :
  - Statistiques : Dashboard avec statistiques du système
  - Utilisateurs : Gestion des utilisateurs et rôles
- **Pages Agent** (`agents/`) :
  - Trajets : Consultation des trajets
  - GererTrajets : Création et modification des trajets
  - Passagers : Liste des passagers par trajet
- **Pages Client** (`clients/`) :
  - Trajets : Recherche et consultation des trajets disponibles
  - Reservation : Formulaire pour réserver un trajet
  - Reservations : Historique des réservations effectuées

### 🧩 Composants (`components/`)

Composants réutilisables dans toute l'application :

- **BarreNav** : Navigation principale avec menu des rôles
- **PiedPage** : Pied de page avec informations
- **Bouton** : Bouton personnalisé avec variantes
- **Chargeur** : Écran/indicateur de chargement

### 📦 Contexte et Hooks (`contexte/`, `hooks/`)

Gestion de l'état global :

- **ContexteAuth** : Stockage de l'utilisateur connecté et de son état d'authentification
- **useAuth** : Hook pour accéder aux informations d'authentification

### 🔌 Services (`services/`)

Intégration avec l'API backend :

- **api.js** : Services API pour :
  - Authentification (`authService`)
  - Trajets (`tripService`)
  - Véhicules (`vehicleService`)
  - Réservations (`reservationService`)
  - Statistiques (`statisticsService`)
- **serviceAuth.js** : Service d'authentification avec axios
- **config.js** : Configuration des variables API

### 🛣️ Routes (`routes/`)

- **AppRoutes** : Définition de toutes les routes et protection par rôle

### 🎨 Styles (`styles/`)

- **variables.css** : Variables CSS globales (couleurs, fonts, espacements)

## Flux d'Authentification

```
User Login (Connexion.jsx)
    ↓
ContexteAuth.login()
    ↓
serviceAuth.login() (appel API)
    ↓
Token stocké + User dans localStorage
    ↓
Redirection selon rôle
```

## Flux de Réservation (Client)

```
Recherche Trajets (Trajets.jsx)
    ↓
Sélection Trajet → Reservation.jsx
    ↓
reservationService.createReservation()
    ↓
Confirmation
    ↓
Historique (Reservations.jsx)
```

## Conventions de Nommage

- **Fichiers** : PascalCase pour les composants/pages (ex: `ContexteAuth.jsx`)
- **Services** : camelCase avec suffixe Service (ex: `serviceAuth.js`)
- **Variables/Fonctions** : camelCase
- **Constantes** : UPPER_SNAKE_CASE
- **Classes CSS** : kebab-case

## Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build pour production
npm run build

# Linting
npm run lint
```

## Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:8080/api
```

## Rôles et Accès

- **CLIENT** : Consultation des trajets, réservation
- **AGENT** : Gestion des trajets et véhicules, consultation des passagers
- **ADMIN** : Gestion des utilisateurs, consultation des statistiques

## Points Clés

✅ Structure claire par rôle utilisateur  
✅ Services centralisés pour l'API  
✅ Gestion d'état globale via Contexte React  
✅ Routes protégées par rôle  
✅ Composants réutilisables  
✅ Configuration facile à maintenir  

---

**Dernier mise à jour** : Février 2026  
**Système** : SmartTrip - Gestion des réservations de trajets
