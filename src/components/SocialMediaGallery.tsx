import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { InstagramEmbed } from 'react-social-media-embed';
import { X } from 'lucide-react';
import { GallerySkeleton } from './SkeletonLoader';

interface SocialMediaPost {
  id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'image';
  url: string;
  title: string;
  active: boolean;
  created_at: string;
}

export function SocialMediaGallery() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_posts')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const TikTokEmbed = ({ url }: { url: string }) => {
    const videoId = url.split('/').pop()?.split('?')[0];
    if (!videoId) return null;

    return (
      <div className="tiktok-embed-container">
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}?autoplay=1&mute=1`}
          style={{ width: '100%', height: '600px' }}
          allow="autoplay"
          frameBorder="0"
        ></iframe>
      </div>
    );
  };

  const YouTubeEmbed = ({ url }: { url: string }) => {
    const videoId = url.includes('youtu.be') 
      ? url.split('/').pop() 
      : url.split('v=')[1]?.split('&')[0];

    if (!videoId) return null;

    return (
      <div className="youtube-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        ></iframe>
      </div>
    );
  };

  const ImageEmbed = ({ url, title }: { url: string; title: string }) => {
    return (
      <div 
        className="relative aspect-w-4 aspect-h-3 cursor-pointer"
        onClick={() => setSelectedImage(url)}
      >
        <img
          src={url}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      </div>
    );
  };

  const InstagramEmbedWrapper = ({ url }: { url: string }) => {
    return (
      <div className="instagram-embed-container">
        <InstagramEmbed 
          url={url}
          width="100%"
          style={{
            maxWidth: '100%',
            width: '100%',
            minHeight: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fafafa',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}
        />
      </div>
    );
  };

  const socialMediaPosts = posts.filter(post => ['instagram', 'tiktok'].includes(post.platform));
  const imagePosts = posts.filter(post => post.platform === 'image');
  const videoPosts = posts.filter(post => post.platform === 'youtube');

  if (loading) {
    return <GallerySkeleton />;
  }

  return (
    <div className="space-y-12">
      {/* Social Media Content */}
      {socialMediaPosts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Sosiale Medier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialMediaPosts.map((post) => (
              <div key={post.id} className="w-full">
                {post.platform === 'instagram' && (
                  <InstagramEmbedWrapper url={post.url} />
                )}
                {post.platform === 'tiktok' && (
                  <TikTokEmbed url={post.url} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images */}
      {imagePosts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Bilder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imagePosts.map((post) => (
              <ImageEmbed key={post.id} url={post.url} title={post.title} />
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videoPosts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-6">Videoer</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {videoPosts.map((post) => (
              <div key={post.id} className="w-full">
                <YouTubeEmbed url={post.url} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-h-[90vh] mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
} 