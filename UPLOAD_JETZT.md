# ⚡ UPLOAD JETZT - In 3 Schritten!

## 🎯 Methode 1: Automatisches Script (EINFACHSTE!)

### Windows:
1. Doppelklick auf **`upload.bat`**
2. Wähle Option 1 oder 2
3. Fertig! 🎉

### Mac/Linux:
1. Terminal öffnen im Projektordner
2. Ausführen: `chmod +x upload.sh && ./upload.sh`
3. Wähle Option 1 oder 2
4. Fertig! 🎉

---

## 🎯 Methode 2: Manuell (3 Befehle)

### Terminal/CMD öffnen im Projektordner:

```bash
# 1. Build erstellen
npm run build

# 2. Wrangler installieren (nur einmal nötig)
npm install -g wrangler

# 3. Hochladen
wrangler login
wrangler pages deploy dist --project-name=blockhost
```

✅ FERTIG! Du bekommst eine URL!

---

## 🎯 Methode 3: Ohne Terminal

### Schritt 1: Build erstellen
- Öffne Terminal/CMD im Projektordner
- Führe aus: `npm run build`
- Es entsteht ein `dist/` Ordner

### Schritt 2: Zu Cloudflare
1. Gehe zu: https://dash.cloudflare.com
2. Login
3. Links: **Workers & Pages** → **Create application**
4. Tab: **Pages** → **Upload assets**

### Schritt 3: Hochladen
1. **Project name:** `blockhost`
2. Ziehe den **`dist/`** Ordner rein
3. Klicke **Deploy site**
4. ⏳ Warte 1 Minute
5. ✅ FERTIG!

---

## 🌐 Domain verbinden

Nach dem Upload:
1. In deinem Cloudflare Pages Projekt
2. **Custom domains** Tab
3. **Set up a custom domain**
4. Eingeben: `blockhosts.org`
5. **Continue**
6. ✅ Fertig nach 5 Minuten!

---

## 💡 Welche Methode?

- **Anfänger:** Methode 1 (Script) oder Methode 3 (Ohne Terminal)
- **Fortgeschritten:** Methode 2 (Wrangler)
- **Am schnellsten:** Methode 2 für Updates

---

## 🔄 Updates hochladen

```bash
npm run build
wrangler pages deploy dist --project-name=blockhost
```

Oder: `upload.bat` / `upload.sh` erneut ausführen!

---

## ✅ Das war's!

**Live URL:** https://blockhost.pages.dev
**Mit Domain:** https://blockhosts.org

**Kosten:** CHF 0.00/Monat

**Viel Erfolg! 🚀**
