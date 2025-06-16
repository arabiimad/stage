# DentalTech Pro - Guide d'Installation

## Quick Start

### Prérequis
- Node.js 18+ 
- pnpm 8+ (gestionnaire de paquets recommandé)

### Installation et Lancement

```bash
# 1. Installation des dépendances
pnpm install

# 2. Lancement du serveur de développement
pnpm run dev

# 3. Accès à l'application
# Ouvrir http://localhost:5173 dans votre navigateur
```

### Build de Production

```bash
# Build pour la production
pnpm run build

# Prévisualisation du build
pnpm run preview
```

## Structure du Projet

```
dental-website/
├── src/
│   ├── index.css              # Styles Tailwind CSS principaux
│   ├── main.jsx              # Point d'entrée de l'application
│   ├── App.jsx               # Composant principal
│   └── components/           # Composants React
├── tailwind.config.js        # Configuration Tailwind CSS v4
├── postcss.config.js         # Configuration PostCSS
├── vite.config.js           # Configuration Vite avec plugin Tailwind
└── package.json             # Dépendances et scripts
```

## Technologies Utilisées

- **React 19.1.0** - Framework frontend
- **Vite 6.3.5** - Outil de build et serveur de développement
- **Tailwind CSS 4.1.7** - Framework CSS utilitaire
- **@tailwindcss/vite 4.1.7** - Plugin Vite pour Tailwind CSS v4
- **@tailwindcss/postcss 4.1.10** - Plugin PostCSS pour Tailwind CSS v4
- **shadcn/ui** - Composants d'interface utilisateur
- **Lucide React** - Icônes
- **Framer Motion** - Animations

## Configuration Tailwind CSS

Le projet utilise Tailwind CSS v4 avec une configuration moderne :

### Couleurs Personnalisées
- **Bleu médical** : `#0d6efd` (couleur primaire)
- **Turquoise** : `#00c4cc` (couleur d'accent)
- **Variables CSS** : Système de couleurs basé sur oklch()

### Fonctionnalités
- ✅ Mode sombre
- ✅ Responsive design
- ✅ Animations personnalisées
- ✅ Accessibilité (WCAG AA)
- ✅ Support print
- ✅ Reduced motion

## Scripts Disponibles

```bash
# Développement
pnpm run dev          # Serveur de développement avec HMR

# Production
pnpm run build        # Build optimisé pour la production
pnpm run preview      # Prévisualisation du build de production

# Qualité de code
pnpm run lint         # Vérification ESLint
```

## Résolution des Problèmes

### Styles Tailwind non appliqués
Si les styles ne s'affichent pas :

1. Vérifiez que `@tailwindcss/vite` est installé :
   ```bash
   pnpm add -D @tailwindcss/vite @tailwindcss/postcss
   ```

2. Vérifiez la configuration Vite :
   ```javascript
   // vite.config.js
   import tailwindcss from '@tailwindcss/vite';
   
   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

3. Vérifiez la configuration PostCSS :
   ```javascript
   // postcss.config.js
   export default {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   }
   ```

### Erreurs de build
- Assurez-vous que toutes les dépendances sont installées
- Vérifiez que les fichiers de configuration sont présents
- Redémarrez le serveur de développement après modification de la configuration

## Support et Maintenance

### Versions Compatibles
- React 18.3.1+ ✅
- date-fns 3.6.0+ ✅  
- react-day-picker 8.10.1 ✅

### Mise à Jour
Pour mettre à jour les dépendances :
```bash
pnpm update
```

### Débogage
Pour activer le mode debug Tailwind :
```bash
DEBUG=tailwindcss:* pnpm run dev
```

---

**Dernière mise à jour :** 16 juin 2025  
**Version Tailwind CSS :** 4.1.7  
**Statut :** ✅ Fonctionnel

