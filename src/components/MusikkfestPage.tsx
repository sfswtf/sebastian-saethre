import React, { useState, useEffect } from 'react';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { EventModal } from './EventModal';
import type { Database } from '../types/supabase';
import { supabase } from '../lib/supabase';

// Event type
type Event = Database['public']['Tables']['events']['Row'];

export function MusikkfestPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchMusikkfestEvents() {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('festival', 'musikkfest')
        .order('event_date', { ascending: true });
      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchMusikkfestEvents();
  }, []);

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 mt-4">Festivalprogram</h1>
        <div className="prose max-w-none mb-10 mx-auto text-center">
          <p>
            Velkommen til årets store musikkbegivenhet på Hovden! Hovden Musikkfest samler noen av Norges mest spennende artister og byr på et variert program for både store og små. Opplev konserter, lokale matopplevelser og ekte festivalstemning i hjertet av fjellheimen.
          </p>
        </div>
        <h2 className="text-2xl font-bold mb-8 text-center">Festivalprogram</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Laster program...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Ingen programinnslag funnet.</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {events.map(event => (
              <AnimatedCard key={event.id} onClick={() => setSelectedEvent(event)} className="cursor-pointer">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full p-0">
                  {event.image_url && (
                    <div className="w-full h-48 bg-stone-100 flex items-center justify-center rounded-t-xl overflow-hidden">
                      <img
                        className="w-full h-48 object-cover"
                        src={event.image_url}
                        alt={event.title}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 mb-2 font-medium">
                      {new Date(event.event_date).toLocaleString('no-NO', {
                        timeZone: 'Europe/Oslo',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-700 line-clamp-3 mb-2">{event.description?.split('\n')[0]}</p>
                    <p className="text-gray-600 mb-2"><span className="font-semibold">Sted:</span> {event.location}</p>
                    <p className="text-gray-600 mb-2"><span className="font-semibold">Pris:</span> {event.ticket_price} kr</p>
                    {event.tickets_url && (
                      <a
                        href={event.tickets_url}
                        className="inline-block bg-[#1d4f4d] text-white px-4 py-2 rounded-md hover:bg-[#2a6f6d] mt-2"
                      >
                        Kjøp billett
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </div>
    </AnimatedSection>
  );
} 