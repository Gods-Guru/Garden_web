import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import CreateGarden from '../pages/Admin/CreateGarden';
import GardenManagement from '../pages/Garden/GardenManagement';

const GardenRoutes = () => {
  return (
    <Routes>
      <Route path="/gardens" element={<PrivateRoute />}>
        <Route path="new" element={<CreateGarden />} />
        <Route path="manage" element={<GardenManagement />} />
        <Route path=":gardenId/*" element={<GardenManagement />} />
      </Route>
    </Routes>
  );
};

export default GardenRoutes;
