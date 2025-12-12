import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Mail, MapPin, Sparkles, Linkedin, Twitter } from 'lucide-react';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { useLanguageStore, detectLanguageFromLocation } from './stores/languageStore';
import { HeroSkeleton } from './components/SkeletonLoader';
import { AnimatedNavbar } from './components/animations/AnimatedNavbar';
import { AnimatedFooter } from './components/animations/AnimatedFooter';
import { ParallaxHero } from './components/animations/ParallaxHero';
import { AnimatedButton } from './components/animations/AnimatedButton';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { ProtectedRoute } from './components/ProtectedRoute'; // Not lazy - needs immediate access to auth state
import { LocalStorageService } from './lib/localStorage';
import { EventModal } from './components/EventModal';
import { EventCardSkeleton } from './components/SkeletonLoader';

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
const CheckoutPage = lazy(() => import('./components/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./components/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const DigitalProductsPage = lazy(() => import('./components/DigitalProductsPage').then(m => ({ default: m.DigitalProductsPage })));
const DigitalProductDetailPage = lazy(() => import('./components/DigitalProductDetailPage').then(m => ({ default: m.DigitalProductDetailPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const MembershipPage = lazy(() => import('./components/MembershipPage').then(m => ({ default: m.MembershipPage })));

function App() {
  const { t, setLanguage } = useLanguageStore();
  
  // Detect language from location on mount (only if no stored preference)
  useEffect(() => {
    const stored = localStorage.getItem('language-storage');
    if (!stored) {
      detectLanguageFromLocation().then(lang => {
        setLanguage(lang);
      }).catch(error => {
        console.error('Failed to detect language from location:', error);
      });
    }
  }, [setLanguage]);
  
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-neutral-50 font-mono flex flex-col">
        <Navigation />
        
        {/* Main Content */}
        <main className="pt-28 relative z-10">
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
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/onboarding/thanks" element={<OnboardingThanksPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/products" element={<DigitalProductsPage />} />
              <Route path="/products/:id" element={<DigitalProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route 
                path="/admin" 
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

        <AnimatedFooter>
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="flex flex-col items-center gap-3 mb-4">
                <a href="mailto:sebastian.saethre@gmail.com" className="flex items-center gap-2 text-neutral-300 hover:text-brand-400 transition-colors">
                  <Mail size={18} />
                  <span>sebastian.saethre@gmail.com</span>
                </a>
              </div>
              <p className="text-neutral-400 text-sm">
                &copy; 2025 Sebastian Saethre. {t('footer.rights')}
                <Link to="/login" className="ml-4 text-neutral-500 hover:text-neutral-400 text-sm">
                  {t('footer.admin')}
                </Link>
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                <a href="https://www.sebastiansaethre.no" className="hover:text-brand-400 transition-colors">
                  www.sebastiansaethre.no
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
    <>
      {/* Hero Section */}
      <ParallaxHero 
        imageUrl="/images/hero-background.jpg"
        videoUrl="/images/hero-intro.mp4"
      >
        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center items-center">
          <div className="text-center w-full flex flex-col items-center gap-5 md:gap-6">
            <div className="max-w-2xl md:max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {t('home.hero.h1')}
              </h1>
              <p className="mt-6 text-sm md:text-base text-white/90">
                {t('home.hero.nameRole')}
              </p>
              <p className="mt-5 md:mt-6 text-sm md:text-base text-slate-200 leading-relaxed">
                {t('home.hero.body')}
              </p>
            </div>

            <div className="mt-6 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 items-start">
              <div className="flex flex-col items-stretch">
                <a href="/onboarding" className="inline-block">
                  <InteractiveHoverButton text={t('home.cta.onboarding')} className="bg-brand-600 text-white border-brand-700" />
                </a>
                
              </div>
              <div className="flex">
                <a href="/resources" className="w-full inline-block">
                  <InteractiveHoverButton text={t('home.cta.resources')} className="bg-background text-white border-white/40" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </ParallaxHero>

      {/* Featured section removed for a cleaner front page */}
    </>
  );
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string | null;
  image_url: string | null;
  status: 'draft' | 'published';
  festival: string | null;
  created_at: string;
  ticket_price: number | null;
  capacity: number | null;
  tickets_url: string | null;
}

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    function fetchEvents() {
      try {
        const allEvents = LocalStorageService.get<Event>('events');
        const published = allEvents.filter(event => event.status === 'published');
        setEvents(published.sort((a, b) => 
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        ));
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Group events by month
  const eventsByMonth = events.reduce((acc, event) => {
    const date = new Date(event.event_date);
    const monthKey = date.toLocaleString('no-NO', {
      timeZone: 'Europe/Oslo',
      year: 'numeric',
      month: 'long'
    });
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort months chronologically
  const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
    const dateA = new Date(eventsByMonth[a][0].event_date);
    const dateB = new Date(eventsByMonth[b][0].event_date);
    return dateA.getTime() - dateB.getTime();
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          No upcoming events at the moment.
        </div>
      ) : (
        <div className="space-y-12">
          {sortedMonths.map(month => (
            <div key={month} className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 border-b-2 border-primary-600 pb-2">
                {month}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventsByMonth[month].map(event => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {event.image_url && (
                      <div className="w-full h-48 bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <img
                          className="w-full h-48 object-contain"
                          src={event.image_url}
                          alt={event.title}
                        />
                      </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-neutral-600 mb-4">
                        {new Date(event.event_date).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-neutral-700 line-clamp-3 mb-4">{event.description}</p>
                      {event.location && (
                        <p className="text-neutral-600 mt-auto">
                          <span className="font-semibold">Location:</span> {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
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


export default App;
