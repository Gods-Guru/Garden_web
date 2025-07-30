import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './ApplicationManagement.scss';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const itemsPerPage = 15;

  useEffect(() => {
    fetchApplications();
  }, [currentPage, filter]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = `/api/admin/applications?page=${currentPage}&limit=${itemsPerPage}`;
      if (filter !== 'all') {
        endpoint += `&status=${filter}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.message);
      // Mock data for development
      setApplications([
        {
          id: 1,
          type: 'plot_application',
          applicant: { name: 'John Doe', email: 'john@example.com' },
          garden: { name: 'Community Garden A' },
          status: 'pending',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          plotRequested: 'A-15'
        },
        {
          id: 2,
          type: 'volunteer_application',
          applicant: { name: 'Jane Smith', email: 'jane@example.com' },
          garden: { name: 'Community Garden B' },
          status: 'approved',
          submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/applications/${applicationId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} application`);
      }

      fetchApplications();
    } catch (error) {
      console.error(`Error ${action} application:`, error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="application-management-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading applications...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="application-management-page">
      <Navbar />
      
      <div className="application-management-container">
        <div className="page-header">
          <h1>Application Management</h1>
          <p>Review and manage all garden applications</p>
        </div>

        <div className="applications-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Applications
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved
            </button>
            <button 
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>Error: {error}</span>
          </div>
        )}

        <div className="applications-list">
          {applications.length > 0 ? (
            applications.map((application) => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <div className="application-type">
                    <span className="type-badge">
                      {application.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="application-status">
                    <span className={`status-badge ${application.status}`}>
                      {application.status}
                    </span>
                  </div>
                </div>

                <div className="application-content">
                  <div className="applicant-info">
                    <h3>{application.applicant.name}</h3>
                    <p>{application.applicant.email}</p>
                  </div>

                  <div className="application-details">
                    <p><strong>Garden:</strong> {application.garden.name}</p>
                    {application.plotRequested && (
                      <p><strong>Plot Requested:</strong> {application.plotRequested}</p>
                    )}
                    <p><strong>Submitted:</strong> {application.submittedAt.toLocaleDateString()}</p>
                  </div>
                </div>

                {application.status === 'pending' && (
                  <div className="application-actions">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleApplicationAction(application.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleApplicationAction(application.id, 'reject')}
                    >
                      Reject
                    </button>
                    <Link 
                      to={`/admin/applications/${application.id}`}
                      className="btn btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-applications">
              <span className="empty-icon">📝</span>
              <h3>No applications found</h3>
              <p>No applications match your current filter.</p>
            </div>
          )}
        </div>

        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage}
          </div>
          
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ApplicationManagement;
