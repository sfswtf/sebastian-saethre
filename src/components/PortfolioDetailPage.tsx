import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ExternalLink, Github, Tag } from 'lucide-react';

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
  long_description?: string;
}

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguageStore();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('portfolio_projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setProject(data as PortfolioProject);
        } else {
          // Fallback to localStorage
          const allProjects = LocalStorageService.get<PortfolioProject>('portfolio_projects');
          const foundProject = allProjects.find(p => p.id === id);
          setProject(foundProject || null);
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allProjects = LocalStorageService.get<PortfolioProject>('portfolio_projects');
          const foundProject = allProjects.find(p => p.id === id);
          setProject(foundProject || null);
        } catch (localError) {
          console.error('Error fetching portfolio project:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
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

  if (!project) {
    return (
      <AnimatedSection>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-neutral-900">{t('portfolio.notFound')}</h1>
            <p className="text-neutral-600 mb-8">{t('portfolio.notFoundDesc')}</p>
            <Link to="/portfolio">
              <button className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700">
                {t('portfolio.backToPortfolio')}
              </button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/portfolio"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t('portfolio.backToPortfolio')}</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Main Image */}
          {project.image_urls && project.image_urls.length > 0 && (
            <div className="relative">
              <img 
                src={project.image_urls[selectedImageIndex]} 
                alt={project.title}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              {project.image_urls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {project.image_urls.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === selectedImageIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-brand-600 uppercase">
                {project.category}
              </span>
              {project.featured && (
                <span className="text-xs bg-brand-100 text-brand-700 px-3 py-1 rounded-full font-semibold">
                  {t('portfolio.featured')}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              {project.title}
            </h1>

            <p className="text-xl text-neutral-700 mb-8 leading-relaxed">
              {project.description}
            </p>

            {project.long_description && (
              <div className="prose prose-lg max-w-none mb-8">
                <div className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {project.long_description}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {project.tech_stack.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Tag size={20} />
                  {t('portfolio.techStack')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="bg-brand-100 text-brand-700 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-neutral-200">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors font-semibold"
                >
                  <ExternalLink size={20} />
                  {t('portfolio.viewLiveDemo')}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-neutral-800 text-white px-6 py-3 rounded-lg hover:bg-neutral-900 transition-colors font-semibold"
                >
                  <Github size={20} />
                  {t('portfolio.viewOnGitHub')}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {project.image_urls && project.image_urls.length > 1 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">{t('portfolio.projectGallery')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.image_urls.map((imageUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    idx === selectedImageIndex 
                      ? 'border-brand-600 ring-2 ring-brand-200' 
                      : 'border-neutral-200 hover:border-brand-300'
                  }`}
                >
                  <img 
                    src={imageUrl} 
                    alt={`${project.title} - Image ${idx + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

