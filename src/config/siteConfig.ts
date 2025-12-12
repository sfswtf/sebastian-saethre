export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  email: string;
  adminEmail: string;
  logo: {
    primary: string;
    secondary?: string;
  };
  social: {
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  payment: {
    solanaAddress?: string;
    paypalClientId?: string;
    paypalEmail?: string;
    cryptoDiscountPercent?: number;
  };
}

export const siteConfig: SiteConfig = {
  name: import.meta.env.VITE_SITE_NAME || 'Sebastian Saethre',
  shortName: import.meta.env.VITE_SITE_SHORT_NAME || 'SS',
  description: import.meta.env.VITE_SITE_DESCRIPTION || 'Website description',
  url: import.meta.env.VITE_SITE_URL || 'https://sebastiansaethre.no',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'contact@sebastiansaethre.no',
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@sebastiansaethre.no',
  logo: {
    primary: import.meta.env.VITE_LOGO_PRIMARY || '/images/logo.jpg',
    secondary: import.meta.env.VITE_LOGO_SECONDARY || '/images/logo.png',
  },
  social: {
    twitter: import.meta.env.VITE_SOCIAL_TWITTER,
    youtube: import.meta.env.VITE_SOCIAL_YOUTUBE,
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN,
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK,
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM,
  },
  payment: {
    solanaAddress: import.meta.env.VITE_SOLANA_ADDRESS,
    paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    paypalEmail: import.meta.env.VITE_PAYPAL_EMAIL,
    cryptoDiscountPercent: 10,
  },
};




