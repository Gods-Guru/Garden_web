import React, { useState } from 'react';
import GardenList from './GardenList';
import GardenForm from './GardenForm';
import GardenMap from './GardenMap';
import { useGardens } from '../../hooks/useGardens';

const GardenManagement = () => {
  const [view, setView] = useState('list'); // 'list' | 'map' | 'new' | 'edit'
  const [selectedGarden, setSelectedGarden] = useState(null);
  const { gardens, isLoading, error } = useGardens();

  const handleCreateNew = () => {
    setSelectedGarden(null);
    setView('new');
  };

  const handleEdit = (garden) => {
    setSelectedGarden(garden);
    setView('edit');
  };

  return (
    <div className="garden-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Garden Management</h1>
          <p>Manage all community gardens in the system</p>
        </div>
        <div className="header-actions">
          <div className="view-toggles">
            <button 
              className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              📋 List View
            </button>
            <button 
              className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
              onClick={() => setView('map')}
            >
              🗺️ Map View
            </button>
          </div>
          <button className="btn-primary" onClick={handleCreateNew}>
            + New Garden
          </button>
        </div>
      </div>

      <div className="garden-content">
        {view === 'list' && (
          <GardenList 
            gardens={gardens} 
            onEdit={handleEdit}
            isLoading={isLoading}
            error={error}
          />
        )}
        {view === 'map' && (
          <GardenMap 
            gardens={gardens}
            onGardenSelect={setSelectedGarden}
          />
        )}
        {(view === 'new' || view === 'edit') && (
          <GardenForm 
            garden={selectedGarden}
            onClose={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
};

export default GardenManagement;
