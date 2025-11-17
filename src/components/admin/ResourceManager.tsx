import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';
import { RichTextEditor } from './RichTextEditor';

interface Resource {
  id?: string;
  name: string;
  description: string;
  category: string;
  affiliate_url: string | null;
  rating: number;
  worth_it: boolean;
  created_at?: string;
}

export function ResourceManager() {
  const { t } = useLanguageStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<Resource>({
    name: '',
    description: '',
    category: '',
    affiliate_url: null,
    rating: 5,
    worth_it: true,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      const { data, error } = await supabase
        .from('tools_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setResources(data as Resource[]);
      } else {
        const localData = LocalStorageService.get<Resource>('tools_resources');
        setResources(localData.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const data = LocalStorageService.get<Resource>('tools_resources');
        setResources(data.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      } catch (localError) {
        console.error('Error fetching resources:', localError);
        toast.error('Kunne ikke hente ressurser');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Debug: Log current state
    console.log('Submitting resource:', {
      editingResource: editingResource?.id,
      formData,
      isEditing: !!editingResource?.id,
    });
    
    try {
      if (editingResource?.id) {
        // Update existing resource
        console.log('Updating resource:', editingResource.id);
        const { error } = await supabase
          .from('tools_resources')
          .update(formData)
          .eq('id', editingResource.id);
        if (error) throw error;
        toast.success('Ressurs oppdatert');
      } else {
        // Insert new resource
        console.log('Creating new resource');
        const { error } = await supabase
          .from('tools_resources')
          .insert([formData]);
        if (error) throw error;
        toast.success('Ressurs opprettet');
      }
      
      // Clear form and refresh
      resetForm();
      fetchResources();
    } catch (error: any) {
      console.warn('Supabase save failed, using localStorage:', error);
      try {
        if (editingResource?.id) {
          LocalStorageService.update('tools_resources', editingResource.id, formData);
          toast.success('Ressurs oppdatert (lokal lagring)');
        } else {
          LocalStorageService.add('tools_resources', formData);
          toast.success('Ressurs opprettet (lokal lagring)');
        }
        resetForm();
        fetchResources();
      } catch (localError) {
        console.error('Error saving resource:', localError);
        toast.error('Kunne ikke lagre ressurs');
      }
    }
  }

  function resetForm() {
    // Clear editing state FIRST
    console.log('Resetting resource form, clearing editingResource');
    setEditingResource(null);
    // Then reset form data
    setFormData({
      name: '',
      description: '',
      category: '',
      affiliate_url: null,
      rating: 5,
      worth_it: true,
    });
  }

  function handleEdit(resource: Resource) {
    // Set editing resource and form data
    console.log('Editing resource:', resource.id);
    setEditingResource(resource);
    setFormData({
      ...resource,
      // Ensure all fields are set
      name: resource.name || '',
      description: resource.description || '',
      category: resource.category || '',
      affiliate_url: resource.affiliate_url || null,
      rating: resource.rating || 5,
      worth_it: resource.worth_it !== undefined ? resource.worth_it : true,
    });
  }
  
  function handleNewResource() {
    // Explicitly clear editing state for new resource
    console.log('Creating new resource');
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne ressursen?')) return;
    
    try {
      const { error } = await supabase
        .from('tools_resources')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Ressurs slettet');
      fetchResources();
    } catch (error: any) {
      console.warn('Supabase delete failed, using localStorage:', error);
      try {
        LocalStorageService.delete('tools_resources', id);
        toast.success('Ressurs slettet (lokal lagring)');
        fetchResources();
      } catch (localError) {
        console.error('Error deleting resource:', localError);
        toast.error('Kunne ikke slette ressurs');
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.resources')}</h2>
        <button
          onClick={handleNewResource}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {t('common.create')} {t('admin.resources')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Navn</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Beskrivelse</label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Beskriv ressursen..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            placeholder="AI Tools, Coding Tools, Content Creation, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Affiliate URL</label>
          <input
            type="url"
            value={formData.affiliate_url || ''}
            onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value || null })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vurdering (1-5)</label>
            <input
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              min="1"
              max="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Verdt det?</label>
            <select
              value={formData.worth_it ? 'true' : 'false'}
              onChange={(e) => setFormData({ ...formData, worth_it: e.target.value === 'true' })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            >
              <option value="true">Ja</option>
              <option value="false">Nei</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            {editingResource ? t('common.save') : t('common.create')}
          </button>
          {editingResource && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-neutral-200 px-6 py-2 rounded-md hover:bg-neutral-300"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Navn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Vurdering</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-neutral-500">
                  Ingen ressurser ennå
                </td>
              </tr>
            ) : (
              resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{resource.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{resource.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{resource.rating}/5</span>
                      {resource.worth_it && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verdt det</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => resource.id && handleDelete(resource.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

