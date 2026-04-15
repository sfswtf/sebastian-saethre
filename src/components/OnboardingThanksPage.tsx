import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedButton } from './animations/AnimatedButton';
import { useLanguageStore } from '../stores/languageStore';
import { CheckCircle } from 'lucide-react';

export function OnboardingThanksPage() {
  const { t } = useLanguageStore();

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-brand-600" size={64} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('onboarding.thanks.title')}
          </h1>
          
          <p className="text-lg text-gray-700 mb-8">
            {t('onboarding.thanks.message')}
          </p>

          <div className="mb-8 p-6 bg-brand-50 rounded-lg border border-brand-200">
            <p className="text-gray-700 mb-4">
              {t('onboarding.thanks.calendly')}
            </p>
            <a
              href="mailto:sebastian.saethre@gmail.com?subject=Schedule%20a%20Meeting&body=Hi%20Sebastian%2C%0A%0AI%27d%20like%20to%20schedule%20a%20meeting%20to%20discuss%20AI%20consulting.%0A%0AThank%20you!"
              className="text-brand-600 hover:text-brand-700 font-semibold underline"
            >
              {t('onboarding.thanks.schedule')}
            </a>
            <p className="text-sm text-gray-600 mt-2">
              Or email directly at{' '}
              <a 
                href="mailto:sebastian.saethre@gmail.com" 
                className="text-brand-600 hover:text-brand-700 underline"
              >
                sebastian.saethre@gmail.com
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog">
              <AnimatedButton
                variant="primary"
                className="w-full sm:w-auto px-8 py-3 bg-brand-600 text-white hover:bg-brand-700"
              >
                {t('onboarding.thanks.readInsights')}
              </AnimatedButton>
            </Link>
            <Link to="/">
              <AnimatedButton
                variant="outline"
                className="w-full sm:w-auto px-8 py-3 border-2 border-brand-600 text-brand-600 hover:bg-brand-50"
              >
                {t('common.backToHome')}
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

