#!/bin/bash
# Script de déploiement pour rdistrib-website

echo "=== Déploiement de rdistrib-website ==="

# Variables
APP_DIR="/var/www/rdistrib"
REPO_URL="https://github.com/nathwebdesign/rdistrib-websitenew.git"

# Se placer dans le répertoire de l'application
cd $APP_DIR

# Si c'est la première fois, cloner le repo
if [ ! -d ".git" ]; then
    echo "Clonage du repository..."
    git clone $REPO_URL .
else
    echo "Mise à jour du code..."
    git pull origin main
fi

# Installation des dépendances
echo "Installation des dépendances..."
npm install

# Build de l'application
echo "Build de l'application Next.js..."
npm run build

# Redémarrage avec PM2
echo "Redémarrage de l'application avec PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# Sauvegarde de la configuration PM2
pm2 save
pm2 startup

echo "=== Déploiement terminé ==="