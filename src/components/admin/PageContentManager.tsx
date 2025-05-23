import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function PageContentManager() {
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPageContent();
  }, []);

  async function fetchPageContent() {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('page_id');

      if (error) {
        console.error('Error fetching page content:', error);
        toast.error('Kunne ikke hente sideinnhold');
        throw error;
      }
      
      console.log('Fetched page content:', data);
      setPageContent(data || []);
    } catch (error) {
      console.error('Error in fetchPageContent:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(content: PageContent) {
    console.log('Editing content:', content);
    setSelectedContent(content);
    setEditedTitle(content.title || '');
    setEditedContent(content.content);
  }

  async function handleSave() {
    if (!selectedContent) return;

    setSaving(true);
    try {
      console.log('Saving content:', {
        id: selectedContent.id,
        title: editedTitle,
        content: editedContent
      });

      const { data, error } = await supabase
        .from('page_content')
        .update({
          title: editedTitle || null,
          content: editedContent,
        })
        .eq('id', selectedContent.id)
        .select();

      if (error) {
        console.error('Error updating page content:', error);
        toast.error('Kunne ikke oppdatere innhold');
        throw error;
      }

      console.log('Update response:', data);

      // Update local state
      setPageContent(pageContent.map(content =>
        content.id === selectedContent.id
          ? { ...content, title: editedTitle || null, content: editedContent }
          : content
      ));
      setSelectedContent(null);
      toast.success('Innhold oppdatert');
    } catch (error) {
      console.error('Error in handleSave:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sideinnhold</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Content List */}
        <div className="space-y-4">
          {pageContent.map((content) => (
            <div
              key={content.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => handleEdit(content)}
            >
              <h3 className="font-semibold">
                {content.page_id} - {content.section_id}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {content.title || 'Ingen tittel'}
              </p>
            </div>
          ))}
        </div>

        {/* Edit Form */}
        {selectedContent && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">
              Rediger {selectedContent.page_id} - {selectedContent.section_id}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tittel
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Innhold
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={10}
                  className="w-full p-2 border rounded font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedContent(null)}
                  className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Lagre'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 