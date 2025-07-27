import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import UserDashboard from '../../pages/UserDashboard';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from '../../pages/Admin/AdminDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuthStore();

  // Role-based dashboard routing
  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'user':
    default:
      return <UserDashboard />;
  }
};

export default RoleBasedDashboard;
