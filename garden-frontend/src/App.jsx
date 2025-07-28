import { useState } from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAuthInit from './hooks/useAuthInit'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Register from './pages/Register'
import Login from './pages/Login'
import EmailVerification from './pages/EmailVerification'
import TwoFactorAuth from './pages/TwoFactorAuth'
import Dashboard from './pages/Dashboard'
import Garden from './pages/Garden'
import Media from './pages/Media'
import Community from './pages/Community'
import Payments from './pages/Payments'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import UserDashboard from './pages/UserDashboard'
import Profile from './pages/Profile/Profile'
import AdminDashboard from './features/admin/components/AdminDashboard'
import UserManagement from './features/admin/components/users/UserManagement'
import ApplicationManagement from './features/admin/components/applications/ApplicationManagement'
import TaskManagement from './features/admin/components/tasks/TaskManagement'
import AdminCalendar from './features/admin/components/calendar/AdminCalendar'
import AnnouncementManagement from './features/admin/components/announcements/AnnouncementManagement'
import MediaModeration from './features/admin/components/media/MediaModeration'
import ReportsAnalytics from './features/admin/components/reports/ReportsAnalytics'
import AdminSettings from './features/admin/components/settings/AdminSettings'
import AdminUtilities from './features/admin/components/utilities/AdminUtilities'
import GardenManagement from './features/admin/components/gardens/GardenManagement'
import PlotManagement from './features/admin/components/plots/PlotManagement'
import ManagerDashboard from './components/dashboard/ManagerDashboard'
import SecondAdminGardens from './pages/SecondAdmin/SecondAdminGardens'
import SecondAdminCommunity from './pages/SecondAdmin/SecondAdminCommunity'
import SecondAdminEvents from './pages/SecondAdmin/SecondAdminEvents'

import Footer from './components/common/Footer'
import CreateGarden from './pages/Admin/CreateGarden'
// import GardenManagement from './pages/GardenManagement'
import Gardens from './pages/Gardens'
import Events from './pages/Events'
import Tasks from './pages/Tasks'
import Notifications from './pages/Notifications'
import Manage from './pages/Manage'
import Help from './pages/Help'
import Contact from './pages/Contact'
import AdminUsers from './pages/Admin/AdminUsers'
import AdminGardens from './pages/Admin/AdminGardens'
import Toast from './components/common/Toast'
import ErrorBoundary from './components/common/ErrorBoundary'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const { isLoading } = useAuthInit();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <Router>
        <Toast />
        <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Verification routes */}
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
        <Route path="/gardens" element={<Gardens />} />

        {/* Protected routes - require authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/gardens/:id" element={
          <ProtectedRoute>
            <Garden />
          </ProtectedRoute>
        } />

        <Route path="/gardens/:gardenId/manage" element={
          <ProtectedRoute>
            <GardenManagement />
          </ProtectedRoute>
        } />

        <Route path="/media" element={
          <ProtectedRoute>
            <Media />
          </ProtectedRoute>
        } />

        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />

        <Route path="/events" element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />

        <Route path="/manage" element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <Manage />
          </ProtectedRoute>
        } />

        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/my-dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />

        {/* Garden creation - any authenticated user */}
        <Route path="/gardens/create" element={
          <ProtectedRoute>
            <CreateGarden />
          </ProtectedRoute>
        } />

        {/* Admin routes - require admin role */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/gardens" element={
          <ProtectedRoute roles={['admin']}>
            <GardenManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/plots" element={
          <ProtectedRoute roles={['admin']}>
            <PlotManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/applications" element={
          <ProtectedRoute roles={['admin']}>
            <ApplicationManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/tasks" element={
          <ProtectedRoute roles={['admin']}>
            <TaskManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/calendar" element={
          <ProtectedRoute roles={['admin']}>
            <AdminCalendar />
          </ProtectedRoute>
        } />
        <Route path="/admin/announcements" element={
          <ProtectedRoute roles={['admin']}>
            <AnnouncementManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/media" element={
          <ProtectedRoute roles={['admin']}>
            <MediaModeration />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute roles={['admin']}>
            <ReportsAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute roles={['admin']}>
            <AdminSettings />
          </ProtectedRoute>
        } />
        <Route path="/admin/utilities" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUtilities />
          </ProtectedRoute>
        } />

        {/* Manager routes */}
        <Route path="/manager/dashboard" element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/manager/gardens" element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <SecondAdminGardens />
          </ProtectedRoute>
        } />

        <Route path="/manager/community" element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <SecondAdminCommunity />
          </ProtectedRoute>
        } />

        <Route path="/manager/events" element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <SecondAdminEvents />
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </ErrorBoundary>
    </QueryClientProvider>
  )
}
