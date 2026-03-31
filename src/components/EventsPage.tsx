import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Calendar, MapPin, Ticket, ExternalLink, ArrowRight } from 'lucide-react';
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
  festival: string | null;
  status: 'draft' | 'published';
  created_at?: string;
}

export function EventsPage() {
  const { t, language } = useLanguageStore();
  const [events, setEvents] = useState<Event[]>([]);
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('event_date', { ascending: true });

      if (error) {
        console.warn('Supabase query error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        // Sync to localStorage as backup
        try {
          const existingEvents = LocalStorageService.get<Event>('events');
          const eventMap = new Map(existingEvents.map(e => [e.id, e]));
          
          // Update or add events from Supabase
          data.forEach(event => {
            if (event.id) {
              eventMap.set(event.id, event as Event);
            }
          });
          
          // Save updated events to localStorage
          LocalStorageService.set('events', Array.from(eventMap.values()));
        } catch (localError) {
          console.warn('Failed to sync events to localStorage:', localError);
        }
        
        // Show all published events (including past ones for now)
        // You can uncomment the filter below to only show upcoming events
        setEvents(data as Event[]);
        
        // Optional: Filter out past events - uncomment to enable
        // const upcoming = data.filter(event => {
        //   const eventDate = new Date(event.event_date);
        //   return eventDate >= new Date();
        // });
        // setEvents(upcoming as Event[]);
      } else {
        // No data from Supabase, try localStorage
        const localData = LocalStorageService.get<Event>('events');
        const published = localData.filter(e => e.status === 'published');
        setEvents(published.sort((a, b) => 
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        ));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const localData = LocalStorageService.get<Event>('events');
        const published = localData.filter(e => e.status === 'published');
        setEvents(published.sort((a, b) => 
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        ));
      } catch (localError) {
        console.error('Error fetching events:', localError);
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-neutral-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">{t('events.title')}</h1>
          <p className="text-neutral-600 text-center">{t('events.comingSoon')}</p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('events.title')}</h1>
        <p className="text-lg text-neutral-600 mb-12 text-center">{t('events.description')}</p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {events.map((event) => (
            <Link 
              key={event.id} 
              to={`/events/${event.id}`}
              className="block h-full"
            >
              <AnimatedCard className="h-full flex flex-col hover:shadow-xl transition-shadow cursor-pointer">
                {event.image_url && (
                  <div className="w-full h-64 bg-neutral-200 rounded-t-lg overflow-hidden mb-4">
                    <img
                      src={event.image_url}
                      alt={getLocalizedContent(event).title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-8 flex-grow flex flex-col">
                  <h2 className="text-3xl font-bold text-neutral-900 mb-4">{getLocalizedContent(event).title}</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-neutral-600">
                      <Calendar size={20} />
                      <span className="text-lg">
                        {format(new Date(event.event_date), 'EEEE d. MMMM yyyy, HH:mm', { locale: nb })}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-neutral-600">
                        <MapPin size={20} />
                        <span className="text-lg">{event.location}</span>
                      </div>
                    )}
                    {event.tour_name && (
                      <div className="inline-block px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm font-medium">
                        {event.tour_name}
                      </div>
                    )}
                  </div>

                  {getLocalizedContent(event).description && (
                    <p className="text-neutral-700 mb-6 line-clamp-4 flex-grow text-lg">
                      {getLocalizedContent(event).description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t">
                    {event.ticket_price !== null && (
                      <div className="flex items-center gap-2 text-brand-600 font-semibold text-xl">
                        <Ticket size={24} />
                        <span>{event.ticket_price} NOK</span>
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700">
                      <span>Les mer</span>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

