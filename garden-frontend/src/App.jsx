import { useState } from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import AdminDashboard from './pages/Admin/AdminDashboard'
import UserManagement from './pages/Admin/UserManagement'
import AuditLog from './pages/Admin/AuditLog'
import AdminSettings from './pages/Admin/AdminSettings'
import ManagerDashboard from './components/dashboard/ManagerDashboard'
import SecondAdminGardens from './pages/SecondAdmin/SecondAdminGardens'
import SecondAdminCommunity from './pages/SecondAdmin/SecondAdminCommunity'
import SecondAdminEvents from './pages/SecondAdmin/SecondAdminEvents'

import Footer from './components/common/Footer'
import CreateGarden from './pages/Admin/CreateGarden'
import GardenManagement from './pages/GardenManagement'
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

export default function App() {
  // Initialize auth on app startup
  useAuthInit();

  return (
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

        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />

        <Route path="/admin/gardens" element={
          <ProtectedRoute roles={['admin']}>
            <AdminGardens />
          </ProtectedRoute>
        } />

        <Route path="/admin/audit" element={
          <ProtectedRoute roles={['admin']}>
            <AuditLog />
          </ProtectedRoute>
        } />

        <Route path="/admin/settings" element={
          <ProtectedRoute roles={['admin']}>
            <AdminSettings />
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
  )
}
