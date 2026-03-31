import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { ShoppingCart, ArrowRight } from 'lucide-react';
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

export function MerchPage() {
  const { t, language } = useLanguageStore();
  const { addItem } = useCartStore();
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchMerch();
  }, []);

  const fetchMerch = async () => {
    try {
      const { data, error } = await supabase
        .from('merch')
        .select('*')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Normalize data to ensure arrays are initialized
        const normalized = data.map((item: any) => ({
          ...item,
          image_urls: Array.isArray(item.image_urls) ? item.image_urls : (item.image_url ? [item.image_url] : []),
          sizes: Array.isArray(item.sizes) ? item.sizes : [],
          colors: Array.isArray(item.colors) ? item.colors : [],
        }));
        setMerchItems(normalized as MerchItem[]);
      } else {
        const localData = LocalStorageService.get<MerchItem>('merch');
        const published = localData.filter(m => m.status === 'published');
        // Normalize data to ensure arrays are initialized
        const normalized = published.map((item: any) => ({
          ...item,
          image_urls: Array.isArray(item.image_urls) ? item.image_urls : (item.image_url ? [item.image_url] : []),
          sizes: Array.isArray(item.sizes) ? item.sizes : [],
          colors: Array.isArray(item.colors) ? item.colors : [],
        }));
        const sorted = normalized.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.display_order - b.display_order || a.name.localeCompare(b.name);
        });
        setMerchItems(sorted);
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const localData = LocalStorageService.get<MerchItem>('merch');
        const published = localData.filter(m => m.status === 'published');
        // Normalize data to ensure arrays are initialized
        const normalized = published.map((item: any) => ({
          ...item,
          image_urls: Array.isArray(item.image_urls) ? item.image_urls : (item.image_url ? [item.image_url] : []),
          sizes: Array.isArray(item.sizes) ? item.sizes : [],
          colors: Array.isArray(item.colors) ? item.colors : [],
        }));
        setMerchItems(normalized);
      } catch (localError) {
        console.error('Error fetching merch:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-neutral-200 h-96 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (merchItems.length === 0) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">{t('merch.title')}</h1>
          <p className="text-neutral-600 text-center">{t('merch.comingSoon')}</p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('merch.title')}</h1>
        <p className="text-lg text-neutral-600 mb-12 text-center">{t('merch.description')}</p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {merchItems.map((item) => (
            <AnimatedCard key={item.id} className="h-full flex flex-col group">
              <Link to={`/merch/${item.id}`} className="flex-grow flex flex-col">
                {(item.image_urls && Array.isArray(item.image_urls) && item.image_urls.length > 0) ? (
                  <div className="w-full h-64 bg-neutral-200 rounded-t-lg overflow-hidden mb-4">
                    <img
                      src={item.image_urls[0]}
                      alt={getLocalizedContent(item).name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-neutral-200 rounded-t-lg overflow-hidden mb-4 flex items-center justify-center">
                    <span className="text-neutral-400">Ingen bilde</span>
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {getLocalizedContent(item).name}
                  </h2>
                  {getLocalizedContent(item).description && (
                    <div 
                      className="text-neutral-600 mb-4 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: getLocalizedContent(item).description }}
                    />
                  )}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-brand-600">
                        {item.price} {item.currency}
                      </span>
                      {item.status === 'out_of_stock' && (
                        <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded">
                          {t('merch.outOfStock')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-brand-600 font-medium flex items-center gap-1">
                        Les mer
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="px-6 pb-6">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item.status === 'out_of_stock') {
                      toast.error('Dette produktet er utsolgt');
                      return;
                    }
                    addItem({
                      merch_id: item.id || '',
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image_url: item.image_urls?.[0],
                    });
                    toast.success(`${getLocalizedContent(item).name} lagt til i handlekurven`, {
                      duration: 3000,
                      position: 'bottom-right',
                      style: {
                        background: '#10b981',
                        color: 'white',
                      },
                    });
                  }}
                  className="w-full bg-[#FF4D00] text-white py-3 px-6 rounded-lg hover:bg-[#e64400] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  disabled={item.status === 'out_of_stock'}
                >
                  <ShoppingCart size={20} />
                  <span>Legg i handlekurv</span>
                </button>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

