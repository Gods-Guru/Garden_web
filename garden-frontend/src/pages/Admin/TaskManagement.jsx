import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import './TaskManagement.scss';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const itemsPerPage = 15;

  useEffect(() => {
    fetchTasks();
  }, [currentPage, filter]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = `/api/admin/tasks?page=${currentPage}&limit=${itemsPerPage}`;
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
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
      // Mock data for development
      setTasks([
        {
          id: 1,
          title: 'Water Garden Beds',
          description: 'Water all vegetable beds in section A',
          status: 'pending',
          priority: 'high',
          assignedTo: { name: 'John Doe' },
          garden: { name: 'Community Garden A' },
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          title: 'Harvest Tomatoes',
          description: 'Harvest ripe tomatoes from plots 15-20',
          status: 'in_progress',
          priority: 'medium',
          assignedTo: { name: 'Jane Smith' },
          garden: { name: 'Community Garden B' },
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/tasks/${taskId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} task`);
      }

      fetchTasks();
    } catch (error) {
      console.error(`Error ${action} task:`, error);
      setError(error.message);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#059669',
      medium: '#d97706',
      high: '#dc2626',
      urgent: '#7c2d12'
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#d97706',
      in_progress: '#2563eb',
      completed: '#059669',
      cancelled: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="task-management-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="task-management-page">
      <Navbar />
      
      <div className="task-management-container">
        <div className="page-header">
          <h1>Task Management</h1>
          <p>Manage and oversee all garden tasks</p>
        </div>

        <div className="tasks-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
              onClick={() => setFilter('in_progress')}
            >
              In Progress
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <Link to="/admin/tasks/create" className="btn btn-primary">
            Create New Task
          </Link>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>Error: {error}</span>
          </div>
        )}

        <div className="tasks-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <div className="task-title">
                    <h3>{task.title}</h3>
                    <div className="task-badges">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority}
                      </span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="task-content">
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-details">
                    <div className="detail-item">
                      <strong>Garden:</strong> {task.garden.name}
                    </div>
                    {task.assignedTo && (
                      <div className="detail-item">
                        <strong>Assigned to:</strong> {task.assignedTo.name}
                      </div>
                    )}
                    <div className="detail-item">
                      <strong>Due Date:</strong> {task.dueDate.toLocaleDateString()}
                    </div>
                    <div className="detail-item">
                      <strong>Created:</strong> {task.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="task-actions">
                  <Link 
                    to={`/admin/tasks/${task.id}`}
                    className="btn btn-outline"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/admin/tasks/${task.id}/edit`}
                    className="btn btn-primary"
                  >
                    Edit
                  </Link>
                  {task.status === 'pending' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleTaskAction(task.id, 'start')}
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'in_progress' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleTaskAction(task.id, 'complete')}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-tasks">
              <span className="empty-icon">📋</span>
              <h3>No tasks found</h3>
              <p>No tasks match your current filter.</p>
              <Link to="/admin/tasks/create" className="btn btn-primary">
                Create First Task
              </Link>
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

export default TaskManagement;
