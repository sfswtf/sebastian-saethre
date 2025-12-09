import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { LocalStorageService } from '../lib/localStorage';

export interface OnboardingFormData {
  type: 'personal' | 'professional';
  goals: string[];
  current_usage: string;
  current_usage_options: string[];
  pain_points: string;
  pain_points_options: string[];
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  industry?: string;
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
            p_current_usage_options: data.current_usage_options || [],
            p_pain_points: data.pain_points,
            p_pain_points_options: data.pain_points_options || [],
            p_name: data.name,
            p_email: data.email,
            p_consent: data.consent,
            p_phone: data.phone || null,
            p_company_name: data.company_name || null,
            p_industry: data.industry || null,
          });

        if (!functionError && functionResult) {
          console.log('Onboarding form submitted via RPC function:', functionResult);
          toast.success('Takk for din interesse! Vi tar kontakt snart.');
          return;
        }
      } catch {
        console.log('RPC function not available, using direct insert');
      }

      // Try Supabase direct insert
      console.log('Attempting to insert onboarding response:', {
        type: data.type,
        name: data.name,
        email: data.email,
        hasGoals: data.goals.length > 0,
        hasCurrentUsageOptions: (data.current_usage_options || []).length > 0,
      });

      const { data: result, error } = await supabase
        .from('onboarding_responses')
        .insert([
          {
            type: data.type,
            goals: data.goals,
            current_usage: data.current_usage,
            current_usage_options: data.current_usage_options || [],
            pain_points: data.pain_points,
            pain_points_options: data.pain_points_options || [],
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company_name: data.company_name || null,
            industry: data.industry || null,
            consent: data.consent,
          },
        ])
        .select();

      if (error) {
        console.error('❌ Supabase insert failed:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        // Show error to user
        toast.error(`Kunne ikke lagre: ${error.message}`);
        
        // Fallback to localStorage
        try {
          LocalStorageService.add('onboarding_responses', {
            ...data,
            created_at: new Date().toISOString(),
          });
          toast.success('Lagret lokalt (Supabase feilet)');
          // Still throw error so form knows submission had issues
          throw new Error(`Supabase failed: ${error.message}. Saved locally.`);
        } catch {
          throw new Error(`Failed to save: ${error.message}`);
        }
      }

      console.log('✅ Onboarding form submitted successfully to Supabase:', result);
      console.log('Inserted row ID:', result?.[0]?.id);
      // Don't show toast here - let the modal handle the success message
    } catch (error) {
      console.error('Error submitting onboarding form:', error);
      
      // Fallback to localStorage
      try {
        LocalStorageService.add('onboarding_responses', {
          ...data,
          created_at: new Date().toISOString(),
        });
        toast.success('Takk for din interesse! (Lagret lokalt)');
        // Don't throw - allow form to show success modal even if Supabase failed
        // The form will show the modal and user can still proceed
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        toast.error('Beklager, noe gikk galt. Vennligst prøv igjen senere.');
        throw new Error('Failed to save form data');
      }
    }
  },
}));
