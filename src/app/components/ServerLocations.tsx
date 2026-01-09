import { Globe, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const locations = [
  { city: "St. Gallen", country: "Schweiz", region: "Europa" }
];

export function ServerLocations() {
  const { t } = useLanguage();
  
  return (
    <section id="servers" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
            <Globe className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-4xl sm:text-5xl text-white mb-4">
            {t('locations.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('locations.subtitle')}
          </p>
        </div>

        <div className="relative">
          {/* World Map Visual */}
          <div className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-green-900/20 border border-white/10">
            <img 
              src="https://images.unsplash.com/flagged/photo-1579274216947-86eaa4b00475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2ZXIlMjBkYXRhJTIwY2VudGVyfGVufDF8fHx8MTc2NjI0NDc3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Server network"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl text-white mb-2">1</div>
                <div className="text-xl text-gray-400">Rechenzentrum in St. Gallen</div>
              </div>
            </div>
          </div>

          {/* Location Grid */}
          <div className="flex justify-center">
            {locations.map((location, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors max-w-md w-full"
              >
                <MapPin className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <div className="text-white text-xl">{location.city}</div>
                  <div className="text-gray-400">{location.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}