import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CreditCard, CheckCircle2, ArrowLeft, ShieldCheck, Lock, Wallet, Crown, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

type PaymentMethod = 'credit' | 'debit' | 'paypal' | 'twint' | 'applepay' | 'invoice';
type CardType = 'credit' | 'debit';
type Currency = 'CHF' | 'USD' | 'EUR';

interface CheckoutProps {
  onBack?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onOrderComplete?: () => void;
}

export function Checkout({ onBack, onNavigateToTerms, onNavigateToPrivacy, onOrderComplete }: CheckoutProps) {
  const { cart, total, subtotal, tax, taxRate, clearCart, setCountry, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const { user, updateUserPlan } = useUser();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [cardType, setCardType] = useState<CardType>('credit');
  const [currency, setCurrency] = useState<Currency>('CHF');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Currency conversion rates (live rates from API)
  const [currencyRates, setCurrencyRates] = useState({
    CHF: 1,
    USD: 1.12,  // Fallback values
    EUR: 0.95
  });
  
  // Fetch live exchange rates
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      // Using exchangerate-api.com (free tier available)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/CHF');
      const data = await response.json();
      
      if (data && data.rates) {
        setCurrencyRates({
          CHF: 1,
          USD: data.rates.USD || 1.12,
          EUR: data.rates.EUR || 0.95
        });
        setLastUpdated(new Date());
        toast.success('Wechselkurse aktualisiert');
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      toast.error('Wechselkurse konnten nicht aktualisiert werden. Verwende Standardwerte.');
      // Keep using fallback rates
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Fetch rates on component mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);
  
  // Currency symbols
  const currencySymbols = {
    CHF: 'CHF',
    USD: '$',
    EUR: '€'
  };
  
  // Convert CHF amount to selected currency
  const convertAmount = (amount: number) => {
    return amount * currencyRates[currency];
  };
  
  // Format currency display
  const formatCurrency = (amount: number) => {
    const convertedAmount = convertAmount(amount);
    const symbol = currencySymbols[currency];
    
    if (currency === 'CHF') {
      return `${symbol} ${convertedAmount.toFixed(2)}`;
    } else {
      return `${symbol}${convertedAmount.toFixed(2)}`;
    }
  };
  
  // Check if user is admin or owner (gets everything free)
  const isPrivileged = user?.isAdmin || user?.isOwner || false;
  const finalTotal = isPrivileged ? 0 : total;
  const finalSubtotal = isPrivileged ? 0 : subtotal;
  const finalTax = isPrivileged ? 0 : tax;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    zip: '',
    country: 'CH',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    terms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Update VAT rate when country changes
    if (name === 'country') {
      setCountry(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms) {
      toast.error('Bitte akzeptieren Sie die AGB');
      return;
    }

    if (cart.length === 0) {
      toast.error('Warenkorb ist leer');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);
    toast.success(t('checkout.orderSuccess'));
    
    // Update user's plan after successful order
    if (cart.length > 0 && cart[0].name) {
      const planName = cart[0].name as 'Basic' | 'Pro' | 'Premium' | 'Enterprise';
      const planConfig = cart[0].config;
      updateUserPlan(planName, planConfig);
    }
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
      setIsCartOpen(false);
      // Navigate to dashboard
      if (onOrderComplete) {
        onOrderComplete();
      }
    }, 3000);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {t('cart.empty')}
            </h1>
            <p className="text-gray-400 mb-8">{t('cart.emptyDesc')}</p>
            <Button onClick={() => window.location.href = '#pricing'} className="bg-green-600 hover:bg-green-700">
              {t('cart.browsePlans')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-16 pb-16">
              <div className="text-center mb-8">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {t('checkout.orderSuccess')}
                </h2>
                <p className="text-gray-400 mb-2">
                  Vielen Dank für Ihre Bestellung! Wir haben Ihnen eine Bestätigung an {formData.email} gesendet.
                </p>
                <div className="inline-block px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 mt-4">
                  <p className="text-sm text-gray-400">Bestellnummer: <span className="text-white font-mono font-medium">#{Math.floor(100000 + Math.random() * 900000)}</span></p>
                </div>
              </div>

              {/* Payment Details for Invoice */}
              {paymentMethod === 'invoice' && (
                <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-green-600/30">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    Zahlungsinformationen
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">IBAN:</span>
                      <span className="text-white font-mono font-medium">CH81 8080 8006 1780 7181 8</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Empfänger:</span>
                      <span className="text-white font-medium">BlockHost</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Bank:</span>
                      <span className="text-white">Raiffeisen Schweiz</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Betrag:</span>
                      <span className="text-white font-bold text-lg">CHF {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Zahlungsziel:</span>
                      <span className="text-white">30 Tage</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                    <p className="text-xs text-blue-400">
                      💡 <strong>Wichtig:</strong> Bitte verwenden Sie Ihre Bestellnummer als Verwendungszweck bei der Überweisung.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Confirmation for Other Methods */}
              {paymentMethod !== 'invoice' && (
                <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-green-600/30">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Zahlungsbestätigung
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                      <p className="text-green-400 font-medium mb-1">
                        ✓ Zahlung erfolgreich verarbeitet
                      </p>
                      <p className="text-sm text-green-400/80">
                        Zahlungsmethode: {
                          paymentMethod === 'credit' ? 'Kreditkarte' :
                          paymentMethod === 'debit' ? 'Debitkarte' :
                          paymentMethod === 'paypal' ? 'PayPal' :
                          paymentMethod === 'twint' ? 'TWINT' :
                          paymentMethod === 'applepay' ? 'Apple Pay' : ''
                        }
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-800">
                      <span className="text-sm text-gray-400">Bezahlter Betrag:</span>
                      <span className="text-white font-bold text-lg">CHF {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Transaktionsstatus:</span>
                      <span className="text-green-400 font-medium">✓ Abgeschlossen</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                    <p className="text-xs text-blue-400">
                      💡 Sie erhalten eine Bestätigungs-E-Mail mit allen Details Ihrer Bestellung.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={() => window.location.href = '/'} className="w-full bg-green-600 hover:bg-green-700">
                  Zurück zur Startseite
                </Button>
                <Button onClick={() => window.location.href = '#pricing'} variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  Weitere Pläne ansehen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              setIsCartOpen(true);
              onBack && onBack();
            }}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('checkout.backToCart')}
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
            {t('checkout.title')}
          </h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-sm">{t('checkout.secureCheckout')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="md:col-span-2 space-y-6">
              {/* Billing Information */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{t('checkout.billing')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">{t('checkout.firstName')}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">{t('checkout.lastName')}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-300">{t('checkout.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">{t('checkout.phone')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-gray-300">{t('checkout.company')}</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-300">{t('checkout.address')}</Label>
                    <Input
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">{t('checkout.city')}</Label>
                      <Input
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-gray-300">{t('checkout.zip')}</Label>
                      <Input
                        id="zip"
                        name="zip"
                        required
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-gray-300">{t('checkout.country')}</Label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-md bg-gray-900 border border-gray-700 text-white"
                      >
                        <optgroup label="DACH">
                          <option value="CH">🇨🇭 Schweiz (MwSt. 8.1%)</option>
                          <option value="DE">🇩🇪 Deutschland (MwSt. 19%)</option>
                          <option value="AT">🇦 Österreich (MwSt. 20%)</option>
                        </optgroup>
                        <optgroup label="Europa">
                          <option value="FR">🇫🇷 Frankreich (MwSt. 20%)</option>
                          <option value="IT">🇮🇹 Italien (MwSt. 22%)</option>
                          <option value="NL">🇳🇱 Niederlande (MwSt. 21%)</option>
                          <option value="BE">🇧🇪 Belgien (MwSt. 21%)</option>
                          <option value="LU">🇱🇺 Luxemburg (MwSt. 17%)</option>
                          <option value="ES">🇪🇸 Spanien (MwSt. 21%)</option>
                          <option value="PT">🇵🇹 Portugal (MwSt. 23%)</option>
                          <option value="SE">🇸🇪 Schweden (MwSt. 25%)</option>
                          <option value="DK">🇩🇰 Dänemark (MwSt. 25%)</option>
                          <option value="NO">🇳🇴 Norwegen (MwSt. 25%)</option>
                          <option value="FI">🇫🇮 Finnland (MwSt. 24%)</option>
                          <option value="GB">🇬🇧 Großbritannien (MwSt. 20%)</option>
                          <option value="IE">🇮🇪 Irland (MwSt. 23%)</option>
                          <option value="PL">🇵🇱 Polen (MwSt. 23%)</option>
                          <option value="CZ">🇨🇿 Tschechien (MwSt. 21%)</option>
                        </optgroup>
                        <optgroup label="International">
                          <option value="US">🇺🇸 USA (keine MwSt.)</option>
                          <option value="CA">🇨🇦 Kanada (GST 5%)</option>
                          <option value="AU">🇦🇺 Australien (GST 10%)</option>
                          <option value="JP">🇯🇵 Japan (Consumption Tax 10%)</option>
                        </optgroup>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Rechnungsadresse (MwSt. wird nach Server-Standort berechnet)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{t('checkout.payment')}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Wähle deine bevorzugte Zahlungsmethode und Währung
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Currency Selection */}
                  <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-gray-300">Währung auswählen</Label>
                      <button
                        type="button"
                        onClick={fetchExchangeRates}
                        disabled={isLoadingRates}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-green-400 transition-colors disabled:opacity-50"
                        title="Wechselkurse aktualisieren"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingRates ? 'animate-spin' : ''}`} />
                        <span>Aktualisieren</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrency('CHF')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currency === 'CHF'
                            ? 'border-green-600 bg-green-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xl font-bold ${currency === 'CHF' ? 'text-green-500' : 'text-gray-400'}`}>CHF</div>
                        <div className="text-xs text-gray-500 mt-1">Schweizer Franken</div>
                        <div className="text-xs text-gray-600 mt-1">1.00</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('USD')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currency === 'USD'
                            ? 'border-green-600 bg-green-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xl font-bold ${currency === 'USD' ? 'text-green-500' : 'text-gray-400'}`}>USD</div>
                        <div className="text-xs text-gray-500 mt-1">US Dollar</div>
                        <div className="text-xs text-gray-600 mt-1">{currencyRates.USD.toFixed(4)}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('EUR')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          currency === 'EUR'
                            ? 'border-green-600 bg-green-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xl font-bold ${currency === 'EUR' ? 'text-green-500' : 'text-gray-400'}`}>EUR</div>
                        <div className="text-xs text-gray-500 mt-1">Euro</div>
                        <div className="text-xs text-gray-600 mt-1">{currencyRates.EUR.toFixed(4)}</div>
                      </button>
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-500">
                        {currency === 'CHF' && '🇨🇭 Originalwährung - Keine Umrechnungsgebühren'}
                        {currency === 'USD' && `🇺🇸 Live-Kurs: 1 CHF = ${currencyRates.USD.toFixed(4)} USD`}
                        {currency === 'EUR' && `🇪🇺 Live-Kurs: 1 CHF = ${currencyRates.EUR.toFixed(4)} EUR`}
                      </p>
                      {lastUpdated && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <span>📊</span>
                          <span>Zuletzt aktualisiert: {lastUpdated.toLocaleString('de-CH', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === 'credit' || paymentMethod === 'debit'
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'credit' || paymentMethod === 'debit' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-white">Karte</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <div className={`text-2xl font-bold mx-auto mb-2 ${paymentMethod === 'paypal' ? 'text-green-500' : 'text-gray-400'}`}>P</div>
                      <span className="text-sm text-white">{t('checkout.paypal')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('twint')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === 'twint'
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <div className={`text-2xl font-bold mx-auto mb-2 ${paymentMethod === 'twint' ? 'text-green-500' : 'text-gray-400'}`}>T</div>
                      <span className="text-sm text-white">{t('checkout.twint')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('applepay')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === 'applepay'
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <div className={`text-2xl font-bold mx-auto mb-2 ${paymentMethod === 'applepay' ? 'text-green-500' : 'text-gray-400'}`}>A</div>
                      <span className="text-sm text-white">{t('checkout.applepay')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('invoice')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === 'invoice'
                          ? 'border-green-600 bg-green-600/10'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <ShieldCheck className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'invoice' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-white">{t('checkout.invoice')}</span>
                    </button>
                  </div>

                  {/* Credit/Debit Card Form */}
                  {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                    <div className="space-y-4 pt-4">
                      {/* Card Type Selection */}
                      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                        <Label className="text-gray-300 mb-3 block">Kartentyp auswählen</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <label
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              cardType === 'credit'
                                ? 'border-green-600 bg-green-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="cardType"
                              value="credit"
                              checked={cardType === 'credit'}
                              onChange={() => {
                                setCardType('credit');
                                setPaymentMethod('credit');
                              }}
                              className="text-green-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-green-500" />
                                <span className="text-white font-medium">Kreditkarte</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">Visa, Mastercard, Amex</p>
                            </div>
                          </label>
                          <label
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              cardType === 'debit'
                                ? 'border-green-600 bg-green-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="cardType"
                              value="debit"
                              checked={cardType === 'debit'}
                              onChange={() => {
                                setCardType('debit');
                                setPaymentMethod('debit');
                              }}
                              className="text-green-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-green-500" />
                                <span className="text-white font-medium">Debitkarte</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">EC, Maestro, V PAY</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardNumber" className="text-gray-300">{t('checkout.cardNumber')}</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="cardExpiry" className="text-gray-300">{t('checkout.cardExpiry')}</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            placeholder="MM/JJ"
                            required
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc" className="text-gray-300">{t('checkout.cardCvc')}</Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            placeholder="123"
                            required
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            className="bg-gray-900 border-gray-700 text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName" className="text-gray-300">{t('checkout.cardName')}</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          required
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="bg-gray-900 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400">Sie werden nach der Bestellung zu PayPal weitergeleitet</p>
                    </div>
                  )}

                  {paymentMethod === 'twint' && (
                    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400">Sie werden nach der Bestellung zu TWINT weitergeleitet</p>
                    </div>
                  )}

                  {paymentMethod === 'applepay' && (
                    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
                      <p className="text-gray-400">Sie werden nach der Bestellung zu Apple Pay weitergeleitet</p>
                    </div>
                  )}

                  {paymentMethod === 'invoice' && (
                    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
                      <div className="space-y-4">
                        <div>
                          <p className="text-white font-medium mb-2">Zahlung auf Rechnung</p>
                          <p className="text-sm text-gray-400">Sie erhalten die Rechnung per E-Mail mit allen Zahlungsdetails. Zahlungsziel: 30 Tage</p>
                        </div>
                        
                        <div className="flex items-start gap-2 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                          <span className="text-blue-400 text-sm">ℹ️</span>
                          <p className="text-xs text-blue-400">
                            Die vollständigen Zahlungsinformationen (IBAN, Empfänger, etc.) erhalten Sie nach Abschluss der Bestellung.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Terms */}
              <div className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  {t('checkout.termsAgree')}{' '}
                  <a href="#" className="text-green-500 hover:text-green-400" onClick={onNavigateToTerms}>{t('checkout.termsLink')}</a>
                  {' '}{t('checkout.and')}{' '}
                  <a href="#" className="text-green-500 hover:text-green-400" onClick={onNavigateToPrivacy}>{t('checkout.privacyLink')}</a>
                </label>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">{t('checkout.summary')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items */}
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-700">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{item.name}</h4>
                            {item.config && (
                              <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                                <div>{item.config.ram}GB RAM</div>
                                <div>{item.config.cpu} CPU Core{item.config.cpu > 1 ? 's' : ''}</div>
                                <div>{item.config.storage}GB Storage</div>
                                <div>{item.config.players > 0 ? `${item.config.players} Players` : 'Unlimited Players'}</div>
                              </div>
                            )}
                          </div>
                          <span className="text-white font-medium">{formatCurrency(item.price)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 pt-3 border-t border-gray-700">
                      {isPrivileged && (
                        <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-500 font-medium text-sm">
                            <Crown className="w-4 h-4" />
                            <span>ADMIN RABATT - 100% KOSTENLOS</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-400">
                        <span>{t('cart.subtotal')}</span>
                        <span className={isPrivileged ? 'line-through' : ''}>{formatCurrency(finalSubtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>{t('cart.tax')} (CH 8.1%)</span>
                        <span className={isPrivileged ? 'line-through' : ''}>{formatCurrency(finalTax)}</span>
                      </div>
                      <div className="px-3 py-2 bg-green-600/10 rounded border border-green-600/20">
                        <p className="text-xs text-green-400 flex items-center gap-1">
                          <span>🇨🇭</span>
                          <span>MwSt. basierend auf Server-Standort: St. Gallen, Schweiz</span>
                        </p>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
                        <span>{t('cart.total')}</span>
                        <span className={isPrivileged ? 'text-green-500' : ''}>
                          {formatCurrency(finalTotal)}
                          {isPrivileged && <span className="text-sm text-yellow-500 ml-2">(GRATIS)</span>}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t('checkout.processing')}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          {t('checkout.completeOrder')}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>256-bit SSL verschlüsselt</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}