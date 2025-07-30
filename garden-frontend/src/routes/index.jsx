import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// General Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Features from '@/pages/Features';
import Contact from '@/pages/Contact';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import TermsAndConditions from '@/pages/legal/TermsAndConditions';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import NotFound from '@/pages/NotFound';

// User Pages
import UserDashboard from '@/pages/user/Dashboard';
import PlotApplication from '@/pages/user/PlotApplication';
import MyPlot from '@/pages/user/MyPlot';
import GardenLog from '@/pages/user/GardenLog';
import GardenDiary from '@/pages/user/GardenDiary';
import Events from '@/pages/user/Events';
import Announcements from '@/pages/user/Announcements';
import Resources from '@/pages/user/Resources';
import ReportIssue from '@/pages/user/ReportIssue';
import Notifications from '@/pages/user/Notifications';
import Profile from '@/pages/user/Profile';
import ChangePassword from '@/pages/user/ChangePassword';
import Forum from '@/pages/user/Forum';

// Manager Pages
import ManagerDashboard from '@/pages/manager/Dashboard';
import PlotRequests from '@/pages/manager/PlotRequests';
import PlotAssignment from '@/pages/manager/PlotAssignment';
import ActivityLogs from '@/pages/manager/ActivityLogs';
import ManageEvents from '@/pages/manager/ManageEvents';
import UserMonitoring from '@/pages/manager/UserMonitoring';
import GardenReport from '@/pages/manager/GardenReport';
import ManageAnnouncements from '@/pages/manager/ManageAnnouncements';
import ManageComplaints from '@/pages/manager/ManageComplaints';
import ManagerNotifications from '@/pages/manager/Notifications';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import GardenManagement from '@/pages/admin/GardenManagement';
import PlotManagement from '@/pages/admin/PlotManagement';
import ManagerAssignment from '@/pages/admin/ManagerAssignment';
import UserManagement from '@/pages/admin/UserManagement';
import ManagerManagement from '@/pages/admin/ManagerManagement';
import ComplaintOverview from '@/pages/admin/ComplaintOverview';
import GlobalEvents from '@/pages/admin/GlobalEvents';
import SystemAnalytics from '@/pages/admin/SystemAnalytics';
import ResourceManagement from '@/pages/admin/ResourceManagement';
import GlobalAnnouncements from '@/pages/admin/GlobalAnnouncements';
import DataManagement from '@/pages/admin/DataManagement';
import PlatformSettings from '@/pages/admin/PlatformSettings';
import AdminNotifications from '@/pages/admin/Notifications';

// Advanced Features
import Gallery from '@/pages/features/Gallery';
import Leaderboard from '@/pages/features/Leaderboard';
import GardenMap from '@/pages/features/GardenMap';
import Calendar from '@/pages/features/Calendar';
import Messages from '@/pages/features/Messages';
import Weather from '@/pages/features/Weather';
import AuditLogs from '@/pages/admin/AuditLogs';
import Heatmaps from '@/pages/features/Heatmaps';
import Feedback from '@/pages/features/Feedback';

const AppRoutes = () => {
  return (
    <Routes>
      {/* General Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply"
        element={
          <ProtectedRoute>
            <PlotApplication />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-plot"
        element={
          <ProtectedRoute>
            <MyPlot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/garden-log"
        element={
          <ProtectedRoute>
            <GardenLog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diary"
        element={
          <ProtectedRoute>
            <GardenDiary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report-issue"
        element={
          <ProtectedRoute>
            <ReportIssue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forum"
        element={
          <ProtectedRoute>
            <Forum />
          </ProtectedRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/plot-requests"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <PlotRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/assign-plot"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <PlotAssignment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/activity-logs"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/events"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <ManageEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/users"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <UserMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/garden-report"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <GardenReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/announcements"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <ManageAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/complaints"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <ManageComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/notifications"
        element={
          <ProtectedRoute roles={['manager', 'admin']}>
            <ManagerNotifications />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gardens"
        element={
          <ProtectedRoute roles={['admin']}>
            <GardenManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/plots"
        element={
          <ProtectedRoute roles={['admin']}>
            <PlotManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/assign-managers"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManagerAssignment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/managers"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManagerManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute roles={['admin']}>
            <ComplaintOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute roles={['admin']}>
            <GlobalEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute roles={['admin']}>
            <SystemAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/resources"
        element={
          <ProtectedRoute roles={['admin']}>
            <ResourceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/announcements"
        element={
          <ProtectedRoute roles={['admin']}>
            <GlobalAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/data"
        element={
          <ProtectedRoute roles={['admin']}>
            <DataManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute roles={['admin']}>
            <PlatformSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute roles={['admin']}>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Advanced Feature Routes */}
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <GardenMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        }
      />
      <Route
        path="/heatmaps"
        element={
          <ProtectedRoute roles={['admin']}>
            <Heatmaps />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
