import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface FormState {
  submitContactForm: (data: ContactFormData) => Promise<void>;
  submitMembershipForm: (data: MembershipFormData) => Promise<void>;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface MembershipFormData {
  name: string;
  email: string;
  phone?: string;
  ageGroup: string;
  musicGenres: string[];
  motivation?: string;
}

export const useFormStore = create<FormState>((set) => ({
  submitContactForm: async (data: ContactFormData) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: data.name,
            email: data.email,
            message: data.message,
          },
        ]);

      if (error) throw error;

      toast.success('Meldingen din er sendt! Vi tar kontakt snart.');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Beklager, noe gikk galt. Vennligst prøv igjen senere.');
    }
  },

  submitMembershipForm: async (data: MembershipFormData) => {
    try {
      console.log('Submitting membership application:', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        age_group: data.ageGroup,
        music_genres: data.musicGenres,
        motivation: data.motivation
      });

      const { data: result, error } = await supabase
        .from('membership_applications')
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            age_group: data.ageGroup,
            music_genres: data.musicGenres,
            motivation: data.motivation
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Submission successful:', result);
      toast.success('Takk for din interesse! Vi behandler søknaden din snart.');
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast.error(`Beklager, noe gikk galt: ${error.message}`);
    }
  },
}));