import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useGardenStore from '../store/useGardenStore';
import RoleBasedDashboard from '../components/dashboard/RoleBasedDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const { fetchMyGardens } = useGardenStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's gardens on dashboard load
    if (isAuthenticated) {
      fetchMyGardens();
    }
  }, [isAuthenticated, fetchMyGardens]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  // Use role-based dashboard component
  return <RoleBasedDashboard />;
};

export default Dashboard;
