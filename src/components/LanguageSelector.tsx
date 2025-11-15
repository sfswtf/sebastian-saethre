import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  
  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 text-slate-200 hover:text-brand-400 px-3 py-2 rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <Globe size={18} />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50 border border-neutral-200">
        <div className="py-1">
          <button
            onClick={() => setLanguage('no')}
            className={`w-full text-left px-4 py-2 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
              language === 'no' 
                ? 'bg-brand-100 text-brand-700 font-medium' 
                : 'text-neutral-700 hover:bg-brand-50'
            }`}
          >
            🇳🇴 Norsk
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`w-full text-left px-4 py-2 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
              language === 'en' 
                ? 'bg-brand-100 text-brand-700 font-medium' 
                : 'text-neutral-700 hover:bg-brand-50'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>
    </div>
  );
}

