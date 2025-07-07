// src/pages/CommunityPage.jsx
import React from 'react';
import CommunityHighlights from '../components/dashboard/CommunityHighlights'; // Reusing the existing CommunityHighlights component

const CommunityPage = () => {
  return (
    <div className="space-y-6">
      {/* <h1 className="text-3xl font-bold text-primary-700">Community Hub</h1> */}
      <CommunityHighlights />
      {/* This page could be expanded with more community features like forums, member directories etc. */}
      <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6">
        <h2 className="text-xl font-semibold text-primary-600 mb-4">Community Forum (Future)</h2>
        <p className="text-muted-foreground">
          A space for discussions, asking questions, and sharing experiences with fellow gardeners.
        </p>
         <div className="mt-4 h-48 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-gray-500">Forum Placeholder</p>
        </div>
      </div>
       <div className="bg-card p-6 rounded-lg shadow-md border border-border mt-6">
        <h2 className="text-xl font-semibold text-primary-600 mb-4">Shared Resources (Future)</h2>
        <p className="text-muted-foreground">
          A library of gardening guides, tool sharing information, and more.
        </p>
         <div className="mt-4 h-48 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-gray-500">Resources Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
