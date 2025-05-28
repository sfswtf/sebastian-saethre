import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

type SocialMediaPost = {
  id: string;
  created_at: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'image';
  url: string;
  title: string;
  display_order: number;
  active: boolean;
};

export function SocialMediaManager() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<SocialMediaPost>>({
    platform: 'instagram',
    url: '',
    title: '',
    active: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Kunne ikke hente innlegg');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newPost = {
        ...formData,
        display_order: posts.length,
      };

      const { error } = await supabase
        .from('social_media_posts')
        .insert([newPost]);

      if (error) throw error;

      toast.success('Innlegg lagt til');
      setFormData({
        platform: 'instagram',
        url: '',
        title: '',
        active: true,
      });
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Kunne ikke lagre innlegg');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette dette innlegget?')) return;
    
    try {
      const { error } = await supabase
        .from('social_media_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Innlegg slettet');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Kunne ikke slette innlegg');
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    try {
      const { error } = await supabase
        .from('social_media_posts')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      toast.success('Status oppdatert');
      fetchPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('Kunne ikke oppdatere status');
    }
  }

  async function handleReorder(id: string, direction: 'up' | 'down') {
    const currentIndex = posts.findIndex(post => post.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === posts.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedPosts = [...posts];
    const temp = updatedPosts[currentIndex];
    updatedPosts[currentIndex] = updatedPosts[newIndex];
    updatedPosts[newIndex] = temp;

    try {
      const updates = updatedPosts.map((post, index) => ({
        id: post.id,
        display_order: index,
      }));

      const { error } = await supabase
        .from('social_media_posts')
        .upsert(updates);

      if (error) throw error;
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error reordering posts:', error);
      toast.error('Kunne ikke endre rekkefølge');
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Legg til nytt innlegg</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Plattform</label>
            <select
              required
              value={formData.platform}
              onChange={e => setFormData({ ...formData, platform: e.target.value as SocialMediaPost['platform'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="image">Bilde</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              required
              value={formData.url || ''}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
              placeholder={
                formData.platform === 'instagram' ? 'https://www.instagram.com/p/...' :
                formData.platform === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                formData.platform === 'tiktok' ? 'https://www.tiktok.com/@user/video/...' :
                'https://example.com/image.jpg'
              }
            />
          </div>

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

          <button
            type="submit"
            className="bg-[#1d4f4d] text-white py-2 px-4 rounded-md hover:bg-[#1d4f4d] focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] focus:ring-offset-2"
          >
            Legg til innlegg
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b">Sosiale medier innlegg</h2>
        <div className="divide-y">
          {posts.map((post, index) => (
            <div key={post.id} className="p-6 flex items-center justify-between">
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-sm text-gray-500">{post.platform}</p>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {post.url}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleActive(post.id, post.active)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    post.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {post.active ? 'Aktiv' : 'Inaktiv'}
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(post.id, 'up')}
                    disabled={index === 0}
                    className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleReorder(post.id, 'down')}
                    disabled={index === posts.length - 1}
                    className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
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