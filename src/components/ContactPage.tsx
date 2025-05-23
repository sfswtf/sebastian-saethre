import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ContactForm } from './ContactForm';
import { MapPin, Mail } from 'lucide-react';

interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  title: string | null;
  content: string;
}

export function ContactPage() {
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
          filter: 'page_id=eq.contact AND section_id=eq.info'
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
        .eq('page_id', 'contact')
        .eq('section_id', 'info')
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Error fetching contact page content:', error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">{content?.title || 'Kontakt Oss'}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Ta Kontakt</h2>
            <div className="prose prose-emerald max-w-none">
              {content?.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="space-y-4 mt-4">
              <p className="flex items-center text-gray-700">
                <MapPin className="mr-2" size={18} />
                Hovden Sentrum, 4755 Hovden, Norge
              </p>
              <p className="flex items-center text-gray-700">
                <Mail className="mr-2" size={18} />
                info@hovdenmusikklubb.no
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
} 