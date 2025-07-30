import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useGardenStore from '../../store/useGardenStore';
import { 
  Loader, 
  AlertTriangle,
  Clock,
  Check,
  X,
  AlertCircle,
  Filter
} from 'lucide-react';
import './Applications.scss';

const Applications = () => {
  const location = useLocation();
  const { 
    getMyApplications,
    withdrawApplication,
    isLoading,
    error
  } = useGardenStore();
  
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error('Error loading applications:', err);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await withdrawApplication(applicationId);
        // Refresh applications list
        loadApplications();
        setSuccessMessage('Application withdrawn successfully');
      } catch (err) {
        console.error('Error withdrawing application:', err);
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'approved':
        return <Check className="status-icon approved" />;
      case 'rejected':
        return <X className="status-icon rejected" />;
      case 'withdrawn':
        return <AlertCircle className="status-icon withdrawn" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="applications-loading">
        <Loader size={40} className="spinner" />
        <p>Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-error">
        <AlertTriangle size={40} />
        <h2>Error Loading Applications</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-btn"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <header className="applications-header">
        <div>
          <h1>My Applications</h1>
          <p>Track the status of your garden plot applications</p>
        </div>

        <div className="filter-section">
          <Filter size={20} />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </header>

      {successMessage && (
        <div className="success-message">
          <Check size={20} />
          <p>{successMessage}</p>
          <button 
            className="close-btn"
            onClick={() => setSuccessMessage('')}
          >
            ×
          </button>
        </div>
      )}

      <div className="applications-list">
        {filteredApplications.length > 0 ? (
          filteredApplications.map(application => (
            <div 
              key={application.id} 
              className={`application-card ${application.status}`}
            >
              <div className="application-header">
                <h2>{application.garden.name}</h2>
                <div className="status">
                  {getStatusIcon(application.status)}
                  <span>{application.status}</span>
                </div>
              </div>

              <div className="application-details">
                <div className="detail-group">
                  <label>Plot Size:</label>
                  <span>{application.plotSize}</span>
                </div>
                
                <div className="detail-group">
                  <label>Submitted:</label>
                  <span>{formatDate(application.submittedAt)}</span>
                </div>
                
                {application.reviewedAt && (
                  <div className="detail-group">
                    <label>Reviewed:</label>
                    <span>{formatDate(application.reviewedAt)}</span>
                  </div>
                )}
              </div>

              <div className="application-content">
                <div className="content-section">
                  <h3>Purpose:</h3>
                  <p>{application.purpose}</p>
                </div>
                
                <div className="content-section">
                  <h3>Experience:</h3>
                  <p>{application.experience}</p>
                </div>
                
                <div className="content-section">
                  <h3>Schedule:</h3>
                  <p>{application.schedule}</p>
                </div>

                {application.feedback && (
                  <div className="feedback-section">
                    <h3>Feedback:</h3>
                    <p>{application.feedback}</p>
                  </div>
                )}
              </div>

              {application.status === 'pending' && (
                <div className="application-actions">
                  <button 
                    onClick={() => handleWithdraw(application.id)}
                    className="withdraw-btn"
                  >
                    Withdraw Application
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-applications">
            <h3>No Applications Found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't submitted any applications yet."
                : `You have no ${filter} applications.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
