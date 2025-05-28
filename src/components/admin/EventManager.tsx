import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import { toast } from 'react-hot-toast';

type Event = Database['public']['Tables']['events']['Row'];

export function EventManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    event_date: '',
    location: '',
    status: 'draft',
    image_url: '',
    ticket_price: null,
    tickets_url: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Kunne ikke hente arrangementer');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(formData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success('Arrangement oppdatert');
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([formData]);

        if (error) throw error;
        toast.success('Arrangement opprettet');
      }

      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        status: 'draft',
        image_url: '',
        ticket_price: null,
        tickets_url: ''
      });
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Kunne ikke lagre arrangement');
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
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Kunne ikke slette arrangement');
    }
  }

  async function handleStatusChange(id: string, newStatus: Event['status']) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setEvents(events.map(event => 
        event.id === id ? { ...event, status: newStatus } : event
      ));
      toast.success('Status oppdatert');
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Kunne ikke oppdatere status');
    }
  }

  function handleEdit(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      status: event.status,
      image_url: event.image_url || '',
      ticket_price: event.ticket_price,
      tickets_url: event.tickets_url || ''
    });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingEvent ? 'Rediger Arrangement' : 'Opprett Nytt Arrangement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tittel</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
            <textarea
              required
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dato og Tid</label>
            <input
              type="datetime-local"
              required
              value={formData.event_date || ''}
              onChange={e => setFormData({ ...formData, event_date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sted</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
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
                  setFormData({
                    title: '',
                    description: '',
                    event_date: '',
                    location: '',
                    status: 'draft',
                    image_url: '',
                    ticket_price: null,
                    tickets_url: ''
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
                  {new Date(event.event_date).toLocaleDateString('no-NO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
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
                  event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
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