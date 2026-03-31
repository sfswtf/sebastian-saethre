import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Menu, X, Facebook, Instagram, Mail, MapPin, Sparkles, Linkedin, Twitter } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { useLanguageStore, detectLanguageFromLocation } from './stores/languageStore';
import { HeroSkeleton } from './components/SkeletonLoader';
import { AnimatedNavbar } from './components/animations/AnimatedNavbar';
import { AnimatedFooter } from './components/animations/AnimatedFooter';
import { ParallaxHero } from './components/animations/ParallaxHero';
import { AnimatedButton } from './components/animations/AnimatedButton';
import { ProtectedRoute } from './components/ProtectedRoute'; // Not lazy - needs immediate access to auth state
import { LocalStorageService } from './lib/localStorage';
import { siteConfig } from './config/siteConfig';

// Lazy load heavy components
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('./components/AdminLogin').then(m => ({ default: m.AdminLogin })));
const PortfolioPage = lazy(() => import('./components/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const BlogPage = lazy(() => import('./components/BlogPage').then(m => ({ default: m.BlogPage })));
const CoursesPage = lazy(() => import('./components/CoursesPage').then(m => ({ default: m.CoursesPage })));
const ResourcesPage = lazy(() => import('./components/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const CommunityPage = lazy(() => import('./components/CommunityPage').then(m => ({ default: m.CommunityPage })));
const ContactForm = lazy(() => import('./components/ContactForm').then(m => ({ default: m.ContactForm })));
const OnboardingForm = lazy(() => import('./components/OnboardingForm').then(m => ({ default: m.OnboardingForm })));
const OnboardingThanksPage = lazy(() => import('./components/OnboardingThanksPage').then(m => ({ default: m.OnboardingThanksPage })));
const ServicesPage = lazy(() => import('./components/ServicesPage').then(m => ({ default: m.ServicesPage })));
const BlogPostDetailPage = lazy(() => import('./components/BlogPostDetailPage').then(m => ({ default: m.BlogPostDetailPage })));
const CourseDetailPage = lazy(() => import('./components/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })));
const PortfolioDetailPage = lazy(() => import('./components/PortfolioDetailPage').then(m => ({ default: m.PortfolioDetailPage })));
const ResourceDetailPage = lazy(() => import('./components/ResourceDetailPage').then(m => ({ default: m.ResourceDetailPage })));
const ArtistsPage = lazy(() => import('./components/ArtistsPage').then(m => ({ default: m.ArtistsPage })));
const ArtistDetailPage = lazy(() => import('./components/ArtistDetailPage').then(m => ({ default: m.ArtistDetailPage })));
const MerchPage = lazy(() => import('./components/MerchPage').then(m => ({ default: m.MerchPage })));
const MerchDetailPage = lazy(() => import('./components/MerchDetailPage').then(m => ({ default: m.MerchDetailPage })));
const CheckoutPage = lazy(() => import('./components/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const EventsPage = lazy(() => import('./components/EventsPage').then(m => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('./components/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const OrderSuccessPage = lazy(() => import('./components/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));

function App() {
  const { t, setLanguage } = useLanguageStore();
  
  // Detect language from location on mount (only if no stored preference)
  useEffect(() => {
    const stored = localStorage.getItem('language-storage');
    if (!stored) {
      detectLanguageFromLocation().then(lang => {
        setLanguage(lang);
      });
    }
  }, [setLanguage]);
  
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <AnimatedNavbar>
          <Navigation />
        </AnimatedNavbar>
        
        {/* Main Content */}
        <main className="pt-20 relative z-10 flex-grow pb-32" style={{ backgroundColor: 'transparent' }}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resources/:id" element={<ResourceDetailPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artists/:id" element={<ArtistDetailPage />} />
              <Route path="/merch" element={<MerchPage />} />
              <Route path="/merch/:id" element={<MerchDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/onboarding/thanks" element={<OnboardingThanksPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route 
                path={siteConfig.adminPath} 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div></div>}>
                      <AdminDashboard />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<AdminLogin />} />
            </Routes>
          </Suspense>
        </main>

        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#10b981',
              color: 'white',
              fontSize: '18px',
              padding: '16px 24px',
              minWidth: '300px',
              borderRadius: '8px',
              fontWeight: '500',
            },
            success: {
              duration: 4000,
              style: {
                background: '#10b981',
                color: 'white',
                fontSize: '18px',
                padding: '16px 24px',
                minWidth: '300px',
                borderRadius: '8px',
                fontWeight: '500',
              },
            },
          }}
        />
        <AnimatedFooter>
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="flex flex-col items-center gap-3 mb-4">
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-neutral-300 hover:text-brand-400 transition-colors">
                  <Mail size={18} />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
              <p className="text-neutral-400 text-sm">
                &copy; {new Date().getFullYear()} {siteConfig.name}. {t('footer.rights')}
                <Link to="/login" className="ml-4 text-neutral-500 hover:text-neutral-400 text-sm">
                  {t('footer.admin')}
                </Link>
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                <a href={siteConfig.url} className="hover:text-brand-400 transition-colors">
                  {siteConfig.url.replace(/^https?:\/\//, '')}
                </a>
              </p>
            </div>
          </div>
        </AnimatedFooter>
      </div>
    </Router>
  );
}

function HomePage() {
  const { t } = useLanguageStore();

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      {/* Hero Section */}
      <ParallaxHero 
        imageUrl="/images/hero-background.jpg"
        videoUrl="/images/hero-intro.mp4"
      >
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center items-center">
          <div className="text-center w-full flex flex-col items-center gap-4 md:gap-6">
            {/* Logo symbol only - increased by 200% (3x size) + 50% more */}
            <img
              src={siteConfig.logo.primary}
              alt={`${siteConfig.name} logo symbol`}
              className="h-[504px] sm:h-[576px] md:h-[720px] lg:h-[792px]"
              style={{
                filter: 'drop-shadow(0 0 16px rgba(0, 0, 0, 0.5))',
                maxWidth: '90vw',
                marginBottom: '-1.16rem'
              }}
              loading="eager"
            />
            
            {/* Name from logo.png image - text part only, positioned right below logo - increased by 200% (3x size) */}
            {siteConfig.logo.secondary && (
              <img
                src={siteConfig.logo.secondary}
                alt={siteConfig.name}
                className="mb-2 md:mb-4 h-[9.75rem] sm:h-[11.7rem] md:h-[13.65rem] lg:h-[15.6rem] w-auto"
                style={{
                  mixBlendMode: 'normal',
                  filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))',
                  marginTop: '-0.96rem'
                }}
                loading="eager"
                onError={(e) => {
                  // If logo.png doesn't exist, hide it
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-lg px-4">
              <Link to="/artists" className="w-full sm:w-auto">
                <AnimatedButton 
                  variant="primary" 
                  className="w-full sm:w-auto rounded-lg px-12 md:px-16 py-5 md:py-6 text-lg md:text-xl font-semibold bg-[#FF4D00] text-white hover:bg-[#e64400] active:bg-[#cc3a00] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
                >
                  Artister
                </AnimatedButton>
              </Link>
              <Link to="/merch" className="w-full sm:w-auto">
                <AnimatedButton 
                  variant="secondary" 
                  className="w-full sm:w-auto rounded-lg px-12 md:px-16 py-5 md:py-6 text-lg md:text-xl font-semibold bg-[#FF4D00] text-white hover:bg-[#e64400] active:bg-[#cc3a00] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
                >
                  Merch
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </ParallaxHero>

      {/* Bottom Image Section - positioned below fixed hero */}
      <div className="relative z-10" style={{ marginTop: '100vh', backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4" style={{ backgroundColor: 'transparent' }}>
          <div className="max-w-5xl mx-auto">
            <img
              src="/bottomfront.png"
              alt=""
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const { t } = useLanguageStore();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <img
          src={siteConfig.logo.primary}
          alt={siteConfig.name}
          className="w-[768px] h-[768px] mx-auto mb-8 rounded-full"
          style={{
            filter: 'contrast(1.1)'
          }}
        />
        <h1 className="text-3xl font-bold mb-8 text-center">{t('about.title')}</h1>
        <div className="prose max-w-none text-left">
          <p className="mb-6">
            {t('about.para1')}
          </p>
          <p className="mb-6">
            {t('about.para2')}
          </p>
          <p className="mb-6">
            {t('about.para3')}
          </p>
        </div>
      </div>
    </div>
  );
}

function MembershipPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        <img
          src="/images/logo.jpg"
          alt="Sebastian Saethre"
          className="w-[20rem] h-[20rem] mx-auto mb-8 rounded-full"
          style={{ filter: 'contrast(1.1)' }}
        />
        {/* Benefits Section */}
        <AnimatedCard className="w-full max-w-2xl mx-auto mt-2 flex flex-col items-center justify-center text-center">
          <AnimatedText text="Join the Community" className="text-2xl font-bold mb-4" />
          <ul className="mb-8 text-neutral-700 space-y-3 text-lg flex flex-col items-center justify-center">
            <li className="flex items-center gap-3">
              <Sparkles size={22} className="text-primary-600" />
              <span>Access to exclusive content and resources</span>
            </li>
            <li className="flex items-center gap-3">
              <Sparkles size={22} className="text-primary-600" />
              <span>Early access to new courses and tools</span>
            </li>
            <li className="flex items-center gap-3">
              <Sparkles size={22} className="text-primary-600" />
              <span>Connect with fellow AI practitioners</span>
            </li>
          </ul>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white py-4 px-8 text-lg rounded-lg hover:bg-primary-700 transform hover:scale-105 transition-transform w-full max-w-xs mx-auto mb-2"
            >
              Join Now
            </button>
          )}
          {/* Membership Form */}
          {showForm && (
            <div className="w-full max-w-2xl mx-auto">
              <MembershipForm />
            </div>
          )}
        </AnimatedCard>
      </div>
    </AnimatedSection>
  );
}

function GalleryPage() {
  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedCard className="mb-12 p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <AnimatedText text="Gallery" className="text-4xl font-bold mb-4 text-neutral-900 mx-auto" delay={0.33} />
            <AnimatedText text="Explore highlights from projects, tutorials, and content. Here you'll find videos and images showcasing my work and AI applications." className="text-lg text-neutral-600 max-w-3xl mx-auto mb-8" delay={0.33} />
          </div>
        </AnimatedCard>
        <div className="space-y-12">
          <SocialMediaGallery />
        </div>
      </div>
    </AnimatedSection>
  );
}

function OnboardingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="animate-pulse bg-neutral-100 h-64 rounded"></div>}>
        <OnboardingForm />
      </Suspense>
    </div>
  );
}

function ContactPage() {
  const { t } = useLanguageStore();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('contact.title')}</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">{t('contact.getInTouch')}</h2>
            <p className="text-lg text-neutral-700 mb-4">
              {t('contact.description')}
            </p>
            <div className="space-y-4">
              <a 
                href={`mailto:${siteConfig.email}`} 
                className="flex items-center text-lg text-neutral-700 hover:text-brand-600 transition-colors"
              >
                <Mail className="mr-2" size={20} />
                <span>{siteConfig.email}</span>
              </a>
            </div>
          </div>
          <Suspense fallback={<div className="animate-pulse bg-neutral-100 h-64 rounded"></div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;