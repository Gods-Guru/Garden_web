// src/pages/CalendarPage.jsx
import React from 'react';
import GardenCalendar from '../components/dashboard/GardenCalendar'; // Reusing the existing GardenCalendar component

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      {/* <h1 className="text-3xl font-bold text-primary-700">Garden Calendar</h1> */}
      <GardenCalendar />
      {/* This page could later be expanded to show a full-sized interactive calendar */}
      <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6">
        <h2 className="text-xl font-semibold text-primary-600 mb-4">Full Calendar View (Future)</h2>
        <p className="text-muted-foreground">
          An interactive monthly or weekly calendar view will be implemented here in a future update,
          allowing for easier event scheduling and long-term planning.
        </p>
        <div className="mt-4 h-64 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-gray-500">Calendar Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
