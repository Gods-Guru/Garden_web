// src/pages/SettingsPage.jsx
import React from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = () => {
  // Mock settings sections
  const settingsSections = [
    { id: 'profile', title: 'Profile Settings', description: 'Manage your personal information, contact details, and profile picture.', icon: <User className="text-primary-500" /> },
    { id: 'notifications', title: 'Notification Preferences', description: 'Choose how and when you receive notifications about tasks, events, and community updates.', icon: <Bell className="text-primary-500" /> },
    { id: 'account', title: 'Account & Security', description: 'Update your password, manage account security, or delete your account.', icon: <Shield className="text-primary-500" /> },
    { id: 'appearance', title: 'Appearance', description: 'Customize the look and feel of your dashboard (e.g., theme, font size).', icon: <Palette className="text-primary-500" /> },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary-700">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map(section => (
          <div key={section.id} className="bg-card p-6 rounded-lg shadow-md border border-border">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-primary-100 rounded-full mr-4">
                {React.cloneElement(section.icon, { size: 24 })}
              </div>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
            <button className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-primary-foreground text-sm font-medium py-2 px-4 rounded-md transition-colors">
              Manage {section.title.split(' ')[0]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
