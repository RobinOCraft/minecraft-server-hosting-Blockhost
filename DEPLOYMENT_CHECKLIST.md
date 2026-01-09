# ✅ Deployment Checkliste - BlockHost

## 📋 Vor dem Upload

- [x] `.gitignore` erstellt - verhindert Upload von `node_modules/`
- [x] `index.html` vorhanden - Einstiegspunkt der App
- [x] `src/main.tsx` vorhanden - React Root
- [x] `public/_headers` erstellt - Security Headers
- [x] `public/_redirects` erstellt - SPA Routing
- [x] `public/favicon.svg` erstellt - Website Icon
- [x] `vite.config.ts` korrekt konfiguriert
- [x] `package.json` hat `build` Script

## 📤 Dateien die hochgeladen werden müssen

### ✅ Root-Verzeichnis
```
/
├── index.html                    ← WICHTIG!
├── package.json                  ← WICHTIG!
├── vite.config.ts               ← WICHTIG!
├── .gitignore                   ← WICHTIG!
├── postcss.config.mjs
├── README.md
└── GITHUB_CLOUDFLARE_DEPLOYMENT.md
```

### ✅ /src Ordner (komplett)
```
/src/
├── main.tsx                     ← WICHTIG!
├── app/
│   ├── App.tsx                  ← WICHTIG!
│   ├── components/              ← ALLE Komponenten
│   └── contexts/                ← ALLE Contexts
└── styles/                      ← ALLE CSS Dateien
```

### ✅ /public Ordner (komplett)
```
/public/
├── _headers                     ← WICHTIG! (Security)
├── _redirects                   ← WICHTIG! (Routing)
└── favicon.svg                  ← WICHTIG! (Icon)
```

### ❌ NICHT hochladen
```
/node_modules/    ← NIE hochladen! (wird automatisch installiert)
/dist/            ← NIE hochladen! (wird beim Build erstellt)
```

---

## 🎯 GitHub Upload - Schritt für Schritt

### Variante 1: Drag & Drop (Empfohlen für Anfänger)

1. **Ordnerstruktur beibehalten:**
   - Öffne deinen Projektordner
   - Wähle ALLE Dateien und Ordner aus
   - **AUSNAHME:** Schließe `node_modules/` und `dist/` aus

2. **Auf GitHub hochladen:**
   ```
   https://github.com/DEIN_USERNAME/blockhost
   → "uploading an existing file" klicken
   → Alle Dateien/Ordner reinziehen
   → "Commit changes" klicken
   ```

3. **Prüfen:**
   - Refresh die GitHub-Seite
   - Du solltest sehen:
     - ✅ `/src` Ordner mit allen Komponenten
     - ✅ `/public` Ordner mit _headers und _redirects
     - ✅ `index.html` im Root
     - ✅ `package.json` im Root
     - ❌ KEIN `node_modules/` Ordner

### Variante 2: Git Command Line

```bash
# Im Projektordner ausführen:

git init
git add .
git commit -m "Initial commit - BlockHost v1.0"
git branch -M main
git remote add origin https://github.com/DEIN_USERNAME/blockhost.git
git push -u origin main
```

---

## ☁️ Cloudflare Pages - Einstellungen

### Build Configuration (WICHTIG!)

```yaml
Production Branch: main

Build Settings:
  Framework preset: Vite
  Build command: npm run build
  Build output directory: dist
  
Root directory: (leer lassen oder "/")

Environment variables: (keine nötig)
```

### Erweiterte Einstellungen (Optional)

```yaml
Node.js version: 18
```

---

## 🧪 Nach dem Deployment testen

### 1. Basis-Funktionalität
- [ ] Website lädt (keine 404 Fehler)
- [ ] Header wird angezeigt
- [ ] Navigation funktioniert
- [ ] Bilder werden geladen

### 2. Sprachen-Switcher
- [ ] Deutsch ↔ Englisch funktioniert
- [ ] Übersetzungen werden korrekt angezeigt

### 3. Login-System
- [ ] Sign In Modal öffnet sich
- [ ] Registrierung funktioniert
- [ ] Login funktioniert
- [ ] Session bleibt erhalten (nach Reload)

### 4. Dashboard
- [ ] Dashboard lädt nach Login
- [ ] Server-Status wird angezeigt
- [ ] Tabs funktionieren (Overview, Console, Files, etc.)
- [ ] Plan-Wechsel funktioniert

### 5. Admin-Features (robinmoser14@gmail.com)
- [ ] Crown Badge wird angezeigt
- [ ] Alle Preise zeigen CHF 0.00
- [ ] Plan-Wechsel zeigt "Kostenlos"

### 6. Server-Verbindung
- [ ] Server-IP wird angezeigt
- [ ] "Kopieren" Button funktioniert
- [ ] RCON Details werden angezeigt

### 7. Konsole
- [ ] Logs werden angezeigt
- [ ] Neue Logs bei Änderungen
- [ ] Plan-Wechsel wird geloggt

---

## 🔍 Häufige Fehler prüfen

### Build-Fehler beheben

#### Fehler: "npm ERR! missing script: build"
```bash
Lösung: package.json prüfen
Sollte enthalten:
"scripts": {
  "build": "vite build"
}
```

#### Fehler: "Cannot find module './app/App'"
```bash
Lösung: Groß-/Kleinschreibung prüfen!
Import: import App from './app/App'
Datei: /src/app/App.tsx
```

#### Fehler: "index.html not found"
```bash
Lösung: index.html muss im Root sein!
Korrekt: /index.html
Falsch: /src/index.html
```

---

## 🌐 Domain-Checkliste (blockhosts.org)

### Bei Domain-Registrar
- [ ] Domain gekauft
- [ ] Nameserver geändert zu:
  - `ns1.cloudflare.com`
  - `ns2.cloudflare.com`
- [ ] Änderung gespeichert

### In Cloudflare
- [ ] Domain zu Cloudflare hinzugefügt
- [ ] Domain-Status: "Active"
- [ ] Custom Domain zu Pages hinzugefügt
- [ ] SSL/TLS Modus: "Full (strict)"
- [ ] "Always Use HTTPS": Aktiviert

### Testen
```bash
# Terminal (nach 24h):
nslookup blockhosts.org

# Sollte Cloudflare IP zeigen:
# Address: 104.21.x.x oder 172.67.x.x
```

---

## 📊 Performance optimieren

### Nach dem Deployment in Cloudflare:

#### 1. Caching optimieren
```
Navigation: Caching → Configuration
- Browser Cache TTL: 4 hours
- Always Online: ON
```

#### 2. Auto Minify
```
Navigation: Speed → Optimization
- JavaScript: ON
- CSS: ON
- HTML: ON
```

#### 3. Brotli Compression
```
Navigation: Speed → Optimization
- Brotli: ON
```

#### 4. Rocket Loader (Optional)
```
Navigation: Speed → Optimization
- Rocket Loader: ON
```

---

## 🔐 Sicherheit prüfen

### Security Headers (automatisch via _headers)
```bash
# Testen auf: https://securityheaders.com
Website: https://blockhosts.org

Sollte A+ oder A Rating haben
```

### SSL/TLS
```bash
# Testen auf: https://www.ssllabs.com/ssltest/
Website: https://blockhosts.org

Sollte A+ Rating haben
```

---

## 🎉 Erfolg!

Wenn alle Checkboxen ✅ sind:

```
🚀 BlockHost ist LIVE!

Production URL: https://blockhosts.org
Staging URL: https://blockhost-xyz.pages.dev

GitHub Repo: https://github.com/DEIN_USERNAME/blockhost
Cloudflare Dashboard: https://dash.cloudflare.com

Kosten: CHF 0.00/Monat

Status: ONLINE ✅
```

---

## 📞 Support Links

- **Detaillierte Anleitung:** `GITHUB_CLOUDFLARE_DEPLOYMENT.md`
- **Schnellstart:** `SCHNELLSTART_DEPLOYMENT.md`
- **GitHub Hilfe:** https://docs.github.com
- **Cloudflare Hilfe:** https://developers.cloudflare.com/pages
- **Vite Hilfe:** https://vitejs.dev/guide/

---

**Viel Erfolg mit dem Deployment! 🚀**
