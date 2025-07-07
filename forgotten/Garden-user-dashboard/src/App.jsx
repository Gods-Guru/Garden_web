import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import OverviewPage from './pages/OverviewPage';
import MyPlotsPage from './pages/MyPlotsPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import CommunityPage from './pages/CommunityPage';
import SettingsPage from './pages/SettingsPage';
import './index.css'; // Ensure global styles are imported

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Default route redirects to /overview */}
          <Route index element={<Navigate replace to="/overview" />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="my-plots" element={<MyPlotsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* You can add a 404 Not Found route here later if needed */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
