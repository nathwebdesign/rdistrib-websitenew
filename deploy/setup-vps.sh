#!/bin/bash
# Script de configuration initiale du VPS OVH pour rdistrib-website

echo "=== Configuration du VPS OVH pour rdistrib-website ==="

# Mise à jour du système
echo "1. Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation de Node.js 20.x
echo "2. Installation de Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de PM2
echo "3. Installation de PM2..."
sudo npm install -g pm2

# Installation de Nginx
echo "4. Installation de Nginx..."
sudo apt install -y nginx

# Installation de Git
echo "5. Installation de Git..."
sudo apt install -y git

# Création du répertoire pour l'application
echo "6. Création du répertoire de l'application..."
sudo mkdir -p /var/www/rdistrib
sudo chown $USER:$USER /var/www/rdistrib

# Installation de Certbot pour SSL (optionnel)
echo "7. Installation de Certbot pour SSL..."
sudo apt install -y certbot python3-certbot-nginx

echo "=== Configuration initiale terminée ==="
echo "Prochaines étapes :"
echo "1. Cloner le repository dans /var/www/rdistrib"
echo "2. Configurer les variables d'environnement"
echo "3. Configurer Nginx"
echo "4. Démarrer l'application avec PM2"