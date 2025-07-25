import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './GardenManagement.scss';

function GardenManagement() {
  const { user } = useAuth();
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [plots, setPlots] = useState([]);

  useEffect(() => {
    fetchGardens();
  }, []);

  useEffect(() => {
    if (selectedGarden) {
      fetchGardenPlots(selectedGarden._id);
    }
  }, [selectedGarden]);

  const fetchGardens = async () => {
    try {
      const res = await fetch('/api/gardens', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGardens(data.gardens);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGardenPlots = async (gardenId) => {
    try {
      const res = await fetch(`/api/gardens/${gardenId}/plots`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPlots(data.plots);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlotAssignment = async (plotId, userId) => {
    try {
      const res = await fetch(`/api/plots/${plotId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setPlots(plots.map(plot => 
        plot._id === plotId ? { ...plot, assignedTo: data.user } : plot
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlotStatusUpdate = async (plotId, status) => {
    try {
      const res = await fetch(`/api/plots/${plotId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setPlots(plots.map(plot => 
        plot._id === plotId ? { ...plot, status: data.status } : plot
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading gardens...</div>;
  }

  return (
    <div className="garden-management">
      <div className="garden-list">
        <h2>My Gardens</h2>
        {error && <div className="error">{error}</div>}
        
        <div className="gardens-grid">
          {gardens.map(garden => (
            <div 
              key={garden._id} 
              className={`garden-card ${selectedGarden?._id === garden._id ? 'selected' : ''}`}
              onClick={() => setSelectedGarden(garden)}
            >
              <h3>{garden.name}</h3>
              <p className="location">{garden.location}</p>
              <div className="garden-stats">
                <span>{garden.plots?.length || 0} Plots</span>
                <span>{garden.members?.length || 0} Members</span>
              </div>
              <div className="garden-status">
                <span className={`status ${garden.status.toLowerCase()}`}>
                  {garden.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedGarden && (
        <div className="garden-details">
          <h3>{selectedGarden.name} - Plot Management</h3>
          
          <div className="plots-grid">
            {plots.map(plot => (
              <div key={plot._id} className={`plot-card ${plot.status.toLowerCase()}`}>
                <h4>Plot {plot.number}</h4>
                <div className="plot-info">
                  <p>Size: {plot.size}</p>
                  <p>Status: {plot.status}</p>
                  {plot.assignedTo && (
                    <p>Assigned to: {plot.assignedTo.name}</p>
                  )}
                </div>
                {(user.isAdmin || user._id === selectedGarden.owner) && (
                  <div className="plot-actions">
                    <select
                      value={plot.status}
                      onChange={(e) => handlePlotStatusUpdate(plot._id, e.target.value)}
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </select>
                    {plot.status === 'AVAILABLE' && (
                      <button 
                        className="assign-button"
                        onClick={() => handlePlotAssignment(plot._id)}
                      >
                        Assign Plot
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {plots.length === 0 && (
            <div className="no-plots">
              <p>No plots found in this garden.</p>
              {(user.isAdmin || user._id === selectedGarden.owner) && (
                <button className="create-plot-button">
                  Create New Plot
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GardenManagement;
