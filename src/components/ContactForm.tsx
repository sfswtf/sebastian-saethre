import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { OnboardingThankYouModal } from './OnboardingThankYouModal';
import { useLanguageStore } from '../stores/languageStore';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting contact form:', formData);
      
      // Don't send status - let database default handle it
      // The DB might use 'unread' or enum type, so we let it default
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message
          // status will use database default
        }]);

      if (error) {
        console.error('Error submitting contact form:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }

      setFormData({ name: '', email: '', message: '' });
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Beklager, noe gikk galt. Vennligst prøv igjen senere.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <OnboardingThankYouModal
      isOpen={showThankYou}
      onClose={() => setShowThankYou(false)}
      onViewResources={() => { setShowThankYou(false); navigate('/resources'); }}
      titleOverride={t('contact.modal.title')}
      messageOverride={t('contact.modal.message')}
      primaryLabelOverride={t('contact.modal.viewResources')}
    />
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Navn *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-post *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Melding *
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1d4f4d] text-white py-3 px-4 rounded-md hover:bg-[#1d4f4d] focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Sender...' : 'Send Melding'}
        </button>
      </div>
      <Toaster position="top-center" />
    </form>
    </>
  );
}
