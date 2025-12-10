import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';
import { RichTextEditor } from './RichTextEditor';

interface DigitalProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  product_type?: 'download' | 'access_code' | 'subscription' | 'service';
  delivery_method?: 'email' | 'instant' | 'manual';
  image_url?: string;
  category?: string;
  rating?: number;
  created_at?: string;
}

export function DigitalProductsManager() {
  const { t } = useLanguageStore();
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [formData, setFormData] = useState<DigitalProduct>({
    name: '',
    description: '',
    price: 0,
    product_type: 'download',
    delivery_method: 'email',
    image_url: '',
    category: '',
    rating: 5,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('digital_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data as DigitalProduct[]);
      } else {
        const localData = LocalStorageService.get<DigitalProduct>('digital_products');
        setProducts(localData.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const data = LocalStorageService.get<DigitalProduct>('digital_products');
        setProducts(data.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      } catch (localError) {
        console.error('Error fetching products:', localError);
        toast.error('Kunne ikke hente produkter');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      if (editingProduct?.id) {
        // Update existing product
        const { error } = await supabase
          .from('digital_products')
          .update(formData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Produkt oppdatert');
      } else {
        // Insert new product
        const { error } = await supabase
          .from('digital_products')
          .insert([formData]);
        if (error) throw error;
        toast.success('Produkt opprettet');
      }
      
      // Clear form and refresh
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.warn('Supabase save failed, using localStorage:', error);
      try {
        if (editingProduct?.id) {
          LocalStorageService.update('digital_products', editingProduct.id, formData);
          toast.success('Produkt oppdatert (lokal lagring)');
        } else {
          LocalStorageService.add('digital_products', formData);
          toast.success('Produkt opprettet (lokal lagring)');
        }
        resetForm();
        fetchProducts();
      } catch (localError) {
        console.error('Error saving product:', localError);
        toast.error('Kunne ikke lagre produkt');
      }
    }
  }

  function resetForm() {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      product_type: 'download',
      delivery_method: 'email',
      image_url: '',
      category: '',
      rating: 5,
    });
  }

  function handleEdit(product: DigitalProduct) {
    setEditingProduct(product);
    setFormData({
      ...product,
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      product_type: product.product_type || 'download',
      delivery_method: product.delivery_method || 'email',
      image_url: product.image_url || '',
      category: product.category || '',
      rating: product.rating || 5,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette dette produktet?')) return;

    try {
      const { error } = await supabase
        .from('digital_products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Produkt slettet');
      fetchProducts();
    } catch (error: any) {
      console.warn('Supabase delete failed, using localStorage:', error);
      try {
        LocalStorageService.delete('digital_products', id);
        toast.success('Produkt slettet (lokal lagring)');
        fetchProducts();
      } catch (localError) {
        console.error('Error deleting product:', localError);
        toast.error('Kunne ikke slette produkt');
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Digitale Produkter</h2>
        <button
          onClick={resetForm}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {editingProduct ? t('common.cancel') : t('common.create')}
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingProduct ? t('common.edit') : t('common.create')} Produkt
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Navn *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pris (NOK) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beskrivelse *
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Produkttype
              </label>
              <select
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value as DigitalProduct['product_type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600"
              >
                <option value="download">Download</option>
                <option value="access_code">Access Code</option>
                <option value="subscription">Subscription</option>
                <option value="service">Service</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leveringsmetode
              </label>
              <select
                value={formData.delivery_method}
                onChange={(e) => setFormData({ ...formData, delivery_method: e.target.value as DigitalProduct['delivery_method'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600"
              >
                <option value="email">Email</option>
                <option value="instant">Instant</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bilde URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-600 focus:border-brand-600"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
            >
              {editingProduct ? t('common.save') : t('common.create')}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                {t('common.cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Navn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Pris</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Levering</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    Ingen produkter
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {product.price} NOK
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {product.product_type || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {product.delivery_method || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => product.id && handleDelete(product.id)}
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
    </div>
  );
}


