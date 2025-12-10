import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';
import { AnimatedButton } from './animations/AnimatedButton';

interface OnboardingThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewResources: () => void;
  titleOverride?: string;
  messageOverride?: string;
  primaryLabelOverride?: string;
}

export function OnboardingThankYouModal({
  isOpen,
  onClose,
  onViewResources,
  titleOverride,
  messageOverride,
  primaryLabelOverride,
}: OnboardingThankYouModalProps) {
  const { t } = useLanguageStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 md:p-8 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="text-brand-600" size={64} />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {titleOverride || t('onboarding.modal.title')}
                </h2>
                
                <p className="text-lg text-gray-700 mb-6">
                  {messageOverride || t('onboarding.modal.message')}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <AnimatedButton
                    variant="primary"
                    onClick={onViewResources}
                    className="px-6 py-3 rounded-lg font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                  >
                    {primaryLabelOverride || t('onboarding.modal.viewResources')}
                  </AnimatedButton>
                  
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    {t('common.close')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
