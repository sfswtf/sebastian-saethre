import React, { useState, useEffect } from 'react';
import { EventModal } from './EventModal';
import { EventCardSkeleton } from './SkeletonLoader';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { useLanguageStore } from '../stores/languageStore';
import type { Database } from '../types/supabase';

type EventRow = Database['public']['Tables']['events']['Row'];

function sortByEventDate(a: EventRow, b: EventRow) {
  return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
}

async function fetchPublishedEvents(): Promise<EventRow[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('event_date', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as EventRow[];
    }
  } catch {
    // Supabase unavailable or not configured — fall back below
  }

  const local = LocalStorageService.get<EventRow>('events').filter(
    (e) => e.status === 'published'
  );
  return [...local].sort(sortByEventDate);
}

export function EventsPage() {
  const { t, language } = useLanguageStore();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);

  const locale = language === 'no' ? 'no-NO' : 'en-US';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchPublishedEvents();
        if (!cancelled) setEvents(list);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const eventsByMonth = events.reduce((acc, event) => {
    const date = new Date(event.event_date);
    const monthKey = date.toLocaleString(locale, {
      timeZone: 'Europe/Oslo',
      year: 'numeric',
      month: 'long',
    });

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, EventRow[]>);

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
      <h1 className="text-3xl font-bold mb-8">{t('events.title')}</h1>
      {events.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">{t('events.empty')}</div>
      ) : (
        <div className="space-y-12">
          {sortedMonths.map((month) => (
            <div key={month} className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900 border-b-2 border-primary-600 pb-2">
                {month}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventsByMonth[month].map((event) => (
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
                        {new Date(event.event_date).toLocaleString(locale, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'Europe/Oslo',
                        })}
                      </p>
                      <p className="text-neutral-700 line-clamp-3 mb-4">{event.description}</p>
                      {event.location && (
                        <p className="text-neutral-600 mt-auto">
                          <span className="font-semibold">{t('events.locationLabel')}</span>{' '}
                          {event.location}
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
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
