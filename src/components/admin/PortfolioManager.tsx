import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';

interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  image_urls: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export function PortfolioManager() {
  const { t } = useLanguageStore();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [formData, setFormData] = useState<PortfolioProject>({
    title: '',
    description: '',
    category: '',
    tech_stack: [],
    image_urls: [],
    live_url: null,
    github_url: null,
    featured: false,
  });
  const [techInput, setTechInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProjects(data as PortfolioProject[]);
      } else {
        const localData = LocalStorageService.get<PortfolioProject>('portfolio_projects');
        setProjects(localData.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const data = LocalStorageService.get<PortfolioProject>('portfolio_projects');
        setProjects(data.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      } catch (localError) {
        console.error('Error fetching portfolio projects:', localError);
        toast.error('Kunne ikke hente porteføljeprosjekter');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleAddTech() {
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({ ...formData, tech_stack: [...formData.tech_stack, techInput.trim()] });
      setTechInput('');
    }
  }

  function handleRemoveTech(tech: string) {
    setFormData({ ...formData, tech_stack: formData.tech_stack.filter(t => t !== tech) });
  }

  function handleAddImage() {
    if (imageInput.trim() && !formData.image_urls.includes(imageInput.trim())) {
      setFormData({ ...formData, image_urls: [...formData.image_urls, imageInput.trim()] });
      setImageInput('');
    }
  }

  function handleRemoveImage(url: string) {
    setFormData({ ...formData, image_urls: formData.image_urls.filter(img => img !== url) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Debug: Log current state
    console.log('Submitting portfolio project:', {
      editingProject: editingProject?.id,
      formData,
      isEditing: !!editingProject?.id,
    });
    
    try {
      if (editingProject?.id) {
        // Update existing project
        console.log('Updating portfolio project:', editingProject.id);
        const { error } = await supabase
          .from('portfolio_projects')
          .update(formData)
          .eq('id', editingProject.id);
        if (error) throw error;
        toast.success('Prosjekt oppdatert');
      } else {
        // Insert new project
        console.log('Creating new portfolio project');
        const { error } = await supabase
          .from('portfolio_projects')
          .insert([formData]);
        if (error) throw error;
        toast.success('Prosjekt opprettet');
      }
      
      // Clear form and refresh
      resetForm();
      fetchProjects();
    } catch (error: any) {
      console.warn('Supabase save failed, using localStorage:', error);
      try {
        if (editingProject?.id) {
          LocalStorageService.update('portfolio_projects', editingProject.id, formData);
          toast.success('Prosjekt oppdatert (lokal lagring)');
        } else {
          LocalStorageService.add('portfolio_projects', formData);
          toast.success('Prosjekt opprettet (lokal lagring)');
        }
        resetForm();
        fetchProjects();
      } catch (localError) {
        console.error('Error saving portfolio project:', localError);
        toast.error('Kunne ikke lagre prosjekt');
      }
    }
  }

  function resetForm() {
    // Clear editing state FIRST
    console.log('Resetting portfolio form, clearing editingProject');
    setEditingProject(null);
    // Then reset form data
    setFormData({
      title: '',
      description: '',
      category: '',
      tech_stack: [],
      image_urls: [],
      live_url: null,
      github_url: null,
      featured: false,
    });
    setTechInput('');
    setImageInput('');
  }

  function handleEdit(project: PortfolioProject) {
    // Set editing project and form data
    console.log('Editing portfolio project:', project.id);
    setEditingProject(project);
    setFormData({
      ...project,
      // Ensure all fields are set
      title: project.title || '',
      description: project.description || '',
      category: project.category || '',
      tech_stack: project.tech_stack || [],
      image_urls: project.image_urls || [],
      live_url: project.live_url || null,
      github_url: project.github_url || null,
      featured: project.featured || false,
    });
  }
  
  function handleNewProject() {
    // Explicitly clear editing state for new project
    console.log('Creating new portfolio project');
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette dette prosjektet?')) return;
    
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Prosjekt slettet');
      fetchProjects();
    } catch (error: any) {
      console.warn('Supabase delete failed, using localStorage:', error);
      try {
        LocalStorageService.delete('portfolio_projects', id);
        toast.success('Prosjekt slettet (lokal lagring)');
        fetchProjects();
      } catch (localError) {
        console.error('Error deleting project:', localError);
        toast.error('Kunne ikke slette prosjekt');
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.portfolio')}</h2>
        <button
          onClick={handleNewProject}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {t('common.create')} Prosjekt
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tittel</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Beskrivelse</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            placeholder="Web Development, AI Projects, Content Creation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tech Stack</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              placeholder="Legg til teknologi..."
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="bg-neutral-200 px-4 py-2 rounded-md hover:bg-neutral-300"
            >
              Legg til
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tech_stack.map((tech) => (
              <span
                key={tech}
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bilde-URLs</label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              placeholder="Legg til bilde-URL..."
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-neutral-200 px-4 py-2 rounded-md hover:bg-neutral-300"
            >
              Legg til
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.image_urls.map((url, idx) => (
              <span
                key={idx}
                className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded text-sm flex items-center gap-2"
              >
                {url.substring(0, 30)}...
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Live URL</label>
            <input
              type="url"
              value={formData.live_url || ''}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value || null })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL</label>
            <input
              type="url"
              value={formData.github_url || ''}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value || null })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium">Fremhevet prosjekt</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            {editingProject ? t('common.save') : t('common.create')}
          </button>
          {editingProject && (
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
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Tittel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Featured</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-neutral-500">
                  Ingen prosjekter ennå
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {project.featured && (
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => project.id && handleDelete(project.id)}
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

