import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
import { useLanguageStore } from '../stores/languageStore';
import { useVideoStore } from '../stores/videoStore';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguageStore();
  const { videoEnded, setVideoEnded } = useVideoStore();
  const location = useLocation();
  
  // Reset video state when navigating away from homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      setVideoEnded(false);
    }
  }, [location.pathname, setVideoEnded]);
  
  // On homepage, fade in after video ends. On other pages, show immediately
  const shouldShow = location.pathname === '/' ? videoEnded : true;

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/portfolio', key: 'nav.portfolio' },
    { path: '/blog', key: 'nav.blog' },
    { path: '/courses', key: 'nav.courses' },
    { path: '/resources', key: 'nav.resources' },
    { path: '/community', key: 'nav.community' },
    { path: '/services', key: 'nav.services' },
  ];

  return (
    <motion.nav 
      className="bg-transparent backdrop-blur-sm w-full z-50 fixed top-0 left-0"
      role="navigation"
      aria-label="Main navigation"
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldShow ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-20 lg:h-20">
          {/* Logo - reduced by 15-20% */}
          <a 
            href="/" 
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
            className="flex items-center text-slate-100 hover:text-brand-400 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded"
            aria-label="Go to homepage"
          >
            <img
              src="/images/logo.jpg"
              alt="Sebastian Saethre logo"
              className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
                objectFit: 'contain'
              }}
              loading="eager"
              width="112"
              height="112"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-slate-200">
            {navLinks.map(({ path, key }) => (
              <Link
                key={path}
                to={path}
                className={`relative whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 ${
                  isActive(path)
                    ? 'text-brand-400 font-medium'
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
            
            {/* Kontakt Button - More prominent */}
            <Link
              to="/contact"
              className={`ml-2 rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent ${
                isActive('/contact')
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-lg hover:scale-105 active:scale-100'
              }`}
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              {t('nav.contact')}
            </Link>

            {/* Language Selector - Far right */}
            <div className="ml-4 pl-4 border-l border-white/10">
              <LanguageSelector />
            </div>
          </div>

          {/* Mobile menu button */}
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
        <div 
          className="md:hidden fixed inset-x-0 top-20 bg-black/98 backdrop-blur-md border-b border-white/10 shadow-xl z-40"
          role="menu"
        >
          <div className="px-4 pt-6 pb-8 space-y-1">
            {navLinks.map(({ path, key }) => (
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
      )}
    </motion.nav>
  );
} 