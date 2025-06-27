// src/pages/OverviewPage.jsx
import React from 'react';
import PersonalOverview from '../components/dashboard/PersonalOverview';
import QuickActions from '../components/dashboard/QuickActions';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import MyTasks from '../components/dashboard/MyTasks'; // Adding MyTasks here for a more comprehensive overview

const OverviewPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary-700">Dashboard Overview</h1>

      <PersonalOverview />

      {/* Consider a two-column layout for the content below on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MyTasks />
          <QuickActions />
        </div>
        <div className="space-y-6">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
