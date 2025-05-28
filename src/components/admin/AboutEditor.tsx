import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type AboutPage = Database['public']['Tables']['about_page']['Row'];

export function AboutEditor() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setContent(data.content.text || '');
      }
    } catch (error) {
      console.error('Error fetching about page content:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('about_page')
        .insert([{
          content: { text: content },
          published_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving about page content:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Rediger Om Oss</h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1d4f4d] text-white py-2 px-4 rounded-md hover:bg-[#1d4f4d] focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] focus:ring-offset-2 disabled:bg-gray-400"
          >
            {saving ? 'Lagrer...' : 'Lagre Endringer'}
          </button>
        </div>

        <div className="prose max-w-none">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
            placeholder="Skriv innholdet for Om Oss-siden her..."
          />
        </div>
      </div>
    </div>
  );
} 