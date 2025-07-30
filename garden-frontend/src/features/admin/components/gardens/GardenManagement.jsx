import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GardenList from './GardenList';
import GardenForm from './GardenForm';
import GardenMap from './GardenMap';
import useGardens from '../../hooks/useGardens';
import './GardenManagement.css';

const GardenManagement = () => {
  const [view, setView] = useState('list'); // 'list' | 'map' | 'new' | 'edit'
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { gardens, isLoading, error, stats, createGarden, updateGarden, deleteGarden } = useGardens();

  const handleCreateNew = () => {
    setSelectedGarden(null);
    setIsFormOpen(true);
  };

  const handleEdit = (garden) => {
    setSelectedGarden(garden);
    setIsFormOpen(true);
  };

  const handleSubmit = async (gardenData) => {
    try {
      if (selectedGarden) {
        await updateGarden({ gardenId: selectedGarden._id, data: gardenData });
      } else {
        await createGarden(gardenData);
      }
      setIsFormOpen(false);
      setSelectedGarden(null);
    } catch (err) {
      console.error('Failed to save garden:', err);
      throw err;
    }
  };

  const handleDelete = async (gardenId) => {
    try {
      await deleteGarden(gardenId);
    } catch (err) {
      console.error('Failed to delete garden:', err);
      throw err;
    }
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
        {error && (
          <div className="error-message">
            Error: {error}
            <button 
              className="btn-secondary btn-sm" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner">Loading gardens...</div>
        ) : (
          <>
            {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Gardens</h4>
              <div className="stat-value">{stats.totalGardens || 0}</div>
            </div>
            <div className="stat-card">
              <h4>Active Gardens</h4>
              <div className="stat-value">{stats.activeGardens || 0}</div>
            </div>
            <div className="stat-card">
              <h4>Total Plots</h4>
              <div className="stat-value">{stats.totalPlots || 0}</div>
            </div>
            <div className="stat-card">
              <h4>Available Plots</h4>
              <div className="stat-value">{stats.availablePlots || 0}</div>
            </div>
          </div>
        )}

        {view === 'list' ? (
          <GardenList
            gardens={gardens}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <GardenMap 
            gardens={gardens}
            onSelectGarden={handleEdit}
          />
        )}

        {isFormOpen && (
          <GardenForm
            garden={selectedGarden}
            onSubmit={handleSubmit}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedGarden(null);
            }}
          />
            )}
          </>
        )}
      </div>
    </div>
  );
};

GardenManagement.propTypes = {
  // Component doesn't currently take any props, but we'll define the structure
  // for future use if needed
};

export default GardenManagement;