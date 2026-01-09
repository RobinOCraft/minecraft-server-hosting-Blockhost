# 🎮 BlockHost - Premium Minecraft Server Hosting

Eine moderne, vollständig responsive React-Webanwendung für Minecraft-Server-Hosting mit dunklem Gaming-Theme und grünen Akzenten.

![BlockHost](https://images.unsplash.com/photo-1759663174469-f1e2a7a4bdcb?w=800&q=80)

## ✨ Features

### 🛒 **Vollständige Warenkorb-Funktionalität**
- Artikel zum Warenkorb hinzufügen
- Warenkorb-Sidebar mit Live-Updates
- Toast-Benachrichtigungen für alle Aktionen
- Gesamt-Preisberechnung in CHF

### 💳 **Hosting-Pläne**
- **Starter** - CHF 5/Monat (2GB RAM, 2 CPU Cores, 10GB Storage)
- **Pro** - CHF 12/Monat (4GB RAM, 4 CPU Cores, 25GB Storage) - Most Popular
- **Ultimate** - CHF 24/Monat (8GB RAM, 6 CPU Cores, 50GB Storage)
- **Enterprise** - Vollständig konfigurierbar mit interaktiven Slidern
  - RAM: 2-12GB
  - CPU: 1-6 Cores
  - Storage: 15-50GB (in 5GB-Schritten)
  - Dynamische Preisberechnung: CHF 1.50/GB RAM + CHF 1.50/CPU Core + CHF 0.10/GB Storage

### 🔐 **Authentifizierung**
- Sign In Modal
- Get Started (Registrierung) Modal
- Formular-Validierung

### 🎨 **Design & UX**
- Modernes dunkles Theme (Schwarz + Grün)
- Smooth Hover-Effekte & Animationen
- Vollständig responsive (Mobile, Tablet, Desktop)
- Toast-Benachrichtigungen mit Sonner
- Backdrop-Blur-Effekte

### 📍 **Server-Spezifikationen**
- **Standort:** St. Gallen, Schweiz 🇨🇭
- **DDoS-Schutz:** TCPShield (panel.tcpshield.com)
- **Max. Storage:** 50GB gedeckelt
- **Währung:** CHF (Schweizer Franken)

### 🧩 **Komponenten**
- Responsive Header mit Mobile Menu
- Hero-Sektion mit Call-to-Action
- Feature-Showcase
- Live-Statistiken
- Pricing-Cards mit Sliders (Enterprise)
- Server-Standort-Karte
- Footer mit Links

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
App läuft auf `http://localhost:5173`

### Production Build
```bash
npm run build
```
Output: `dist/` Ordner

## 📦 Technologie-Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite
- **UI-Komponenten:** Radix UI
- **Icons:** Lucide React
- **Toast-Notifications:** Sonner
- **State Management:** React Context API
- **Animations:** CSS Transitions

## 🎯 Deployment

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für detaillierte Anleitung zu:
- Cloudflare Pages (Direct Upload & Git Integration)
- Vercel
- Netlify
- Andere Hosting-Optionen

### Schnell-Deploy zu Cloudflare:
```bash
npm run build
# Lade den Inhalt von dist/ zu Cloudflare Pages hoch
```

## 📱 Screenshots & Features

### Warenkorb-System
- Sidebar mit allen Items
- Artikel entfernen
- Live-Preisberechnung
- Checkout-Button

### Enterprise-Konfigurator
- Interaktive RAM-Slider (2-12GB)
- CPU-Core-Slider (1-6 Cores)
- Storage-Slider (15-50GB)
- Live-Preisvorschau

### Mobile Responsive
- Hamburger-Menu
- Touch-optimierte Navigation
- Mobile-optimierte Modals

## 🔧 Projekt-Struktur

```
/src
  /app
    App.tsx                 # Main App Component
    /components
      Header.tsx           # Navigation + Warenkorb-Icon
      Hero.tsx             # Landing Hero Section
      Features.tsx         # Feature Showcase
      Stats.tsx            # Live Statistics
      Pricing.tsx          # Pricing Cards + Enterprise Config
      ServerLocations.tsx  # Server-Standort
      Footer.tsx           # Footer mit Links
      CartSidebar.tsx      # Warenkorb Sidebar
      SignInModal.tsx      # Login Modal
      GetStartedModal.tsx  # Registration Modal
      /ui                  # Radix UI Components
    /contexts
      CartContext.tsx      # Warenkorb State Management
```

## 🎨 Design-System

### Farben
- **Primär:** Grün (#22c55e - green-500/600)
- **Hintergrund:** Schwarz (#000000)
- **Sekundär:** Grau (#1f2937, #374151)
- **Akzent:** Blau (#3b82f6)

### Typography
- **Heading:** System Fonts (Segoe UI, Roboto)
- **Body:** -apple-system, BlinkMacSystemFont

## 🌍 Browser-Support

- Chrome (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Edge (neueste Version)

## 📄 Lizenz

© 2025 BlockHost. All rights reserved.

---

**Entwickelt mit ❤️ für die Minecraft-Community**
