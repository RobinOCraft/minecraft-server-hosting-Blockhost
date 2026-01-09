import { Server, Menu, X, ShoppingCart, User, LogOut, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useUser } from "../contexts/UserContext";
import { SignInModal } from "./SignInModal";
import { GetStartedModal } from "./GetStartedModal";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CurrencyTicker } from "./CurrencyTicker";

interface HeaderProps {
  onNavigateToCheckout?: () => void;
}

export function Header({ onNavigateToCheckout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const { user, isLoggedIn, logout } = useUser();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Server className="w-8 h-8 text-green-500" />
              <span className="text-xl text-white">BlockHost</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.features')}
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.pricing')}
              </a>
              <a href="#servers" className="text-gray-300 hover:text-white transition-colors">
                {t('nav.locations')}
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <CurrencyTicker />
              <LanguageSwitcher />
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-green-500 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
              
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                    {(user?.isAdmin || user?.isOwner) ? (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <User className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-white">{user?.name}</span>
                    {user?.isOwner && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-full border border-yellow-500/30">
                        OWNER
                      </span>
                    )}
                    {user?.isAdmin && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-full border border-yellow-500/30">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                    onClick={() => setSignInModalOpen(true)}
                  >
                    {t('nav.signIn')}
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setGetStartedModalOpen(true)}
                  >
                    {t('nav.getStarted')}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.features')}
                </a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.pricing')}
                </a>
                <a href="#servers" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.locations')}
                </a>
                <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                  <div className="pb-2 space-y-2">
                    <CurrencyTicker />
                    <LanguageSwitcher />
                  </div>
                  
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                        {(user?.isAdmin || user?.isOwner) ? (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <User className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-white">{user?.name}</span>
                        {user?.isOwner && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-full border border-yellow-500/30">
                            OWNER
                          </span>
                        )}
                        {user?.isAdmin && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-full border border-yellow-500/30">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10 w-full"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="text-white hover:bg-white/10 w-full"
                        onClick={() => {
                          setSignInModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {t('nav.signIn')}
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white w-full"
                        onClick={() => {
                          setGetStartedModalOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {t('nav.getStarted')}
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/10 w-full relative"
                    onClick={() => {
                      setIsCartOpen(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t('nav.cart')}
                    {cart.length > 0 && (
                      <span className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <SignInModal isOpen={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
      <GetStartedModal isOpen={getStartedModalOpen} onClose={() => setGetStartedModalOpen(false)} />
    </>
  );
}