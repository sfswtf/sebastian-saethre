import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MembershipForm } from './MembershipForm';
import { MembershipFormSkeleton } from './SkeletonLoader';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <img
            src="/images/logo.jpg"
            alt="Hovden Musikklubb Logo"
            className="w-64 h-64 mx-auto mb-8 rounded-full"
            style={{
              filter: 'contrast(1.1)'
            }}
          />
          <h1 className="text-3xl font-bold mb-8">Bli Medlem</h1>
        </div>
        <MembershipFormSkeleton />
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