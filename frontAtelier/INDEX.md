# 📑 Index de Documentation - SmartTrip Frontend

## 🎯 Bienvenue sur SmartTrip!

Ce projet a été complètement restructuré en français pour garantir une meilleure lisibilité et une maintenance facilitée. Tous les fichiers, dossiers et conventions suivent un standard unifié.

---

## 📚 Documentation Disponible

### 1. 🚀 **RESUME_RESTRUCTURATION.md** ← **COMMENCER ICI**
   - Vue d'ensemble rapide de ce qui a été fait
   - Résultats de la restructuration
   - Statut du build
   - Prochaines étapes
   - **Lire en 5 minutes pour comprendre le contexte**

### 2. 📐 **STRUCTURE_PROJET.md**
   - Arborescence détaillée du projet
   - Description complète de chaque module
   - Flux d'authentification et de réservation
   - Comment les fichiers sont organisés
   - **Pour comprendre l'architecture globale**

### 3. 🔍 **GUIDE_RESTRUCTURATION.md**
   - Liste complète des changements effectués
   - Tous les fichiers renommés
   - Les imports mis à jour
   - Avant/après détaillé
   - **Pour voir exactement ce qui a changé**

### 4. 📋 **CONVENTIONS.md**
   - Standards de développement à suivre
   - Conventions de nommage
   - Structures de fichiers recommandées
   - Bonnes pratiques React
   - Exemples de code
   - **À consulter avant de commencer le développement**

---

## 🎯 Par Profil

### Je Suis Nouveau sur le Projet
1. Lire → [RESUME_RESTRUCTURATION.md](./RESUME_RESTRUCTURATION.md)
2. Explorer → [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md)
3. Approfondir → [CONVENTIONS.md](./CONVENTIONS.md)

### Je Veux Contribuer du Code
1. Consulter → [CONVENTIONS.md](./CONVENTIONS.md)
2. Référencer → [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md)
3. Questionner → Voir section FAQ ci-dessous

### Je Dois Maintenir le Code
1. Relire → [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md)
2. Appliquer → [CONVENTIONS.md](./CONVENTIONS.md)
3. Tester → Voir section Testing

### Je Dois Déboguer
1. Explorer → Structure dans [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md)
2. Vérifier → Imports dans [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md)
3. Appliquer → Patterns dans [CONVENTIONS.md](./CONVENTIONS.md)

---

## 🗂️ Structure du Projet

```
src/
├── pages/
│   ├── Accueil.jsx
│   ├── Connexion.jsx
│   ├── Inscription.jsx
│   ├── admin/
│   │   ├── Statistiques.jsx
│   │   └── Utilisateurs.jsx
│   ├── agents/
│   │   ├── GererTrajets.jsx
│   │   ├── Passagers.jsx
│   │   └── Trajets.jsx
│   └── clients/
│       ├── Reservation.jsx
│       ├── Reservations.jsx
│       └── Trajets.jsx
├── components/
│   ├── BarreNav.jsx
│   ├── Bouton.jsx
│   ├── Chargeur.jsx
│   └── PiedPage.jsx
├── contexte/
│   └── ContexteAuth.jsx
├── hooks/
│   └── useAuth.jsx
├── routes/
│   └── AppRoutes.jsx
└── services/
    ├── api.js
    └── serviceAuth.js
```

---

## ❓ FAQ

### Q: Où trouver un exemple de composant?
**R:** Voir [CONVENTIONS.md](./CONVENTIONS.md) section "Structure des Fichiers" → "Composant Standard"

### Q: Comment ajouter une nouvelle page?
**R:** 
1. Créer le fichier dans le bon dossier (ex: `pages/admin/NouvellePage.jsx`)
2. Utiliser le template dans [CONVENTIONS.md](./CONVENTIONS.md)
3. Ajouter la route dans `routes/AppRoutes.jsx`

### Q: Comment faire un appel API?
**R:** 
1. Utiliser les services dans `services/api.js`
2. Ou créer un nouveau service en suivant le pattern [CONVENTIONS.md](./CONVENTIONS.md)

### Q: Pourquoi les fichiers sont en français?
**R:** 
- Cohérence avec le cahier des charges SmartTrip
- Meilleure compréhension pour l'équipe
- Documentation en français
- Standard unifié

### Q: Que faire si je vois une erreur d'import?
**R:** 
1. Vérifier le chemin dans [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md)
2. S'assurer que le fichier n'a pas été renommé
3. Vérifier la casse (les dossiers sont minuscules, les fichiers PascalCase)

### Q: Où signaler une incohérence?
**R:** Créer une issue ou contacter l'équipe de développement

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev      # Lancer le serveur de développement

# Build
npm run build    # Compiler pour la production
npm run preview  # Prévisualiser le build

# Linting (si configuré)
npm run lint     # Vérifier la qualité du code
npm run format   # Formater le code

# Tests (si configuré)
npm run test     # Lancer les tests
npm run test:ui  # UI de test
```

---

## 🎓 Concepts Clés

### Authentification
- **Fichiers** : `contexte/ContexteAuth.jsx`, `hooks/useAuth.jsx`, `services/serviceAuth.js`
- **Usage** : `const { user, token } = useAuth()`
- **Protection** : Routes protégées dans `routes/AppRoutes.jsx`

### Pages par Rôle
- **Admin** : `pages/admin/` - Statistiques et gestion utilisateurs
- **Agent** : `pages/agents/` - Gestion trajets et passagers
- **Client** : `pages/clients/` - Recherche et réservation

### Services API
- **auth** : Authentification et utilisateurs
- **trip** : Trajets et véhicules
- **reservation** : Réservations et annulations
- **statistics** : Données pour le dashboard

### Composants Réutilisables
- **BarreNav** : Navigation principale
- **Bouton** : Boutons personnalisés
- **Chargeur** : Écrans de chargement
- **PiedPage** : Pied de page

---

## ✅ Checklist Démarrage

- [ ] Lire [RESUME_RESTRUCTURATION.md](./RESUME_RESTRUCTURATION.md)
- [ ] Consulter [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md)
- [ ] Parcourir [CONVENTIONS.md](./CONVENTIONS.md)
- [ ] Cloner le repo
- [ ] `npm install`
- [ ] `npm run dev`
- [ ] Tester dans le navigateur
- [ ] Créer une nouvelle branche pour vos modifications

---

## 📞 Besoin d'Aide?

### Documentation Technique
Consultez les fichiers `.md` du projet :
- Architecture → [STRUCTURE_PROJET.md](./STRUCTURE_PROJET.md)
- Conventions → [CONVENTIONS.md](./CONVENTIONS.md)
- Changements → [GUIDE_RESTRUCTURATION.md](./GUIDE_RESTRUCTURATION.md)

### Exemples de Code
Dans [CONVENTIONS.md](./CONVENTIONS.md) :
- Composants
- Services
- Hooks
- Routes protégées
- Gestion d'erreurs

### Problèmes Courants
Voir FAQ ci-dessus ou créer une issue

---

## 📊 Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| **Fichiers renommés** | 22 |
| **Imports mis à jour** | 5+ |
| **Pages** | 10 |
| **Composants** | 4 |
| **Services** | 2 |
| **Hooks personnalisés** | 1 |
| **Documents créés** | 4 |
| **Build** | ✅ Succès |

---

## 🎯 Vision SmartTrip

SmartTrip vise à **digitaliser les réservations de trajets** pour :
- ✅ Réduire les files d'attente
- ✅ Optimiser la gestion des départs
- ✅ Faciliter le travail des compagnies
- ✅ Améliorer l'expérience utilisateur

**Cette restructuration supporte cette vision** en garantissant un code de qualité, maintenable et évolutif.

---

## 📝 Versioning

**Version actuelle** : 1.0.0 (Post-restructuration)  
**Dernière mise à jour** : 2 février 2026  
**État** : ✅ Stable et testé

---

## 🤝 Contribution

Pour contribuer :
1. Lire les [CONVENTIONS.md](./CONVENTIONS.md)
2. Respecter la structure établie
3. Tester avant de pousser
4. Documenter les changements

---

**Bon développement! 🚀**

*N'hésitez pas à consulter la documentation pour toute question.*
