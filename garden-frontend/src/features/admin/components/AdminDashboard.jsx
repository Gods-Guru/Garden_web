import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminStats from './AdminStats';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="admin-dashboard">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="admin-main">
        <AdminHeader onMenuClick={toggleSidebar} />
        <div className="admin-content">
          <AdminStats />
          <div className="dashboard-grid">
            <div className="grid-item gardens-overview">
              <h2>Gardens Overview</h2>
              {/* Garden stats and quick actions will go here */}
            </div>
            <div className="grid-item recent-applications">
              <h2>Recent Applications</h2>
              {/* Latest plot and volunteer applications will go here */}
            </div>
            <div className="grid-item tasks-overview">
              <h2>Tasks Overview</h2>
              {/* Task statistics and urgent tasks will go here */}
            </div>
            <div className="grid-item system-health">
              <h2>System Health</h2>
              {/* System status and alerts will go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
