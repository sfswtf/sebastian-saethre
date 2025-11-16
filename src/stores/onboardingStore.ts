import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { LocalStorageService } from '../lib/localStorage';

export interface OnboardingFormData {
  type: 'personal' | 'professional';
  goals: string[];
  current_usage: string;
  pain_points: string;
  name: string;
  email: string;
  phone?: string;
  consent: boolean;
}

interface OnboardingState {
  submitOnboardingForm: (data: OnboardingFormData) => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>(() => ({
  submitOnboardingForm: async (data: OnboardingFormData) => {
    try {
      // Try using RPC function first (if it exists, bypasses RLS)
      // Fallback to direct insert if function doesn't exist
      try {
        const { data: functionResult, error: functionError } = await supabase
          .rpc('insert_onboarding_response', {
            p_type: data.type,
            p_goals: data.goals,
            p_current_usage: data.current_usage,
            p_pain_points: data.pain_points,
            p_name: data.name,
            p_email: data.email,
            p_phone: data.phone || null,
            p_consent: data.consent,
          });

        if (!functionError && functionResult) {
          console.log('Onboarding form submitted via RPC function:', functionResult);
          toast.success('Takk for din interesse! Vi tar kontakt snart.');
          return;
        }
      } catch (rpcError) {
        // RPC function doesn't exist, fall through to direct insert
        console.log('RPC function not available, using direct insert');
      }

      // Try Supabase direct insert
      const { data: result, error } = await supabase
        .from('onboarding_responses')
        .insert([
          {
            type: data.type,
            goals: data.goals,
            current_usage: data.current_usage,
            pain_points: data.pain_points,
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            consent: data.consent,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase insert failed:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        
        // Show error to user
        toast.error(`Kunne ikke lagre: ${error.message}`);
        
        // Fallback to localStorage
        LocalStorageService.add('onboarding_responses', {
          ...data,
          created_at: new Date().toISOString(),
        });
        toast.success('Lagret lokalt (Supabase feilet)');
        return;
      }

      console.log('Onboarding form submitted successfully to Supabase:', result);
      toast.success('Takk for din interesse! Vi tar kontakt snart.');
    } catch (error: any) {
      console.error('Error submitting onboarding form:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      
      // Fallback to localStorage
      try {
        LocalStorageService.add('onboarding_responses', {
          ...data,
          created_at: new Date().toISOString(),
        });
        toast.success('Takk for din interesse! (Lagret lokalt)');
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        toast.error('Beklager, noe gikk galt. Vennligst prøv igjen senere.');
      }
    }
  },
}));

