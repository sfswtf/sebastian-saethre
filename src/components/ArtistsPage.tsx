import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Music, ExternalLink } from 'lucide-react';

interface Artist {
  id?: string;
  name: string; // Legacy
  name_nb?: string;
  name_en?: string;
  bio?: string; // Legacy
  bio_nb?: string;
  bio_en?: string;
  image_url?: string;
  spotify_url?: string;
  website_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  other_links?: Array<{ label: string; url: string }>;
  status: 'draft' | 'published';
  featured: boolean;
  display_order: number;
  created_at?: string;
}

export function ArtistsPage() {
  const { t, language } = useLanguageStore();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get localized content
  const getLocalizedContent = (artist: Artist) => {
    const name = language === 'en' 
      ? (artist.name_en || artist.name_nb || artist.name || '')
      : (artist.name_nb || artist.name || '');
    const bio = language === 'en'
      ? (artist.bio_en || artist.bio_nb || artist.bio || '')
      : (artist.bio_nb || artist.bio || '');
    return { name, bio };
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setArtists(data as Artist[]);
      } else {
        // Fallback to localStorage
        const allArtists = LocalStorageService.get<Artist>('artists');
        const published = allArtists.filter(a => a.status === 'published');
        const sorted = published.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.display_order - b.display_order || a.name.localeCompare(b.name);
        });
        setArtists(sorted);
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const allArtists = LocalStorageService.get<Artist>('artists');
        const published = allArtists.filter(a => a.status === 'published');
        const sorted = published.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.display_order - b.display_order || a.name.localeCompare(b.name);
        });
        setArtists(sorted);
      } catch (localError) {
        console.error('Error fetching artists:', localError);
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
            <div key={index} className="animate-pulse bg-neutral-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">{t('artists.title')}</h1>
          <p className="text-neutral-600 text-center">{t('artists.comingSoon')}</p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('artists.title')}</h1>
        <p className="text-lg text-neutral-600 mb-12 text-center">{t('artists.description')}</p>
        
        <div className="grid gap-8 md:grid-cols-2">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artists/${artist.id}`}
              className="group"
            >
              <AnimatedCard className="h-full transition-transform hover:scale-105">
                {artist.image_url && (
                  <div className="w-full h-96 bg-neutral-200 rounded-t-lg overflow-hidden mb-6">
                    <img
                      src={artist.image_url}
                      alt={getLocalizedContent(artist).name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Music className="text-brand-600" size={24} />
                    <h2 className="text-3xl font-bold text-neutral-900">{getLocalizedContent(artist).name}</h2>
                    {artist.featured && (
                      <span className="ml-auto px-3 py-1 text-sm font-semibold bg-brand-100 text-brand-700 rounded">
                        {t('artists.featured')}
                      </span>
                    )}
                  </div>
                  {getLocalizedContent(artist).bio && (
                    <div 
                      className="text-neutral-600 line-clamp-4 mb-4 text-lg"
                      dangerouslySetInnerHTML={{ 
                        __html: (() => {
                          const bio = getLocalizedContent(artist).bio;
                          const plainText = bio.replace(/<[^>]*>/g, '');
                          return plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText;
                        })()
                      }}
                    />
                  )}
                </div>
              </AnimatedCard>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

