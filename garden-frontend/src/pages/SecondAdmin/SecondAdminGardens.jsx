import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SecondAdminGardens.scss';

function SecondAdminGardens() {
  const { user } = useAuth();
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  useEffect(() => {
    fetchGardens();
  }, [filters]);

  const fetchGardens = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: filters.status,
        search: filters.search,
      }).toString();

      const response = await fetch(`/api/second-admin/gardens?${queryParams}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch gardens');
      }
      
      setGardens(data.data.gardens);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (gardenId, newStatus) => {
    try {
      const response = await fetch(`/api/second-admin/gardens/${gardenId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update garden status');
      }

      setGardens(gardens.map(garden => 
        garden._id === gardenId ? { ...garden, status: newStatus } : garden
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading gardens...</div>;
  }

  return (
    <div className="second-admin-gardens">
      <header className="page-header">
        <h1>Garden Management</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search gardens..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="gardens-grid">
        {gardens.map(garden => (
          <div key={garden._id} className={`garden-card ${garden.status}`}>
            <div className="garden-header">
              <h2>{garden.name}</h2>
              <span className={`status-badge ${garden.status}`}>
                {garden.status}
              </span>
            </div>

            <div className="garden-details">
              <p><strong>Location:</strong> {garden.address.city}, {garden.address.state}</p>
              <p><strong>Members:</strong> {garden.stats.totalMembers}</p>
              <p><strong>Plots:</strong> {garden.stats.totalPlots}</p>
            </div>

            <div className="garden-actions">
              <select
                value={garden.status}
                onChange={(e) => handleStatusChange(garden._id, e.target.value)}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <button 
                onClick={() => window.location.href = `/gardens/${garden._id}`}
                className="view-details"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {gardens.length === 0 && (
        <div className="no-gardens">
          <p>No gardens found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default SecondAdminGardens;
