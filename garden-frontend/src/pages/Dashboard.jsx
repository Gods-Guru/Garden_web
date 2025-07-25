import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useGardenStore from '../store/useGardenStore';
import UserDashboard from './UserDashboard';
import AdminDashboard from './Admin/AdminDashboard';
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

  // Route to appropriate dashboard based on user role
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Default to user dashboard for regular users
  return <UserDashboard />;
};

export default Dashboard;
