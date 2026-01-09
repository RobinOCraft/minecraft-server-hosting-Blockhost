#!/bin/bash

echo "========================================"
echo "  BlockHost - Cloudflare Upload Script"
echo "========================================"
echo ""

echo "[1/4] Installiere Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "FEHLER: npm install fehlgeschlagen!"
    exit 1
fi
echo ""

echo "[2/4] Baue Projekt..."
npm run build
if [ $? -ne 0 ]; then
    echo "FEHLER: Build fehlgeschlagen!"
    exit 1
fi
echo ""

echo "[3/4] Kopiere wichtige Dateien..."
if [ -f "public/_headers" ]; then
    cp -f "public/_headers" "dist/_headers"
    echo "_headers kopiert"
fi
if [ -f "public/_redirects" ]; then
    cp -f "public/_redirects" "dist/_redirects"
    echo "_redirects kopiert"
fi
echo ""

echo "[4/4] Uploade zu Cloudflare..."
echo ""
echo "WICHTIG: Wähle eine Option:"
echo "  1) Mit Wrangler (automatisch)"
echo "  2) Manuell (öffnet dist/ Ordner)"
echo ""
read -p "Deine Wahl (1 oder 2): " choice

if [ "$choice" == "1" ]; then
    echo ""
    echo "Prüfe ob Wrangler installiert ist..."
    if ! command -v wrangler &> /dev/null; then
        echo "Wrangler nicht gefunden! Installiere..."
        npm install -g wrangler
    fi
    echo ""
    echo "Melde dich bei Cloudflare an..."
    wrangler login
    echo ""
    echo "Uploade Projekt..."
    wrangler pages deploy dist --project-name=blockhosts
else
    echo ""
    echo "Öffne dist/ Ordner..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open dist
    else
        xdg-open dist
    fi
    echo ""
    echo "Gehe zu: https://dash.cloudflare.com"
    echo "1. Workers & Pages > Create application > Pages > Upload assets"
    echo "2. Ziehe den kompletten dist/ Ordner rein"
    echo "3. Project name: blockhosts"
    echo "4. Deploy site klicken"
fi

echo ""
echo "========================================"
echo "  Upload abgeschlossen!"
echo "========================================"
echo ""