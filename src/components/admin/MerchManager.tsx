import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';
import { RichTextEditor } from './RichTextEditor';
import { X, Plus } from 'lucide-react';

interface MerchItem {
  id?: string;
  name: string; // Legacy
  name_nb?: string;
  name_en?: string;
  description?: string; // Legacy
  description_nb?: string;
  description_en?: string;
  price: number;
  currency: string;
  image_urls?: string[];
  category?: string;
  sizes?: string[];
  colors?: string[];
  stock_quantity?: number;
  status: 'draft' | 'published' | 'out_of_stock';
  featured: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export function MerchManager() {
  const { t } = useLanguageStore();
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MerchItem | null>(null);
  const [formData, setFormData] = useState<MerchItem>({
    name: '',
    name_nb: '',
    name_en: '',
    description: '',
    description_nb: '',
    description_en: '',
    price: 0,
    currency: 'NOK',
    image_urls: [],
    category: '',
    sizes: [],
    colors: [],
    stock_quantity: undefined,
    status: 'published',
    featured: false,
    display_order: 0,
  });
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchMerch();
  }, []);

  async function fetchMerch() {
    try {
      const { data, error } = await supabase
        .from('merch')
        .select('*')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Ensure arrays are initialized
        const normalizedData = data.map((item: any) => ({
          ...item,
          sizes: item.sizes || [],
          colors: item.colors || [],
          image_urls: item.image_urls || [],
        }));
        setMerchItems(normalizedData as MerchItem[]);
      } else {
        const localData = LocalStorageService.get<MerchItem>('merch');
        // Ensure arrays are initialized
        const normalizedData = localData.map((item: any) => ({
          ...item,
          sizes: item.sizes || [],
          colors: item.colors || [],
          image_urls: item.image_urls || [],
        }));
        setMerchItems(normalizedData.sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const data = LocalStorageService.get<MerchItem>('merch');
        // Ensure arrays are initialized
        const normalizedData = data.map((item: any) => ({
          ...item,
          sizes: item.sizes || [],
          colors: item.colors || [],
          image_urls: item.image_urls || [],
        }));
        setMerchItems(normalizedData.sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name)));
      } catch (localError) {
        console.error('Error fetching merch:', localError);
        toast.error('Kunne ikke hente merch');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleAddSize() {
    if (sizeInput.trim() && !formData.sizes?.includes(sizeInput.trim())) {
      setFormData({ ...formData, sizes: [...(formData.sizes || []), sizeInput.trim()] });
      setSizeInput('');
    }
  }

  function handleRemoveSize(size: string) {
    setFormData({ ...formData, sizes: formData.sizes?.filter(s => s !== size) || [] });
  }

  function handleAddColor() {
    if (colorInput.trim() && !formData.colors?.includes(colorInput.trim())) {
      setFormData({ ...formData, colors: [...(formData.colors || []), colorInput.trim()] });
      setColorInput('');
    }
  }

  function handleRemoveColor(color: string) {
    setFormData({ ...formData, colors: formData.colors?.filter(c => c !== color) || [] });
  }

  function handleAddImage() {
    if (imageInput.trim() && !formData.image_urls?.includes(imageInput.trim())) {
      setFormData({ ...formData, image_urls: [...(formData.image_urls || []), imageInput.trim()] });
      setImageInput('');
    }
  }

  function handleRemoveImage(url: string) {
    setFormData({ ...formData, image_urls: formData.image_urls?.filter(img => img !== url) || [] });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Ensure arrays are properly formatted before saving
      const merchData = {
        ...formData,
        image_urls: Array.isArray(formData.image_urls) ? formData.image_urls.filter(url => url && url.trim()) : [],
        sizes: Array.isArray(formData.sizes) ? formData.sizes.filter(size => size && size.trim()) : [],
        colors: Array.isArray(formData.colors) ? formData.colors.filter(color => color && color.trim()) : [],
        updated_at: new Date().toISOString(),
        created_at: formData.created_at || new Date().toISOString(),
      };

      // Use localStorage directly (Supabase will be set up later)
      const localData = LocalStorageService.get<MerchItem>('merch');

      if (editingItem?.id) {
        const updated = localData.map(m => 
          m.id === editingItem.id 
            ? { ...merchData, id: editingItem.id, created_at: m.created_at || new Date().toISOString() } 
            : m
        );
        LocalStorageService.set('merch', updated);
        toast.success('Merch oppdatert!');
      } else {
        const newItem = { 
          ...merchData, 
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
        };
        LocalStorageService.set('merch', [...localData, newItem]);
        toast.success('Merch opprettet!');
      }

      setEditingItem(null);
      setFormData({
        name: '',
        name_nb: '',
        name_en: '',
        description: '',
        description_nb: '',
        description_en: '',
        price: 0,
        currency: 'NOK',
        image_urls: [],
        category: '',
        sizes: [],
        colors: [],
        stock_quantity: undefined,
        status: 'published',
        featured: false,
        display_order: 0,
      });
      fetchMerch();
    } catch (error: any) {
      console.error('Error saving merch:', error);
      toast.error('Kunne ikke lagre merch');
    }
  }

  function handleEdit(item: MerchItem) {
    setEditingItem(item);
    // Ensure we get fresh data from localStorage to avoid stale data
    const localData = LocalStorageService.get<MerchItem>('merch');
    const freshItem = localData.find(m => m.id === item.id);
    const itemToEdit = freshItem || item;
    
    // Normalize arrays - handle both array and non-array formats
    let normalizedSizes: string[] = [];
    if (Array.isArray(itemToEdit.sizes)) {
      normalizedSizes = itemToEdit.sizes;
    } else if (itemToEdit.sizes) {
      normalizedSizes = [itemToEdit.sizes];
    }
    
    let normalizedColors: string[] = [];
    if (Array.isArray(itemToEdit.colors)) {
      normalizedColors = itemToEdit.colors;
    } else if (itemToEdit.colors) {
      normalizedColors = [itemToEdit.colors];
    }
    
    let normalizedImageUrls: string[] = [];
    if (Array.isArray(itemToEdit.image_urls)) {
      normalizedImageUrls = itemToEdit.image_urls.filter((url: any) => url && typeof url === 'string');
    } else if (itemToEdit.image_urls && typeof itemToEdit.image_urls === 'string') {
      normalizedImageUrls = [itemToEdit.image_urls];
    } else if (itemToEdit.image_url && typeof itemToEdit.image_url === 'string') {
      normalizedImageUrls = [itemToEdit.image_url];
    }
    
    setFormData({
      ...itemToEdit,
      name: itemToEdit.name || itemToEdit.name_nb || '',
      name_nb: itemToEdit.name_nb || itemToEdit.name || '',
      name_en: itemToEdit.name_en || '',
      description: itemToEdit.description || itemToEdit.description_nb || '',
      description_nb: itemToEdit.description_nb || itemToEdit.description || '',
      description_en: itemToEdit.description_en || '',
      sizes: normalizedSizes,
      colors: normalizedColors,
      image_urls: normalizedImageUrls,
      category: itemToEdit.category || '',
      stock_quantity: itemToEdit.stock_quantity || undefined,
    });
    
    console.log('Editing item:', {
      original: itemToEdit,
      normalized: {
        sizes: normalizedSizes,
        colors: normalizedColors,
        image_urls: normalizedImageUrls,
      }
    });
  }

  function handleNew() {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'NOK',
      image_urls: [],
      category: '',
      sizes: [],
      colors: [],
      stock_quantity: undefined,
      status: 'published',
      featured: false,
      display_order: 0,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette dette merch-varen?')) return;

    try {
      const { error } = await supabase.from('merch').delete().eq('id', id);
      if (error) throw error;

      const localData = LocalStorageService.get<MerchItem>('merch');
      LocalStorageService.set('merch', localData.filter(m => m.id !== id));

      toast.success('Merch slettet!');
      fetchMerch();
    } catch (error: any) {
      console.error('Error deleting merch:', error);
      toast.error('Kunne ikke slette merch');
    }
  }

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.merch')}</h2>
        <button
          onClick={handleNew}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {t('common.create')} {t('admin.merch')}
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
          <label className="block text-sm font-medium mb-1">Beskrivelse (Norsk) *</label>
          <RichTextEditor
            value={formData.description_nb || ''}
            onChange={(value) => setFormData({ ...formData, description_nb: value, description: value })}
            placeholder="Beskriv merch-varen..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Beskrivelse (English)</label>
          <RichTextEditor
            value={formData.description_en || ''}
            onChange={(value) => setFormData({ ...formData, description_en: value })}
            placeholder="Describe the merch item..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pris *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valuta</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            >
              <option value="NOK">NOK</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lager</label>
            <input
              type="number"
              value={formData.stock_quantity || ''}
              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || undefined })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <input
            type="text"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Størrelser</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="f.eks. S, M, L"
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-md"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.sizes || []).map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md"
              >
                <span>{size}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Farger</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="f.eks. Black, White"
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-md"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.colors || []).map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md"
              >
                <span>{color}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bilde URLs</label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-md"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {(formData.image_urls || []).map((url, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 rounded-md"
              >
                <span className="max-w-xs truncate">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </span>
            ))}
          </div>
          {formData.image_urls && formData.image_urls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Forhåndsvisning:</p>
              <div className="flex flex-wrap gap-4">
                {formData.image_urls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="out_of_stock">Out of Stock</option>
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
            {editingItem ? t('common.save') : t('common.create')}
          </button>
          {editingItem && (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Pris</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {merchItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.price} {item.currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.status === 'published' ? 'bg-green-100 text-green-800' :
                      item.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                      'bg-red-orange-100 text-red-orange-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id)}
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

