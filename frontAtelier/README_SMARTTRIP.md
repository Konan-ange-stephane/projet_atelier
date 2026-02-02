# 🚌 SmartTrip - Frontend (React + Vite)

Système de gestion numérique des réservations de trajets - Interface web moderne et responsive.

## 📖 Documentation Rapide

> **Nouveau sur le projet?** Lire [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md) (3 minutes)

### Navigation Documentation
| Document | Objectif |
|----------|----------|
| **[DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)** | ⚡ Commencer en 3 minutes |
| **[INDEX.md](./INDEX.md)** | 📍 Navigation complète (par profil) |
| **[RESUME_RESTRUCTURATION.md](./RESUME_RESTRUCTURATION.md)** | 📊 Vue d'ensemble du projet |
| **[STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md)** | 🗂️ Architecture et organisation |
| **[CONVENTIONS.md](./CONVENTIONS.md)** | 📐 Standards de développement |
| **[GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md)** | 🔄 Changements effectués |
| **[RAPPORT_FINAL.md](./RAPPORT_FINAL.md)** | ✅ Rapport de restructuration |

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
L'application sera disponible à **http://localhost:5173**

### Production
```bash
npm run build
npm run preview
```

---

## 📁 Structure du Projet

```
src/
├── pages/              # Pages par rôle (admin, agents, clients)
├── components/         # Composants réutilisables
├── contexte/           # Gestion d'état (authentification)
├── services/           # Services API
├── hooks/              # Hooks React personnalisés
├── routes/             # Configuration du routage
└── styles/             # Styles globaux
```

**→ Voir [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md) pour détails complets**

---

## 👥 Rôles Utilisateur

### 👤 Client
- Recherche de trajets
- Réservation et annulation
- Historique des réservations

### 🚌 Agent
- Gestion des trajets
- Gestion des véhicules
- Consultation des passagers

### 🔧 Administrateur
- Gestion des utilisateurs
- Consultation des statistiques

---

## 🛠️ Technologies

- **React 18** - Framework UI
- **Vite 7** - Build tool
- **React Router DOM** - Routage
- **CSS3** - Styles

---

## 📝 Conventions

Toutes les ressources sont **en français** et suivent des conventions strictes:
- **Fichiers** : PascalCase (ex: `MonComposant.jsx`)
- **Dossiers** : minuscule (ex: `pages/`)
- **Variables** : camelCase (ex: `maVariable`)
- **Constantes** : UPPER_SNAKE_CASE (ex: `API_URL`)

**→ Voir [CONVENTIONS.md](./CONVENTIONS.md) pour guide complet**

---

## 💻 Commandes Disponibles

```bash
# Développement
npm run dev             # Serveur de développement

# Production
npm run build           # Build production
npm run preview         # Prévisualiser le build

# Linting (si configuré)
npm run lint            # Vérifier la qualité du code
npm run format          # Formater le code

# Tests (si configuré)
npm run test            # Lancer les tests
```

---

## 🔐 Authentification

Le projet utilise un système d'authentification avec tokens JWT:
- Login/Logout via `pages/Connexion.jsx`
- Inscription via `pages/Inscription.jsx`
- Gestion d'état via `contexte/ContexteAuth.jsx`
- Routes protégées par rôle dans `routes/AppRoutes.jsx`

---

## 🌐 Variables d'Environnement

Créez un fichier `.env` à la racine:

```env
VITE_API_URL=http://localhost:8080/api
```

Pour la production:
```env
VITE_API_URL=https://api.smarttrip.com/api
```

---

## 📚 Documentation Complète

### Pour les Développeurs
- [CONVENTIONS.md](./CONVENTIONS.md) - Avant de coder
- [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md) - Comprendre l'architecture

### Pour les Nouveaux
- [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md) - Installation rapide
- [INDEX.md](./INDEX.md) - Navigation par profil

### Technique
- [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md) - Changements détaillés
- [RAPPORT_FINAL.md](./RAPPORT_FINAL.md) - Validation complète
- [RESUME_RESTRUCTURATION.md](./RESUME_RESTRUCTURATION.md) - Vue d'ensemble

---

## ✅ Checklist Démarrage

- [ ] Lire [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md)
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Consulter [CONVENTIONS.md](./CONVENTIONS.md)
- [ ] Créer une branche pour vos changements
- [ ] Commencer à développer!

---

## 📞 Support

### Questions Fréquentes
**→ Voir [INDEX.md](./INDEX.md) section FAQ**

### Problèmes Courants
- **Erreur d'import** : Vérifier casse (minuscule pour dossiers)
- **Port occupé** : `npm run dev -- --port 3000`
- **Problème de dépendances** : `rm -rf node_modules && npm install`

---

## 🎯 Objectifs du Projet

SmartTrip vise à **digitaliser les réservations de trajets** pour:
- ✅ Réduire les files d'attente
- ✅ Optimiser la gestion des départs
- ✅ Faciliter le travail des compagnies
- ✅ Améliorer l'expérience utilisateur

---

## 📄 Licence

Projet SmartTrip - 2026

---

## 🤝 Contribution

Avant de contribuer, consulter:
1. [CONVENTIONS.md](./CONVENTIONS.md) - Standards
2. [DEMARRAGE_RAPIDE.md](./DEMARRAGE_RAPIDE.md) - Installation
3. [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md) - Architecture

---

**Restructuré le** : 2 février 2026  
**Status** : ✅ Production Ready  
**Version** : 1.0.0
