import React, { useState, useEffect } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const categories = Array.from(new Set(resources.map(r => r.category)));
  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

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

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {t('resources.all')}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        {filteredResources.length === 0 ? (
          <AnimatedCard className="p-12 text-center">
            <p className="text-neutral-500 text-lg">
              {t('resources.comingSoon')}
            </p>
          </AnimatedCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <AnimatedCard key={resource.id} className="p-6 hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-neutral-900 flex-1">{resource.name}</h3>
                  {resource.worth_it && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold whitespace-nowrap ml-2">
                      {t('resources.worthIt')}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < resource.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}
                    />
                  ))}
                  <span className="ml-2 text-sm text-neutral-600 font-medium">{resource.rating}/5</span>
                </div>
                <p className="text-neutral-600 mb-4 line-clamp-3 flex-grow">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-auto">
                  <span className="text-xs font-semibold text-brand-600 uppercase">{resource.category}</span>
                  {resource.affiliate_url && (
                    <a
                      href={resource.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors font-semibold text-sm"
                    >
                      {t('resources.visit')}
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

