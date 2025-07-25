import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = ({ 
  children, 
  roles = [], 
  gardenId = null,
  gardenRoles = [],
  fallback = null 
}) => {
  const { isAuthenticated, user, loading, getUserRoleInGarden, isGardenAdmin, canManageGarden } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check global roles if specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check garden-specific roles if specified
  if (gardenId && gardenRoles.length > 0) {
    const userGardenRole = getUserRoleInGarden(gardenId);
    
    // Special role checks
    if (gardenRoles.includes('admin') && !isGardenAdmin(gardenId)) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges for this garden.</p>
          </div>
        </div>
      );
    }

    if (gardenRoles.includes('manager') && !canManageGarden(gardenId)) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You need management privileges for this garden.</p>
          </div>
        </div>
      );
    }

    // Regular role check
    if (!gardenRoles.includes(userGardenRole)) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have the required role in this garden.</p>
          </div>
        </div>
      );
    }
  }

  // All checks passed - render the protected component
  return children;
};

export default ProtectedRoute;
