import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';
import { RichTextEditor } from './RichTextEditor';
import { X, Plus } from 'lucide-react';

interface Artist {
  id?: string;
  name: string; // Legacy - kept for backward compatibility
  name_nb?: string;
  name_en?: string;
  bio?: string; // Legacy - kept for backward compatibility
  bio_nb?: string;
  bio_en?: string;
  image_url?: string;
  spotify_url?: string;
  spotify_embed_url?: string;
  website_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  other_links?: Array<{ label: string; url: string }>;
  status: 'draft' | 'published';
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export function ArtistManager() {
  const { t } = useLanguageStore();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState<Artist>({
    name: '',
    name_nb: '',
    name_en: '',
    bio: '',
    bio_nb: '',
    bio_en: '',
    image_url: '',
    spotify_url: '',
    spotify_embed_url: '',
    website_url: '',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    other_links: [],
    status: 'published',
    featured: false,
    display_order: 0,
  });
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    fetchArtists();
  }, []);

  async function fetchArtists() {
    try {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Ensure arrays and strings are initialized
        const normalizedData = data.map((item: any) => ({
          ...item,
          bio: item.bio || '',
          image_url: item.image_url || '',
          spotify_url: item.spotify_url || '',
          spotify_embed_url: item.spotify_embed_url || '',
          website_url: item.website_url || '',
          instagram_url: item.instagram_url || '',
          facebook_url: item.facebook_url || '',
          youtube_url: item.youtube_url || '',
          other_links: item.other_links || [],
        }));
        setArtists(normalizedData as Artist[]);
      } else {
        const localData = LocalStorageService.get<Artist>('artists');
        // Ensure arrays and strings are initialized
        const normalizedData = localData.map((item: any) => ({
          ...item,
          bio: item.bio || '',
          image_url: item.image_url || '',
          spotify_url: item.spotify_url || '',
          spotify_embed_url: item.spotify_embed_url || '',
          website_url: item.website_url || '',
          instagram_url: item.instagram_url || '',
          facebook_url: item.facebook_url || '',
          youtube_url: item.youtube_url || '',
          other_links: item.other_links || [],
        }));
        setArtists(normalizedData.sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const data = LocalStorageService.get<Artist>('artists');
        // Ensure arrays and strings are initialized
        const normalizedData = data.map((item: any) => ({
          ...item,
          bio: item.bio || '',
          image_url: item.image_url || '',
          spotify_url: item.spotify_url || '',
          spotify_embed_url: item.spotify_embed_url || '',
          website_url: item.website_url || '',
          instagram_url: item.instagram_url || '',
          facebook_url: item.facebook_url || '',
          youtube_url: item.youtube_url || '',
          other_links: item.other_links || [],
        }));
        setArtists(normalizedData.sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)));
      } catch (localError) {
        console.error('Error fetching artists:', localError);
        toast.error('Kunne ikke hente artister');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleAddLink() {
    if (linkLabel.trim() && linkUrl.trim()) {
      setFormData({
        ...formData,
        other_links: [...(formData.other_links || []), { label: linkLabel.trim(), url: linkUrl.trim() }],
      });
      setLinkLabel('');
      setLinkUrl('');
    }
  }

  function handleRemoveLink(index: number) {
    const newLinks = [...(formData.other_links || [])];
    newLinks.splice(index, 1);
    setFormData({ ...formData, other_links: newLinks });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Ensure arrays are properly formatted before saving
      const artistData = {
        ...formData,
        other_links: Array.isArray(formData.other_links) ? formData.other_links.filter(link => link && link.url) : [],
        updated_at: new Date().toISOString(),
        created_at: formData.created_at || new Date().toISOString(),
      };

      // Use localStorage directly (Supabase will be set up later)
      const localData = LocalStorageService.get<Artist>('artists');

      if (editingArtist?.id) {
        // Update existing
        const updated = localData.map(a => 
          a.id === editingArtist.id 
            ? { ...artistData, id: editingArtist.id, created_at: a.created_at || new Date().toISOString() } 
            : a
        );
        LocalStorageService.set('artists', updated);
        toast.success('Artist oppdatert!');
      } else {
        // Create new
        const newArtist = { 
          ...artistData, 
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
        };
        LocalStorageService.set('artists', [...localData, newArtist]);
        toast.success('Artist opprettet!');
      }

      setEditingArtist(null);
      setFormData({
        name: '',
        name_nb: '',
        name_en: '',
        bio: '',
        bio_nb: '',
        bio_en: '',
        image_url: '',
        spotify_url: '',
        spotify_embed_url: '',
        website_url: '',
        instagram_url: '',
        facebook_url: '',
        youtube_url: '',
        other_links: [],
        status: 'published',
        featured: false,
        display_order: 0,
      });
      fetchArtists();
    } catch (error: any) {
      console.error('Error saving artist:', error);
      toast.error('Kunne ikke lagre artist');
    }
  }

  function handleEdit(artist: Artist) {
    setEditingArtist(artist);
    setFormData({
      ...artist,
      name: artist.name || artist.name_nb || '',
      name_nb: artist.name_nb || artist.name || '',
      name_en: artist.name_en || '',
      bio: artist.bio || artist.bio_nb || '',
      bio_nb: artist.bio_nb || artist.bio || '',
      bio_en: artist.bio_en || '',
      image_url: artist.image_url || '',
      spotify_url: artist.spotify_url || '',
      spotify_embed_url: artist.spotify_embed_url || '',
      website_url: artist.website_url || '',
      instagram_url: artist.instagram_url || '',
      facebook_url: artist.facebook_url || '',
      youtube_url: artist.youtube_url || '',
      other_links: artist.other_links || [],
    });
  }

  function handleNew() {
    setEditingArtist(null);
    setFormData({
      name: '',
      bio: '',
      image_url: '',
      spotify_url: '',
      spotify_embed_url: '',
      website_url: '',
      instagram_url: '',
      facebook_url: '',
      youtube_url: '',
      other_links: [],
      status: 'published',
      featured: false,
      display_order: 0,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne artisten?')) return;

    try {
      const { error } = await supabase.from('artists').delete().eq('id', id);
      if (error) throw error;

      const localData = LocalStorageService.get<Artist>('artists');
      LocalStorageService.set('artists', localData.filter(a => a.id !== id));

      toast.success('Artist slettet!');
      fetchArtists();
    } catch (error: any) {
      console.error('Error deleting artist:', error);
      toast.error('Kunne ikke slette artist');
    }
  }

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.artists')}</h2>
        <button
          onClick={handleNew}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {t('common.create')} {t('admin.artists')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="border-b border-gray-200 mb-4 pb-2">
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
          <label className="block text-sm font-medium mb-1">Navn (Norsk) *</label>
          <input
            type="text"
            value={formData.name_nb || ''}
            onChange={(e) => setFormData({ ...formData, name_nb: e.target.value, name: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Navn (English)</label>
          <input
            type="text"
            value={formData.name_en || ''}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            placeholder="Leave empty to use Norwegian version"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio (Norsk) *</label>
          <RichTextEditor
            value={formData.bio_nb || ''}
            onChange={(value) => setFormData({ ...formData, bio_nb: value, bio: value })}
            placeholder="Beskriv artisten..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio (English)</label>
          <RichTextEditor
            value={formData.bio_en || ''}
            onChange={(value) => setFormData({ ...formData, bio_en: value })}
            placeholder="Describe the artist..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bilde URL</label>
          <input
            type="url"
            value={formData.image_url || ''}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image_url && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Forhåndsvisning:</p>
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-64 h-64 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const errorMsg = document.createElement('p');
                  errorMsg.className = 'text-red-600 text-sm mt-2';
                  errorMsg.textContent = 'Kunne ikke laste bildet. Sjekk at URL-en er riktig.';
                  (e.target as HTMLImageElement).parentElement?.appendChild(errorMsg);
                }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Spotify URL</label>
            <input
              type="url"
              value={formData.spotify_url || ''}
              onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              placeholder="https://open.spotify.com/artist/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Spotify Embed URL (valgfritt)</label>
            <input
              type="url"
              value={formData.spotify_embed_url || ''}
              onChange={(e) => setFormData({ ...formData, spotify_embed_url: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              placeholder="https://open.spotify.com/embed/..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website URL</label>
            <input
              type="url"
              value={formData.website_url || ''}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram URL</label>
            <input
              type="url"
              value={formData.instagram_url || ''}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Facebook URL</label>
            <input
              type="url"
              value={formData.facebook_url || ''}
              onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">YouTube URL</label>
            <input
              type="url"
              value={formData.youtube_url || ''}
              onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Andre lenker</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              placeholder="Label"
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL"
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-md"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.other_links || []).map((link, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md"
              >
                <span>{link.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Order</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            {editingArtist ? t('common.save') : t('common.create')}
          </button>
          {editingArtist && (
            <button
              type="button"
              onClick={handleNew}
              className="bg-neutral-200 text-neutral-700 px-6 py-2 rounded-md hover:bg-neutral-300"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Navn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {artists.map((artist) => (
                <tr key={artist.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{artist.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      artist.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-red-orange-100 text-red-orange-800'
                    }`}>
                      {artist.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {artist.featured ? '✓' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(artist)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => artist.id && handleDelete(artist.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

