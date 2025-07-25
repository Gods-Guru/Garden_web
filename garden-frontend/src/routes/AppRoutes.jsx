import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Components
import AdminPanel from '../components/admin/AdminPanel';
import AuditLog from '../components/audit/AuditLog';
import GardenGuides from '../pages/GardenGuides';
import Notifications from '../components/notifications/Notifications';
import GardenCreate from '../pages/GardenCreate';
import GardenList from '../pages/GardenList';
import GardenDetails from '../pages/GardenDetails';
import EventCalendar from '../pages/EventCalendar';
import MediaGallery from '../pages/MediaGallery';
import UserProfile from '../pages/UserProfile';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <GardenList />
        </ProtectedRoute>
      } />

      {/* Garden Routes */}
      <Route path="/gardens/create" element={
        <ProtectedRoute>
          <GardenCreate />
        </ProtectedRoute>
      } />
      
      <Route path="/gardens/:id" element={
        <ProtectedRoute>
          <GardenDetails />
        </ProtectedRoute>
      } />

      {/* Feature Routes */}
      <Route path="/events" element={
        <ProtectedRoute>
          <EventCalendar />
        </ProtectedRoute>
      } />
      
      <Route path="/media" element={
        <ProtectedRoute>
          <MediaGallery />
        </ProtectedRoute>
      } />
      
      <Route path="/guides" element={
        <ProtectedRoute>
          <GardenGuides />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin', 'secondAdmin']}>
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/audit" element={
        <ProtectedRoute roles={['admin']}>
          <AuditLog />
        </ProtectedRoute>
      } />

      {/* Notification Route - Available to all authenticated users */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
