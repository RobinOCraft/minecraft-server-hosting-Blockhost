# 🚀 Wie lade ich BlockHost auf Cloudflare hoch?

## ⚡ Super einfache Methode (5 Minuten)

### Option 1: Wrangler CLI (Empfohlen - Am einfachsten!)

#### Schritt 1: Wrangler installieren
Öffne das Terminal/CMD in deinem Projektordner und führe aus:

```bash
npm install -g wrangler
```

#### Schritt 2: Bei Cloudflare anmelden
```bash
wrangler login
```
- Dein Browser öffnet sich
- Melde dich bei Cloudflare an
- Klicke auf "Allow"

#### Schritt 3: Projekt bauen
```bash
npm install
npm run build
```
- Erstellt den `dist/` Ordner mit der fertigen App

#### Schritt 4: Hochladen
```bash
wrangler pages deploy dist --project-name=blockhost
```

✅ **FERTIG!** Du bekommst eine URL wie: `https://blockhost.pages.dev`

---

### Option 2: Direkt über Cloudflare Dashboard (Ohne Git)

#### Schritt 1: Projekt bauen
Öffne Terminal/CMD in deinem Projektordner:

```bash
npm install
npm run build
```

#### Schritt 2: Zu Cloudflare gehen
1. Gehe zu https://dash.cloudflare.com/login
2. Melde dich an
3. Links auf **"Workers & Pages"** klicken
4. **"Create application"** klicken
5. Tab **"Pages"** wählen
6. **"Upload assets"** klicken

#### Schritt 3: Hochladen
1. **Project name:** `blockhost`
2. **Production branch:** `production`
3. Klicke auf **"Upload"** Button
4. Ziehe den kompletten **`dist/`** Ordner ins Upload-Feld
   - WICHTIG: Nur der `dist/` Ordner, nicht der ganze Projektordner!
5. Klicke auf **"Deploy site"**

✅ **FERTIG!** Warte 1-2 Minuten, dann ist deine App live!

---

### Option 3: Via GitHub (Automatische Updates)

Siehe `SCHNELLSTART_DEPLOYMENT.md` für die GitHub-Methode.

---

## 🌐 Custom Domain (blockhosts.org) verbinden

### Nach dem Upload:

1. In Cloudflare Pages Projekt → **"Custom domains"** Tab
2. Klicke **"Set up a custom domain"**
3. Gib ein: `blockhosts.org`
4. Klicke **"Continue"**
5. Cloudflare erstellt automatisch die DNS-Einträge
6. ✅ FERTIG nach 1-5 Minuten!

---

## 🔄 Updates machen

### Mit Wrangler (Schnell):
```bash
npm run build
wrangler pages deploy dist --project-name=blockhost
```

### Mit Dashboard (Einfach):
1. `npm run build` ausführen
2. Cloudflare Dashboard → Dein Projekt
3. **"Create deployment"** klicken
4. Neuen `dist/` Ordner hochladen

---

## 📋 Wichtige Infos

### Was ist der `dist/` Ordner?
- Der fertig gebaute, optimierte Code deiner App
- Wird erstellt mit `npm run build`
- NUR diesen Ordner auf Cloudflare hochladen!

### Dateien die du brauchst:
```
dist/
├── index.html
├── assets/
│   ├── index-abc123.js
│   ├── index-def456.css
│   └── ...
├── _headers          ← Wichtig!
├── _redirects        ← Wichtig!
└── favicon.svg
```

### Wichtig: `_headers` und `_redirects` müssen im `dist/` sein!

Prüfe nach `npm run build` ob diese Dateien in `dist/` sind:
```bash
# Windows CMD:
dir dist

# Mac/Linux Terminal:
ls -la dist
```

Falls `_headers` und `_redirects` fehlen, kopiere sie manuell:
```bash
# Windows:
copy public\_headers dist\_headers
copy public\_redirects dist\_redirects

# Mac/Linux:
cp public/_headers dist/_headers
cp public/_redirects dist/_redirects
```

---

## ✅ Checkliste

- [ ] `npm install` ausgeführt
- [ ] `npm run build` ausgeführt
- [ ] `dist/` Ordner wurde erstellt
- [ ] `dist/_headers` existiert
- [ ] `dist/_redirects` existiert
- [ ] Wrangler installiert ODER Cloudflare Dashboard geöffnet
- [ ] Bei Cloudflare angemeldet
- [ ] `dist/` Ordner hochgeladen
- [ ] Deployment erfolgreich
- [ ] URL funktioniert (z.B. `https://blockhost.pages.dev`)

---

## 🆘 Häufige Probleme

### Problem: "npm: command not found"
**Lösung:** Node.js installieren von https://nodejs.org

### Problem: "npm run build" funktioniert nicht
**Lösung:** 
```bash
# Erst installieren:
npm install

# Dann bauen:
npm run build
```

### Problem: `dist/` Ordner ist leer
**Lösung:** Prüfe die Konsole auf Fehler beim Build

### Problem: "_headers" oder "_redirects" fehlen in `dist/`
**Lösung:** Manuell kopieren (siehe oben) ODER Vite Config anpassen

### Problem: 404 Fehler auf der Website
**Lösung:** `_redirects` Datei fehlt! Muss in `dist/` sein mit Inhalt:
```
/* /index.html 200
```

### Problem: Wrangler fragt nach Project Name
**Lösung:** 
```bash
wrangler pages deploy dist --project-name=blockhost
```

---

## 💡 Profi-Tipp: Automatisches Kopieren von _headers und _redirects

Ändere die `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // NEU: Kopiert _headers und _redirects automatisch
  publicDir: 'public',
})
```

Dann einfach:
```bash
npm run build
```

Und `_headers` + `_redirects` sind automatisch in `dist/`! ✅

---

## 🎉 Geschafft!

Deine App läuft jetzt auf:
- **Production:** https://blockhosts.org (nach Domain-Setup)
- **Staging:** https://blockhost.pages.dev

### Kosten: CHF 0.00/Monat 🎊

---

## 📞 Mehr Hilfe?

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Vite Docs:** https://vitejs.dev/

**Viel Erfolg! 🚀**
