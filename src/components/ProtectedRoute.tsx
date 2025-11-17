import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalAuthStore } from '../stores/localAuthStore';

type Props = {
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = useLocalAuthStore((state) => state.isAdmin);
  const isAuthenticated = useLocalAuthStore((state) => state.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check auth state
    const checkAuth = () => {
      if (!isAuthenticated || !isAdmin) {
        navigate('/login', { replace: true });
      } else {
        setIsChecking(false);
      }
    };

    // Small delay to ensure state is loaded from localStorage
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdmin, navigate]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
          <p className="mt-4 text-neutral-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}; 