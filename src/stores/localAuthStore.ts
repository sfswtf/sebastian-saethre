import { create } from 'zustand';

interface LocalAuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  email: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Local admin credentials for testing
const ADMIN_EMAIL = 'sebastian.saethre@gmail.com';
const ADMIN_PASSWORD = 'Lykkeigris92';

// Load from localStorage on init
const loadAuthState = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false, isAdmin: false, email: null };
  try {
    const stored = localStorage.getItem('local-auth-storage');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load auth state:', e);
  }
  return { isAuthenticated: false, isAdmin: false, email: null };
};

const saveAuthState = (state: { isAuthenticated: boolean; isAdmin: boolean; email: string | null }) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('local-auth-storage', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  }
};

export const useLocalAuthStore = create<LocalAuthState>((set, get) => {
  const initialState = loadAuthState();
  
  return {
    ...initialState,
    login: (email: string, password: string) => {
      console.log('Login attempt:', { email, providedPassword: password, expectedEmail: ADMIN_EMAIL });
      // Simple local authentication
      const emailMatch = email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
      const passwordMatch = password === ADMIN_PASSWORD;
      
      console.log('Auth check:', { emailMatch, passwordMatch });
      
      if (emailMatch && passwordMatch) {
        const newState = {
          isAuthenticated: true,
          isAdmin: true,
          email: ADMIN_EMAIL,
        };
        console.log('Setting auth state:', newState);
        set(newState);
        saveAuthState(newState);
        
        // Verify it was saved
        const saved = localStorage.getItem('local-auth-storage');
        console.log('Saved to localStorage:', saved);
        
        // Force a re-render by triggering state update
        setTimeout(() => {
          const current = get();
          console.log('State after update:', current);
          set({ ...newState });
        }, 0);
        return true;
      }
      console.log('Login failed - credentials mismatch');
      return false;
    },
    logout: () => {
      const newState = {
        isAuthenticated: false,
        isAdmin: false,
        email: null,
      };
      set(newState);
      saveAuthState(newState);
    },
  };
});

