# 🚀 BlockHost - GitHub + Cloudflare Pages Deployment Anleitung

## 📋 Übersicht
Diese Anleitung zeigt dir Schritt für Schritt, wie du deine BlockHost-Anwendung auf GitHub hochlädst und mit Cloudflare Pages live schaltest.

---

## 🎯 Schritt 1: Projekt vorbereiten

### 1.1 Wichtige Dateien erstellen

Erstelle eine `.gitignore` Datei im Hauptverzeichnis:

```
node_modules/
dist/
.DS_Store
*.log
.env
.env.local
.vite/
.cache/
```

### 1.2 README erstellen (optional)

Erstelle eine `README.md` im Hauptverzeichnis:

```markdown
# BlockHost - Minecraft Server Hosting Platform

Eine moderne Minecraft Server Hosting Plattform mit:
- Mehrsprachigkeit (Deutsch/Englisch)
- Vollständiges Dashboard mit Server-Verwaltung
- Plan-Management (Basic, Pro, Premium, Enterprise)
- Echtzeit-Server-Konsole
- Backup-System
- Billing & Rechnungen

## Technologien
- React 18.3.1
- TypeScript
- Vite 6.3.5
- Tailwind CSS 4.1.12
- Recharts für Statistiken

## Live-Demo
https://blockhosts.org

## Installation
\`\`\`bash
npm install
npm run build
\`\`\`
```

---

## 📦 Schritt 2: GitHub Repository erstellen

### 2.1 GitHub Account
1. Gehe zu [github.com](https://github.com)
2. Melde dich an (oder erstelle einen Account)

### 2.2 Neues Repository erstellen
1. Klicke auf das **"+"** Symbol oben rechts
2. Wähle **"New repository"**
3. Fülle die Details aus:
   - **Repository name:** `blockhost`
   - **Description:** "Minecraft Server Hosting Platform - BlockHost"
   - **Visibility:** Public (oder Private)
   - ⚠️ **WICHTIG:** Aktiviere **NICHT** "Add a README file" - wir haben schon eine!
   - ⚠️ **WICHTIG:** Aktiviere **NICHT** "Add .gitignore" - wir haben schon eine!
4. Klicke auf **"Create repository"**

---

## 📤 Schritt 3: Projekt auf GitHub hochladen

### Option A: Via GitHub Website (Einfach - Empfohlen für Anfänger)

1. **Projekt als ZIP vorbereiten:**
   - Wähle ALLE Dateien und Ordner in deinem Projekt aus
   - **AUSNAHME:** Schließe `node_modules/` aus (falls vorhanden)
   - Erstelle eine ZIP-Datei (z.B. `blockhost.zip`)

2. **Auf GitHub hochladen:**
   - Gehe zu deinem leeren Repository auf GitHub
   - Klicke auf **"uploading an existing file"** (im blauen Info-Bereich)
   - Ziehe die ZIP-Datei in den Upload-Bereich ODER wähle die Dateien manuell aus
   - ⚠️ **WICHTIG:** Lade die entpackten Dateien hoch, NICHT die ZIP!
   - Füge eine Commit-Nachricht hinzu: "Initial commit - BlockHost v1.0"
   - Klicke auf **"Commit changes"**

### Option B: Via Git Command Line (Für Fortgeschrittene)

```bash
# 1. Git initialisieren
git init

# 2. Alle Dateien hinzufügen
git add .

# 3. Ersten Commit erstellen
git commit -m "Initial commit - BlockHost v1.0"

# 4. Branch umbenennen
git branch -M main

# 5. Remote Repository hinzufügen (ersetze USERNAME mit deinem GitHub-Benutzernamen)
git remote add origin https://github.com/USERNAME/blockhost.git

# 6. Hochladen
git push -u origin main
```

---

## ☁️ Schritt 4: Cloudflare Pages einrichten

### 4.1 Cloudflare Account
1. Gehe zu [dash.cloudflare.com](https://dash.cloudflare.com)
2. Melde dich an (oder erstelle einen kostenlosen Account)

### 4.2 Pages Projekt erstellen

1. **Workers & Pages öffnen:**
   - Im Cloudflare Dashboard links auf **"Workers & Pages"** klicken
   - Klicke auf **"Create application"**
   - Wähle den Tab **"Pages"**
   - Klicke auf **"Connect to Git"**

2. **GitHub verbinden:**
   - Klicke auf **"Connect GitHub"**
   - Autorisiere Cloudflare für deinen GitHub Account
   - Wähle dein Repository **"blockhost"** aus
   - Klicke auf **"Begin setup"**

3. **Build-Einstellungen konfigurieren:**
   ```
   Production Branch: main
   
   Build Settings:
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   
   Root directory: /
   
   Environment variables: (keine nötig)
   ```

4. **Deployment starten:**
   - Klicke auf **"Save and Deploy"**
   - ⏳ Warte 2-5 Minuten während Cloudflare deine App baut

5. **Live-URL erhalten:**
   - Nach erfolgreichem Build bekommst du eine URL wie:
   - `https://blockhost-xyz.pages.dev`

---

## 🌐 Schritt 5: Custom Domain einrichten (blockhosts.org)

### 5.1 Domain zu Cloudflare hinzufügen

1. **Domain hinzufügen:**
   - Im Cloudflare Dashboard auf **"Websites"** (links)
   - Klicke auf **"Add a site"**
   - Gib `blockhosts.org` ein
   - Wähle den **Free Plan**
   - Cloudflare scannt deine DNS-Einträge

2. **Nameserver ändern:**
   - Cloudflare zeigt dir zwei Nameserver an (z.B. `ns1.cloudflare.com` und `ns2.cloudflare.com`)
   - Gehe zu deinem Domain-Registrar (wo du `blockhosts.org` gekauft hast)
   - Ändere die Nameserver dort zu den Cloudflare-Nameservern
   - ⏳ Warte 2-24 Stunden bis die Änderung aktiv ist

### 5.2 Pages mit Custom Domain verbinden

1. Gehe zurück zu **"Workers & Pages"**
2. Klicke auf dein **"blockhost"** Projekt
3. Gehe zum Tab **"Custom domains"**
4. Klicke auf **"Set up a custom domain"**
5. Gib ein: `blockhosts.org`
6. Klicke auf **"Continue"**
7. Cloudflare erstellt automatisch die DNS-Einträge
8. Warte 1-5 Minuten
9. ✅ Deine App ist jetzt live unter `https://blockhosts.org`!

### 5.3 www-Subdomain hinzufügen (optional)

1. Wiederhole Schritt 5.2
2. Gib ein: `www.blockhosts.org`
3. Cloudflare leitet automatisch `www` zu `blockhosts.org` weiter

---

## 🔄 Schritt 6: Updates deployen

### Via GitHub Website:

1. Gehe zu deinem Repository auf GitHub
2. Navigiere zur Datei, die du ändern möchtest
3. Klicke auf das Stift-Symbol (Edit)
4. Mache deine Änderungen
5. Scrolle runter und klicke auf **"Commit changes"**
6. Cloudflare Pages deployt automatisch die neue Version! 🚀

### Via Git Command Line:

```bash
# 1. Änderungen speichern
git add .
git commit -m "Update: Beschreibung deiner Änderungen"

# 2. Hochladen
git push origin main

# Cloudflare Pages deployt automatisch! 🚀
```

---

## ✅ Checkliste

- [ ] `.gitignore` Datei erstellt
- [ ] GitHub Repository erstellt
- [ ] Projekt auf GitHub hochgeladen
- [ ] Cloudflare Account erstellt
- [ ] GitHub mit Cloudflare verbunden
- [ ] Build-Einstellungen konfiguriert
- [ ] Erste Deployment erfolgreich
- [ ] Domain `blockhosts.org` zu Cloudflare hinzugefügt
- [ ] Nameserver beim Registrar geändert
- [ ] Custom Domain mit Pages verbunden
- [ ] App ist live unter `https://blockhosts.org`! 🎉

---

## 🆘 Häufige Probleme & Lösungen

### Build schlägt fehl

**Problem:** "npm ERR! missing script: build"
```bash
Lösung: Prüfe ob package.json den build-Befehl hat:
"scripts": {
  "build": "vite build"
}
```

**Problem:** "Module not found"
```bash
Lösung: In Build-Einstellungen unter "Environment variables" hinzufügen:
NODE_VERSION = 18
```

### Domain funktioniert nicht

**Problem:** "DNS_PROBE_FINISHED_NXDOMAIN"
```bash
Lösung: 
1. Prüfe ob Nameserver korrekt gesetzt sind
2. Warte bis zu 24 Stunden
3. Lösche Browser-Cache
```

**Problem:** 404 Fehler bei Routes
```bash
Lösung: In Cloudflare Pages Settings:
Functions > _routes.json erstellen:
{
  "version": 1,
  "include": ["/*"],
  "exclude": []
}
```

### HTTPS funktioniert nicht

```bash
Lösung: Cloudflare aktiviert HTTPS automatisch.
In SSL/TLS Settings wähle: "Full (strict)"
```

---

## 🎯 Performance-Tipps

### 1. Cloudflare Caching optimieren
- Gehe zu **"Caching"** > **"Configuration"**
- Aktiviere **"Browser Cache TTL"**: 4 hours
- Aktiviere **"Always Online"**

### 2. Auto Minify aktivieren
- Gehe zu **"Speed"** > **"Optimization"**
- Aktiviere Auto Minify für:
  - ✅ JavaScript
  - ✅ CSS
  - ✅ HTML

### 3. Brotli Compression
- Gehe zu **"Speed"** > **"Optimization"**
- Aktiviere **"Brotli"**

---

## 📊 Monitoring & Analytics

### Cloudflare Web Analytics einrichten

1. Gehe zu **"Analytics & Logs"** > **"Web Analytics"**
2. Klicke auf **"Add a site"**
3. Gib `blockhosts.org` ein
4. Kopiere das Tracking-Script
5. Füge es in `/index.html` vor dem `</head>` Tag ein:

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "DEIN_TOKEN"}'></script>
```

---

## 🔐 Sicherheits-Empfehlungen

### 1. Security Headers
Erstelle eine Datei `_headers` im `/public` Ordner:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 2. Rate Limiting (optional)
- Gehe zu **"Security"** > **"WAF"**
- Erstelle Rate Limiting Rules für Login-Endpunkte

---

## 💰 Kosten

### GitHub
- ✅ **Kostenlos** für öffentliche Repositories
- ✅ **Kostenlos** für private Repositories (bis 500 MB)

### Cloudflare Pages
- ✅ **Kostenlos** für:
  - Unlimited Bandwidth
  - 500 Builds/Monat
  - 100 Custom Domains
  - Automatic HTTPS
  - DDoS Protection
  - Web Analytics

### Gesamt: CHF 0.00/Monat 🎉

---

## 📞 Support

- **GitHub Docs:** https://docs.github.com
- **Cloudflare Docs:** https://developers.cloudflare.com/pages
- **Vite Docs:** https://vitejs.dev

---

## 🎉 Geschafft!

Deine BlockHost-Plattform ist jetzt live unter:
- **Production:** https://blockhosts.org
- **Staging:** https://blockhost-xyz.pages.dev

Jedes Mal wenn du auf GitHub pushst, wird automatisch eine neue Version deployed!

**Viel Erfolg mit BlockHost! 🚀**
