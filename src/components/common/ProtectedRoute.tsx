import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

// Mock authentication - in real app this would connect to your auth system
const useAuth = () => {
  // For demo purposes, assume user is always authenticated
  return {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin'
    }
  };
};

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};