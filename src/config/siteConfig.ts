/**
 * Site Configuration
 * 
 * This file contains all configurable values for the website template.
 * Values can be overridden via environment variables (VITE_*).
 * 
 * To customize for a new client:
 * 1. Set environment variables in .env file
 * 2. Or modify the default values below
 */

export interface SiteConfig {
  // Site Identity
  name: string;
  shortName: string;
  description: string;
  url: string;
  
  // Contact
  email: string;
  adminEmail: string;
  /** Dashboard URL path (not advertised; use env to rotate). */
  adminPath: string;
  
  // Branding
  logo: {
    primary: string;
    secondary?: string;
    header?: string; // Logo for header/navigation (smaller areas)
  };
  
  // Social Media (optional)
  social: {
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  
  // CTA Buttons (optional - can be overridden in languageStore)
  cta: {
    primary?: string;
    secondary?: string;
  };
  
  // Payment Configuration
  payment: {
    solanaAddress?: string;
    paypalClientId?: string;
    paypalEmail?: string;
    cryptoDiscountPercent?: number; // Discount percentage for crypto payments
  };
}

// Load configuration from environment variables with fallback to defaults
export const siteConfig: SiteConfig = {
  name: import.meta.env.VITE_SITE_NAME || 'Site Name',
  shortName: import.meta.env.VITE_SITE_SHORT_NAME || 'Site',
  description: import.meta.env.VITE_SITE_DESCRIPTION || 'Website description',
  url: import.meta.env.VITE_SITE_URL || 'https://example.com',
  
  email: import.meta.env.VITE_CONTACT_EMAIL || 'contact@example.com',
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com',
  adminPath: import.meta.env.VITE_ADMIN_PATH || '/696969',
  
  logo: {
    primary: import.meta.env.VITE_LOGO_PRIMARY || '/images/logo.jpg',
    secondary: import.meta.env.VITE_LOGO_SECONDARY || '/images/logo.png',
    header: import.meta.env.VITE_LOGO_HEADER || '/images/logohead.png',
  },
  
  social: {
    twitter: import.meta.env.VITE_SOCIAL_TWITTER,
    youtube: import.meta.env.VITE_SOCIAL_YOUTUBE,
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN,
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK,
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM,
  },
  
  cta: {
    primary: import.meta.env.VITE_CTA_PRIMARY,
    secondary: import.meta.env.VITE_CTA_SECONDARY,
  },
  
  payment: {
    solanaAddress: import.meta.env.VITE_SOLANA_ADDRESS || 'HS4nu9ykFZKAyrABw4J3UceYzJQ6NbSsdzZnAptEdKk7',
    paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    paypalEmail: import.meta.env.VITE_PAYPAL_EMAIL,
    cryptoDiscountPercent: 10, // 10% discount for crypto payments
  },
};
