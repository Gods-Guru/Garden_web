// src/components/layout/Header.jsx
import React from 'react';
import { Menu, Bell, UserCircle } from 'lucide-react';

const Header = ({ toggleSidebar, pageTitle }) => {
  return (
    <header className="bg-card text-foreground border-b border-border p-4 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between max-w-full px-0"> {/* Ensure header content can span full width if needed */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden mr-2"
            aria-label="Toggle navigation"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-primary-700">
            {pageTitle || 'Garden Dashboard'} {/* Use dynamic title or fallback */}
          </h1>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            className="p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {/* Notification badge example: <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /> */}
          </button>
          <button
            className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="User profile"
          >
            <UserCircle size={24} />
            <span className="hidden sm:inline text-sm font-medium">Alex G.</span>
            {/* Replace with actual user avatar/name later */}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
