import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
import { useLanguageStore } from '../stores/languageStore';
import { useVideoStore } from '../stores/videoStore';
import { useCartStore } from '../stores/cartStore';
import { siteConfig } from '../config/siteConfig';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguageStore();
  const { videoEnded, setVideoEnded } = useVideoStore();
  const { getItemCount } = useCartStore();
  const location = useLocation();
  const cartCount = getItemCount();
  
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
    { path: '/artists', key: 'nav.artists' },
    { path: '/events', key: 'nav.events' },
    // Hidden but kept in codebase:
    // { path: '/merch', key: 'nav.merch' },
    // { path: '/portfolio', key: 'nav.portfolio' },
    // { path: '/blog', key: 'nav.blog' },
    // { path: '/courses', key: 'nav.courses' },
    // { path: '/resources', key: 'nav.resources' },
    // { path: '/community', key: 'nav.community' },
    // { path: '/services', key: 'nav.services' },
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
          {/* Left Navigation - Artister (closer to logo) */}
          <div className="hidden md:flex items-center flex-1 justify-end pr-4 lg:pr-6">
            <Link
              to="/artists"
              className={`relative whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 text-lg text-slate-200 ${
                isActive('/artists')
                  ? 'text-brand-400 font-medium'
                  : 'hover:text-brand-400'
              }`}
              aria-current={isActive('/artists') ? 'page' : undefined}
            >
              {t('nav.artists')}
              {isActive('/artists') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 transition-all duration-300 ease-in-out" />
              )}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 scale-x-0 hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left" />
            </Link>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
              className="flex items-center text-slate-100 hover:opacity-80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              aria-label="Go to homepage"
            >
              <img
                src={siteConfig.logo.header || siteConfig.logo.primary}
                alt={`${siteConfig.name} logo`}
                className="h-24 w-auto md:h-28 lg:h-36"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
                  objectFit: 'contain'
                }}
                loading="eager"
              />
            </Link>
          </div>

          {/* Right Navigation - Tour/Events, Cart, Contact, Language */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-lg text-slate-200 flex-1 justify-start pl-4 lg:pl-6">
            {/* Tour/Events Link */}
            <Link
              to="/events"
              className={`relative whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1 ${
                isActive('/events')
                  ? 'text-brand-400 font-medium'
                  : 'hover:text-brand-400'
              }`}
              aria-current={isActive('/events') ? 'page' : undefined}
            >
              {t('nav.events')}
              {isActive('/events') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 transition-all duration-300 ease-in-out" />
              )}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 scale-x-0 hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left" />
            </Link>
            
            {/* Cart Icon - More visible */}
            <Link
              to="/checkout"
              className="relative p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-300"
              aria-label="Handlekurv"
            >
              <ShoppingCart size={24} className="drop-shadow-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF4D00] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Contact Button */}
            <Link
              to="/contact"
              className={`rounded-lg px-6 py-3 text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 focus:ring-offset-transparent ${
                isActive('/contact')
                  ? 'bg-[#FF4D00] text-white shadow-lg'
                  : 'bg-[#FF4D00] text-white hover:bg-[#e64400] hover:shadow-lg hover:scale-105 active:scale-100'
              }`}
              aria-current={isActive('/contact') ? 'page' : undefined}
            >
              {t('nav.contact')}
            </Link>

            {/* Language Selector */}
            <div className="pl-4 border-l border-white/10">
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
          
          {/* Mobile Logo - centered when menu is closed */}
          {!isOpen && (
            <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
              <Link 
                to="/" 
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/';
                }}
                className="flex items-center"
                aria-label="Go to homepage"
              >
                <img
                  src={siteConfig.logo.header || siteConfig.logo.primary}
                  alt={`${siteConfig.name} logo`}
                  className="h-24 w-auto"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.5))',
                    objectFit: 'contain'
                  }}
                  loading="eager"
                />
              </Link>
            </div>
          )}
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
            className="md:hidden fixed inset-x-0 top-20 bg-neutral-900 border-b border-neutral-700 shadow-xl z-40"
            role="menu"
          >
            <div className="px-4 pt-6 pb-8 space-y-1">
            {navLinks.map(({ path, key }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block py-4 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
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
              className={`block py-4 px-4 rounded-lg mt-2 text-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                isActive('/contact')
                  ? 'bg-[#FF4D00] text-white font-medium'
                  : 'bg-[#FF4D00] text-white hover:bg-[#e64400]'
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
    </motion.nav>
  );
} 