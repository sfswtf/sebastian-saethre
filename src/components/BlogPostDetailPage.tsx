import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedButton } from './animations/AnimatedButton';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { ExternalLink, ArrowLeft, Calendar, Tag } from 'lucide-react';

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

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;

        if (data) {
          setPost(data as BlogPost);
          
          // Get related posts (simplified - by category first)
          const { data: relatedData } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .neq('id', data.id)
            .eq('category', data.category)
            .limit(3);

          if (relatedData) {
            setRelatedPosts(relatedData as BlogPost[]);
          }
        } else {
          // Fallback to localStorage
          const allPosts = LocalStorageService.get<BlogPost>('blog_posts');
          const foundPost = allPosts.find(p => p.slug === slug && p.status === 'published');
          
          if (foundPost) {
            setPost(foundPost);
            
            // Get related posts (same category or tags, excluding current)
            const related = allPosts
              .filter(p => 
                p.id !== foundPost.id && 
                p.status === 'published' &&
                (p.category === foundPost.category || 
                 p.tags.some(tag => foundPost.tags.includes(tag)))
              )
              .slice(0, 3);
            setRelatedPosts(related);
          }
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allPosts = LocalStorageService.get<BlogPost>('blog_posts');
          const foundPost = allPosts.find(p => p.slug === slug && p.status === 'published');
          
          if (foundPost) {
            setPost(foundPost);
            
            // Get related posts (same category or tags, excluding current)
            const related = allPosts
              .filter(p => 
                p.id !== foundPost.id && 
                p.status === 'published' &&
                (p.category === foundPost.category || 
                 p.tags.some(tag => foundPost.tags.includes(tag)))
              )
              .slice(0, 3);
            setRelatedPosts(related);
          }
        } catch (localError) {
          console.error('Error fetching blog post:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Simple markdown to HTML converter (basic support)
  // Also handles HTML from RichTextEditor (Quill)
  const renderMarkdown = (markdown: string): string => {
    if (!markdown) return '';
    
    // If content is already HTML (from RichTextEditor), return as-is
    // Check if it contains HTML tags
    if (markdown.includes('<p>') || markdown.includes('<div>') || markdown.includes('<h1>') || markdown.includes('<h2>') || markdown.includes('<h3>')) {
      return markdown;
    }
    
    let html = markdown;
    
    // Code blocks first (before other processing)
    html = html.replace(/```([\s\S]*?)```/gim, (match, code) => {
      return `<pre class="bg-neutral-100 p-4 rounded-lg overflow-x-auto my-4 border border-neutral-200"><code class="text-sm font-mono">${code.trim()}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-neutral-100 px-2 py-1 rounded text-sm font-mono text-brand-700">$1</code>');
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4 text-neutral-900">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-6 text-neutral-900">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-8 text-neutral-900">$1</h1>');
    
    // Bold and italic (bold first to avoid conflicts)
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-neutral-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-brand-600 hover:text-brand-700 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Lists - process line by line
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const listMatch = line.match(/^[\*\-\+] (.+)$/);
      
      if (listMatch) {
        if (!inList) {
          processedLines.push('<ul class="list-disc my-4 space-y-2 ml-6">');
          inList = true;
        }
        processedLines.push(`<li class="mb-2 text-neutral-700">${listMatch[1]}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    if (inList) {
      processedLines.push('</ul>');
    }
    
    html = processedLines.join('\n');
    
    // Paragraphs - split by double newlines and wrap non-HTML content
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(para => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      // Don't wrap if it's already HTML (starts with <)
      if (trimmed.startsWith('<')) return trimmed;
      // Don't wrap if it's a list
      if (trimmed.startsWith('<ul') || trimmed.startsWith('<li')) return trimmed;
      return `<p class="mb-3 text-neutral-700 leading-relaxed text-lg">${trimmed}</p>`;
    }).filter(p => p).join('\n');
    
    return html;
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

  if (!post) {
    return (
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-neutral-900">{t('blog.articleNotFound')}</h1>
            <p className="text-neutral-600 mb-8">{t('blog.articleNotFoundDesc')}</p>
            <Link to="/blog">
              <AnimatedButton variant="primary" className="bg-brand-600 text-white hover:bg-brand-700">
                {t('blog.backToNews')}
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t('blog.backToNews')}</span>
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 uppercase">
              {post.category}
            </span>
            {post.published_at && (
              <span className="inline-flex items-center gap-1 text-sm text-neutral-500">
                <Calendar size={16} />
                {new Date(post.published_at).toLocaleDateString('no-NO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-xs bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-10">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12 article-content"
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.75rem',
            color: '#374151'
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Affiliate Links Section */}
        {post.affiliate_links && post.affiliate_links.length > 0 && (
          <div className="my-12 p-6 bg-brand-50 rounded-lg border border-brand-200">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">{t('blog.relatedLinks')}</h3>
            <div className="flex flex-wrap gap-3">
              {post.affiliate_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-brand-700 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors border border-brand-200"
                >
                  <span className="font-medium">{link.text}</span>
                  {link.isAffiliate && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">
                      {t('blog.affiliate')}
                    </span>
                  )}
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="my-12 p-8 bg-brand-50 rounded-lg border-2 border-brand-200 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-3">
            {t('blog.helpApply')}
          </h3>
          <p className="text-neutral-600 mb-6">
            {t('blog.helpApplyDesc')}
          </p>
          <Link to="/onboarding">
            <AnimatedButton
              variant="primary"
              className="bg-brand-600 text-white hover:bg-brand-700"
            >
              {t('home.cta.onboarding')}
            </AnimatedButton>
          </Link>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">{t('blog.relatedArticles')}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-brand-300 hover:shadow-md transition-all"
                >
                  {relatedPost.featured_image && (
                    <img 
                      src={relatedPost.featured_image} 
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {relatedPost.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to News Button */}
        <div className="mt-12 text-center">
          <Link to="/blog">
            <AnimatedButton
              variant="outline"
              className="border-2 border-brand-600 text-brand-600 hover:bg-brand-50"
            >
              {t('blog.viewAllNews')}
            </AnimatedButton>
          </Link>
        </div>
      </article>
    </AnimatedSection>
  );
}

