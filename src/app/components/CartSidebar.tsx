import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface CartSidebarProps {
  onCheckout?: () => void;
}

export function CartSidebar({ onCheckout }: CartSidebarProps) {
  const { cart, removeFromCart, total, subtotal, tax, taxRate, isCartOpen, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    setIsCartOpen(false);
    if (onCheckout) {
      onCheckout();
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast.success(t('cart.removedFromCart'), {
      description: name,
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 border-l border-white/10 z-50 transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-500" />
            <h2 className="text-white">{t('cart.title')}</h2>
            {cart.length > 0 && (
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-64px)]">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-xl text-white mb-2">{t('cart.empty')}</h3>
              <p className="text-gray-400 mb-6">{t('cart.emptyDesc')}</p>
              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  window.location.href = '#pricing';
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                {t('cart.browsePlans')}
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        {item.config && (
                          <div className="text-sm text-gray-400 mt-1">
                            <div>{item.config.ram}GB {t('pricing.ram')}</div>
                            <div>{item.config.storage}GB {t('pricing.storage')}</div>
                            <div>{item.config.players} {t('pricing.players')}</div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <span className="text-gray-400 text-sm">CHF {item.price}{t('pricing.monthly')}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-4 space-y-4 bg-gray-800/50">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>{t('cart.subtotal')}</span>
                    <span>CHF {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{t('cart.tax')} (CH 8.1%)</span>
                    <span>CHF {tax.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 pl-0">
                    🇨🇭 MwSt. basierend auf Server-Standort: St. Gallen, Schweiz
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
                    <span>{t('cart.total')}</span>
                    <span>CHF {total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {t('cart.checkout')}
                </Button>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  {t('cart.continueShopping')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}