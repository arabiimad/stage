# Guide d'installation et de déploiement - DentalTech Pro

## Prérequis système

### Environnement de développement
- **Node.js:** Version 20.18.0 ou supérieure
- **Python:** Version 3.11 ou supérieure
- **Git:** Pour la gestion de version
- **Navigateur moderne:** Chrome, Firefox, Safari, Edge

### Outils recommandés
- **VS Code** avec extensions React et Python
- **Postman** pour tester les APIs
- **Chrome DevTools** pour le debugging

## Installation locale

### 1. Clonage du projet
```bash
git clone <repository-url>
cd dental-website-project
```

### 2. Installation du Frontend (React)
```bash
cd dental-website

# Installation des dépendances
pnpm install

# Démarrage du serveur de développement
pnpm run dev

# Le site sera accessible sur http://localhost:5173
```

### 3. Installation du Backend (Flask)
```bash
cd dental-api

# Création de l'environnement virtuel
python -m venv venv

# Activation de l'environnement virtuel
# Sur Linux/Mac:
source venv/bin/activate
# Sur Windows:
venv\Scripts\activate

# Installation des dépendances
pip install -r requirements.txt

# Démarrage du serveur API
python src/main.py

# L'API sera accessible sur http://localhost:5000
```

### 4. Configuration de la base de données
La base de données SQLite est automatiquement créée et peuplée au premier démarrage du serveur Flask.

## Build de production

### Frontend
```bash
cd dental-website

# Build de production
pnpm run build

# Test du build en local
pnpm run preview

# Les fichiers optimisés sont dans le dossier dist/
```

### Backend
```bash
cd dental-api

# Activation de l'environnement virtuel
source venv/bin/activate

# Configuration pour la production
export FLASK_ENV=production

# Démarrage du serveur
python src/main.py
```

## Déploiement

### Option 1: Déploiement Frontend (Vercel)
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
cd dental-website
vercel --prod
```

### Option 2: Déploiement Backend (Heroku)
```bash
# Installation de Heroku CLI
# Puis création de l'application
heroku create dentaltech-api

# Configuration des variables d'environnement
heroku config:set FLASK_ENV=production

# Déploiement
git push heroku main
```

### Option 3: Déploiement complet (DigitalOcean)
```bash
# Configuration du serveur
sudo apt update
sudo apt install nginx python3-pip nodejs npm

# Installation de PM2 pour la gestion des processus
npm install -g pm2

# Configuration Nginx
sudo nano /etc/nginx/sites-available/dentaltech
```

## Configuration des variables d'environnement

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_ANALYTICS_ID=your_analytics_id
```

### Backend (.env)
```env
FLASK_ENV=production
DATABASE_URL=sqlite:///dental.db
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=https://your-frontend-domain.com
```

## Tests et validation

### Tests Frontend
```bash
cd dental-website

# Tests unitaires
pnpm run test

# Tests de performance
pnpm run lighthouse

# Validation du build
pnpm run build && pnpm run preview
```

### Tests Backend
```bash
cd dental-api

# Tests API
python -m pytest tests/

# Validation des endpoints
curl http://localhost:5000/api/products
```

## Monitoring et maintenance

### Logs de production
```bash
# Frontend (Vercel)
vercel logs

# Backend (Heroku)
heroku logs --tail

# Serveur personnalisé
tail -f /var/log/nginx/access.log
```

### Sauvegarde de la base de données
```bash
# Sauvegarde SQLite
cp dental.db backup_$(date +%Y%m%d).db

# Pour PostgreSQL en production
pg_dump database_name > backup_$(date +%Y%m%d).sql
```

### Mises à jour
```bash
# Frontend
cd dental-website
pnpm update
pnpm audit fix

# Backend
cd dental-api
pip list --outdated
pip install --upgrade package_name
```

## Résolution des problèmes courants

### Erreur de port déjà utilisé
```bash
# Trouver le processus utilisant le port
lsof -i :5173
lsof -i :5000

# Arrêter le processus
kill -9 PID
```

### Problème de CORS
Vérifier la configuration CORS dans `dental-api/src/main.py`:
```python
CORS(app, origins=['http://localhost:5173', 'https://your-domain.com'])
```

### Erreur de build
```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json
pnpm install

# Ou pour Python
pip cache purge
pip install -r requirements.txt --force-reinstall
```

## Performance et optimisation

### Optimisations Frontend
- Code splitting activé automatiquement
- Images optimisées avec lazy loading
- Service Worker pour le cache
- Bundle analysis avec `pnpm run analyze`

### Optimisations Backend
- Gzip compression activée
- Cache des réponses API
- Optimisation des requêtes SQL
- Rate limiting pour la sécurité

## Sécurité

### Checklist de sécurité
- [ ] HTTPS activé en production
- [ ] Variables d'environnement sécurisées
- [ ] CORS configuré correctement
- [ ] Validation des entrées utilisateur
- [ ] Protection contre les injections SQL
- [ ] Headers de sécurité configurés

### Configuration Nginx sécurisée
```nginx
server {
    listen 443 ssl;
    server_name dentaltech-pro.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

## Support technique

En cas de problème, vérifier dans l'ordre:
1. Les logs d'erreur du navigateur (F12)
2. Les logs du serveur de développement
3. La configuration des variables d'environnement
4. La connectivité réseau entre frontend et backend
5. Les permissions de fichiers et dossiers

