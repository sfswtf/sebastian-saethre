import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedButton } from './animations/AnimatedButton';
import { useLanguageStore } from '../stores/languageStore';
import { Brain, Zap, Users } from 'lucide-react';

export function ServicesPage() {
  const { t } = useLanguageStore();

  const services = [
    {
      icon: Brain,
      title: t('services.card1.title'),
      description: t('services.card1.description'),
      benefits: t('services.card1.benefits').split(',').map(b => b.trim()),
    },
    {
      icon: Zap,
      title: t('services.card2.title'),
      description: t('services.card2.description'),
      benefits: t('services.card2.benefits').split(',').map(b => b.trim()),
    },
    {
      icon: Users,
      title: t('services.card3.title'),
      description: t('services.card3.description'),
      benefits: t('services.card3.benefits').split(',').map(b => b.trim()),
    },
  ];

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            {t('services.title')}
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            {t('services.description')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <AnimatedCard key={index} className="p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-6">
                  <IconComponent className="text-brand-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  {service.title}
                </h2>
                <p className="text-neutral-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-700">
                      <span className="text-brand-600 mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/onboarding" className="block">
                  <AnimatedButton
                    variant="primary"
                    className="w-full bg-brand-600 text-white hover:bg-brand-700"
                  >
                    {t('services.getStarted')}
                  </AnimatedButton>
                </Link>
              </AnimatedCard>
            );
          })}
        </div>

        <div className="text-center">
          <AnimatedCard className="p-8 bg-brand-50 border-2 border-brand-200">
            <p className="text-lg text-neutral-700 mb-4">
              {t('services.cta')}
            </p>
            <Link to="/onboarding">
              <AnimatedButton
                variant="primary"
                className="bg-brand-600 text-white hover:bg-brand-700"
              >
                {t('home.cta.onboarding')}
              </AnimatedButton>
            </Link>
          </AnimatedCard>
        </div>
      </div>
    </AnimatedSection>
  );
}

