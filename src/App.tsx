import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Mail, MapPin, Music2 } from 'lucide-react';
import { MembershipForm } from './components/MembershipForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import SupabaseTest from './components/SupabaseTest';
import { VideoGallery } from './components/VideoGallery';
import { ContactForm } from './components/ContactForm';
import { Navigation } from './components/Navigation';
import { supabase } from './lib/supabase';
import type { Database } from './types/supabase';
import { SocialMediaGallery } from './components/SocialMediaGallery';
import { AdminLogin } from './components/AdminLogin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-100">
        <Navigation />
        
        {/* Main Content */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/test" element={<SupabaseTest />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-stone-900">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 text-[#f2e1c5]">
                  <Music2 size={24} />
                  <span className="font-bold text-xl">HOVDEN MUSIKKLUBB</span>
                </div>
                <p className="mt-4 text-gray-300">
                  Der fjellene møter musikken.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Adresse</h3>
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="mt-1 flex-shrink-0" size={18} />
                  <p>Hovden Sentrum<br />4755 Hovden<br />Norge</p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Følg Oss</h3>
                <div className="flex space-x-6">
                  <a href="https://www.instagram.com/hovdenmusikklubb/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                    <Instagram size={24} />
                  </a>
                  <Link to="/contact" className="text-gray-400 hover:text-gray-300">
                    <Mail size={24} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8">
              <p className="text-center text-gray-400">
                &copy; 2025 Hovden Musikklubb. Alle rettigheter reservert.
                <Link to="/login" className="ml-4 text-gray-500 hover:text-gray-400 text-sm">
                  Admin
                </Link>
              </p>
              <p className="text-center text-gray-400 text-sm mt-4">
                Created by Sebastian Saethre - Need a site like this?{' '}
                <a href="mailto:sebastian.saethre@gmail.com" className="text-[#1d4f4d] underline hover:text-[#1d4f4d] focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] rounded">
                  Contact me
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function HomePage() {
  const [nextEvent, setNextEvent] = useState<Database['public']['Tables']['events']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextEvent() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setNextEvent(data);
      } catch (error) {
        console.error('Error fetching next event:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNextEvent();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&q=80"
            alt="Norske fjell"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-start items-center pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 text-center leading-tight" style={{wordBreak: 'break-word'}}>
            Velkommen til
          </h1>
          <img
            src="/images/logo.jpg"
            alt="Hovden Musikklubb Logo"
            className="w-[20rem] sm:w-[28rem] md:w-[32rem] h-auto mb-4 rounded-full"
            style={{ filter: 'contrast(1.1)' }}
          />
          <div className="text-center mx-auto max-w-3xl">
            <p className="text-xl text-gray-300 mb-6">
              Der fjellånden møter musikksjelen. Bli med oss på intime konserter i vårt unike lokale.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <Link to="/events" className="inline-block min-w-[180px] px-6 py-3 text-base font-semibold rounded-full bg-[#1d4f4d] text-white hover:bg-[#1d4f4d] focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] focus:ring-offset-2 transition-all text-center shadow-md">
                Kommende Arrangementer
              </Link>
              <Link to="/membership" className="inline-block min-w-[180px] px-6 py-3 text-base font-semibold rounded-full bg-white text-[#1d4f4d] border border-[#1d4f4d] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] focus:ring-offset-2 transition-all text-center shadow-md">
                Bli Medlem
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Link 
              to="/events" 
              className="bg-[#1d4f4d] rounded-lg p-8 transition-transform hover:scale-105 flex flex-col justify-center items-center text-center min-h-[180px]"
            >
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                {loading ? 'Laster...' : (nextEvent ? 'Neste Arrangement' : 'Ingen planlagte arrangementer')}
              </h2>
              <p className="mt-4 text-lg text-white">
                {nextEvent ? (
                  <>
                    {nextEvent.title} - {new Date(nextEvent.event_date).toLocaleDateString('no-NO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </>
                ) : (
                  'Følg med for kommende arrangementer'
                )}
              </p>
            </Link>
            <Link 
              to="/membership" 
              className="bg-stone-100 rounded-lg p-8 transition-transform hover:scale-105 flex flex-col justify-center items-center text-center min-h-[180px]"
            >
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Medlemskap</h2>
              <p className="mt-4 text-lg text-gray-500">
                Bli medlem for eksklusiv tilgang til intime konserter og spesielle arrangementer.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function EventsPage() {
  const [events, setEvents] = useState<Database['public']['Tables']['events']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('event_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1d4f4d] border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Laster arrangementer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Kommende Arrangementer</h1>
      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Ingen kommende arrangementer for øyeblikket.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {event.image_url && (
                <img
                  className="w-full h-48 object-cover"
                  src={event.image_url}
                  alt={event.title}
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">
                  {new Date(event.event_date).toLocaleDateString('no-NO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-gray-700 mb-4">{event.description}</p>
                {event.location && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Sted:</span> {event.location}
                  </p>
                )}
                {event.ticket_price && (
                  <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Pris:</span> {event.ticket_price} kr
                  </p>
                )}
                {event.tickets_url && (
                  <a
                    href={event.tickets_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#1d4f4d] text-white px-4 py-2 rounded-md hover:bg-[#1d4f4d]"
                  >
                    Kjøp Billetter
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const { data, error } = await supabase
          .from('about_page')
          .select('*')
          .order('version', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setContent(data.content.text || '');
        }
      } catch (error) {
        console.error('Error fetching about page content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1d4f4d] border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Laster innhold...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <img
          src="/images/logo.jpg"
          alt="Hovden Musikklubb Logo"
          className="w-64 h-64 mx-auto mb-8 rounded-full"
          style={{
            filter: 'contrast(1.1)'
          }}
        />
        <h1 className="text-3xl font-bold mb-8">Om Oss</h1>
        <div className="prose max-w-none">
          {content ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <p className="text-gray-500">Ingen informasjon tilgjengelig ennå.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MembershipPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <img
          src="/images/logo.jpg"
          alt="Hovden Musikklubb Logo"
          className="w-64 h-64 mx-auto mb-8 rounded-full"
          style={{
            filter: 'contrast(1.1)'
          }}
        />
        <h1 className="text-3xl font-bold mb-8">Bli Medlem</h1>
      </div>
      
      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Medlemsfordeler</h2>
        <ul className="list-none mb-8 text-gray-700 space-y-3">
          <li>Prioritert tilgang til billetter</li>
          <li>Eksklusive medlemsarrangementer</li>
          <li>Støtt lokal musikkultur</li>
        </ul>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#1d4f4d] text-white py-4 px-8 text-lg rounded-lg hover:bg-[#1d4f4d] transform hover:scale-105 transition-transform"
          >
            Bli Medlem Nå
          </button>
        )}
      </div>

      {/* Membership Form */}
      {showForm && <MembershipForm />}
    </div>
  );
}

function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Galleri</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Utforsk høydepunkter fra våre arrangementer og konserter. Her finner du videoer og bilder 
          som fanger den unike stemningen i Hovden Musikklubb.
        </p>
      </div>

      <div className="space-y-12">
        <SocialMediaGallery />
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Kontakt Oss</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Ta Kontakt</h2>
            <p className="text-gray-700 mb-4">
              Har du spørsmål? Vi vil gjerne høre fra deg. Send oss en melding, så svarer vi så snart som mulig.
            </p>
            <div className="space-y-4">
              <p className="flex items-center text-gray-700">
                <MapPin className="mr-2" size={18} />
                Hovden Sentrum, 4755 Hovden, Norge
              </p>
              <p className="flex items-center text-gray-700">
                <Mail className="mr-2" size={18} />
                info@hovdenmusikklubb.no
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default App;