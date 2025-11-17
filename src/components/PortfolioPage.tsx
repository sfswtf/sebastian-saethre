import React, { useState, useEffect } from 'react';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  image_urls: string[];
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  created_at?: string;
}

export function PortfolioPage() {
  const { t } = useLanguageStore();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          // Sort: featured first, then by date
          const sorted = data.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          });
          setProjects(sorted as PortfolioProject[]);
        } else {
          // Fallback to localStorage
          const allProjects = LocalStorageService.get<PortfolioProject>('portfolio_projects');
          const sorted = allProjects.sort((a, b) => {
            // Featured projects first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            // Then by date
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          });
          setProjects(sorted);
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allProjects = LocalStorageService.get<PortfolioProject>('portfolio_projects');
          const sorted = allProjects.sort((a, b) => {
            // Featured projects first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            // Then by date
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          });
          setProjects(sorted);
        } catch (localError) {
          console.error('Error fetching portfolio projects:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
          <AnimatedText text={t('portfolio.title')} className="text-4xl font-bold mb-4 text-neutral-900" />
          <AnimatedText 
            text={t('portfolio.description')}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
            delay={0.2}
          />
        </div>
        
        {projects.length === 0 ? (
          <AnimatedCard className="p-12 text-center">
            <p className="text-neutral-500 text-lg">
              {t('portfolio.comingSoon')}
            </p>
          </AnimatedCard>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={project.id ? `/portfolio/${project.id}` : '#'}
                className="block"
              >
                <AnimatedCard className="overflow-hidden hover:shadow-xl transition-all hover:scale-[1.01] flex flex-col h-full cursor-pointer group">
                  {project.image_urls && project.image_urls.length > 0 && (
                    <img 
                      src={project.image_urls[0]} 
                      alt={project.title}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-brand-600 uppercase">{project.category}</span>
                      {project.featured && (
                        <span className="text-sm bg-brand-100 text-brand-700 px-3 py-1 rounded-full">{t('portfolio.featured')}</span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral-900 group-hover:text-brand-600 transition-colors">{project.title}</h3>
                    <p className="text-neutral-600 mb-6 line-clamp-4 flex-grow">
                      {project.description}
                    </p>
                    {project.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech_stack.slice(0, 5).map((tech, idx) => (
                          <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-auto">
                      <div className="flex gap-4">
                        {project.live_url && (
                          <a 
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-brand-600 hover:text-brand-700 font-semibold text-sm"
                          >
                            {t('portfolio.liveDemo')} →
                          </a>
                        )}
                        {project.github_url && (
                          <a 
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-neutral-600 hover:text-neutral-700 font-semibold text-sm"
                          >
                            {t('portfolio.github')} →
                          </a>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-2 text-brand-600 group-hover:text-brand-700 font-semibold text-base">
                        {t('portfolio.viewDetails')} →
                      </span>
                    </div>
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

