import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAuthStore from '../../store/useAuthStore';
import '../../styles/pagestyles/AdminGardens.scss';

const AdminGardens = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, inactive, pending
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGardens();
  }, [filter]);

  const fetchGardens = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock gardens data
      const mockGardens = [
        {
          id: 1,
          name: 'Central Community Garden',
          location: '123 Main Street, Green City',
          status: 'active',
          owner: 'John Smith',
          members: 45,
          plots: { total: 50, occupied: 42 },
          createdDate: '2023-05-15',
          lastActivity: '2024-03-20',
          description: 'A thriving community garden in the heart of the city',
          image: '/api/placeholder/300/200'
        },
        {
          id: 2,
          name: 'East Side Garden',
          location: '456 Oak Avenue, Green City',
          status: 'active',
          owner: 'Sarah Johnson',
          members: 28,
          plots: { total: 30, occupied: 25 },
          createdDate: '2023-08-20',
          lastActivity: '2024-03-19',
          description: 'Family-friendly garden with educational programs',
          image: '/api/placeholder/300/200'
        },
        {
          id: 3,
          name: 'Herb Garden Collective',
          location: '789 Pine Street, Green City',
          status: 'inactive',
          owner: 'Mike Chen',
          members: 12,
          plots: { total: 15, occupied: 8 },
          createdDate: '2024-01-10',
          lastActivity: '2024-02-15',
          description: 'Specialized herb and medicinal plant garden',
          image: '/api/placeholder/300/200'
        },
        {
          id: 4,
          name: 'Sunset Community Plot',
          location: '321 Elm Drive, Green City',
          status: 'pending',
          owner: 'Emily Davis',
          members: 5,
          plots: { total: 20, occupied: 0 },
          createdDate: '2024-03-18',
          lastActivity: '2024-03-18',
          description: 'New garden awaiting approval and setup',
          image: '/api/placeholder/300/200'
        }
      ];
      
      setGardens(mockGardens);
    } catch (err) {
      setError('Failed to load gardens. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredGardens = gardens.filter(garden => {
    const matchesSearch = garden.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garden.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garden.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && garden.status === filter;
  });

  const handleStatusChange = async (gardenId, newStatus) => {
    try {
      setGardens(gardens.map(g => 
        g.id === gardenId ? { ...g, status: newStatus } : g
      ));
    } catch (err) {
      console.error('Failed to update garden status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOccupancyRate = (plots) => {
    return Math.round((plots.occupied / plots.total) * 100);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="admin-gardens-page">
        <Navbar />
        <div className="unauthorized">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-gardens-page">
      <Navbar />
      
      <div className="admin-gardens-container">
        {/* Header */}
        <div className="admin-gardens-header">
          <div className="header-content">
            <h1>🌱 Garden Management</h1>
            <p>Oversee all community gardens and their operations</p>
          </div>
          
          <div className="header-actions">
            <Link to="/admin/create-garden" className="btn btn-primary">
              Create Garden
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="garden-stats">
          <div className="stat-card">
            <div className="stat-number">{gardens.length}</div>
            <div className="stat-label">Total Gardens</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{gardens.filter(g => g.status === 'active').length}</div>
            <div className="stat-label">Active Gardens</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{gardens.reduce((sum, g) => sum + g.members, 0)}</div>
            <div className="stat-label">Total Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{gardens.reduce((sum, g) => sum + g.plots.total, 0)}</div>
            <div className="stat-label">Total Plots</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="gardens-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search gardens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Gardens
            </button>
            <button
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-tab ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="gardens-content">
          {loading ? (
            <LoadingSpinner message="Loading gardens..." />
          ) : error ? (
            <div className="error-state">
              <h3>Unable to load gardens</h3>
              <p>{error}</p>
              <button onClick={fetchGardens} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : filteredGardens.length === 0 ? (
            <div className="empty-state">
              <h3>No gardens found</h3>
              <p>
                {searchTerm 
                  ? `No gardens match "${searchTerm}"`
                  : 'No gardens available for the selected filter'
                }
              </p>
              <Link to="/admin/create-garden" className="btn btn-primary">
                Create First Garden
              </Link>
            </div>
          ) : (
            <div className="gardens-grid">
              {filteredGardens.map(garden => (
                <div key={garden.id} className="garden-card">
                  <div className="garden-image">
                    <img src={garden.image} alt={garden.name} />
                    <div className={`garden-status ${getStatusColor(garden.status)}`}>
                      {garden.status}
                    </div>
                  </div>
                  
                  <div className="garden-content">
                    <h3 className="garden-name">{garden.name}</h3>
                    <p className="garden-location">📍 {garden.location}</p>
                    <p className="garden-description">{garden.description}</p>
                    
                    <div className="garden-stats-mini">
                      <div className="stat-item">
                        <span className="stat-value">{garden.members}</span>
                        <span className="stat-label">Members</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{garden.plots.occupied}/{garden.plots.total}</span>
                        <span className="stat-label">Plots</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{getOccupancyRate(garden.plots)}%</span>
                        <span className="stat-label">Occupied</span>
                      </div>
                    </div>
                    
                    <div className="garden-meta">
                      <div className="garden-owner">👤 {garden.owner}</div>
                      <div className="garden-created">📅 {formatDate(garden.createdDate)}</div>
                      <div className="garden-activity">🕒 {formatDate(garden.lastActivity)}</div>
                    </div>
                    
                    <div className="garden-actions">
                      <Link to={`/gardens/${garden.id}`} className="btn btn-secondary">
                        View Garden
                      </Link>
                      <Link to={`/admin/gardens/${garden.id}/edit`} className="btn btn-primary">
                        Manage
                      </Link>
                    </div>
                    
                    <div className="status-controls">
                      <select
                        value={garden.status}
                        onChange={(e) => handleStatusChange(garden.id, e.target.value)}
                        className={`status-select ${getStatusColor(garden.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminGardens;
