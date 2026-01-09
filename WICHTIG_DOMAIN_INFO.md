# ⚠️ WICHTIG: Deine Domain-Information

## 🌐 Deine Domain

**Domain:** `blockhosts.org` (MIT "s"!)

---

## 📋 Korrekte Namen für Deployment

### Cloudflare Pages Projekt-Name:
```
blockhosts
```
**WICHTIG:** Mit "s" am Ende!

### Cloudflare Pages URL:
```
https://blockhosts.pages.dev
```

### Custom Domain (Deine finale URL):
```
https://blockhosts.org
https://www.blockhosts.org
```

---

## 🚀 Korrekte Befehle

### Mit Wrangler deployen:
```bash
wrangler pages deploy dist --project-name=blockhosts
```

### DNS Records:
```
CNAME @ → blockhosts.pages.dev
CNAME www → blockhosts.pages.dev
```

---

## ✅ Checkliste vor dem Deploy

- [ ] Projekt-Name: `blockhosts` (mit "s")
- [ ] Pages URL: `blockhosts.pages.dev` (mit "s")
- [ ] Domain: `blockhosts.org` (mit "s")
- [ ] DNS Records zeigen auf `blockhosts.pages.dev`

---

## 🎯 Deployment-Schritte

### 1. Projekt deployen:
```bash
# Windows:
upload.bat

# Mac/Linux:
./upload.sh
```

Oder manuell:
```bash
npm run build
wrangler login
wrangler pages deploy dist --project-name=blockhosts
```

### 2. Custom Domain verbinden:
1. Cloudflare Dashboard → Workers & Pages
2. Projekt **blockhosts** öffnen
3. Custom domains → Set up a custom domain
4. Eingeben: `blockhosts.org`
5. Continue klicken
6. ✅ Fertig!

### 3. DNS Records (automatisch erstellt):
```
CNAME @ blockhosts.pages.dev (Proxied)
CNAME www blockhosts.pages.dev (Proxied)
```

---

## 📝 Zusammenfassung

| Was | Name/URL |
|-----|----------|
| **Projekt-Name** | blockhosts |
| **Pages URL** | blockhosts.pages.dev |
| **Deine Domain** | blockhosts.org |
| **WWW Domain** | www.blockhosts.org |
| **DNS CNAME @** | blockhosts.pages.dev |
| **DNS CNAME www** | blockhosts.pages.dev |

**ALLES mit "s" am Ende! ✅**

---

## 🎉 Nach dem Deployment

Deine Website ist erreichbar unter:

- **Temporär:** https://blockhosts.pages.dev
- **Final:** https://blockhosts.org
- **Mit WWW:** https://www.blockhosts.org

**Viel Erfolg! 🚀**
