import { NavLink } from "react-router-dom"
import "./Sidebar.scss"

const Sidebar = ({ isOpen, user }) => {
  const menuItems = [
    { path: "/dashboard", icon: "🏡", label: "Dashboard", roles: ["admin", "manager", "gardener"] },
    { path: "/gardens", icon: "🌿", label: "Gardens", roles: ["admin", "manager", "gardener"] },
    { path: "/plots", icon: "🧱", label: "My Plots", roles: ["gardener"] },
    { path: "/tasks", icon: "📋", label: "Tasks", roles: ["admin", "manager", "gardener"] },
    { path: "/calendar", icon: "📅", label: "Calendar", roles: ["admin", "manager", "gardener"] },
    { path: "/volunteers", icon: "🤝", label: "Volunteers", roles: ["admin", "manager"] },
    { path: "/applications", icon: "📝", label: "Applications", roles: ["admin", "manager"] },
    { path: "/reports", icon: "📊", label: "Reports", roles: ["admin", "manager"] },
    { path: "/payments", icon: "💳", label: "Payments", roles: ["admin"] },
    { path: "/settings", icon: "⚙️", label: "Settings", roles: ["admin", "manager", "gardener"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role?.toLowerCase()))

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🌱</span>
          {isOpen && <span className="logo-text">GardenHub</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredMenuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {isOpen && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">{user?.name?.charAt(0)?.toUpperCase()}</div>
              )}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
