# Guide de déploiement sur VPS OVH

## Prérequis
- VPS OVH avec Ubuntu 20.04 ou plus récent
- Accès SSH au serveur (IP: 51.75.26.4)
- Nom de domaine (optionnel)

## 1. Connexion au serveur

```bash
ssh root@51.75.26.4
```

## 2. Configuration initiale du serveur

Télécharger et exécuter le script de configuration :

```bash
# Télécharger le script
wget https://raw.githubusercontent.com/nathwebdesign/rdistrib-websitenew/main/deploy/setup-vps.sh
chmod +x setup-vps.sh

# Exécuter le script
./setup-vps.sh
```

## 3. Cloner le projet

```bash
cd /var/www/rdistrib
git clone https://github.com/nathwebdesign/rdistrib-websitenew.git .
```

## 4. Configuration des variables d'environnement

Créer le fichier `.env.local` :

```bash
nano /var/www/rdistrib/.env.local
```

Ajouter les variables suivantes :

```env
# MongoDB
MONGODB_URI=mongodb+srv://rdistrib:rdistrib2024@cluster0.mongodb.net/rdistrib?retryWrites=true&w=majority

# Email (Resend)
RESEND_API_KEY=votre_cle_resend

# Application
NEXT_PUBLIC_SITE_URL=http://51.75.26.4
NODE_ENV=production
```

## 5. Configuration de Nginx

```bash
# Copier la configuration Nginx
sudo cp /var/www/rdistrib/deploy/nginx.conf /etc/nginx/sites-available/rdistrib
sudo ln -s /etc/nginx/sites-available/rdistrib /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 6. Build et démarrage de l'application

```bash
cd /var/www/rdistrib

# Installer les dépendances
npm install

# Build de l'application
npm run build

# Copier le fichier de configuration PM2
cp deploy/ecosystem.config.js .

# Démarrer avec PM2
pm2 start ecosystem.config.js

# Sauvegarder la configuration PM2
pm2 save
pm2 startup
```

## 7. Vérification

Visitez http://51.75.26.4 pour vérifier que le site fonctionne.

## 8. Configuration SSL (optionnel)

Si vous avez un nom de domaine :

```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

## Commandes utiles

### Logs de l'application
```bash
pm2 logs rdistrib-website
```

### Redémarrer l'application
```bash
pm2 restart rdistrib-website
```

### Mise à jour du code
```bash
cd /var/www/rdistrib
./deploy/deploy.sh
```

### Vérifier le statut
```bash
pm2 status
sudo systemctl status nginx
```

## Sécurité

### Configurer le firewall
```bash
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

### Créer un utilisateur non-root
```bash
adduser rdistrib
usermod -aG sudo rdistrib
chown -R rdistrib:rdistrib /var/www/rdistrib
```

## Maintenance

### Sauvegardes automatiques
Créer un script de sauvegarde pour MongoDB et les fichiers :

```bash
#!/bin/bash
# Créer dans /home/rdistrib/backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p /home/rdistrib/backups

# Sauvegarde des fichiers
tar -czf /home/rdistrib/backups/files_$DATE.tar.gz /var/www/rdistrib

# Nettoyer les sauvegardes de plus de 7 jours
find /home/rdistrib/backups -name "*.tar.gz" -mtime +7 -delete
```

Ajouter au cron :
```bash
crontab -e
# Ajouter : 0 2 * * * /home/rdistrib/backup.sh
```

## Dépannage

### L'application ne démarre pas
```bash
# Vérifier les logs
pm2 logs rdistrib-website --lines 100

# Vérifier les ports
sudo netstat -tlnp | grep 3000
```

### Erreur 502 Bad Gateway
```bash
# Vérifier que l'app est en cours d'exécution
pm2 status

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problèmes de permissions
```bash
sudo chown -R $USER:$USER /var/www/rdistrib
chmod -R 755 /var/www/rdistrib
```