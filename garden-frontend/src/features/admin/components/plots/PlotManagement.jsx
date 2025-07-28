import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PlotList from './PlotList';
import PlotForm from './PlotForm';
import AssignPlotModal from './AssignPlotModal';
import { usePlots } from '../../hooks/usePlots';
import useAuthStore from '../../../../store/useAuthStore';

const PlotManagement = () => {
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [plotToAssign, setPlotToAssign] = useState(null);
  const [selectedGarden, setSelectedGarden] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { userGardens, isGardenAdmin } = useAuthStore();
  const { plots, isLoading, error, createPlot, updatePlot, assignPlot } = usePlots(
    selectedGarden === 'all' ? null : selectedGarden
  );

  const handleCreatePlot = () => {
    setSelectedPlot(null);
    setIsFormOpen(true);
  };

  const handlePlotSubmit = async (plotData) => {
    try {
      if (selectedPlot) {
        await updatePlot(selectedPlot._id, plotData);
      } else {
        await createPlot(plotData);
      }
      setIsFormOpen(false);
      setSelectedPlot(null);
    } catch (err) {
      console.error('Failed to save plot:', err);
    }
  };

  const handleAssignPlot = async (plotId, userId) => {
    try {
      await assignPlot(plotId, userId);
    } catch (err) {
      console.error('Failed to assign plot:', err);
    }
  };

  const filteredPlots = plots.filter(plot => {
    if (statusFilter !== 'all' && plot.status !== statusFilter) return false;
    if (searchQuery && !plot.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="plot-management">
      <div className="page-header">
        <div className="header-content">
          <h1>Plot Management</h1>
          <p>Manage and assign garden plots</p>
        </div>
        {isGardenAdmin(selectedGarden) && (
          <button className="btn-primary" onClick={handleCreatePlot}>
            + New Plot
          </button>
        )}
      </div>

      <div className="plot-filters">
        <select 
          className="filter-select"
          value={selectedGarden}
          onChange={(e) => setSelectedGarden(e.target.value)}
        >
          <option value="all">All Gardens</option>
          {userGardens.map(garden => (
            <option key={garden._id} value={garden._id}>
              {garden.name}
            </option>
          ))}
        </select>
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search plots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="loading">Loading plots...</div>
      ) : error ? (
        <div className="error">Error loading plots: {error}</div>
      ) : (
        <>
          <PlotList
            plots={filteredPlots}
            onEdit={(plot) => {
              setSelectedPlot(plot);
              setIsFormOpen(true);
            }}
            onAssign={(plot) => {
              setPlotToAssign(plot);
              setIsAssignModalOpen(true);
            }}
          />

          {isFormOpen && (
            <PlotForm
              plot={selectedPlot}
              onSubmit={handlePlotSubmit}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedPlot(null);
              }}
            />
          )}

          {isAssignModalOpen && plotToAssign && (
            <AssignPlotModal
              plot={plotToAssign}
              onAssign={(plotId, userId) => {
                handleAssignPlot(plotId, userId);
                setIsAssignModalOpen(false);
                setPlotToAssign(null);
              }}
              onClose={() => {
                setIsAssignModalOpen(false);
                setPlotToAssign(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PlotManagement;
