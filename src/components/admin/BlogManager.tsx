import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';
import { RichTextEditor } from './RichTextEditor';

interface AffiliateLink {
  text: string;
  url: string;
  isAffiliate: boolean;
}

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  featured_image: string | null;
  published_at: string | null;
  status: 'draft' | 'published';
  author_id?: string;
  created_at?: string;
  updated_at?: string;
  affiliate_links?: AffiliateLink[];
}

export function BlogManager() {
  const { t } = useLanguageStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    category: '',
    tags: [],
    featured_image: null,
    published_at: null,
    status: 'draft',
    affiliate_links: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isAffiliate, setIsAffiliate] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setPosts(data as BlogPost[]);
      } else {
        // Fallback to localStorage
        const localData = LocalStorageService.get<BlogPost>('blog_posts');
        setPosts(localData.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      // Fallback to localStorage
      try {
        const data = LocalStorageService.get<BlogPost>('blog_posts');
        setPosts(data.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      } catch (localError) {
        console.error('Error fetching blog posts:', localError);
        toast.error('Kunne ikke hente nyheter');
      }
    } finally {
      setLoading(false);
    }
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  function handleTitleChange(title: string) {
    setFormData({ ...formData, title, slug: generateSlug(title) });
  }

  function handleAddTag() {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  }

  function handleRemoveTag(tag: string) {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  }

  function handleAddAffiliateLink() {
    if (linkText.trim() && linkUrl.trim()) {
      const newLink: AffiliateLink = {
        text: linkText.trim(),
        url: linkUrl.trim(),
        isAffiliate: isAffiliate,
      };
      setFormData({
        ...formData,
        affiliate_links: [...(formData.affiliate_links || []), newLink],
      });
      setLinkText('');
      setLinkUrl('');
      setIsAffiliate(false);
    }
  }

  function handleRemoveAffiliateLink(index: number) {
    const links = formData.affiliate_links || [];
    setFormData({
      ...formData,
      affiliate_links: links.filter((_, i) => i !== index),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const submitData: BlogPost = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        published_at: formData.status === 'published' && !formData.published_at
          ? new Date().toISOString()
          : formData.published_at,
      };

      if (editingPost?.id) {
        // Try Supabase first
        const { error } = await supabase
          .from('blog_posts')
          .update(submitData)
          .eq('id', editingPost.id);

        if (error) throw error;
        toast.success('Nyhet oppdatert');
      } else {
        // Try Supabase first
        const { error } = await supabase
          .from('blog_posts')
          .insert([submitData]);

        if (error) throw error;
        toast.success('Nyhet opprettet');
      }

      resetForm();
      fetchPosts();
    } catch (error: any) {
      console.error('Supabase save failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      toast.error(`Supabase feilet: ${error.message || 'Ukjent feil'}. Bruker lokal lagring.`);
      // Fallback to localStorage
      try {
        const submitData: BlogPost = {
          ...formData,
          slug: formData.slug || generateSlug(formData.title),
          published_at: formData.status === 'published' && !formData.published_at
            ? new Date().toISOString()
            : formData.published_at,
        };

        if (editingPost?.id) {
          LocalStorageService.update('blog_posts', editingPost.id, submitData);
          toast.success('Nyhet oppdatert (lokal lagring)');
        } else {
          LocalStorageService.add('blog_posts', submitData);
          toast.success('Nyhet opprettet (lokal lagring)');
        }
        resetForm();
        fetchPosts();
      } catch (localError) {
        console.error('Error saving blog post:', localError);
        toast.error('Kunne ikke lagre nyhet');
      }
    }
  }

  function resetForm() {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      category: '',
      tags: [],
      featured_image: null,
      published_at: null,
      status: 'draft',
      affiliate_links: [],
    });
    setTagInput('');
    setLinkText('');
    setLinkUrl('');
    setIsAffiliate(false);
  }

  function handleEdit(post: BlogPost) {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      category: post.category,
      tags: post.tags,
      featured_image: post.featured_image,
      published_at: post.published_at,
      status: post.status,
      affiliate_links: post.affiliate_links || [],
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne nyheten?')) return;
    
    try {
      // Try Supabase first
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Nyhet slettet');
      fetchPosts();
    } catch (error: any) {
      console.warn('Supabase delete failed, using localStorage:', error);
      // Fallback to localStorage
      try {
        LocalStorageService.delete('blog_posts', id);
        toast.success('Nyhet slettet (lokal lagring)');
        fetchPosts();
      } catch (localError) {
        console.error('Error deleting blog post:', localError);
        toast.error('Kunne ikke slette nyhet');
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.blog')}</h2>
        <button
          onClick={resetForm}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {t('common.create')} {t('admin.blog')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('common.title')}</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Innhold</label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            placeholder="Skriv inn innholdet her..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              placeholder="Legg til tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-neutral-200 px-4 py-2 rounded-md hover:bg-neutral-300"
            >
              Legg til
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bilde-URL</label>
          <input
            type="url"
            value={formData.featured_image || ''}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value || null })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Affiliate Links</label>
          <div className="space-y-2 mb-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link text"
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="URL"
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAffiliate}
                onChange={(e) => setIsAffiliate(e.target.checked)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <label className="text-sm">Is Affiliate Link</label>
            </div>
            <button
              type="button"
              onClick={handleAddAffiliateLink}
              className="bg-neutral-200 px-4 py-2 rounded-md hover:bg-neutral-300 text-sm"
            >
              Add Link
            </button>
          </div>
          <div className="space-y-1">
            {(formData.affiliate_links || []).map((link, index) => (
              <div
                key={index}
                className="bg-neutral-50 px-3 py-2 rounded-md text-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{link.text}</span>
                  <span className="text-neutral-500">→</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    {link.url}
                  </a>
                  {link.isAffiliate && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">Affiliate</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAffiliateLink(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
          >
            <option value="draft">Draft</option>
            <option value="published">Publisert</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            {editingPost ? t('common.save') : t('common.create')}
          </button>
          {editingPost && (
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
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-neutral-500">
                  Ingen nyheter ennå
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => post.id && handleDelete(post.id)}
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

