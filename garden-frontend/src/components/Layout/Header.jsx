"use client"

import { useState } from "react"
import "./Header.scss"

const Header = ({ toggleSidebar, user }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, message: "New plot application received", time: "5 min ago", unread: true },
    { id: 2, message: 'Task "Water tomatoes" is due today', time: "1 hour ago", unread: true },
    { id: 3, message: "Garden meeting scheduled for tomorrow", time: "2 hours ago", unread: false },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="page-title">Community Garden Dashboard</h1>
      </div>

      <div className="header-right">
        <div className="search-box">
          <input type="text" placeholder="Search gardens, plots, tasks..." />
          <button className="search-btn">🔍</button>
        </div>

        <div className="notifications">
          <button className="notification-btn" onClick={() => setNotificationsOpen(!notificationsOpen)}>
            🔔{unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {notificationsOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Mark all read</button>
              </div>
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`notification-item ${notification.unread ? "unread" : ""}`}>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="user-menu">
          <div className="user-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">{user?.name?.charAt(0)?.toUpperCase()}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
