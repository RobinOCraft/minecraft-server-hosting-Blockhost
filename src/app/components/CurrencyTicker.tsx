import { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function CurrencyTicker() {
  const { language } = useLanguage();
  const [rates, setRates] = useState({ USD: 1.12, EUR: 0.95 });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/CHF');
      const data = await response.json();
      
      if (data && data.rates) {
        setRates({
          USD: data.rates.USD || 1.12,
          EUR: data.rates.EUR || 0.95
        });
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Update every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-900/50 rounded-lg border border-white/10">
      <TrendingUp className="w-4 h-4 text-green-500" />
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-400">1 CHF =</span>
          <span className="text-white font-semibold">{rates.USD.toFixed(4)} USD</span>
        </div>
        <div className="w-px h-3 bg-white/20" />
        <div className="flex items-center gap-1">
          <span className="text-gray-400">1 CHF =</span>
          <span className="text-white font-semibold">{rates.EUR.toFixed(4)} EUR</span>
        </div>
      </div>
      <button
        onClick={fetchRates}
        disabled={isLoading}
        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        title={language === 'de' ? 'Aktualisieren' : 'Refresh'}
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
