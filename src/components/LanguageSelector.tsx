import React, { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-slate-200 hover:text-brand-400 px-3 py-2 rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Globe size={18} />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-50 border border-neutral-200">
          <div className="py-1">
            <button
              onClick={() => { setLanguage('no'); setOpen(false); }}
              aria-label="Norsk"
              className={`w-full px-4 py-2 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                language === 'no' 
                  ? 'bg-brand-100 text-brand-700 font-medium' 
                  : 'text-neutral-700 hover:bg-brand-50'
              }`}
            >
              <span className="flex items-center justify-center text-xl">🇳🇴</span>
            </button>
            <button
              onClick={() => { setLanguage('en'); setOpen(false); }}
              aria-label="English"
              className={`w-full px-4 py-2 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                language === 'en' 
                  ? 'bg-brand-100 text-brand-700 font-medium' 
                  : 'text-neutral-700 hover:bg-brand-50'
              }`}
            >
              <span className="flex items-center justify-center text-xl">🇬🇧</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
