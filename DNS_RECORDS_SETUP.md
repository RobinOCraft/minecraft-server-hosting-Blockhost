# 🌐 DNS Records Setup für blockhosts.org

## ⚡ Schnellstart: Automatischer Import (EINFACHSTE METHODE!)

Wenn du deine Domain **blockhosts.org** bereits bei Cloudflare hast:

### Option 1: Automatische Verbindung über Cloudflare Pages

1. Gehe zu deinem **Cloudflare Pages** Projekt
2. Klicke auf **"Custom domains"** Tab
3. Klicke **"Set up a custom domain"**
4. Gib ein: `blockhosts.org`
5. Klicke **"Continue"**
6. ✅ **FERTIG!** Cloudflare erstellt automatisch die richtigen DNS-Records!

---

## 📋 Manuelle DNS Records (Falls du die Domain woanders hast)

Falls deine Domain **NICHT** bei Cloudflare ist, hier sind die DNS-Records:

### Schritt 1: Domain zu Cloudflare transferieren (EMPFOHLEN)

1. Gehe zu: https://dash.cloudflare.com
2. **"Add a site"** klicken
3. Domain eingeben: `blockhosts.org`
4. **"Add site"** klicken
5. Plan wählen: **"Free"**
6. Cloudflare scannt automatisch deine existierenden DNS-Records
7. Records überprüfen und **"Continue"** klicken
8. Nameserver bei deinem Domain-Registrar ändern (siehe unten)

### Schritt 2: Nameserver ändern bei deinem Registrar

Cloudflare zeigt dir 2 Nameserver wie:
```
ava.ns.cloudflare.com
raj.ns.cloudflare.com
```

Diese Nameserver musst du bei deinem Domain-Registrar eintragen (z.B. GoDaddy, Namecheap, etc.)

### Schritt 3: DNS Records für Cloudflare Pages

Nach dem Transfer/Setup füge diese Records hinzu:

#### A) Mit Custom Domain in Cloudflare Pages (AUTOMATISCH):
- Gehe zu deinem Pages Projekt → Custom domains
- Füge `blockhosts.org` hinzu
- Cloudflare erstellt automatisch:
  - **CNAME** `@` → `blockhost.pages.dev`
  - **CNAME** `www` → `blockhost.pages.dev`

#### B) Manuell (Falls du es selbst machen willst):

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| CNAME | @ | blockhost.pages.dev | Proxied (Orange Cloud) | Auto |
| CNAME | www | blockhost.pages.dev | Proxied (Orange Cloud) | Auto |

---

## 🔧 Komplette DNS-Konfiguration für BlockHost

### Minimale Konfiguration (Nur Website):

```dns
Type: CNAME
Name: @
Content: blockhost.pages.dev
Proxy: Proxied
TTL: Auto

Type: CNAME
Name: www
Content: blockhost.pages.dev
Proxy: Proxied
TTL: Auto
```

### Erweiterte Konfiguration (Mit E-Mail, etc.):

```dns
# Website
Type: CNAME
Name: @
Content: blockhost.pages.dev
Proxy: Proxied
TTL: Auto

Type: CNAME
Name: www
Content: blockhost.pages.dev
Proxy: Proxied
TTL: Auto

# E-Mail (Falls du E-Mail nutzen willst)
Type: MX
Name: @
Content: mail.blockhosts.org
Priority: 10
TTL: Auto

Type: A
Name: mail
Content: [DEINE_MAIL_SERVER_IP]
Proxy: DNS only (Grey Cloud)
TTL: Auto

# Optional: Subdomain für API
Type: CNAME
Name: api
Content: blockhost.pages.dev
Proxy: Proxied
TTL: Auto
```

---

## 📥 DNS Records Import Format

Falls du DNS Records importieren möchtest, hier das Format:

### BIND Format (Standard):
```bind
@       300     IN      CNAME   blockhost.pages.dev.
www     300     IN      CNAME   blockhost.pages.dev.
```

### Cloudflare CSV Format:
```csv
Type,Name,Content,TTL,Proxy
CNAME,@,blockhost.pages.dev,Auto,true
CNAME,www,blockhost.pages.dev,Auto,true
```

### JSON Format (Cloudflare API):
```json
[
  {
    "type": "CNAME",
    "name": "@",
    "content": "blockhost.pages.dev",
    "ttl": 1,
    "proxied": true
  },
  {
    "type": "CNAME",
    "name": "www",
    "content": "blockhost.pages.dev",
    "ttl": 1,
    "proxied": true
  }
]
```

---

## 🎯 Import über Cloudflare Dashboard

### Schritt-für-Schritt:

1. **Dashboard öffnen:** https://dash.cloudflare.com
2. Deine Domain auswählen: **blockhosts.org**
3. Links auf **"DNS"** klicken
4. Rechts oben auf **"Advanced"** klicken
5. **"Import records"** wählen
6. Datei auswählen oder Text einfügen
7. Format wählen: **BIND** oder **CSV**
8. **"Import"** klicken
9. ✅ **Fertig!**

---

## ⚙️ Wichtige Einstellungen nach dem DNS-Setup

### 1. SSL/TLS Einstellungen
```
Dashboard → SSL/TLS → Overview
Encryption mode: Full (strict)
```

### 2. Page Rules (Optional aber empfohlen)
```
Dashboard → Rules → Page Rules

Rule 1: http://blockhosts.org/*
Einstellung: Always Use HTTPS

Rule 2: http://www.blockhosts.org/*
Einstellung: Forwarding URL (301) zu https://blockhosts.org/$1
```

### 3. Security Einstellungen
```
Dashboard → Security → Settings
Security Level: Medium
Bot Fight Mode: On
```

---

## 🔍 DNS Records Testen

### Nach dem Setup (Warte 5-10 Minuten):

#### Online Tools:
- https://dnschecker.org → Gib `blockhosts.org` ein
- https://www.whatsmydns.net → Prüfe CNAME Records

#### Terminal/CMD:
```bash
# Windows:
nslookup blockhosts.org

# Mac/Linux:
dig blockhosts.org
dig www.blockhosts.org
```

#### Erwartete Ausgabe:
```
blockhosts.org → CNAME → blockhost.pages.dev
www.blockhosts.org → CNAME → blockhost.pages.dev
```

---

## 🆘 Häufige Probleme

### Problem: "CNAME record already exists"
**Lösung:** Lösche den alten CNAME Record zuerst, dann erstelle den neuen.

### Problem: "DNS_PROBE_FINISHED_NXDOMAIN"
**Lösung:** 
1. Warte 10-30 Minuten (DNS Propagation)
2. Prüfe ob Nameserver korrekt sind
3. Leere Browser Cache (Ctrl + Shift + Delete)

### Problem: "Too many redirects"
**Lösung:** 
```
SSL/TLS → Overview → Encryption mode: Full (strict)
```

### Problem: "Domain not verified"
**Lösung:** 
1. Gehe zu Cloudflare Pages Projekt
2. Custom domains → Domain entfernen
3. Neu hinzufügen und warten

### Problem: "www funktioniert, aber @ nicht"
**Lösung:** 
```
Füge CNAME Record hinzu:
Type: CNAME
Name: @
Content: blockhost.pages.dev
Proxy: Proxied
```

---

## 📊 DNS Records Status Prüfen

### In Cloudflare Dashboard:

1. **Dashboard** → **DNS** → **Records**
2. Prüfe Status:
   - ✅ **Orange Cloud** = Proxied (Empfohlen für Website)
   - ⚪ **Grey Cloud** = DNS Only (Für Mail, etc.)

### Richtige Konfiguration:
```
✅ @ → CNAME → blockhost.pages.dev [Orange Cloud]
✅ www → CNAME → blockhost.pages.dev [Orange Cloud]
```

---

## 🎉 Checkliste

- [ ] Domain bei Cloudflare hinzugefügt
- [ ] Nameserver geändert (falls nötig)
- [ ] DNS Records erstellt/importiert
- [ ] CNAME @ → blockhost.pages.dev
- [ ] CNAME www → blockhost.pages.dev
- [ ] SSL/TLS auf "Full (strict)"
- [ ] 10 Minuten gewartet
- [ ] https://blockhosts.org funktioniert ✅
- [ ] https://www.blockhosts.org funktioniert ✅

---

## 🚀 Nach dem DNS-Setup

### 1. Domain in Cloudflare Pages verbinden:
```
Pages Projekt → Custom domains → blockhosts.org hinzufügen
```

### 2. HTTPS funktioniert automatisch:
- Cloudflare erstellt automatisch SSL-Zertifikat
- Dauert 5-15 Minuten
- Danach: https://blockhosts.org ist live! 🎉

### 3. Testen:
```
https://blockhosts.org
https://www.blockhosts.org
```

---

## 💡 Profi-Tipps

### 1. Apex Domain vs WWW
Beide sollten funktionieren:
- `blockhosts.org` → Hauptdomain
- `www.blockhosts.org` → Redirect zu Hauptdomain

### 2. Schnellere DNS Propagation
- Setze TTL auf "Auto" oder niedrig (300)
- Nach Änderungen: Warte 5-30 Minuten
- Leere Browser Cache

### 3. Subdomain für Staging
```
Type: CNAME
Name: staging
Content: staging-blockhost.pages.dev
```

### 4. CAA Records für Sicherheit (Optional)
```
Type: CAA
Name: @
Content: 0 issue "letsencrypt.org"
```

---

## 📞 Mehr Hilfe

- **Cloudflare DNS Docs:** https://developers.cloudflare.com/dns/
- **Pages Custom Domains:** https://developers.cloudflare.com/pages/how-to/custom-domains/
- **DNS Checker:** https://dnschecker.org

---

## ✅ Zusammenfassung

**Einfachste Methode:**
1. Pages Projekt deployen
2. Custom domain hinzufügen: `blockhosts.org`
3. Cloudflare macht den Rest automatisch!

**Kosten:** CHF 0.00/Monat

**Viel Erfolg! 🚀**
