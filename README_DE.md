# 🎮 BlockHost - Minecraft Server Hosting

Eine moderne, vollständig responsive Minecraft Server Hosting Web-Anwendung mit dunklem Theme, grünen Akzenten und vollständigem E-Commerce-System.

---

## ✨ Features

### **Hauptfunktionen:**
- ✅ **Vollständige Landing Page** mit Hero, Features, Pricing, Server-Standort
- ✅ **Warenkorb-System** mit persistentem State
- ✅ **Checkout/Kasse** mit 4 Zahlungsmethoden
- ✅ **Mehrsprachigkeit** (Deutsch/Englisch)
- ✅ **Sign In / Get Started Modals**
- ✅ **Toast-Benachrichtigungen**
- ✅ **Vollständig responsive** (Mobile, Tablet, Desktop)

### **Spezifikationen:**
- 📍 **Server-Standort:** St. Gallen, Schweiz
- 🛡️ **DDoS-Schutz:** TCPShield (panel.tcpshield.com)
- 💾 **Max. Speicher:** 50GB für alle Pläne
- 💰 **Währung:** CHF (Schweizer Franken)
- 🧮 **MwSt.:** 7.7% automatisch berechnet

---

## 🚀 Quick Start

```bash
# 1. Dependencies installieren
npm install

# 2. Development Server starten
npm run dev

# 3. Im Browser öffnen
http://localhost:5173
```

---

## 📦 Deployment (Cloudflare Pages)

```bash
# 1. Production Build erstellen
npm run build

# 2. Zu Cloudflare Pages hochladen
# → https://dash.cloudflare.com
# → Workers & Pages → Create a project → Upload assets
# → Ziehe ALLE Dateien AUS dem dist/ Ordner ins Upload-Feld
```

---

## 🌐 Mehrsprachigkeit

Die App unterstützt Deutsch und Englisch:

```typescript
// Sprache wechseln
const { language, setLanguage, t } = useLanguage();
setLanguage('de'); // Deutsch
setLanguage('en'); // English

// Text übersetzen
t('nav.features')    // Features
t('hero.title')      // Premium Minecraft Server Hosting
t('cart.checkout')   // Zur Kasse / Proceed to Checkout
```

**Weitere Sprachen hinzufügen:**
Bearbeite `/src/app/contexts/LanguageContext.tsx`

---

## 🛒 Warenkorb & Checkout

### **Warenkorb:**
```typescript
const { cart, addToCart, removeFromCart, total } = useCart();

// Item hinzufügen
addToCart({
  id: 'starter-plan',
  name: 'Starter Plan',
  price: 9.90,
});

// Item entfernen
removeFromCart('starter-plan');
```

### **Checkout:**
- Rechnungsinformationen (Name, Adresse, etc.)
- 4 Zahlungsmethoden:
  - 💳 Kreditkarte
  - 🅿️ PayPal
  - 📱 TWINT (Schweiz)
  - 📄 Rechnung
- Automatische MwSt.-Berechnung (7.7%)
- Success/Error Handling

---

## 🎨 Technologie-Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Notifications:** Sonner
- **State Management:** React Context API

---

## 📁 Projekt-Struktur

```
/src/
├── main.tsx                              (Entry Point)
├── /app/
│   ├── App.tsx                           (Main App)
│   ├── /contexts/
│   │   ├── CartContext.tsx               (Warenkorb)
│   │   └── LanguageContext.tsx           (Mehrsprachigkeit)
│   └── /components/
│       ├── Header.tsx                    (Navigation)
│       ├── Hero.tsx                      (Hero Section)
│       ├── Features.tsx                  (Features)
│       ├── Pricing.tsx                   (Preispläne)
│       ├── CartSidebar.tsx               (Warenkorb)
│       ├── Checkout.tsx                  (Kasse)
│       ├── SignInModal.tsx               (Anmeldung)
│       └── GetStartedModal.tsx           (Registrierung)
└── /styles/
    ├── fonts.css                         (Font Imports)
    └── theme.css                         (Theme & Tailwind)
```

---

## 🎯 Preispläne

### **Starter** - CHF 9.90/Monat
- 10-20 Spieler
- 4GB RAM
- 25GB Storage

### **Gaming** - CHF 19.90/Monat ⭐ Beliebteste
- 20-50 Spieler
- 8GB RAM
- 50GB Storage

### **Pro** - CHF 39.90/Monat
- 50-100 Spieler
- 16GB RAM
- 50GB Storage

### **Enterprise** - Individuell
- Konfigurierbar (RAM, Storage, Spieler)
- Dedizierter Support

---

## 🔧 Konfiguration

### **Zahlungsmethoden anpassen:**
Bearbeite `/src/app/components/Checkout.tsx`:
```typescript
type PaymentMethod = 'card' | 'paypal' | 'twint' | 'invoice';
```

### **MwSt.-Satz ändern:**
Bearbeite `/src/app/contexts/CartContext.tsx`:
```typescript
const TAX_RATE = 0.077; // 7.7%
```

### **Server-Standort ändern:**
Bearbeite `/src/app/components/ServerLocations.tsx`

---

## 📝 Übersetzungen verwalten

Alle Übersetzungen befinden sich in:
`/src/app/contexts/LanguageContext.tsx`

```typescript
const translations = {
  de: {
    'nav.features': 'Features',
    'hero.title': 'Premium Minecraft Server Hosting',
    // ... weitere Übersetzungen
  },
  en: {
    'nav.features': 'Features',
    'hero.title': 'Premium Minecraft Server Hosting',
    // ... weitere Übersetzungen
  }
};
```

---

## 🧪 Testing

```bash
# Development Server starten
npm run dev

# Features testen:
# 1. Sprache wechseln (DE/EN Toggle im Header)
# 2. Plan zum Warenkorb hinzufügen
# 3. Warenkorb öffnen
# 4. Checkout durchführen
# 5. Verschiedene Zahlungsmethoden testen
```

---

## 🐛 Fehlerbehebung

### **Build-Fehler:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **TypeScript-Fehler:**
```bash
npm run build -- --mode development
```

### **Port bereits belegt:**
```bash
# Ändere Port in vite.config.ts
server: { port: 3000 }
```

---

## 📚 Weitere Dokumentation

- 📄 `WELCHEN_CODE_BRAUCHST_DU.md` - Deployment-Anleitung
- 📄 `CHECKOUT_UND_SPRACHEN_INFO.md` - Feature-Übersicht
- 📄 `DATEISTRUKTUR.md` - Komplette Datei-Übersicht
- 📄 `ALLE_DATEIEN.md` - Was du brauchst zum Deployment

---

## 🔐 Sicherheit

- ✅ Kein echtes Payment-Processing (nur Simulation)
- ✅ Keine sensiblen Daten gespeichert
- ✅ Client-Side Only (Static Hosting)
- ⚠️ Für Production: Echte Payment-API integrieren

---

## 🚧 Nächste Schritte / Erweiterungen

### **Kurzfristig:**
- [ ] Payment-Integration (Stripe, PayPal API)
- [ ] User Authentication (Supabase, Firebase)
- [ ] E-Mail-Benachrichtigungen

### **Mittelfristig:**
- [ ] User Dashboard
- [ ] Server-Management Panel
- [ ] Ticket-System
- [ ] Knowledge Base

### **Langfristig:**
- [ ] Server-Monitoring
- [ ] Automatisches Provisioning
- [ ] Backup-Management
- [ ] API für Kunden

---

## 📞 Support

Falls du Hilfe benötigst:

1. **Dokumentation lesen:** Alle Info-Dateien durchgehen
2. **Dependencies prüfen:** `npm install` ohne Fehler?
3. **Build testen:** `npm run build` erfolgreich?
4. **Browser Console:** Fehler-Meldungen checken

---

## 📄 Lizenz

Dieses Projekt ist für den privaten und kommerziellen Gebrauch verfügbar.

---

## 🎉 Credits

- **Design & Development:** Figma Make
- **UI-Komponenten:** Shadcn/ui Inspired
- **Icons:** Lucide React
- **Hosting:** Cloudflare Pages

---

**Made with ❤️ for Minecraft Server Hosting**

🚀 **Bereit für Production!**
