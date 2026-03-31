import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Ticket, ExternalLink, ArrowLeft, Users, Clock, Building } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale/nb';

interface Event {
  id?: string;
  title: string; // Legacy
  title_nb?: string;
  title_en?: string;
  description: string; // Legacy
  description_nb?: string;
  description_en?: string;
  event_date: string;
  location: string | null;
  image_url: string | null;
  ticket_price: number | null;
  tickets_url: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_country: string | null;
  tour_name: string | null;
  event_type: 'tour' | 'festival' | 'concert' | 'other';
  capacity: number | null;
  doors_open: string | null;
  promoter: string | null;
  status: 'draft' | 'published' | 'cancelled';
  artists?: Array<{
    id: string;
    artist_id: string;
    artist_name: string;
    is_headliner: boolean;
    performance_order: number;
  }>;
  created_at?: string;
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguageStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get localized content
  const getLocalizedContent = (event: Event) => {
    const title = language === 'en' 
      ? (event.title_en || event.title_nb || event.title || '')
      : (event.title_nb || event.title || '');
    const description = language === 'en'
      ? (event.description_en || event.description_nb || event.description || '')
      : (event.description_nb || event.description || '');
    return { title, description };
  };

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }
  }, [id]);

  const fetchEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_artists (
            id,
            artist_id,
            is_headliner,
            performance_order,
            artists (id, name)
          )
        `)
        .eq('id', eventId)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      if (data) {
        const eventWithArtists = {
          ...data,
          artists: (data.event_artists || []).map((ea: any) => ({
            id: ea.id,
            artist_id: ea.artist_id,
            artist_name: ea.artists?.name || '',
            is_headliner: ea.is_headliner,
            performance_order: ea.performance_order,
          })),
        };
        setEvent(eventWithArtists as Event);
      } else {
        // Try localStorage
        const localData = LocalStorageService.get<Event>('events');
        const found = localData.find(e => e.id === eventId && e.status === 'published');
        if (found) {
          // Get all artists to map IDs to names
          const allArtists = LocalStorageService.get<any>('artists');
          const artistMap = new Map(allArtists.map((a: any) => [a.id || '', a.name]));
          
          const eventWithArtists = {
            ...found,
            artists: (found.artists || []).map((ea: any) => ({
              ...ea,
              artist_name: ea.artist_name || artistMap.get(ea.artist_id) || '',
            })),
          };
          setEvent(eventWithArtists);
        }
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const localData = LocalStorageService.get<Event>('events');
        const found = localData.find(e => e.id === eventId && e.status === 'published');
        if (found) {
          // Get all artists to map IDs to names
          const allArtists = LocalStorageService.get<any>('artists');
          const artistMap = new Map(allArtists.map((a: any) => [a.id || '', a.name]));
          
          const eventWithArtists = {
            ...found,
            artists: (found.artists || []).map((ea: any) => ({
              ...ea,
              artist_name: ea.artist_name || artistMap.get(ea.artist_id) || '',
            })),
          };
          setEvent(eventWithArtists);
        }
      } catch (localError) {
        console.error('Error fetching event:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse bg-neutral-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-neutral-600">Arrangement ikke funnet</p>
          <Link to="/events" className="text-brand-600 hover:text-brand-700 mt-4 inline-block">
            ← Tilbake til arrangementer
          </Link>
        </div>
      </AnimatedSection>
    );
  }

  const sortedArtists = event.artists?.sort((a, b) => {
    if (a.is_headliner && !b.is_headliner) return -1;
    if (!a.is_headliner && b.is_headliner) return 1;
    return a.performance_order - b.performance_order;
  }) || [];

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/events" 
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Tilbake til arrangementer</span>
        </Link>

        {event.image_url && (
          <div className="w-full h-96 bg-neutral-200 rounded-lg overflow-hidden mb-8">
            <img
              src={event.image_url}
              alt={getLocalizedContent(event).title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">{getLocalizedContent(event).title}</h1>

          {event.tour_name && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm font-medium">
                {event.tour_name}
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-brand-600 mt-1" size={20} />
                <div>
                  <p className="text-sm text-neutral-500">Dato og tid</p>
                  <p className="font-medium">
                    {format(new Date(event.event_date), 'EEEE d. MMMM yyyy', { locale: nb })}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {format(new Date(event.event_date), 'HH:mm', { locale: nb })}
                  </p>
                </div>
              </div>

              {event.doors_open && (
                <div className="flex items-start gap-3">
                  <Clock className="text-brand-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500">Dører åpner</p>
                    <p className="font-medium">
                      {format(new Date(event.doors_open), 'HH:mm', { locale: nb })}
                    </p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-brand-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500">Sted</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              )}

              {event.venue_name && (
                <div className="flex items-start gap-3">
                  <Building className="text-brand-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500">Venue</p>
                    <p className="font-medium">{event.venue_name}</p>
                    {event.venue_address && (
                      <p className="text-sm text-neutral-600">{event.venue_address}</p>
                    )}
                    {event.venue_city && (
                      <p className="text-sm text-neutral-600">{event.venue_city}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {sortedArtists.length > 0 && (
                <div>
                  <p className="text-sm text-neutral-500 mb-2">Artister</p>
                  <div className="space-y-2">
                    {sortedArtists.map((ea) => (
                      <div key={ea.id} className="flex items-center gap-2">
                        {ea.is_headliner && (
                          <span className="text-xs bg-[#FF4D00] text-white px-2 py-1 rounded">Hovedartist</span>
                        )}
                        <Link 
                          to={`/artists/${ea.artist_id}`}
                          className="font-medium text-brand-600 hover:text-brand-700"
                        >
                          {ea.artist_name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.capacity && (
                <div className="flex items-start gap-3">
                  <Users className="text-brand-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500">Kapasitet</p>
                    <p className="font-medium">{event.capacity} personer</p>
                  </div>
                </div>
              )}

              {event.ticket_price !== null && (
                <div className="flex items-start gap-3">
                  <Ticket className="text-brand-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-neutral-500">Billettpris</p>
                    <p className="font-medium text-2xl">{event.ticket_price} NOK</p>
                  </div>
                </div>
              )}

              {event.promoter && (
                <div>
                  <p className="text-sm text-neutral-500">Arrangør</p>
                  <p className="font-medium">{event.promoter}</p>
                </div>
              )}
            </div>
          </div>

          {getLocalizedContent(event).description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'About the event' : 'Om arrangementet'}</h2>
              <div className="prose max-w-none text-neutral-700 whitespace-pre-wrap">
                {getLocalizedContent(event).description}
              </div>
            </div>
          )}

          {event.tickets_url && (
            <div className="flex justify-center">
              <a
                href={event.tickets_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF4D00] text-white rounded-lg hover:bg-[#e64400] transition-colors font-semibold text-lg"
              >
                <span>Kjøp billetter</span>
                <ExternalLink size={20} />
              </a>
            </div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}

