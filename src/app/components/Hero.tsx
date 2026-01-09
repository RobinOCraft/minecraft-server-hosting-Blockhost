import { Button } from "./ui/button";
import { Zap, Shield, Clock } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  
  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1759663174469-f1e2a7a4bdcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5lY3JhZnQlMjBnYW1lJTIwYmxvY2tzfGVufDF8fHx8MTc2NjIzNzI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover bg-center opacity-10" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6">
            {t('hero.title').split(' ').slice(0, 2).join(' ')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              {t('hero.title').split(' ').slice(2).join(' ')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={scrollToPricing}
            >
              {t('hero.cta')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={scrollToPricing}
            >
              {t('hero.learnMore')}
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Shield className="w-5 h-5 text-green-500" />
              <span>{t('features.ddos.title')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-5 h-5 text-green-500" />
              <span>{t('features.instant.title')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Zap className="w-5 h-5 text-green-500" />
              <span>{t('features.performance.title')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}