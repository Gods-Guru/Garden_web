import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuthStore from '../store/useAuthStore';
import './MainLayout.scss';

const MainLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, validateToken } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const isValid = await validateToken();
        if (!isValid) {
          navigate('/auth/login');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, validateToken, navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <main className="dashboard-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
