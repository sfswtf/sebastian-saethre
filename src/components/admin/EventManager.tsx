import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';

type Artist = {
  id?: string;
  name: string;
  status?: 'draft' | 'published';
};

type EventArtist = {
  id: string;
  artist_id: string;
  artist_name: string;
  is_headliner: boolean;
  performance_order: number;
};

type Event = {
  id?: string;
  title: string; // Legacy - kept for backward compatibility
  title_nb?: string;
  title_en?: string;
  description: string; // Legacy - kept for backward compatibility
  description_nb?: string;
  description_en?: string;
  event_date: string;
  location: string | null;
  status: 'draft' | 'published' | 'cancelled';
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
  support_acts: string[] | null;
  promoter: string | null;
  production_notes: string | null;
  created_at?: string;
  updated_at?: string;
  artists?: EventArtist[];
};

export function EventManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<EventArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    title_nb: '',
    title_en: '',
    description: '',
    description_nb: '',
    description_en: '',
    event_date: '',
    location: '',
    status: 'draft',
    image_url: '',
    ticket_price: null,
    tickets_url: '',
    venue_name: '',
    venue_address: '',
    venue_city: '',
    venue_country: 'Norway',
    tour_name: '',
    event_type: 'concert',
    capacity: null,
    doors_open: '',
    support_acts: [],
    promoter: '',
    production_notes: '',
  });

  useEffect(() => {
    fetchEvents();
    fetchArtists();
  }, []);

  async function fetchArtists() {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('id, name')
        .eq('status', 'published')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setArtists(data as Artist[]);
      } else {
        const localData = LocalStorageService.get<Artist>('artists');
        const published = localData.filter(a => (a.status || 'published') === 'published');
        setArtists(published.map(a => ({ id: a.id || `local-${Date.now()}-${Math.random()}`, name: a.name })));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const localData = LocalStorageService.get<Artist>('artists');
        const published = localData.filter(a => (a.status || 'published') === 'published');
        setArtists(published.map(a => ({ id: a.id || `local-${Date.now()}-${Math.random()}`, name: a.name })));
      } catch (localError) {
        console.error('Error fetching artists:', localError);
      }
    }
  }

  async function fetchEvents() {
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
        .order('event_date', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const eventsWithArtists = data.map(event => ({
          ...event,
          artists: (event.event_artists || []).map((ea: any) => ({
            id: ea.id,
            artist_id: ea.artist_id,
            artist_name: ea.artists?.name || '',
            is_headliner: ea.is_headliner,
            performance_order: ea.performance_order,
          })),
        }));
        setEvents(eventsWithArtists as Event[]);
      } else {
        const localData = LocalStorageService.get<Event>('events');
        // Get all artists to map IDs to names
        const allArtists = LocalStorageService.get<Artist>('artists');
        const artistMap = new Map(allArtists.map(a => [a.id || '', a.name]));
        
        // Ensure artists array exists and map artist names
        const eventsWithArtists = localData.map(event => ({
          ...event,
          artists: (event.artists || []).map(ea => ({
            ...ea,
            artist_name: ea.artist_name || artistMap.get(ea.artist_id) || '',
          })),
        }));
        setEvents(eventsWithArtists.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const data = LocalStorageService.get<Event>('events');
        // Get all artists to map IDs to names
        const allArtists = LocalStorageService.get<Artist>('artists');
        const artistMap = new Map(allArtists.map(a => [a.id || '', a.name]));
        
        // Ensure artists array exists and map artist names
        const eventsWithArtists = data.map(event => ({
          ...event,
          artists: (event.artists || []).map(ea => ({
            ...ea,
            artist_name: ea.artist_name || artistMap.get(ea.artist_id) || '',
          })),
        }));
        setEvents(eventsWithArtists.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
      } catch (localError) {
        console.error('Error fetching events:', localError);
        toast.error('Kunne ikke hente arrangementer');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      let eventId: string;
      
      if (editingEvent?.id) {
        // Update existing event - explicitly include all fields
        const updateData = {
          title: formData.title || '',
          description: formData.description || '',
          event_date: formData.event_date || '',
          location: formData.location || null,
          status: formData.status || 'draft',
          image_url: formData.image_url || null,
          ticket_price: formData.ticket_price || null,
          tickets_url: formData.tickets_url || null,
          festival: formData.festival || null,
        };
        const { error } = await supabase
          .from('events')
          .update(updateData)
          .eq('id', editingEvent.id);
        if (error) throw error;
        eventId = editingEvent.id;
        toast.success('Arrangement oppdatert');
      } else {
        const { data, error } = await supabase
          .from('events')
          .insert([formData as Event])
          .select()
          .single();
        if (error) throw error;
        eventId = data.id;
        toast.success('Arrangement opprettet');
      }

      // Update event artists
      if (eventId && selectedArtists.length > 0) {
        // Delete existing artists
        await supabase
          .from('event_artists')
          .delete()
          .eq('event_id', eventId);

        // Insert new artists
        const artistInserts = selectedArtists.map((ea, index) => ({
          event_id: eventId,
          artist_id: ea.artist_id,
          is_headliner: ea.is_headliner,
          performance_order: ea.performance_order || index,
        }));

        const { error: artistError } = await supabase
          .from('event_artists')
          .insert(artistInserts);
        
        if (artistError) throw artistError;
      }

      // Also save to localStorage as backup
      try {
        const eventData = {
          ...formData,
          id: eventId,
          artists: selectedArtists,
        } as Event;

        if (editingEvent?.id) {
          LocalStorageService.update('events', editingEvent.id, eventData);
        } else {
          // Check if it already exists in localStorage
          const existing = LocalStorageService.get<Event>('events').find(e => e.id === eventId);
          if (existing) {
            LocalStorageService.update('events', eventId, eventData);
          } else {
            LocalStorageService.add('events', eventData);
          }
        }
      } catch (localError) {
        console.warn('Failed to save to localStorage backup:', localError);
        // Don't throw - Supabase save succeeded, localStorage is just backup
      }

      setEditingEvent(null);
      setSelectedArtists([]);
      setFormData({
        title: '',
        title_nb: '',
        title_en: '',
        description: '',
        description_nb: '',
        description_en: '',
        event_date: '',
        location: '',
        status: 'draft',
        image_url: '',
        ticket_price: null,
        tickets_url: '',
        venue_name: '',
        venue_address: '',
        venue_city: '',
        venue_country: 'Norway',
        tour_name: '',
        event_type: 'concert',
        capacity: null,
        doors_open: '',
        support_acts: [],
        promoter: '',
        production_notes: '',
      });
      fetchEvents();
    } catch (error: any) {
      console.warn('Supabase save failed, using localStorage:', error);
      try {
        // Include artists in the event data for localStorage
        const eventData = {
          ...formData,
          artists: selectedArtists,
        } as Event;

        if (editingEvent?.id) {
          LocalStorageService.update('events', editingEvent.id, eventData);
          toast.success('Arrangement oppdatert (lokal lagring)');
        } else {
          // Generate a temporary ID for new events in localStorage
          const newEvent = {
            ...eventData,
            id: `local-${Date.now()}`,
          };
          LocalStorageService.add('events', newEvent);
          toast.success('Arrangement opprettet (lokal lagring)');
        }
        setEditingEvent(null);
        setSelectedArtists([]);
        setFormData({
          title: '',
          description: '',
          event_date: '',
          location: '',
          status: 'draft',
          image_url: '',
          ticket_price: null,
          tickets_url: '',
          venue_name: '',
          venue_address: '',
          venue_city: '',
          venue_country: 'Norway',
          tour_name: '',
          event_type: 'concert',
          capacity: null,
          doors_open: '',
          support_acts: [],
          promoter: '',
          production_notes: '',
        });
        fetchEvents();
      } catch (localError) {
        console.error('Error saving event:', localError);
        toast.error('Kunne ikke lagre arrangement');
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette dette arrangementet?')) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Arrangement slettet');
      fetchEvents();
    } catch (error: any) {
      console.warn('Supabase delete failed, using localStorage:', error);
      try {
        LocalStorageService.delete('events', id);
        toast.success('Arrangement slettet (lokal lagring)');
        fetchEvents();
      } catch (localError) {
        console.error('Error deleting event:', localError);
        toast.error('Kunne ikke slette arrangement');
      }
    }
  }

  async function handleStatusChange(id: string, newStatus: Event['status']) {
    try {
      // Update in Supabase first
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Also update in localStorage as backup
      try {
        LocalStorageService.update('events', id, { status: newStatus });
      } catch (localError) {
        console.warn('Failed to update localStorage:', localError);
      }
      
      setEvents(events.map(event => 
        event.id === id ? { ...event, status: newStatus } : event
      ));
      toast.success('Status oppdatert');
    } catch (error) {
      console.error('Error updating event status:', error);
      // Fallback to localStorage only
      try {
        LocalStorageService.update('events', id, { status: newStatus });
        setEvents(events.map(event => 
          event.id === id ? { ...event, status: newStatus } : event
        ));
        toast.success('Status oppdatert (lokal lagring)');
      } catch (localError) {
        toast.error('Kunne ikke oppdatere status');
      }
    }
  }

  function handleEdit(event: Event) {
    console.log('Editing event:', event.id);
    console.log('Event data:', JSON.stringify(event, null, 2));
    setEditingEvent(event);
    // Explicitly set each field - don't use spread to avoid issues
    setFormData({
      title: event.title || event.title_nb || '',
      title_nb: event.title_nb || event.title || '',
      title_en: event.title_en || '',
      description: event.description || event.description_nb || '',
      description_nb: event.description_nb || event.description || '',
      description_en: event.description_en || '',
      event_date: event.event_date,
      location: event.location,
      status: event.status,
      image_url: event.image_url || '',
      ticket_price: event.ticket_price,
      tickets_url: event.tickets_url || '',
      venue_name: event.venue_name || '',
      venue_address: event.venue_address || '',
      venue_city: event.venue_city || '',
      venue_country: event.venue_country || 'Norway',
      tour_name: event.tour_name || '',
      event_type: event.event_type || 'concert',
      capacity: event.capacity,
      doors_open: event.doors_open || '',
      support_acts: event.support_acts || [],
      promoter: event.promoter || '',
      production_notes: event.production_notes || '',
    });
    setSelectedArtists(event.artists || []);
  }

  function addArtist() {
    if (artists.length === 0) {
      toast.error('Ingen artister tilgjengelig');
      return;
    }
    const firstArtist = artists[0];
    setSelectedArtists([
      ...selectedArtists,
      {
        id: '',
        artist_id: firstArtist.id,
        artist_name: firstArtist.name,
        is_headliner: false,
        performance_order: selectedArtists.length,
      },
    ]);
  }

  function removeArtist(index: number) {
    setSelectedArtists(selectedArtists.filter((_, i) => i !== index));
  }

  function updateArtist(index: number, field: keyof EventArtist, value: any) {
    const updated = [...selectedArtists];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedArtists(updated);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingEvent ? 'Rediger Arrangement' : 'Opprett Nytt Arrangement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {}}
                className="px-4 py-2 font-medium text-sm border-b-2 border-blue-600 text-blue-600"
              >
                Norsk
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="px-4 py-2 font-medium text-sm text-gray-500 hover:text-gray-700"
              >
                English
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tittel (Norsk) *</label>
            <input
              type="text"
              required
              value={formData.title_nb || ''}
              onChange={e => setFormData({ ...formData, title_nb: e.target.value, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tittel (English)</label>
            <input
              type="text"
              value={formData.title_en || ''}
              onChange={e => setFormData({ ...formData, title_en: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="Leave empty to use Norwegian version"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Beskrivelse (Norsk) *</label>
            <textarea
              required
              value={formData.description_nb || ''}
              onChange={e => setFormData({ ...formData, description_nb: e.target.value, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Beskrivelse (English)</label>
            <textarea
              value={formData.description_en || ''}
              onChange={e => setFormData({ ...formData, description_en: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="Leave empty to use Norwegian version"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dato og Tid</label>
            <input
              type="datetime-local"
              required
              value={formData.event_date ? (() => {
                try {
                  const d = new Date(formData.event_date);
                  // Get Oslo time parts
                  const oslo = d.toLocaleString('sv-SE', { timeZone: 'Europe/Oslo' }).replace(' ', 'T').slice(0, 16);
                  return oslo;
                } catch {
                  return '';
                }
              })() : ''}
              onChange={e => {
                const local = e.target.value;
                if (local) {
                  const [date, time] = local.split('T');
                  const [year, month, day] = date.split('-').map(Number);
                  const [hour, minute] = time.split(':').map(Number);
                  // Create a Date object as if in Oslo
                  const osloDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
                  // Get the offset (in minutes) for Oslo at that date
                  const temp = new Date(osloDate.toLocaleString('en-US', { timeZone: 'Europe/Oslo' }));
                  const offset = (osloDate.getTime() - temp.getTime()) / 60000;
                  // Adjust to true UTC
                  const utcMillis = osloDate.getTime() + offset * 60000;
                  const utc = new Date(utcMillis).toISOString();
                  setFormData({ ...formData, event_date: utc });
                } else {
                  setFormData({ ...formData, event_date: '' });
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Arrangementstype</label>
            <select
              value={formData.event_type || 'concert'}
              onChange={e => setFormData({ ...formData, event_type: e.target.value as Event['event_type'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            >
              <option value="concert">Konsert</option>
              <option value="tour">Tour</option>
              <option value="festival">Festival</option>
              <option value="other">Annet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tour-navn (hvis del av tour)</label>
            <input
              type="text"
              value={formData.tour_name || ''}
              onChange={e => setFormData({ ...formData, tour_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="Eks: Vintertour 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sted / Lokasjon</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="Eks: Oslo Konserthus"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Venue-navn</label>
              <input
                type="text"
                value={formData.venue_name || ''}
                onChange={e => setFormData({ ...formData, venue_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">By</label>
              <input
                type="text"
                value={formData.venue_city || ''}
                onChange={e => setFormData({ ...formData, venue_city: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Venue-adresse</label>
            <input
              type="text"
              value={formData.venue_address || ''}
              onChange={e => setFormData({ ...formData, venue_address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kapasitet</label>
              <input
                type="number"
                value={formData.capacity || ''}
                onChange={e => setFormData({ ...formData, capacity: e.target.value ? Number(e.target.value) : null })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dører åpner</label>
              <input
                type="datetime-local"
                value={formData.doors_open ? (() => {
                  try {
                    const d = new Date(formData.doors_open!);
                    return d.toLocaleString('sv-SE', { timeZone: 'Europe/Oslo' }).replace(' ', 'T').slice(0, 16);
                  } catch {
                    return '';
                  }
                })() : ''}
                onChange={e => {
                  if (e.target.value) {
                    const [date, time] = e.target.value.split('T');
                    const [year, month, day] = date.split('-').map(Number);
                    const [hour, minute] = time.split(':').map(Number);
                    const osloDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
                    const temp = new Date(osloDate.toLocaleString('en-US', { timeZone: 'Europe/Oslo' }));
                    const offset = (osloDate.getTime() - temp.getTime()) / 60000;
                    const utcMillis = osloDate.getTime() + offset * 60000;
                    setFormData({ ...formData, doors_open: new Date(utcMillis).toISOString() });
                  } else {
                    setFormData({ ...formData, doors_open: null });
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Promoter / Arrangør</label>
            <input
              type="text"
              value={formData.promoter || ''}
              onChange={e => setFormData({ ...formData, promoter: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bilde URL</label>
            <input
              type="url"
              value={formData.image_url || ''}
              onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Billettpris (NOK)</label>
            <input
              type="number"
              value={formData.ticket_price || ''}
              onChange={e => setFormData({ ...formData, ticket_price: e.target.value ? Number(e.target.value) : null })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Billettlink</label>
            <input
              type="url"
              value={formData.tickets_url || ''}
              onChange={e => setFormData({ ...formData, tickets_url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="https://ticketmaster.com/event/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Artister</label>
            <div className="space-y-2">
              {selectedArtists.map((artist, index) => (
                <div key={index} className="flex gap-2 items-center p-2 border rounded">
                  <select
                    value={artist.artist_id}
                    onChange={e => {
                      const selected = artists.find(a => a.id === e.target.value);
                      updateArtist(index, 'artist_id', e.target.value);
                      if (selected) {
                        updateArtist(index, 'artist_name', selected.name);
                      }
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
                  >
                    {artists.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={artist.is_headliner}
                      onChange={e => updateArtist(index, 'is_headliner', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Hovedartist
                  </label>
                  <input
                    type="number"
                    value={artist.performance_order}
                    onChange={e => updateArtist(index, 'performance_order', Number(e.target.value))}
                    placeholder="Rekkefølge"
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
                  />
                  <button
                    type="button"
                    onClick={() => removeArtist(index)}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addArtist}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Legg til artist
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Produksjonsnotater</label>
            <textarea
              value={formData.production_notes || ''}
              onChange={e => setFormData({ ...formData, production_notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder="Interne notater om produksjon, teknikere, etc."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#1d4f4d] text-white py-2 px-4 rounded-md hover:bg-[#1d4f4d] focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] focus:ring-offset-2"
            >
              {editingEvent ? 'Oppdater Arrangement' : 'Opprett Arrangement'}
            </button>
            {editingEvent && (
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setSelectedArtists([]);
                  setFormData({
                    title: '',
                    description: '',
                    event_date: '',
                    location: '',
                    status: 'draft',
                    image_url: '',
                    ticket_price: null,
                    tickets_url: '',
                    venue_name: '',
                    venue_address: '',
                    venue_city: '',
                    venue_country: 'Norway',
                    tour_name: '',
                    event_type: 'concert',
                    capacity: null,
                    doors_open: '',
                    support_acts: [],
                    promoter: '',
                    production_notes: '',
                  });
                }}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Avbryt Redigering
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b">Arrangementer</h2>
        <div className="divide-y">
          {events.map(event => (
            <div key={event.id} className="p-6 flex items-center justify-between">
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.event_date).toLocaleString('no-NO', {
                    timeZone: 'Europe/Oslo',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-500">{event.location}</p>
                )}
                {event.artists && event.artists.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Artister: {event.artists.map(a => a.artist_name).join(', ')}
                  </p>
                )}
                {event.image_url && (
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="mt-2 h-24 w-auto object-cover rounded"
                  />
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  event.status === 'published' ? 'bg-green-100 text-green-800' :
                  event.status === 'draft' ? 'bg-red-orange-100 text-red-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
                <select
                  value={event.status}
                  onChange={e => handleStatusChange(event.id, e.target.value as Event['status'])}
                  className="rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Rediger
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}