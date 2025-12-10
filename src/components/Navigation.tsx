import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
// framer-motion removed to prevent initial mount flicker
import { LanguageSelector } from './LanguageSelector';
import { useLanguageStore } from '../stores/languageStore';
 

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguageStore();
  const location = useLocation();
  

  const isActive = (path: string) => location.pathname === path;

  const leftLinks = [
    { path: '/portfolio', key: 'nav.portfolio' },
    { path: '/resources', key: 'nav.resources' },
  ];
  const rightNavLinks = [
    { path: '/community', key: 'nav.community' },
    { path: '/services', key: 'nav.services' },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-sm w-full"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-24 md:h-24 lg:h-24">
          {/* Left Cluster */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-base font-medium text-slate-200 justify-self-end">
            {leftLinks.map(({ path, key }) => (
              <Link
                key={path}
                to={path}
                className={`relative whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 ${
                  isActive(path)
                    ? 'text-brand-400'
                    : 'hover:text-brand-400'
                }`}
                aria-current={isActive(path) ? 'page' : undefined}
              >
                {t(key)}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 transition-all duration-300 ease-in-out" />
                )}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 scale-x-0 hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left" />
              </Link>
            ))}

            {/* Shopping Cart hidden temporarily */}
          </div>

          {/* Center Logo */}
          <div className="flex justify-center items-center justify-self-center px-4 z-10">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
              className="flex items-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              aria-label="Go to homepage"
            >
              <img
                src="/images/logo.jpg"
                alt="Sebastian Saethre logo"
                className="h-20 w-auto md:h-24 max-h-[85px]"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
                  objectFit: 'contain'
                }}
                loading="eager"
                width="112"
                height="112"
              />
            </a>
          </div>

          {/* Right Cluster: nav links near logo + Contact & Language pushed to far right */}
          <div className="hidden md:flex items-center w-full justify-self-start gap-6 lg:gap-8 text-base font-medium text-slate-200">
            {rightNavLinks.map(({ path, key }) => (
              <Link
                key={path}
                to={path}
                className={`relative whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 ${
                  isActive(path)
                    ? 'text-brand-400'
                    : 'hover:text-brand-400'
                }`}
                aria-current={isActive(path) ? 'page' : undefined}
              >
                {t(key)}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 transition-all duration-300 ease-in-out" />
                )}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 scale-x-0 hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left" />
              </Link>
            ))}

            <div className="flex items-center gap-4 ml-auto">
              <Link
                to="/contact"
                className={`rounded-lg px-6 py-3 text-base font-semibold whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent ${
                  isActive('/contact')
                    ? 'bg-brand-600 text-white shadow-lg'
                    : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg hover:scale-105 active:scale-100'
                }`}
                aria-current={isActive('/contact') ? 'page' : undefined}
              >
                {t('nav.contact')}
              </Link>
              <LanguageSelector />
            </div>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <LanguageSelector />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-brand-400 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 ease-in-out"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          {/* Menu */}
          <div 
            className="md:hidden fixed inset-x-0 top-24 bg-neutral-900 border-b border-neutral-700 shadow-xl z-40"
          role="menu"
        >
            <div className="px-4 pt-6 pb-8 space-y-1">
            {[...leftLinks, ...rightNavLinks].map(({ path, key }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                  isActive(path)
                    ? 'text-brand-400 bg-white/5 font-medium'
                    : 'text-slate-200 hover:text-brand-400 hover:bg-white/5'
                }`}
                role="menuitem"
                aria-current={isActive(path) ? 'page' : undefined}
              >
                {t(key)}
              </Link>
            ))}
            {/* Checkout link hidden temporarily */}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 rounded-lg mt-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                isActive('/contact')
                  ? 'bg-brand-600 text-white font-medium'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              }`}
              role="menuitem"
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
        </>
      )}
    </nav>
  );
} 
