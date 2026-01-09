# ✅ Cloudflare Pages Deployment Checkliste

## Vor dem Deployment

- [ ] Alle Dependencies installiert: `npm install`
- [ ] App läuft lokal ohne Fehler: `npm run dev`
- [ ] Production Build erfolgreich: `npm run build`
- [ ] Keine Konsolenfehler im Browser

## Deployment Schritte

### Option A: Direct Upload (5 Minuten)

1. **Build erstellen**
   ```bash
   npm run build
   ```
   ✅ `dist/` Ordner wurde erstellt

2. **Cloudflare öffnen**
   - Gehe zu: https://dash.cloudflare.com
   - Klicke: **Workers & Pages** → **Pages**
   - Klicke: **Create a project**

3. **Upload**
   - Wähle: **"Upload assets"**
   - Ziehe **ALLE Dateien AUS** `dist/` rein (nicht den Ordner selbst!)
   - Projekt-Name: `blockhost` (oder eigener Name)
   - Klicke: **Deploy site**

4. **Fertig!**
   - URL: `https://blockhost.pages.dev`
   - Custom Domain hinzufügen unter: **Custom domains**

---

### Option B: Git Integration (10 Minuten, automatische Updates)

1. **Git Repository erstellen**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   ```

2. **Zu GitHub pushen**
   ```bash
   # Erstelle Repository auf GitHub
   git remote add origin https://github.com/username/blockhost.git
   git push -u origin main
   ```

3. **Cloudflare verbinden**
   - Gehe zu: https://dash.cloudflare.com
   - Klicke: **Workers & Pages** → **Pages**
   - Klicke: **Create a project** → **Connect to Git**
   - Autorisiere GitHub
   - Wähle dein Repository

4. **Build Settings**
   ```
   Framework preset:          Vite
   Build command:             npm run build
   Build output directory:    dist
   Root directory:            /
   Environment variables:     (keine erforderlich)
   ```

5. **Deploy**
   - Klicke: **Save and Deploy**
   - Warte 2-3 Minuten auf Build
   - ✅ Live URL: `https://blockhost-xxx.pages.dev`

6. **Automatische Updates aktiviert!**
   - Jeder `git push` triggert neuen Build 🎉

---

## Nach dem Deployment

### Testen
- [ ] Homepage lädt korrekt
- [ ] Navigation funktioniert
- [ ] Pricing-Pläne werden angezeigt
- [ ] Enterprise-Slider funktionieren
- [ ] Artikel können zum Warenkorb hinzugefügt werden
- [ ] Warenkorb-Sidebar öffnet sich
- [ ] Sign In Modal öffnet sich
- [ ] Get Started Modal öffnet sich
- [ ] Mobile Menu funktioniert
- [ ] Toast-Benachrichtigungen erscheinen
- [ ] Alle Bilder laden

### Optional: Custom Domain

1. **Domain verbinden**
   - Gehe zu deinem Projekt in Cloudflare Pages
   - Klicke: **Custom domains**
   - Klicke: **Set up a custom domain**
   - Gib deine Domain ein: z.B. `blockhost.com`
   - Folge den DNS-Anweisungen

2. **SSL/HTTPS**
   - Cloudflare aktiviert automatisch SSL
   - ✅ Deine Seite ist sicher (HTTPS)

---

## Troubleshooting

### "Build failed" Fehler
**Lösung:**
```bash
# Lösche node_modules und lockfile
rm -rf node_modules package-lock.json

# Neu installieren
npm install

# Nochmal testen
npm run build
```

### "Page not found" nach Deployment
**Lösung:**
- Überprüfe, dass der **Build output directory** auf `dist` gesetzt ist
- Stelle sicher, dass der Inhalt von `dist/` hochgeladen wurde (nicht der Ordner selbst)

### "Assets not loading"
**Lösung:**
- Cloudflare braucht 2-3 Minuten zum Caching
- Hard-Refresh im Browser: `Ctrl+Shift+R` (Windows) oder `Cmd+Shift+R` (Mac)

### "npm command not found"
**Lösung:**
- Installiere Node.js: https://nodejs.org
- Version prüfen: `node -v` (sollte v18+ sein)

---

## 🎯 Was hochgeladen werden muss

### ✅ Hochladen (dist/ Inhalt)
```
dist/
  ├── index.html          ✅ Main HTML
  ├── assets/             ✅ CSS, JS, Images
  │   ├── index-xyz.js
  │   ├── index-xyz.css
  │   └── ...
  └── ...
```

### ❌ NICHT hochladen
```
❌ node_modules/
❌ src/
❌ package.json
❌ vite.config.ts
❌ tsconfig.json
❌ .git/
```

---

## 🚀 Schnell-Kommandos

```bash
# Development starten
npm run dev

# Production Build
npm run build

# Build lokal testen
npx vite preview

# Git commit & push (wenn Option B)
git add .
git commit -m "Update"
git push
```

---

## 📞 Support

Bei Problemen:
- Cloudflare Docs: https://developers.cloudflare.com/pages
- Vite Docs: https://vitejs.dev
- GitHub Issues: (dein-repo)/issues

---

**🎉 Viel Erfolg mit dem Deployment!**
