import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AGE_GROUPS = ['Under 18', '18-25', '26-35', '36-50', 'Over 50'];
const MUSIC_GENRES = [
  'Rock', 'Jazz', 'Classical', 'Electronic', 'Folk',
  'Pop', 'Metal', 'Hip Hop', 'Blues', 'World Music'
];

export function ManualMemberAdd({ onMemberAdded }: { onMemberAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ageGroup: '',
    musicGenres: [] as string[],
    motivation: '',
    status: 'approved' // Default to approved for manual entries
  });

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      musicGenres: prev.musicGenres.includes(genre)
        ? prev.musicGenres.filter(g => g !== genre)
        : [...prev.musicGenres, genre]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.ageGroup || formData.musicGenres.length === 0) {
      toast.error('Vennligst fyll ut alle påkrevde felt');
      return;
    }

    try {
      const { error } = await supabase
        .from('membership_applications')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          age_group: formData.ageGroup,
          music_genres: formData.musicGenres,
          motivation: formData.motivation || null,
          status: formData.status
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast.success('Medlem lagt til manuelt');
      onMemberAdded();
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        ageGroup: '',
        musicGenres: [],
        motivation: '',
        status: 'approved'
      });
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error(error.message || 'Kunne ikke legge til medlem');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold mb-4">Legg til medlem manuelt</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Navn *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">E-post *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Telefon</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Aldersgruppe *</label>
        <select
          required
          value={formData.ageGroup}
          onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        >
          <option value="">Velg aldersgruppe</option>
          {AGE_GROUPS.map(age => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Musikksjangre (velg minst én) *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_GENRES.map(genre => (
            <label key={genre} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.musicGenres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2"
              />
              <span className="text-sm text-gray-700">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notat</label>
        <textarea
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={!formData.name || !formData.email || !formData.ageGroup || formData.musicGenres.length === 0}
        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Legg til medlem
      </button>
    </form>
  );
} 