import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/pagestyles/Navbar.scss';

export function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <span role="img" aria-label="logo">🌱</span> Rooted
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/community" className={pathname === '/community' ? 'active' : ''}>Community</Link></li>
        <li><Link to="/gardens/1" className={pathname.startsWith('/gardens') ? 'active' : ''}>Gardens</Link></li>
        <li><Link to="/media" className={pathname === '/media' ? 'active' : ''}>Media</Link></li>
        <li><Link to="/login" className={pathname === '/login' ? 'active' : ''}>Login</Link></li>
        <li><Link to="/register" className={pathname === '/register' ? 'active' : ''}>Register</Link></li>
      </ul>
    </nav>
  );
}
