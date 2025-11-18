import React, { useState } from 'react';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { AnimatedButton } from './animations/AnimatedButton';
import { useLanguageStore } from '../stores/languageStore';
import { Users, Mail, Gift, Twitter, Youtube, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { LocalStorageService } from '../lib/localStorage';

export function CommunityPage() {
  const { t } = useLanguageStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Try Supabase first
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email.trim().toLowerCase(),
            status: 'subscribed',
          },
        ]);

      if (error) {
        // If email already exists, that's okay - they're already subscribed
        if (error.code === '23505') {
          toast.success(t('community.alreadySubscribed'));
          setSubmitted(true);
          setEmail('');
          setTimeout(() => setSubmitted(false), 3000);
          setIsSubmitting(false);
          return;
        }
        
        console.error('Supabase insert failed:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        
        // Fallback to localStorage
        LocalStorageService.add('newsletter_subscriptions', {
          email: email.trim().toLowerCase(),
          status: 'subscribed',
          created_at: new Date().toISOString(),
        });
        toast.success(t('community.subscribedLocal'));
      } else {
        toast.success(t('community.thankYouSubscribed'));
      }

      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      // Fallback to localStorage
      try {
        LocalStorageService.add('newsletter_subscriptions', {
          email: email.trim().toLowerCase(),
          status: 'subscribed',
          created_at: new Date().toISOString(),
        });
        toast.success(t('community.subscribedLocal'));
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 3000);
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        toast.error(t('community.sorryError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const communityFeatures: Array<{
    icon: React.ComponentType<{ className?: string; size?: number }> | null;
    iconImage?: string;
    title: string;
    description: string;
    action: string;
    link: string;
    external?: boolean;
  }> = [
    {
      icon: null,
      iconImage: '/images/discord.png',
      title: t('community.discordTitle'),
      description: t('community.discordDesc'),
      action: t('community.joinDiscord'),
      link: 'https://discord.gg/8zftytYdZF',
      external: true,
    },
    {
      icon: Mail,
      title: t('community.newsletterTitle'),
      description: t('community.newsletterDesc'),
      action: t('community.subscribe'),
      link: '#',
    },
    {
      icon: Bell,
      iconImage: null,
      title: t('community.keepUpdatedTitle'),
      description: t('community.keepUpdatedDesc'),
      action: '',
      link: '#',
      customContent: true,
    },
    {
      icon: Gift,
      title: t('community.exclusiveTitle'),
      description: t('community.exclusiveDesc'),
      action: t('community.learnMore'),
      link: '/resources',
    },
  ];

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <AnimatedText text={t('community.title')} className="text-4xl font-bold mb-4 text-neutral-900" />
          <AnimatedText 
            text={t('community.description')}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
            delay={0.2}
          />
        </div>


        {/* Newsletter Signup - Integrated into Newsletter card */}
        <div className="mb-12">
          <AnimatedCard className="p-8 bg-gradient-to-r from-brand-50 to-brand-100 border-2 border-brand-200">
            <div className="max-w-2xl mx-auto text-center">
              {submitted ? (
                <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg">
                  {t('community.thankYouSubscribed')}
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('community.enterEmail')}
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50"
                  />
                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="bg-brand-600 text-white hover:bg-brand-700 px-6 disabled:opacity-50"
                  >
                    {isSubmitting ? t('community.subscribing') : t('community.subscribe')}
                  </AnimatedButton>
                </form>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Community Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
          {communityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <AnimatedCard key={index} className="p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full">
                    {feature.iconImage ? (
                      <img 
                        src={feature.iconImage} 
                        alt={feature.title}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      IconComponent && <IconComponent className="text-brand-600" size={28} />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                {feature.customContent ? (
                  <div className="flex flex-col gap-3">
                    <a 
                      href="https://twitter.com/sebastiansaethre" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold"
                    >
                      <Twitter size={20} />
                      <span>Twitter / X</span>
                      <span className="ml-auto">→</span>
                    </a>
                    <a 
                      href="https://youtube.com/@sebastiansaethre" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold"
                    >
                      <Youtube size={20} />
                      <span>YouTube</span>
                      <span className="ml-auto">→</span>
                    </a>
                  </div>
                ) : feature.external ? (
                  <a 
                    href={feature.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    {feature.action} →
                  </a>
                ) : feature.link === '#' ? (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const form = document.querySelector('form');
                      if (form) {
                        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    {feature.action} →
                  </button>
                ) : (
                  <Link to={feature.link} className="text-brand-600 hover:text-brand-700 font-semibold">
                    {feature.action} →
                  </Link>
                )}
              </AnimatedCard>
            );
          })}
        </div>

        {/* CTA Section */}
        <AnimatedCard className="p-8 bg-brand-600 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            {t('community.readyToJoin')}
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            {t('community.joinMessage')}
          </p>
          <Link to="/onboarding">
            <AnimatedButton
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-neutral-100 px-8 py-3"
            >
              {t('community.getStarted')}
            </AnimatedButton>
          </Link>
        </AnimatedCard>
      </div>
    </AnimatedSection>
  );
}

