// src/pages/MyPlotsPage.jsx
import React from 'react';
import MyPlots from '../components/dashboard/MyPlots'; // Reusing the existing MyPlots component

const MyPlotsPage = () => {
  return (
    <div className="space-y-6">
      {/* The MyPlots component already has a title "My Plots", so we might not need another H1 here,
          or we can remove the title from the component if it's used as a full page.
          For now, let's assume the component's internal title is sufficient.
          Alternatively, the Header component could display the page title.
      */}
      {/* <h1 className="text-3xl font-bold text-primary-700">My Garden Plots</h1> */}
      <MyPlots />
    </div>
  );
};

export default MyPlotsPage;
