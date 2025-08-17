import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface PrivateRouteProps {
  children?: React.ReactElement;
  element?: React.ReactElement;
  requireProvider?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  element,
  requireProvider = false 
}) => {
  const { isAuthenticated, isProvider, loading } = useAuth();
  const location = useLocation();
  
  const content = children ?? element ?? null;
  
  // Show loading state while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If provider role is required but user is not a provider
  if (requireProvider && !isProvider) {
    return <Navigate to="/get-started" state={{ from: location }} replace />;
  }
  
  return content;
};

export default PrivateRoute; 