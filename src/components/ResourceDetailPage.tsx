import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';

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

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguageStore();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching resource with ID:', id);
        
        // Try Supabase first
        const { data, error } = await supabase
          .from('tools_resources')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (data) {
          console.log('Found resource in Supabase:', data);
          setResource(data as Resource);
        } else {
          console.log('No data from Supabase, trying localStorage');
          // Fallback to localStorage
          const allResources = LocalStorageService.get<Resource>('tools_resources');
          const foundResource = allResources.find(r => r.id === id);
          if (foundResource) {
            console.log('Found resource in localStorage:', foundResource);
            setResource(foundResource);
          } else {
            console.log('Resource not found in localStorage either');
            setResource(null);
          }
        }
      } catch (error: any) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        
        // Fallback to localStorage
        try {
          const allResources = LocalStorageService.get<Resource>('tools_resources');
          const foundResource = allResources.find(r => r.id === id);
          if (foundResource) {
            console.log('Found resource in localStorage fallback:', foundResource);
            setResource(foundResource);
          } else {
            console.log('Resource not found anywhere');
            setResource(null);
          }
        } catch (localError) {
          console.error('Error fetching resource:', localError);
          setResource(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <AnimatedSection>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (!resource) {
    return (
      <AnimatedSection>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-neutral-900">{t('resources.notFound')}</h1>
            <p className="text-neutral-600 mb-8">{t('resources.notFoundDesc')}</p>
            <Link to="/resources">
              <button className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">
                {t('resources.backToResources')}
              </button>
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
          to="/resources"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t('resources.backToResources')}</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                  {resource.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < resource.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                      />
                    ))}
                    <span className="ml-2 text-lg text-neutral-600 font-medium">{resource.rating}/5</span>
                  </div>
                  {resource.worth_it && (
                    <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded font-semibold">
                      {t('resources.worthIt')}
                    </span>
                  )}
                </div>
                <span className="inline-block text-sm font-semibold text-brand-600 uppercase bg-brand-50 px-3 py-1 rounded">
                  {resource.category}
                </span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mt-8">
              <div 
                className="text-neutral-700 leading-relaxed article-content"
                dangerouslySetInnerHTML={{ __html: resource.description }}
              />
            </div>

            {resource.affiliate_url && (
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <a
                  href={resource.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors font-semibold"
                >
                  {t('resources.visit')} {resource.name}
                  <ExternalLink size={18} />
                </a>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-neutral-200">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold"
              >
                {t('resources.needHelp')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

