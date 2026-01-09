import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{language === 'de' ? 'DE' : 'EN'}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <button
          onClick={() => setLanguage('de')}
          className={`w-full px-4 py-3 text-left text-sm transition-colors rounded-t-lg flex items-center gap-3 ${
            language === 'de'
              ? 'bg-green-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-lg">🇩🇪</span>
          <span>Deutsch</span>
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`w-full px-4 py-3 text-left text-sm transition-colors rounded-b-lg flex items-center gap-3 ${
            language === 'en'
              ? 'bg-green-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <span className="text-lg">🇬🇧</span>
          <span>English</span>
        </button>
      </div>
    </div>
  );
}
