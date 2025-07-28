import React from 'react';

const AdminHeader = ({ onMenuClick }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <button onClick={onMenuClick} className="menu-btn">
          ☰
        </button>
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        <div className="search-box">
          <input type="text" placeholder="Search..." />
          <button>🔍</button>
        </div>
        <div className="notifications">
          <button className="notification-btn">
            🔔
            <span className="badge">3</span>
          </button>
        </div>
        <div className="admin-profile">
          <img src="/placeholder-admin.jpg" alt="Admin" />
          <div className="profile-info">
            <span className="name">Admin Name</span>
            <span className="role">System Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
