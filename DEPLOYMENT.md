# 🚀 BlockHost Deployment Guide

## Cloudflare Pages Deployment

### Option 1: Direct Upload (Schnellste Methode)

1. **Build lokal erstellen:**
   ```bash
   npm install
   npm run build
   ```
   Dies erstellt einen `dist/` Ordner mit allen kompilierten Dateien.

2. **Cloudflare Dashboard öffnen:**
   - Gehe zu [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigiere zu **Workers & Pages** → **Pages**
   - Klicke auf **"Create a project"**

3. **Upload Methode wählen:**
   - Wähle **"Upload assets"** (Direct Upload)

4. **Dateien hochladen:**
   - Ziehe den gesamten **Inhalt** des `dist/` Ordners (nicht den Ordner selbst) in den Upload-Bereich
   - Gib deinem Projekt einen Namen: z.B. `blockhost`
   - Klicke **"Deploy site"**

5. **Fertig!** 🎉
   - Deine Seite ist live unter: `blockhost.pages.dev`
   - Optional: Custom Domain verbinden unter **Custom domains**

---

### Option 2: Git Integration (Empfohlen für automatische Updates)

1. **Repository erstellen:**
   - Pushe deinen Code zu GitHub, GitLab oder Bitbucket
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Cloudflare Pages verbinden:**
   - Gehe zu [dash.cloudflare.com](https://dash.cloudflare.com)
   - **Workers & Pages** → **Pages** → **"Create a project"**
   - Wähle **"Connect to Git"**

3. **Repository auswählen:**
   - Autorisiere Cloudflare für dein GitHub/GitLab
   - Wähle dein Repository aus

4. **Build-Einstellungen konfigurieren:**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

5. **Environment Variables (Optional):**
   - Keine erforderlich für diese Anwendung

6. **Deploy starten:**
   - Klicke **"Save and Deploy"**
   - Cloudflare baut automatisch deine App

7. **Automatische Updates:**
   - Jeder Push zu `main` triggered automatisch einen neuen Build! 🔄

---

## Alternative Hosting-Optionen

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Static File Hosting
Nach `npm run build` kannst du den `dist/` Ordner auf jedem Webserver hosten:
- Apache
- Nginx
- Amazon S3
- GitHub Pages

---

## Build-Befehle Übersicht

```bash
# Dependencies installieren
npm install

# Development Server starten (http://localhost:5173)
npm run dev

# Production Build erstellen
npm run build

# Production Build lokal testen
npx vite preview
```

---

## Wichtige Hinweise

- ✅ Die App ist eine **reine Frontend-Anwendung** (kein Backend erforderlich)
- ✅ Alle Preise sind in **CHF** (Schweizer Franken)
- ✅ Server-Standort: **St. Gallen, Schweiz**
- ✅ DDoS-Schutz via **TCPShield** (panel.tcpshield.com)
- ✅ Max. Storage: **50GB** gedeckelt
- ✅ Warenkorb-Funktionalität vollständig implementiert

---

## Troubleshooting

**Problem: "npm: command not found"**
- Installiere Node.js von [nodejs.org](https://nodejs.org)

**Problem: Build schlägt fehl**
- Lösche `node_modules/` und `package-lock.json`
- Führe `npm install` erneut aus

**Problem: Seite lädt nicht auf Cloudflare**
- Überprüfe, ob der Build-Output-Ordner korrekt auf `dist` gesetzt ist
- Stelle sicher, dass alle Dateien aus `dist/` hochgeladen wurden (nicht der Ordner selbst)

---

## 🎮 Viel Erfolg mit BlockHost!
