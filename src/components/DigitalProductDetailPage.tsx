import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../stores/cartStore';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
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

export function DigitalProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguageStore();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('digital_products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setProduct(data as DigitalProduct);
        } else {
          // Fallback to localStorage
          const allProducts = LocalStorageService.get<DigitalProduct>('digital_products');
          const foundProduct = allProducts.find(p => p.id === id);
          setProduct(foundProduct || null);
        }
      } catch (error: any) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allProducts = LocalStorageService.get<DigitalProduct>('digital_products');
          const foundProduct = allProducts.find(p => p.id === id);
          setProduct(foundProduct || null);
        } catch (localError) {
          console.error('Error fetching product:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.id) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (!product) {
    return (
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Produkt ikke funnet</h1>
            <p className="text-neutral-600 mb-6">Produktet du leter etter eksisterer ikke.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Tilbake til produkter</span>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Tilbake til produkter</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {product.image_url && (
            <div className="w-full h-96 bg-neutral-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>
                {product.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < product.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                      />
                    ))}
                    <span className="ml-2 text-base text-neutral-600 font-semibold">{product.rating}/5</span>
                  </div>
                )}
              </div>
              <div className="text-right ml-6">
                <div className="text-4xl font-bold text-brand-600 mb-2">{product.price} NOK</div>
                {product.product_type && (
                  <p className="text-sm text-neutral-500">{product.product_type}</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div 
                className="prose prose-lg max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8 p-4 bg-neutral-50 rounded-lg">
              {product.product_type && (
                <div>
                  <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Produkttype</p>
                  <p className="text-base text-neutral-900">{product.product_type}</p>
                </div>
              )}
              {product.delivery_method && (
                <div>
                  <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Leveringsmetode</p>
                  <p className="text-base text-neutral-900">{product.delivery_method}</p>
                </div>
              )}
              {product.category && (
                <div>
                  <p className="text-sm font-semibold text-neutral-500 uppercase mb-1">Kategori</p>
                  <p className="text-base text-neutral-900">{product.category}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 text-black py-4 px-6 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 font-semibold text-lg"
            >
              <ShoppingCart size={24} />
              <span>Legg til i handlekurv</span>
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}




