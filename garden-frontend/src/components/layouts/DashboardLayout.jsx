import React from 'react';
import EnhancedDashboardLayout from '../dashboard/EnhancedDashboardLayout';

const DashboardLayout = ({ children }) => {
  return (
    <EnhancedDashboardLayout>
      {children}
    </EnhancedDashboardLayout>
  );
};

export default DashboardLayout;
