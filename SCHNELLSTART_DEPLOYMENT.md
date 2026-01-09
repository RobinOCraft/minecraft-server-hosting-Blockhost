# ⚡ Schnellstart: GitHub + Cloudflare Deployment

## 🎯 In 10 Minuten live!

### Schritt 1: GitHub (2 Minuten)
1. Gehe zu https://github.com/new
2. Repository Name: `blockhost`
3. Public wählen
4. **NICHTS** anhaken (kein README, kein .gitignore)
5. "Create repository" klicken

### Schritt 2: Dateien hochladen (3 Minuten)
1. Klicke auf "uploading an existing file"
2. **WICHTIG:** Wähle ALLE Dateien AUSSER `node_modules/` (falls vorhanden)
3. Ziehe sie in den Upload-Bereich
4. Unten: "Initial commit - BlockHost v1.0"
5. "Commit changes" klicken

### Schritt 3: Cloudflare Pages (5 Minuten)
1. Gehe zu https://dash.cloudflare.com/sign-up (kostenlos!)
2. Nach Login: Links **"Workers & Pages"** → **"Create application"**
3. Tab **"Pages"** → **"Connect to Git"**
4. **"Connect GitHub"** → Autorisieren
5. Repository **"blockhost"** auswählen → **"Begin setup"**

**Build Settings:**
```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

6. **"Save and Deploy"** klicken
7. ⏳ 2-5 Minuten warten
8. ✅ FERTIG! Du bekommst eine URL wie: `https://blockhost-abc.pages.dev`

---

## 🌐 Domain blockhosts.org verbinden (Optional)

### Wenn du die Domain noch NICHT gekauft hast:
1. Kaufe bei einem Registrar (z.B. Namecheap, GoDaddy, Hostpoint)
2. Folge dann "Wenn du die Domain SCHON hast"

### Wenn du die Domain SCHON hast:

#### A) Domain zu Cloudflare hinzufügen:
1. Cloudflare Dashboard → Links **"Websites"** → **"Add a site"**
2. Gib ein: `blockhosts.org`
3. Plan: **Free** wählen
4. **"Continue"** klicken

#### B) Nameserver ändern:
1. Cloudflare zeigt dir 2 Nameserver (z.B. `ns1.cloudflare.com`)
2. Gehe zu deinem Domain-Registrar (wo du die Domain gekauft hast)
3. Suche "Nameserver" oder "DNS Settings"
4. Ändere zu den Cloudflare-Nameservern
5. Speichern
6. ⏳ Warte 2-24 Stunden

#### C) Domain mit Pages verbinden:
1. Cloudflare → **"Workers & Pages"** → Dein **"blockhost"** Projekt
2. Tab **"Custom domains"** → **"Set up a custom domain"**
3. Gib ein: `blockhosts.org`
4. **"Continue"** klicken
5. ⏳ Warte 1-5 Minuten
6. ✅ FERTIG! App ist live unter https://blockhosts.org

---

## 🔄 Updates machen

### Via GitHub Website (Einfach):
1. Gehe zu deinem Repository
2. Klicke auf die Datei die du ändern willst
3. Stift-Symbol klicken → Änderungen machen
4. Unten "Commit changes" klicken
5. Cloudflare deployt automatisch! 🚀

---

## ✅ Das war's!

- GitHub Repository: `https://github.com/DEIN_USERNAME/blockhost`
- Live App: `https://blockhost-abc.pages.dev` (oder `https://blockhosts.org`)
- Kosten: **CHF 0.00/Monat** 🎉

**Viel Erfolg! 🚀**

---

## 🆘 Probleme?

**Build schlägt fehl?**
- Prüfe ob alle Dateien hochgeladen wurden
- Prüfe Build Settings in Cloudflare

**Domain funktioniert nicht?**
- Nameserver richtig gesetzt?
- 24 Stunden gewartet?
- Browser-Cache gelöscht?

**Mehr Hilfe:** Siehe `GITHUB_CLOUDFLARE_DEPLOYMENT.md` für Details!
