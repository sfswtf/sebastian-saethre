import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore, OnboardingFormData } from '../stores/onboardingStore';
import { useLanguageStore } from '../stores/languageStore';
import { AnimatedButton } from './animations/AnimatedButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function OnboardingForm() {
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const { submitOnboardingForm } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingFormData>({
    type: 'personal',
    goals: [],
    current_usage: '',
    pain_points: '',
    name: '',
    email: '',
    phone: '',
    consent: false,
  });
  const [currentUsageOptions, setCurrentUsageOptions] = useState<string[]>([]);
  const [painPointsOptions, setPainPointsOptions] = useState<string[]>([]);

  const personalGoals = t('onboarding.step2.personal.goals').split(',').map(g => g.trim());
  const professionalGoals = t('onboarding.step2.professional.goals').split(',').map(g => g.trim());
  const currentUsageOptionsList = t('onboarding.step3.options').split(',').map(o => o.trim());
  const painPointsOptionsList = t('onboarding.step4.options').split(',').map(o => o.trim());

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalToggle = (goal: string) => {
    const goals = formData.goals.includes(goal)
      ? formData.goals.filter(g => g !== goal)
      : [...formData.goals, goal];
    setFormData({ ...formData, goals });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 5) {
      setIsSubmitting(true);
      try {
        await submitOnboardingForm(formData);
        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/onboarding/thanks');
        }, 500);
      } catch (error) {
        setIsSubmitting(false);
      }
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.type !== '';
      case 2:
        return formData.goals.length > 0;
      case 3:
        return currentUsageOptions.length > 0 || formData.current_usage.trim() !== '';
      case 4:
        return painPointsOptions.length > 0 || formData.pain_points.trim() !== '';
      case 5:
        return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.consent;
      default:
        return false;
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('onboarding.step')} {currentStep} {t('common.of')} 5
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 5) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t('onboarding.title')}
        </h2>

        <AnimatePresence mode="wait">
          {/* Step 1: Type Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('onboarding.step1.title')}
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="personal"
                    checked={formData.type === 'personal'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'personal' | 'professional' })}
                    className="mr-3 w-5 h-5 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-lg text-gray-700">{t('onboarding.step1.personal')}</span>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                  <input
                    type="radio"
                    name="type"
                    value="professional"
                    checked={formData.type === 'professional'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'personal' | 'professional' })}
                    className="mr-3 w-5 h-5 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-lg text-gray-700">{t('onboarding.step1.professional')}</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Step 2: Goals */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('onboarding.step2.title')}
              </h3>
              <div className="space-y-2">
                {(formData.type === 'personal' ? personalGoals : professionalGoals).map((goal) => (
                  <label
                    key={goal}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                      className="mr-3 w-4 h-4 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Current Usage */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('onboarding.step3.title')}
              </h3>
              <div className="space-y-2 mb-4">
                {currentUsageOptionsList.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={currentUsageOptions.includes(option)}
                      onChange={() => {
                        const updated = currentUsageOptions.includes(option)
                          ? currentUsageOptions.filter(o => o !== option)
                          : [...currentUsageOptions, option];
                        setCurrentUsageOptions(updated);
                        // Only update if textarea is empty, otherwise keep user's text
                        if (!formData.current_usage.trim()) {
                          setFormData({ ...formData, current_usage: updated.join(', ') });
                        }
                      }}
                      className="mr-3 w-4 h-4 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.step3.elaborate')}
                </label>
                <textarea
                  value={formData.current_usage}
                  onChange={(e) => setFormData({ ...formData, current_usage: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                  rows={4}
                  placeholder={t('onboarding.step3.placeholder')}
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Pain Points */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('onboarding.step4.title')}
              </h3>
              <div className="space-y-2 mb-4">
                {painPointsOptionsList.map((option) => (
                  <label
                    key={option}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={painPointsOptions.includes(option)}
                      onChange={() => {
                        const updated = painPointsOptions.includes(option)
                          ? painPointsOptions.filter(o => o !== option)
                          : [...painPointsOptions, option];
                        setPainPointsOptions(updated);
                        // Only update if textarea is empty, otherwise keep user's text
                        if (!formData.pain_points.trim()) {
                          setFormData({ ...formData, pain_points: updated.join(', ') });
                        }
                      }}
                      className="mr-3 w-4 h-4 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.step4.elaborate')}
                </label>
                <textarea
                  value={formData.pain_points}
                  onChange={(e) => setFormData({ ...formData, pain_points: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                  rows={4}
                  placeholder={t('onboarding.step4.placeholder')}
                />
              </div>
            </motion.div>
          )}

          {/* Step 5: Contact Info */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('onboarding.step5.title')}
              </h3>
              <div>
                <label className="block text-gray-700 mb-2 text-left">
                  {t('common.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-left">
                  {t('common.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-left">
                  {t('common.phone')} ({t('common.optional')})
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 mr-3 w-4 h-4 text-brand-600 focus:ring-brand-500"
                  required
                />
                <label className="text-sm text-gray-700">
                  {t('onboarding.consent')} *
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft size={20} />
            {t('common.previous')}
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('common.next')}
              <ChevronRight size={20} />
            </button>
          ) : (
            <AnimatedButton
              variant="primary"
              type="submit"
              disabled={!isStepValid() || isSubmitting}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                isStepValid() && !isSubmitting
                  ? 'bg-brand-600 text-white hover:bg-brand-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{t('onboarding.sending')}</span>
                </>
              ) : (
                t('common.submit')
              )}
            </AnimatedButton>
          )}
        </div>
      </div>
    </form>
  );
}

