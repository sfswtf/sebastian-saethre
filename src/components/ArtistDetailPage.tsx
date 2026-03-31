import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Music, ExternalLink, ArrowLeft, Instagram, Facebook, Youtube, Globe } from 'lucide-react';

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
  spotify_embed_url?: string;
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

export function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguageStore();
  const [artist, setArtist] = useState<Artist | null>(null);
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
    if (id) {
      fetchArtist(id);
    }
  }, [id]);

  const fetchArtist = async (artistId: string) => {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      if (data) {
        setArtist(data as Artist);
      } else {
        // Fallback to localStorage
        const allArtists = LocalStorageService.get<Artist>('artists');
        const found = allArtists.find(a => a.id === artistId && a.status === 'published');
        if (found) {
          setArtist(found);
        }
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const allArtists = LocalStorageService.get<Artist>('artists');
        const found = allArtists.find(a => a.id === artistId && a.status === 'published');
        if (found) {
          setArtist(found);
        }
      } catch (localError) {
        console.error('Error fetching artist:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract Spotify ID from URL for embed
  const getSpotifyEmbedUrl = (url?: string, embedUrl?: string) => {
    if (embedUrl) return embedUrl;
    if (!url) return null;
    
    // Try to extract Spotify ID from various URL formats
    const patterns = [
      /spotify\.com\/artist\/([a-zA-Z0-9]+)/,
      /spotify\.com\/album\/([a-zA-Z0-9]+)/,
      /spotify\.com\/track\/([a-zA-Z0-9]+)/,
      /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const type = url.includes('/artist/') ? 'artist' : 
                     url.includes('/album/') ? 'album' : 
                     url.includes('/track/') ? 'track' : 'playlist';
        return `https://open.spotify.com/embed/${type}/${match[1]}?utm_source=generator`;
      }
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-neutral-200 rounded mb-6"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4 text-center">{t('artists.notFound')}</h1>
          <p className="text-neutral-600 mb-6 text-center">{t('artists.notFoundDesc')}</p>
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
          >
            <ArrowLeft size={20} />
            {t('artists.backToArtists')}
          </Link>
        </div>
      </AnimatedSection>
    );
  }

  const spotifyEmbedUrl = getSpotifyEmbedUrl(artist.spotify_url, artist.spotify_embed_url);

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/artists"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          {t('artists.backToArtists')}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Artist Image */}
          {artist.image_url && (
            <div className="w-full h-[600px] overflow-hidden rounded-lg shadow-lg">
              <img
                src={artist.image_url}
                alt={getLocalizedContent(artist).name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Artist Info */}
          <div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="text-brand-600" size={32} />
              <h1 className="text-4xl font-bold text-neutral-900 text-center">{getLocalizedContent(artist).name}</h1>
            </div>

            {getLocalizedContent(artist).bio && (
              <div className="prose max-w-none mb-6">
                <div 
                  className="text-lg text-neutral-700"
                  dangerouslySetInnerHTML={{ __html: getLocalizedContent(artist).bio }}
                />
              </div>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 mb-6">
              {artist.spotify_url && (
                <a
                  href={artist.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Music size={20} />
                  <span>Spotify</span>
                  <ExternalLink size={16} />
                </a>
              )}
              {artist.website_url && (
                <a
                  href={artist.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Globe size={20} />
                  <span>Website</span>
                  <ExternalLink size={16} />
                </a>
              )}
              {artist.instagram_url && (
                <a
                  href={artist.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                  <ExternalLink size={16} />
                </a>
              )}
              {artist.facebook_url && (
                <a
                  href={artist.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                  <span>Facebook</span>
                  <ExternalLink size={16} />
                </a>
              )}
              {artist.youtube_url && (
                <a
                  href={artist.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Youtube size={20} />
                  <span>YouTube</span>
                  <ExternalLink size={16} />
                </a>
              )}
              {artist.other_links && artist.other_links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  <span>{link.label}</span>
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Spotify Player */}
        {spotifyEmbedUrl && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">{t('artists.listenOnSpotify')}</h2>
            <div className="bg-neutral-900 rounded-lg p-4">
              <iframe
                src={spotifyEmbedUrl}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
            {artist.spotify_url && (
              <div className="mt-4 text-center">
                <a
                  href={artist.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
                >
                  <span>Åpne i Spotify</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

