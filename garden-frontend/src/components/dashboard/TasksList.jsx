import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TasksList.scss';

const TasksList = ({ showActions = false, showPoints = false, limit = null }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = limit ? `/api/tasks/my-tasks?limit=${limit}` : '/api/tasks/my-tasks';
      const response = await fetch(url, {
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
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      // Refresh tasks after completion
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (loading) {
    return (
      <div className="tasks-list loading">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-list error">
        <div className="error-state">
          <span className="error-icon">❌</span>
          <p>Error loading tasks: {error}</p>
          <button onClick={fetchTasks} className="btn btn-outline">
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!tasks || tasks.length === 0) {
    return (
      <div className="tasks-list empty">
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <p>No tasks available</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#dc2626',
      medium: '#d97706',
      low: '#059669'
    };
    return colors[priority] || '#6b7280';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#d97706',
      'in-progress': '#2563eb',
      completed: '#059669'
    };
    return colors[status] || '#6b7280';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#059669',
      'Medium': '#d97706',
      'Hard': '#dc2626'
    };
    return colors[difficulty] || '#6b7280';
  };

  const handleTaskAction = async (taskId, action) => {
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
        case 'update':
          // Navigate to task update page
          window.location.href = `/tasks/${taskId}/edit`;
          return;
        case 'view':
          // Navigate to task details page
          window.location.href = `/tasks/${taskId}`;
          return;
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

      // Refresh tasks after action
      fetchTasks();
    } catch (error) {
      console.error(`Error ${action} task:`, error);
    }
  };

  return (
    <div className="tasks-list">
      {tasks.slice(0, 4).map((task) => (
        <div key={task.id} className="task-item">
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-badges">
              {task.priority && (
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              )}
              {task.status && (
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {task.status}
                </span>
              )}
              {task.difficulty && (
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(task.difficulty) }}
                >
                  {task.difficulty}
                </span>
              )}
            </div>
          </div>
          
          <div className="task-details">
            {task.garden && (
              <span className="task-garden">🌱 {task.garden}</span>
            )}
            {task.dueDate && (
              <span className="task-due-date">📅 Due: {task.dueDate}</span>
            )}
            {task.estimatedTime && (
              <span className="task-time">⏰ {task.estimatedTime}</span>
            )}
            {showPoints && task.points && (
              <span className="task-points">⭐ {task.points} points</span>
            )}
          </div>
          
          {showActions && (
            <div className="task-actions">
              {task.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleTaskAction(task.id, 'accept')}
                  >
                    Accept
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleTaskAction(task.id, 'view')}
                  >
                    View Details
                  </button>
                </>
              )}
              {task.status === 'in-progress' && (
                <>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => handleTaskAction(task.id, 'complete')}
                  >
                    Mark Done
                  </button>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleTaskAction(task.id, 'update')}
                  >
                    Update
                  </button>
                </>
              )}
              {!task.status && showPoints && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleTaskAction(task.id, 'volunteer')}
                >
                  Volunteer
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TasksList;
