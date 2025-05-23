import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  title: string | null;
  content: string;
}

export function MembershipPage() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('page_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_content',
          filter: 'page_id=eq.membership AND section_id=eq.benefits'
        },
        (payload) => {
          if (payload.new) {
            setContent(payload.new as PageContent);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_id', 'membership')
        .eq('section_id', 'benefits')
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Error fetching membership page content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Laster innhold...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{content?.title || 'Medlemskap'}</h1>
        <div className="prose prose-emerald max-w-none">
          {content?.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
} 