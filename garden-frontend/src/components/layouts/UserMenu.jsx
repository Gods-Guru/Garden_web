import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './UserMenu.scss';

const UserMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div
      className="user-menu"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
      tabIndex={-1}
    >
      <div className="user-info" role="none">
        <div className="user-details">
          <p className="user-name">{user?.name}</p>
          <p className="user-email">{user?.email}</p>
        </div>
      </div>
      <div className="menu-section" role="none">
        <button
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          className="menu-item"
          role="menuitem"
        >
          <User className="menu-icon" aria-hidden="true" />
          Your Profile
        </button>
        <button
          onClick={() => {
            navigate('/settings');
            onClose();
          }}
          className="menu-item"
          role="menuitem"
        >
          <Settings className="menu-icon" aria-hidden="true" />
          Settings
        </button>
      </div>
      <div className="menu-section" role="none">
        <button
          onClick={handleLogout}
          className="menu-item logout"
          role="menuitem"
        >
          <LogOut className="menu-icon" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
