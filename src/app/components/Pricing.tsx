import { Check, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

type Currency = 'CHF' | 'USD' | 'EUR';

const plans = [
  {
    name: "Basic",
    price: 5,
    description: "Perfect for small servers",
    popular: false,
    features: [
      "2GB RAM",
      "2 CPU Cores",
      "10GB NVMe Storage",
      "Unlimited Players",
      "DDoS Protection (TCPShield)",
      "5 Daily Backups",
      "Mod Support"
    ]
  },
  {
    name: "Pro",
    price: 12,
    description: "Most popular choice",
    popular: true,
    features: [
      "4GB RAM",
      "4 CPU Cores",
      "25GB NVMe Storage",
      "Unlimited Players",
      "DDoS Protection (TCPShield)",
      "10 Daily Backups",
      "Mod Support",
      "Priority Support"
    ]
  },
  {
    name: "Premium",
    price: 24,
    description: "For large communities",
    popular: false,
    features: [
      "8GB RAM",
      "6 CPU Cores",
      "50GB NVMe Storage",
      "Unlimited Players",
      "DDoS Protection (TCPShield)",
      "15 Daily Backups",
      "Full Mod Support",
      "24/7 Priority Support",
      "Free MySQL Database"
    ]
  }
];

function EnterpriseCard({ currency, exchangeRates }: { currency: Currency; exchangeRates: { CHF: number; USD: number; EUR: number } }) {
  const [ram, setRam] = useState(12);
  const [cpu, setCpu] = useState(6);
  const [storage, setStorage] = useState(50);
  const { addToCart } = useCart();
  const { user } = useUser();

  // Price calculation: CHF 1.50 per GB RAM + CHF 1.50 per CPU Core + CHF 0.10 per GB Storage
  const priceInCHF = parseFloat((ram * 1.5 + cpu * 1.5 + storage * 0.1).toFixed(0));
  const price = parseFloat((priceInCHF * exchangeRates[currency]).toFixed(2));
  const isOwner = user?.isOwner || false;
  const isAdmin = user?.isAdmin || false;
  const isPrivileged = isOwner || isAdmin;
  const finalPrice = isPrivileged ? 0 : price;
  
  // Dynamic backup calculation: 5 base + ram/2 + cpu/2 + storage/10, max 20
  const backups = Math.min(20, Math.floor(5 + ram / 2 + cpu / 2 + storage / 10));

  const features = [
    `${ram}GB RAM`,
    `${cpu} CPU Core${cpu > 1 ? 's' : ''}`,
    `${storage}GB NVMe Storage`,
    "Unlimited Players",
    "DDoS Protection (TCPShield)",
    `${backups} Daily Backups`,
    "Full Mod Support",
    "Dedicated Support Manager",
    "SLA Guarantee",
    "Custom Configurations"
  ];

  const handleAddToCart = () => {
    addToCart({
      id: `enterprise-${Date.now()}`,
      name: "Enterprise",
      price: finalPrice,
      details: `${ram}GB RAM, ${cpu} CPU Core${cpu > 1 ? 's' : ''}, ${storage}GB Storage`,
      config: {
        ram: ram,
        cpu: cpu,
        storage: storage,
        players: 0, // Unlimited
      }
    });
    toast.success(`Enterprise Plan wurde zum Warenkorb hinzugefügt!`, {
      description: `${currency} ${finalPrice}/month`
    });
  };

  return (
    <Card className="relative bg-gradient-to-b from-purple-900/30 to-red-900/20 border-purple-700/50 hover:scale-105 transition-all duration-300 hover:border-purple-600/60">
      {isPrivileged && (
        <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 ${
          isOwner 
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700' 
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        }`}>
          <Crown className="w-3 h-3" />
          {isOwner ? 'Owner - Gratis' : 'Admin - Gratis'}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-center gap-2">
          Enterprise
          {isPrivileged && <Crown className={`w-5 h-5 ${isOwner ? 'text-yellow-400' : 'text-yellow-500'}`} />}
        </CardTitle>
        <CardDescription className="text-gray-400">Tailored to your needs</CardDescription>
        <div className="mt-4">
          {isPrivileged ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl text-gray-500 line-through">CHF {priceInCHF}</span>
                <Badge className={
                  isOwner 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                }>100% Rabatt</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-4xl font-bold ${isOwner ? 'text-yellow-400' : 'text-green-500'}`}>GRATIS</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">{currency} {finalPrice}</span>
              <p className="text-gray-400">/month</p>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* RAM Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-300">RAM</label>
            <span className="text-sm text-purple-400">{ram}GB</span>
          </div>
          <Slider
            value={[ram]}
            onValueChange={(value) => setRam(value[0])}
            min={2}
            max={12}
            step={1}
            className="w-full enterprise-slider"
          />
        </div>

        {/* CPU Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-300">CPU Cores</label>
            <span className="text-sm text-purple-400">{cpu} Core{cpu > 1 ? 's' : ''}</span>
          </div>
          <Slider
            value={[cpu]}
            onValueChange={(value) => setCpu(value[0])}
            min={2}
            max={6}
            step={1}
            className="w-full enterprise-slider"
          />
        </div>

        {/* Storage Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-300">Storage</label>
            <span className="text-sm text-purple-400">{storage}GB</span>
          </div>
          <Slider
            value={[storage]}
            onValueChange={(value) => setStorage(value[0])}
            min={15}
            max={50}
            step={5}
            className="w-full enterprise-slider"
          />
        </div>

        {/* Features List */}
        <ul className="space-y-3 pt-4">
          {features.map((feature, fIndex) => (
            <li key={fIndex} className="flex items-start gap-2 text-gray-300">
              <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white shadow-lg shadow-purple-600/50 hover:shadow-purple-500/70 transition-all duration-300"
          onClick={handleAddToCart}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}

export function Pricing() {
  const { addToCart } = useCart();
  const { user } = useUser();
  const isOwner = user?.isOwner || false;
  const isAdmin = user?.isAdmin || false;
  const isPrivileged = isOwner || isAdmin;
  
  // Currency state and exchange rates
  const [currency, setCurrency] = useState<Currency>('CHF');
  const [exchangeRates, setExchangeRates] = useState({ CHF: 1, USD: 1.12, EUR: 0.95 });
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Fetch live exchange rates
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/CHF');
      const data = await response.json();
      
      if (data && data.rates) {
        setExchangeRates({
          CHF: 1,
          USD: data.rates.USD || 1.12,
          EUR: data.rates.EUR || 0.95
        });
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleAddToCart = (plan: typeof plans[0]) => {
    // Extract RAM, CPU and Storage from features
    const ramMatch = plan.features.find(f => f.includes('GB RAM'))?.match(/(\d+)GB RAM/);
    const cpuMatch = plan.features.find(f => f.includes('CPU Core'))?.match(/(\d+) CPU Core/);
    const storageMatch = plan.features.find(f => f.includes('GB NVMe Storage'))?.match(/(\d+)GB NVMe Storage/);
    
    const ram = ramMatch ? parseInt(ramMatch[1]) : 0;
    const cpu = cpuMatch ? parseInt(cpuMatch[1]) : 0;
    const storage = storageMatch ? parseInt(storageMatch[1]) : 0;
    const priceInCurrency = parseFloat((plan.price * exchangeRates[currency]).toFixed(2));
    const finalPrice = isPrivileged ? 0 : priceInCurrency;
    
    addToCart({
      id: `${plan.name.toLowerCase()}-${Date.now()}`,
      name: plan.name,
      price: finalPrice,
      details: plan.features.slice(0, 3).join(', '),
      config: {
        ram: ram,
        cpu: cpu,
        storage: storage,
        players: 0, // Unlimited
      }
    });
    toast.success(`${plan.name} Plan wurde zum Warenkorb hinzugefügt!`, {
      description: `${currency} ${finalPrice}/month`
    });
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your server. All plans include a 7-day money-back guarantee.
          </p>
          
          {/* Currency Selector */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <span className="text-gray-400">Select Currency:</span>
            <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
              {(['CHF', 'USD', 'EUR'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  disabled={isLoadingRates}
                  className={`px-4 py-2 rounded-md transition-all ${
                    currency === curr
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  } disabled:opacity-50`}
                >
                  {curr}
                </button>
              ))}
            </div>
            {currency !== 'CHF' && (
              <span className="text-sm text-gray-500">
                1 CHF = {exchangeRates[currency].toFixed(4)} {currency}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const priceInCurrency = parseFloat((plan.price * exchangeRates[currency]).toFixed(2));
            const finalPrice = isPrivileged ? 0 : priceInCurrency;
            
            // Minecraft material colors
            let cardColor = '';
            let checkColor = '';
            let buttonColor = '';
            let textGradient = '';
            
            if (plan.name === 'Basic') {
              // Coal - Dark gray/black
              cardColor = 'bg-gradient-to-b from-gray-800/30 to-gray-900/30 border-gray-600/50';
              checkColor = 'text-gray-400';
              buttonColor = 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg shadow-gray-900/50 hover:shadow-gray-700/60';
              textGradient = 'bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent';
            } else if (plan.name === 'Pro') {
              // Gold - Yellow/golden
              cardColor = 'bg-gradient-to-b from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
              checkColor = 'text-yellow-400';
              buttonColor = 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 shadow-lg shadow-yellow-600/50 hover:shadow-yellow-500/70';
              textGradient = 'bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent';
            } else if (plan.name === 'Premium') {
              // Diamond - Cyan/light blue
              cardColor = 'bg-gradient-to-b from-cyan-500/20 to-blue-400/20 border-cyan-400/50';
              checkColor = 'text-cyan-400';
              buttonColor = 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70';
              textGradient = 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent';
            }
            
            return (
            <Card 
              key={index}
              className={`relative ${cardColor} hover:scale-105 transition-all duration-300`}
            >
              {plan.popular && !isPrivileged && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
                  Most Popular
                </Badge>
              )}
              {isPrivileged && (
                <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 ${
                  isOwner 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                }`}>
                  <Crown className="w-3 h-3" />
                  {isOwner ? 'Owner - Gratis' : 'Admin - Gratis'}
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  {plan.name}
                  {isPrivileged && <Crown className={`w-5 h-5 ${isOwner ? 'text-yellow-400' : 'text-yellow-500'}`} />}
                </CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                <div className="mt-4">
                  {isPrivileged ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-gray-500 line-through">CHF {plan.price}</span>
                        <Badge className={
                          isOwner 
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }>100% Rabatt</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-4xl font-bold ${isOwner ? 'text-yellow-400' : 'text-green-500'}`}>GRATIS</span>
                        <span className="text-gray-400">/month</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className={`text-4xl font-bold ${textGradient}`}>{currency} {finalPrice}</span>
                      <p className="text-gray-400">/month</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-gray-300">
                      <Check className={`w-5 h-5 ${checkColor} flex-shrink-0 mt-0.5`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${buttonColor} text-white shadow-lg`}
                  onClick={() => handleAddToCart(plan)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
            );
          })}

          {/* Enterprise Card with Sliders */}
          <EnterpriseCard currency={currency} exchangeRates={exchangeRates} />
        </div>
      </div>
    </section>
  );
}