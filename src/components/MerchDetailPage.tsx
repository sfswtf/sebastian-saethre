import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { toast } from 'react-hot-toast';

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
}

export function MerchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguageStore();
  const { addItem } = useCartStore();
  const [merchItem, setMerchItem] = useState<MerchItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Helper function to get localized content
  const getLocalizedContent = (item: MerchItem) => {
    const name = language === 'en' 
      ? (item.name_en || item.name_nb || item.name || '')
      : (item.name_nb || item.name || '');
    const description = language === 'en'
      ? (item.description_en || item.description_nb || item.description || '')
      : (item.description_nb || item.description || '');
    return { name, description };
  };

  useEffect(() => {
    if (id) {
      fetchMerchItem(id);
    }
  }, [id]);

  const fetchMerchItem = async (itemId: string) => {
    try {
      const { data, error } = await supabase
        .from('merch')
        .select('*')
        .eq('id', itemId)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      if (data) {
        // Normalize data to ensure arrays are initialized
        const normalized = {
          ...data,
          image_urls: Array.isArray(data.image_urls) ? data.image_urls : (data.image_url ? [data.image_url] : []),
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
          colors: Array.isArray(data.colors) ? data.colors : [],
        };
        setMerchItem(normalized as MerchItem);
      } else {
        const localData = LocalStorageService.get<MerchItem>('merch');
        const found = localData.find(m => m.id === itemId && m.status === 'published');
        if (found) {
          // Normalize data to ensure arrays are initialized
          const normalized = {
            ...found,
            image_urls: Array.isArray(found.image_urls) ? found.image_urls : (found.image_url ? [found.image_url] : []),
            sizes: Array.isArray(found.sizes) ? found.sizes : [],
            colors: Array.isArray(found.colors) ? found.colors : [],
          };
          setMerchItem(normalized);
        }
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const localData = LocalStorageService.get<MerchItem>('merch');
        const found = localData.find(m => m.id === itemId && m.status === 'published');
        if (found) {
          // Normalize data to ensure arrays are initialized
          const normalized = {
            ...found,
            image_urls: Array.isArray(found.image_urls) ? found.image_urls : (found.image_url ? [found.image_url] : []),
            sizes: Array.isArray(found.sizes) ? found.sizes : [],
            colors: Array.isArray(found.colors) ? found.colors : [],
          };
          setMerchItem(normalized);
        }
      } catch (localError) {
        console.error('Error fetching merch item:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!merchItem) return;
    if (merchItem.status === 'out_of_stock') {
      toast.error('Dette produktet er utsolgt');
      return;
    }
    // Check if sizes are required (only if sizes array exists and has items)
    if (merchItem.sizes && Array.isArray(merchItem.sizes) && merchItem.sizes.length > 0 && !selectedSize) {
      toast.error('Vennligst velg størrelse');
      return;
    }
    // Check if colors are required (only if colors array exists and has items)
    if (merchItem.colors && Array.isArray(merchItem.colors) && merchItem.colors.length > 0 && !selectedColor) {
      toast.error('Vennligst velg farge');
      return;
    }

    if (!merchItem.id) {
      toast.error('Produkt-ID mangler');
      return;
    }

    addItem({
      merch_id: merchItem.id,
      name: getLocalizedContent(merchItem).name,
      price: merchItem.price,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      image_url: merchItem.image_urls?.[0],
    });
    
    toast.success(`${getLocalizedContent(merchItem).name} lagt til i handlekurven`, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#10b981',
        color: 'white',
        fontSize: '18px',
        padding: '16px 24px',
        minWidth: '300px',
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse bg-neutral-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  if (!merchItem) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-neutral-600">Produkt ikke funnet</p>
          <Link to="/merch" className="text-brand-600 hover:text-brand-700 mt-4 inline-block">
            ← Tilbake til merch
          </Link>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/merch" 
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Tilbake til merch</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {merchItem.image_urls && merchItem.image_urls.length > 0 ? (
              <div className="w-full">
                <img
                  src={merchItem.image_urls[0]}
                  alt={getLocalizedContent(merchItem).name}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                {merchItem.image_urls.length > 1 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {merchItem.image_urls.slice(1).map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${getLocalizedContent(merchItem).name} ${index + 2}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-neutral-200 rounded-lg"></div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">{getLocalizedContent(merchItem).name}</h1>
            
            {merchItem.category && (
              <p className="text-neutral-500 mb-4">{merchItem.category}</p>
            )}

            <div className="mb-6">
              <span className="text-4xl font-bold text-brand-600">
                {merchItem.price} {merchItem.currency}
              </span>
            </div>

            {getLocalizedContent(merchItem).description && (
              <div 
                className="prose max-w-none mb-8 text-neutral-700"
                dangerouslySetInnerHTML={{ __html: getLocalizedContent(merchItem).description }}
              />
            )}

            {merchItem.sizes && merchItem.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Størrelse
                </label>
                <div className="flex flex-wrap gap-2">
                  {merchItem.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-300 hover:border-brand-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {merchItem.colors && merchItem.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farge
                </label>
                <div className="flex flex-wrap gap-2">
                  {merchItem.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-300 hover:border-brand-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Antall
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={merchItem.status === 'out_of_stock'}
              className="w-full bg-[#FF4D00] text-white py-4 px-6 rounded-lg hover:bg-[#e64400] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
            >
              <ShoppingCart size={24} />
              <span>Legg i handlekurv</span>
            </button>

            {merchItem.status === 'out_of_stock' && (
              <p className="mt-4 text-center text-red-600 font-medium">
                Dette produktet er utsolgt
              </p>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

