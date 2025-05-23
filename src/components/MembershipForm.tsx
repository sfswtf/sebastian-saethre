import React, { useState } from 'react';
import { useFormStore } from '../stores/formStore';
import { Toaster } from 'react-hot-toast';

const AGE_GROUPS = [
  'Under 18',
  '18-25',
  '26-35',
  '36-50',
  'Over 50'
];

const MUSIC_GENRES = [
  'Rock',
  'Jazz',
  'Classical',
  'Electronic',
  'Folk',
  'Pop',
  'Metal',
  'Hip Hop',
  'Blues',
  'World Music'
];

export function MembershipForm() {
  const submitMembershipForm = useFormStore((state) => state.submitMembershipForm);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    ageGroup: '',
    musicGenres: [] as string[],
    motivation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitMembershipForm(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      ageGroup: '',
      musicGenres: [],
      motivation: ''
    });
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      musicGenres: prev.musicGenres.includes(genre)
        ? prev.musicGenres.filter(g => g !== genre)
        : [...prev.musicGenres, genre]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Medlemskapssøknad</h2>
        
        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Navn *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">E-post *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Telefon (valgfritt)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Bosted *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="F.eks. Hovden, Oslo, etc."
            />
          </div>

          {/* Age Group Selection */}
          <div>
            <label className="block text-gray-700 mb-2">Aldersgruppe *</label>
            <select
              required
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Velg aldersgruppe</option>
              {AGE_GROUPS.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          {/* Music Genres */}
          <div>
            <label className="block text-gray-700 mb-2">Musikksjangre (velg minst én) *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MUSIC_GENRES.map(genre => (
                <label key={genre} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.musicGenres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <div>
            <label className="block text-gray-700 mb-2">
              Hvorfor ønsker du å bli medlem? (valgfritt)
            </label>
            <textarea
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={formData.musicGenres.length === 0}
          className="w-full mt-6 bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send Søknad
        </button>
      </div>
      <Toaster position="top-center" />
    </form>
  );
}