import React, { useState, useEffect } from 'react';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { AnimatedButton } from './animations/AnimatedButton';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface AffiliateLink {
  text: string;
  url: string;
  isAffiliate: boolean;
}

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  featured_image: string | null;
  published_at: string | null;
  status: 'draft' | 'published';
  created_at?: string;
  affiliate_links?: AffiliateLink[];
}

export function BlogPage() {
  const { t } = useLanguageStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setPosts(data as BlogPost[]);
        } else {
          // Fallback to localStorage
          const allPosts = LocalStorageService.get<BlogPost>('blog_posts');
          const published = allPosts.filter(post => post.status === 'published');
          setPosts(published.sort((a, b) => 
            new Date(b.published_at || b.created_at || 0).getTime() - 
            new Date(a.published_at || a.created_at || 0).getTime()
          ));
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allPosts = LocalStorageService.get<BlogPost>('blog_posts');
          const published = allPosts.filter(post => post.status === 'published');
          setPosts(published.sort((a, b) => 
            new Date(b.published_at || b.created_at || 0).getTime() - 
            new Date(a.published_at || a.created_at || 0).getTime()
          ));
        } catch (localError) {
          console.error('Error fetching blog posts:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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
          <AnimatedText text={t('blog.title')} className="text-4xl font-bold mb-4 text-neutral-900" />
          <AnimatedText 
            text={t('blog.description')}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
            delay={0.2}
          />
        </div>
        
        {posts.length === 0 ? (
          <AnimatedCard className="p-12 text-center">
            <p className="text-neutral-500 text-lg">
              {t('blog.comingSoon')}
            </p>
          </AnimatedCard>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="block"
              >
                <AnimatedCard className="overflow-hidden hover:shadow-xl transition-all hover:scale-[1.01] flex flex-col h-full cursor-pointer group">
                  {post.featured_image && (
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-brand-600 uppercase">{post.category}</span>
                      {post.published_at && (
                        <span className="text-sm text-neutral-500">
                          {new Date(post.published_at).toLocaleDateString('no-NO')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral-900 group-hover:text-brand-600 transition-colors">{post.title}</h3>
                    <div 
                      className="text-neutral-600 mb-6 line-clamp-4 flex-grow prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' }}
                    />
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {post.affiliate_links && post.affiliate_links.length > 0 && (
                      <div className="mb-4 pt-4 border-t border-neutral-200">
                        <p className="text-xs font-semibold text-neutral-700 mb-2">{t('blog.relatedLinks')}:</p>
                        <div className="flex flex-wrap gap-2">
                          {post.affiliate_links.slice(0, 2).map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-3 py-1.5 rounded-md hover:bg-brand-100 transition-colors"
                            >
                              {link.text}
                              {link.isAffiliate && (
                                <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-[10px]">{t('blog.affiliate')}</span>
                              )}
                              <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-auto">
                      <Link 
                        to="/onboarding"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-neutral-500 hover:text-brand-600"
                      >
                        {t('blog.needHelp')} →
                      </Link>
                      <span className="inline-flex items-center gap-2 text-brand-600 group-hover:text-brand-700 font-semibold text-base">
                        {t('blog.readMore')} →
                      </span>
                    </div>
                  </div>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        )}
        
        {/* Bottom onboarding card removed per request */}
      </div>
    </AnimatedSection>
  );
}
