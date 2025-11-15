import React from 'react';

type Props = {
  children: React.ReactNode;
};

// No authentication required - allow direct access for local testing
export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
}; 