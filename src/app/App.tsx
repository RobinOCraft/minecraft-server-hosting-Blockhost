import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Stats } from "./components/Stats";
import { Pricing } from "./components/Pricing";
import { ServerLocations } from "./components/ServerLocations";
import { Footer } from "./components/Footer";
import { CartSidebar } from "./components/CartSidebar";
import { Checkout } from "./components/Checkout";
import { TermsOfService } from "./components/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { Dashboard } from "./components/Dashboard";
import { ActivePlanAlert } from "./components/ActivePlanAlert";
import { PaymentReminderAlert } from "./components/PaymentReminderAlert";
import { PaymentWarning1Alert } from "./components/PaymentWarning1Alert";
import { PaymentWarning2Alert } from "./components/PaymentWarning2Alert";
import { PaymentWarning3Alert } from "./components/PaymentWarning3Alert";
import { ServerSuspendedAlert } from "./components/ServerSuspendedAlert";
import { EmailVerificationModal } from "./components/EmailVerificationModal";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { Toaster } from "sonner";
import { useState } from "react";

type Page = 'home' | 'checkout' | 'terms' | 'privacy' | 'dashboard';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { logout } = useUser();

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  const handleOrderComplete = () => {
    // Redirect to dashboard after successful order
    setTimeout(() => {
      setCurrentPage('dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black">
      {currentPage === 'dashboard' && (
        <>
          <Dashboard 
            onLogout={handleLogout}
            onBackToHome={() => setCurrentPage('home')}
          />
          <CartSidebar onCheckout={() => setCurrentPage('checkout')} />
        </>
      )}
      {currentPage === 'checkout' && (
        <Checkout 
          onBack={() => setCurrentPage('home')}
          onNavigateToTerms={() => setCurrentPage('terms')}
          onNavigateToPrivacy={() => setCurrentPage('privacy')}
          onOrderComplete={handleOrderComplete}
        />
      )}
      {currentPage === 'terms' && (
        <TermsOfService onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'privacy' && (
        <PrivacyPolicy onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'home' && (
        <>
          <Header onNavigateToCheckout={() => setCurrentPage('checkout')} />
          <main>
            <Hero />
            <div className="space-y-6">
              <ServerSuspendedAlert onGoToBilling={() => setCurrentPage('dashboard')} />
              <PaymentWarning3Alert onGoToBilling={() => setCurrentPage('dashboard')} />
              <PaymentWarning2Alert onGoToBilling={() => setCurrentPage('dashboard')} />
              <PaymentWarning1Alert onGoToBilling={() => setCurrentPage('dashboard')} />
              <PaymentReminderAlert onGoToBilling={() => setCurrentPage('dashboard')} />
              <ActivePlanAlert onGoToDashboard={() => setCurrentPage('dashboard')} />
            </div>
            <Stats />
            <Features />
            <Pricing />
            <ServerLocations />
          </main>
          <Footer 
            onNavigateToTerms={() => setCurrentPage('terms')}
            onNavigateToPrivacy={() => setCurrentPage('privacy')}
          />
          <CartSidebar onCheckout={() => setCurrentPage('checkout')} />
        </>
      )}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      
      {/* Email Verification Modal - Always rendered */}
      <EmailVerificationModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </UserProvider>
    </LanguageProvider>
  );
}