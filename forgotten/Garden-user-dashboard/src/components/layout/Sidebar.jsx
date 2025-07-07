// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Leaf, ListChecks, CalendarDays, Users, Settings, ChevronLeft } from 'lucide-react'; // Added ChevronLeft for collapse

const navigationItems = [
  { to: '/overview', text: 'Overview', icon: <Home size={20} /> },
  { to: '/my-plots', text: 'My Plots', icon: <Leaf size={20} /> },
  { to: '/tasks', text: 'Tasks', icon: <ListChecks size={20} /> },
  { to: '/calendar', text: 'Calendar', icon: <CalendarDays size={20} /> },
  { to: '/community', text: 'Community', icon: <Users size={20} /> },
  { to: '/settings', text: 'Settings', icon: <Settings size={20} /> },
];

const Sidebar = ({ isOpen, toggleSidebar }) => { // Added isOpen and toggleSidebar props
  return (
    <aside
      className={`bg-card text-foreground border-r border-border transition-all duration-300 ease-in-out flex flex-col
                  ${isOpen ? 'w-64 p-4' : 'w-16 p-2 items-center'} h-screen fixed top-0 left-0 shadow-lg z-40`}
    >
      <div className={`flex items-center mb-8 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <h1 className="text-2xl font-bold text-primary-600 flex items-center">
            <Leaf size={28} className="mr-2" /> Garden
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft size={24} className={`transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      <nav className="flex-grow">
        <ul>
          {navigationItems.map((item) => (
            <li key={item.text} className="mb-2">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-3 rounded-md text-sm font-medium transition-colors
                   hover:bg-primary-50 hover:text-primary-600 group
                   ${isOpen ? '' : 'justify-center'}
                   ${isActive ? 'bg-primary-100 text-primary-700 shadow-sm' : 'text-muted-foreground'}`
                }
                title={isOpen ? '' : item.text} // Show tooltip when collapsed
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {isOpen && <span className="ml-3">{item.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Your Garden App
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
