import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state or spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return isAuthenticated
    ? element
    : <Navigate to="/login" state={{ from: location }} replace />;
}; 