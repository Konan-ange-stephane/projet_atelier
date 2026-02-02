# 🚀 DÉMARRAGE RAPIDE - SmartTrip Frontend

## ⚡ En 3 Minutes (Vérification Rapide)

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
# http://localhost:5173
```

✅ **Voilà! Le projet est en cours d'exécution.**

---

## 📚 Documentation Complète

### 🎯 Où Commencer?
**→ Lire [INDEX.md](./INDEX.md) en priorité**

### 📍 Navigation par Besoin

| Je veux... | Lire... |
|-----------|---------|
| Comprendre le projet | [RESUME_RESTRUCTURATION.md](./RESUME_RESTRUCTURATION.md) |
| Connaître la structure | [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md) |
| Contribuer du code | [CONVENTIONS.md](./CONVENTIONS.md) |
| Voir les changements | [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md) |
| Avoir un aperçu | [RAPPORT_FINAL.md](./RAPPORT_FINAL.md) |

---

## 🗂️ Structure en Un Coup d'Oeil

```
src/
├── pages/           ← Pages principales par rôle
│   ├── admin/       ← Pages administrateur
│   ├── agents/      ← Pages agents
│   └── clients/     ← Pages clients
├── components/      ← Composants réutilisables
├── contexte/        ← Gestion d'état (authentification)
├── services/        ← Services API
├── hooks/           ← React Hooks personnalisés
└── routes/          ← Configuration du routage
```

---

## 🎯 Rôles Utilisateur

### 👤 Client
- **Pages** : `pages/clients/`
- **Permissions** : Recherche trajets, réservation, historique

### 🚌 Agent
- **Pages** : `pages/agents/`
- **Permissions** : Gestion trajets, consultation passagers

### 🔧 Administrateur
- **Pages** : `pages/admin/`
- **Permissions** : Gestion utilisateurs, statistiques

---

## 💡 Concepts Clés

### Authentification
```javascript
import { useAuth } from './hooks/useAuth';

const MaPage = () => {
  const { user, token, login, logout } = useAuth();
  
  if (!user) return <Navigate to="/connexion" />;
  
  return <div>Bienvenue {user.nom}!</div>;
};
```

### Appel API
```javascript
import { tripService } from './services/api';

const trajets = await tripService.getAllTrips();
```

### Composant Réutilisable
```jsx
<Bouton 
  texte="Valider" 
  onClick={() => console.log('Cliqué')}
/>
```

---

## 📋 Conventions Essentielles

| Type | Convention | Exemple |
|------|-----------|---------|
| **Fichiers** | PascalCase | `MaPage.jsx` |
| **Dossiers** | minuscule | `pages/` |
| **Variables** | camelCase | `monVariable` |
| **Constantes** | UPPER_SNAKE_CASE | `API_URL` |

**→ Voir [CONVENTIONS.md](./CONVENTIONS.md) pour plus**

---

## 🛠️ Commandes Principales

```bash
# Développement
npm run dev         # Serveur de dev (Ctrl+C pour arrêter)

# Production
npm run build       # Build production
npm run preview     # Prévisualiser le build

# Outils
npm run lint        # Vérifier la qualité (si configuré)
npm run format      # Formater le code (si configuré)
```

---

## ✅ Première Tâche

### Pour les Nouveaux Développeurs

1. [ ] Cloner le repo
2. [ ] `npm install`
3. [ ] Lire [INDEX.md](./INDEX.md)
4. [ ] `npm run dev`
5. [ ] Explorer `pages/Accueil.jsx`
6. [ ] Consulter [CONVENTIONS.md](./CONVENTIONS.md)
7. [ ] Créer une branche pour vos changements
8. [ ] Commencer à développer!

### Pour Dépanner

**Erreur d'import?**
- Vérifier le chemin exact dans [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md)
- Vérifier la casse : dossiers minuscules, fichiers PascalCase

**Port déjà utilisé?**
```bash
# Utiliser un port différent
npm run dev -- --port 3000
```

**Problème de dépendances?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎓 Ressources

### Officiel
- 📖 [Documentation React](https://react.dev)
- 📖 [Documentation Vite](https://vitejs.dev)
- 📖 [React Router](https://reactrouter.com)

### Notre Documentation
- 📄 [INDEX.md](./INDEX.md) - Navigation complète
- 📄 [CONVENTIONS.md](./CONVENTIONS.md) - Standards de code
- 📄 [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md) - Architecture
- 📄 [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md) - Changements

---

## 🚨 Besoin d'Aide?

### Questions Courantes
**Voir [INDEX.md](./INDEX.md) section FAQ**

### Documentation
**Tous les fichiers .md à la racine du projet**

### Contact
Créer une issue ou contacter l'équipe

---

## ✨ Bonne Chance! 🚀

Vous êtes maintenant prêt à contribuer à **SmartTrip** !

**Commandes rapides** :
```bash
npm install && npm run dev
```

**Consultez** : [INDEX.md](./INDEX.md)

**Développez** : Avec les conventions de [CONVENTIONS.md](./CONVENTIONS.md)

---

**Date** : 2 février 2026  
**Projet** : SmartTrip - Gestion Numérique des Réservations  
**Status** : ✅ Prêt pour développement
