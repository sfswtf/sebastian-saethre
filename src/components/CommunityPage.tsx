import React, { useState } from 'react';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { AnimatedButton } from './animations/AnimatedButton';
import { useLanguageStore } from '../stores/languageStore';
import { Users, Mail, MessageCircle, BookOpen, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CommunityPage() {
  const { t } = useLanguageStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    console.log('Newsletter signup:', email);
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const communityFeatures = [
    {
      icon: MessageCircle,
      title: 'Discord Community',
      description: 'Join our Discord server for real-time discussions, Q&A sessions, and networking with other AI enthusiasts.',
      action: 'Join Discord',
      link: '#', // Replace with actual Discord link
    },
    {
      icon: Mail,
      title: 'Newsletter',
      description: 'Get weekly updates on AI tools, tutorials, and industry insights delivered to your inbox.',
      action: 'Subscribe',
      link: '#',
    },
    {
      icon: BookOpen,
      title: 'Free Courses',
      description: 'Access our collection of free AI courses and tutorials to level up your skills.',
      action: 'Browse Courses',
      link: '/courses',
    },
    {
      icon: Gift,
      title: 'Exclusive Resources',
      description: 'Get early access to new tools, templates, and resources before they\'re publicly available.',
      action: 'Learn More',
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

        {/* Newsletter Signup */}
        <AnimatedCard className="p-8 mb-12 bg-gradient-to-r from-brand-50 to-brand-100 border-2 border-brand-200">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Stay Updated
            </h2>
            <p className="text-neutral-700 mb-6">
              Subscribe to our newsletter for the latest AI insights, tool reviews, and exclusive content.
            </p>
            {submitted ? (
              <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg">
                Thank you for subscribing! Check your email to confirm.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  className="bg-brand-600 text-white hover:bg-brand-700 px-6"
                >
                  Subscribe
                </AnimatedButton>
              </form>
            )}
          </div>
        </AnimatedCard>

        {/* Community Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
          {communityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <AnimatedCard key={index} className="p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full">
                    <IconComponent className="text-brand-600" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                {feature.link === '#' ? (
                  <button className="text-brand-600 hover:text-brand-700 font-semibold">
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
        <AnimatedCard className="p-8 bg-brand-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join?
          </h2>
          <p className="text-brand-100 mb-6 text-lg">
            Start your AI journey today and connect with a community of like-minded individuals.
          </p>
          <Link to="/onboarding">
            <AnimatedButton
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-neutral-100 px-8 py-3"
            >
              Get Started
            </AnimatedButton>
          </Link>
        </AnimatedCard>
      </div>
    </AnimatedSection>
  );
}

