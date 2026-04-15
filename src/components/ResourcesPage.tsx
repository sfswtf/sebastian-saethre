import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Star, ExternalLink } from 'lucide-react';

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

export function ResourcesPage() {
  const { t } = useLanguageStore();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('tools_resources')
          .select('*')
          .order('rating', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setResources(data as Resource[]);
        } else {
          // Fallback to localStorage
          const allResources = LocalStorageService.get<Resource>('tools_resources');
          const sorted = allResources.sort((a, b) => b.rating - a.rating);
          setResources(sorted);
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allResources = LocalStorageService.get<Resource>('tools_resources');
          const sorted = allResources.sort((a, b) => b.rating - a.rating);
          setResources(sorted);
        } catch (localError) {
          console.error('Error fetching resources:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Removed category filtering - show all resources
  const filteredResources = resources;

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
          <AnimatedText text={t('resources.title')} className="text-4xl font-bold mb-4 text-neutral-900" />
          <AnimatedText 
            text={t('resources.description')}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
            delay={0.2}
          />
        </div>
        
        {filteredResources.length === 0 ? (
          <AnimatedCard className="p-12 text-center">
            <p className="text-neutral-500 text-lg">
              {t('resources.comingSoon')}
            </p>
          </AnimatedCard>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {filteredResources.map((resource) => (
              <Link
                key={resource.id}
                to={resource.id ? `/resources/${resource.id}` : '#'}
                className="block"
              >
                <AnimatedCard className="p-8 hover:shadow-xl transition-all hover:scale-[1.01] flex flex-col h-full cursor-pointer group" withGlow={true}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-neutral-900 flex-1 group-hover:text-brand-600 transition-colors">{resource.name}</h3>
                    {resource.worth_it && (
                      <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap ml-3">
                        {t('resources.worthIt')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < resource.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                      />
                    ))}
                    <span className="ml-2 text-base text-neutral-600 font-semibold">{resource.rating}/5</span>
                  </div>
                  <div 
                    className="text-neutral-600 mb-6 line-clamp-4 flex-grow prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: resource.description.replace(/\n/g, '<br />') }}
                  />
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-auto">
                    <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">{resource.category}</span>
                    <span className="inline-flex items-center gap-2 text-brand-600 group-hover:text-brand-700 font-semibold text-base">
                      {t('resources.readMore')} →
                    </span>
                  </div>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

