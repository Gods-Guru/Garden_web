import { useState } from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAuthInit from './hooks/useAuthInit'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomeRedirect from './components/auth/HomeRedirect'
import Home from './pages/Home'
import About from './pages/About'
import Features from './pages/Features'
import Terms from './pages/Terms'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Register from './pages/Register'
import Login from './pages/Login'
import MyPlot from './pages/MyPlot'
import ActivityLog from './pages/ActivityLog'
import GardenDiary from './pages/GardenDiary'
import Resources from './pages/Resources'
import ReportIssue from './pages/ReportIssue'
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
import EditProfile from './pages/EditProfile'
import AdminDashboard from './features/admin/components/AdminDashboard'
import UserManagement from './features/admin/components/users/UserManagement'
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

// Page components
import AddCrop from './pages/AddCrop'
import TaskDetails from './pages/TaskDetails'
import EditTask from './pages/EditTask'
import Plots from './pages/Plots'
import Forum from './pages/Forum'
import Applications from './pages/Applications'
import AuditLog from './pages/AuditLog'
import GardenManagementPage from './pages/GardenManagement'
import MediaGallery from './pages/MediaGallery'
import ManageUsers from './pages/Admin/ManageUsers'
import CreateGarden from './pages/Admin/CreateGarden'
import Gardens from './pages/Gardens'
import Events from './pages/Events'
import Tasks from './pages/Tasks'
import Notifications from './pages/Notifications'
import Manage from './pages/Manage'
import Help from './pages/Help'
import Contact from './pages/Contact'

import Footer from './components/common/Footer'
import Toast from './components/common/Toast'
import ErrorBoundary from './components/common/ErrorBoundary'

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
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gardens" element={<Gardens />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />

            {/* Verification routes */}
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/two-factor-auth" element={<TwoFactorAuth />} />

            {/* Protected user routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gardens/:id" element={<Garden />} />
              <Route path="/media" element={<MediaGallery />} />
              <Route path="/community" element={<Community />} />
              <Route path="/events" element={<Events />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/my-dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/my-plot" element={<MyPlot />} />
              <Route path="/activity-log" element={<ActivityLog />} />
              <Route path="/garden-diary" element={<GardenDiary />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/crops/add" element={<AddCrop />} />
              <Route path="/tasks/:taskId" element={<TaskDetails />} />
              <Route path="/tasks/:taskId/edit" element={<EditTask />} />
              <Route path="/plots" element={<Plots />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/gardens/create" element={<CreateGarden />} />
            </Route>

            {/* Manager routes */}
            <Route element={<ProtectedRoute roles={['admin', 'manager']} />}>
              <Route path="/manage" element={<Manage />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/garden-management" element={<GardenManagementPage />} />
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/gardens" element={<SecondAdminGardens />} />
              <Route path="/manager/community" element={<SecondAdminCommunity />} />
              <Route path="/manager/events" element={<SecondAdminEvents />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/gardens" element={<GardenManagement />} />
              <Route path="/admin/plots" element={<PlotManagement />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/tasks" element={<TaskManagement />} />
              <Route path="/admin/calendar" element={<AdminCalendar />} />
              <Route path="/admin/announcements" element={<AnnouncementManagement />} />
              <Route path="/admin/media" element={<MediaModeration />} />
              <Route path="/admin/reports" element={<ReportsAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/utilities" element={<AdminUtilities />} />
              <Route path="/admin/audit-log" element={<AuditLog />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}