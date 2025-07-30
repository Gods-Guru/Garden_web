import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useGardenStore from '../../store/useGardenStore';
import AdminDashboard from './AdminDashboard';
import EnhancedManagerDashboard from './EnhancedManagerDashboard';
import GardenerDashboard from './GardenerDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import CombinedRoleDashboard from './CombinedRoleDashboard';
import EnhancedDashboardLayout from './EnhancedDashboardLayout';
import LoadingSpinner from '../common/LoadingSpinner';
import './RoleBasedDashboard.scss';

const RoleBasedDashboard = () => {
  const { user, roles, isAuthenticated } = useAuthStore();
  const { gardens, isLoading, fetchMyGardens } = useGardenStore();
  const [activeRole, setActiveRole] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyGardens();
      // Set primary role as active role
      setActiveRole(roles?.[0] || user?.role || 'gardener');
    }
  }, [isAuthenticated, user, fetchMyGardens, roles]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  // Check if user has multiple roles
  const hasMultipleRoles = roles && roles.length > 1;

  // Render appropriate dashboard based on role(s)
  const renderDashboard = () => {
    if (hasMultipleRoles) {
      return (
        <CombinedRoleDashboard
          user={user}
          roles={roles}
          activeRole={activeRole}
          onRoleSwitch={setActiveRole}
          gardens={gardens}
        />
      );
    }

    // Single role dashboard
    const currentRole = activeRole || roles?.[0] || user?.role || 'gardener';

    switch (currentRole) {
      case 'admin':
        return <AdminDashboard user={user} gardens={gardens} />;
      case 'manager':
        return <EnhancedManagerDashboard user={user} gardens={gardens} />;
      case 'volunteer':
        return <VolunteerDashboard user={user} gardens={gardens} />;
      case 'gardener':
      case 'user':
      default:
        return <GardenerDashboard user={user} gardens={gardens} />;
    }
  };

  return (
    <EnhancedDashboardLayout user={user} roles={roles} activeRole={activeRole}>
      {renderDashboard()}
    </EnhancedDashboardLayout>
  );
};

export default RoleBasedDashboard;
