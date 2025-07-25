import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from '../common/LoadingSpinner';
import './TaskList.scss';

const TaskList = ({ limit = null, gardenId = null }) => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue

  useEffect(() => {
    fetchTasks();
  }, [gardenId, filter]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      let url = '/api/tasks';
      const params = new URLSearchParams();
      
      if (gardenId) params.append('gardenId', gardenId);
      if (filter !== 'all') params.append('status', filter);
      if (limit) params.append('limit', limit);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
      }

      setTasks(data.data.tasks || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markTaskComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.map(task => 
          task._id === taskId 
            ? { ...task, status: 'completed', completedAt: new Date() }
            : task
        ));
      }
    } catch (err) {
      console.error('Failed to mark task complete:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getStatusColor = (status, dueDate) => {
    if (status === 'completed') return 'status-completed';
    if (dueDate && new Date(dueDate) < new Date()) return 'status-overdue';
    return 'status-pending';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner size="small" message="Loading tasks..." />;
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>Tasks</h3>
        {!limit && (
          <div className="task-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="task-error">
          <p>Error loading tasks: {error}</p>
          <button onClick={fetchTasks} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {tasks.length === 0 && !loading && !error ? (
        <div className="task-empty">
          <p>No tasks found</p>
          {gardenId && (
            <p className="task-empty-subtitle">
              Tasks will appear here when they're assigned to you
            </p>
          )}
        </div>
      ) : (
        <div className="task-items">
          {tasks.map(task => (
            <div key={task._id} className="task-item">
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => markTaskComplete(task._id)}
                  disabled={task.status === 'completed'}
                />
              </div>

              <div className="task-content">
                <div className="task-main">
                  <h4 className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                </div>

                <div className="task-meta">
                  <div className="task-badges">
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`status-badge ${getStatusColor(task.status, task.dueDate)}`}>
                      {task.status === 'completed' ? 'completed' : 
                       task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : 'pending'}
                    </span>
                  </div>

                  <div className="task-details">
                    {task.dueDate && (
                      <span className="task-due-date">
                        Due: {formatDate(task.dueDate)}
                      </span>
                    )}
                    {task.garden && (
                      <span className="task-garden">
                        {task.garden.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {limit && tasks.length >= limit && (
        <div className="task-view-all">
          <button className="view-all-btn">
            View All Tasks →
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
