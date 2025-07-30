import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './TaskDetails.scss';

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch task details');
      }

      const data = await response.json();
      setTask(data.task || data);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (action) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      let method = 'PATCH';

      switch (action) {
        case 'accept':
          endpoint = `/api/tasks/${taskId}/accept`;
          break;
        case 'complete':
          endpoint = `/api/tasks/${taskId}/complete`;
          break;
        case 'volunteer':
          endpoint = `/api/tasks/${taskId}/volunteer`;
          method = 'POST';
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} task`);
      }

      // Refresh task details
      fetchTaskDetails();
    } catch (error) {
      console.error(`Error ${action} task:`, error);
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#d97706',
      'in-progress': '#2563eb',
      completed: '#059669',
      cancelled: '#dc2626'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#dc2626',
      medium: '#d97706',
      low: '#059669'
    };
    return colors[priority] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="task-details-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-details-page">
        <Navbar />
        <div className="error-container">
          <div className="error-content">
            <span className="error-icon">❌</span>
            <h2>Error Loading Task</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={fetchTaskDetails} className="btn btn-primary">
                Try Again
              </button>
              <Link to="/tasks" className="btn btn-outline">
                Back to Tasks
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-page">
        <Navbar />
        <div className="error-container">
          <div className="error-content">
            <span className="error-icon">📝</span>
            <h2>Task Not Found</h2>
            <p>The task you're looking for doesn't exist or has been removed.</p>
            <Link to="/tasks" className="btn btn-primary">
              Back to Tasks
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="task-details-page">
      <Navbar />
      
      <div className="task-details-container">
        <div className="task-details-header">
          <div className="breadcrumb">
            <Link to="/tasks">Tasks</Link>
            <span className="separator">›</span>
            <span className="current">Task Details</span>
          </div>
          
          <div className="task-title-section">
            <h1>{task.title}</h1>
            <div className="task-badges">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(task.status) }}
              >
                {task.status}
              </span>
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority} priority
              </span>
              {task.difficulty && (
                <span className="difficulty-badge">
                  {task.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="task-details-content">
          <div className="task-main-info">
            <div className="task-description">
              <h3>Description</h3>
              <p>{task.description || 'No description provided.'}</p>
            </div>

            {task.instructions && (
              <div className="task-instructions">
                <h3>Instructions</h3>
                <div className="instructions-content">
                  {task.instructions.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="task-details-grid">
              <div className="detail-item">
                <span className="detail-label">Garden:</span>
                <span className="detail-value">
                  {task.garden?.name || 'Not specified'}
                </span>
              </div>
              
              {task.plot && (
                <div className="detail-item">
                  <span className="detail-label">Plot:</span>
                  <span className="detail-value">{task.plot.name}</span>
                </div>
              )}
              
              {task.dueDate && (
                <div className="detail-item">
                  <span className="detail-label">Due Date:</span>
                  <span className="detail-value">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {task.estimatedTime && (
                <div className="detail-item">
                  <span className="detail-label">Estimated Time:</span>
                  <span className="detail-value">{task.estimatedTime}</span>
                </div>
              )}
              
              {task.points && (
                <div className="detail-item">
                  <span className="detail-label">Points:</span>
                  <span className="detail-value">⭐ {task.points}</span>
                </div>
              )}
              
              {task.assignedTo && (
                <div className="detail-item">
                  <span className="detail-label">Assigned To:</span>
                  <span className="detail-value">{task.assignedTo.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="task-actions-panel">
            <h3>Actions</h3>
            
            {task.status === 'pending' && (
              <div className="action-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleTaskAction('accept')}
                  disabled={actionLoading}
                >
                  Accept Task
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => handleTaskAction('volunteer')}
                  disabled={actionLoading}
                >
                  Volunteer for Task
                </button>
              </div>
            )}
            
            {task.status === 'in-progress' && (
              <div className="action-buttons">
                <button 
                  className="btn btn-success"
                  onClick={() => handleTaskAction('complete')}
                  disabled={actionLoading}
                >
                  Mark as Complete
                </button>
                <Link 
                  to={`/tasks/${taskId}/edit`}
                  className="btn btn-outline"
                >
                  Update Progress
                </Link>
              </div>
            )}
            
            {task.status === 'completed' && (
              <div className="completion-info">
                <span className="completion-icon">✅</span>
                <p>This task has been completed!</p>
                {task.completedAt && (
                  <p className="completion-date">
                    Completed on {new Date(task.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="navigation-buttons">
              <Link to="/tasks" className="btn btn-outline">
                Back to Tasks
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TaskDetails;
