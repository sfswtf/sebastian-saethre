import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

export function DigitalProductsPage() {
  const { t } = useLanguageStore();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('digital_products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data as DigitalProduct[]);
        } else {
          // Fallback to localStorage
          const allProducts = LocalStorageService.get<DigitalProduct>('digital_products');
          setProducts(allProducts);
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allProducts = LocalStorageService.get<DigitalProduct>('digital_products');
          setProducts(allProducts);
        } catch (localError) {
          console.error('Error fetching products:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: DigitalProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.id) {
      toast.error('Produkt mangler ID');
      return;
    }

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      product_type: product.product_type,
      delivery_method: product.delivery_method,
      image_url: product.image_url,
    });

    toast.success(`${product.name} lagt til i handlekurven!`);
  };

  if (loading) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <AnimatedText text="Digitale Produkter" className="text-4xl font-bold mb-4 text-neutral-900" />
          <AnimatedText 
            text="Utforsk våre digitale produkter og tjenester"
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
            delay={0.2}
          />
        </div>
        
        {products.length === 0 ? (
          <AnimatedCard className="p-12 text-center">
            <p className="text-neutral-500 text-lg">
              Ingen produkter tilgjengelig for øyeblikket.
            </p>
          </AnimatedCard>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="block">
                <AnimatedCard className="p-8 hover:shadow-xl transition-all hover:scale-[1.01] flex flex-col h-full cursor-pointer group">
                  {product.image_url && (
                    <div className="mb-4 -mx-8 -mt-8">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-neutral-900 flex-1 group-hover:text-brand-600 transition-colors">{product.name}</h3>
                  </div>
                  {product.rating && (
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < product.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                        />
                      ))}
                    </div>
                  )}
                  <div 
                    className="text-neutral-600 mb-6 line-clamp-4 flex-grow prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-auto">
                    <div>
                      <span className="text-2xl font-bold text-brand-600">{product.price} NOK</span>
                      {product.product_type && (
                        <p className="text-xs text-neutral-500 mt-1">{product.product_type}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={product.id ? `/products/${product.id}` : '#'}
                        className="px-4 py-2 text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        Detaljer
                      </Link>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="px-4 py-2 text-sm font-semibold bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        Legg til
                      </button>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}


