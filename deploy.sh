#!/usr/bin/env bash
# =============================================================================
# GdrHelper VTT - Deploy Script
# Run this on the LAN server to pull and restart the app without conflicts.
# Usage:  bash /opt/GdrHelper/deploy.sh
# =============================================================================
set -e

APP_DIR="/opt/GdrHelper"
PM2_NAME="gdrhelper"     # Change to your actual PM2 process name

echo ""
echo "🐉 GdrHelper — Deploy in corso..."
echo ""

cd "$APP_DIR"

# 1. Rimuovi i file .next/ generati localmente (mai in git)
echo "🧹 Pulizia build precedente..."
rm -rf .next/

# 2. Pull del codice sorgente
echo "⬇️  Aggiornamento codice da GitHub..."
git pull origin main

# 3. Installa eventuali nuove dipendenze npm
echo "📦  npm install..."
npm install --production=false

# 4. Rigenera il client Prisma (in caso di modifiche schema)
echo "🔧  Prisma generate..."
npx prisma generate

# 5. Riavvia l'app con PM2
echo "🔄  Riavvio app..."
pm2 restart "$PM2_NAME" --update-env

echo ""
echo "✅  Deploy completato!"
echo "📍  App disponibile su http://$(hostname -I | awk '{print $1}'):3000"
echo ""
