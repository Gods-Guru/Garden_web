import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, FiFilter, FiSearch, FiCalendar, FiClock, FiCheckCircle,
  FiAlertCircle, FiUser, FiMapPin, FiEdit3, FiTrash2, FiPlay
} from 'react-icons/fi';
import useAuthStore from '../store/useAuthStore';
import useNotificationStore from '../store/useNotificationStore';
import './Tasks.scss';

const Tasks = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useNotificationStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockTasks = [
        {
          id: 1,
          title: 'Water tomato plants',
          description: 'Water the tomato plants in plot A-12, check soil moisture first',
          status: 'pending',
          priority: 'high',
          category: 'watering',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          estimatedDuration: 30,
          assignedTo: [{ user: user.id, role: 'assignee' }],
          createdBy: user.id,
          garden: { id: 1, name: 'Sunny Acres Community Garden' },
          plot: { id: 1, number: 'A-12' },
          progress: { percentage: 0 },
          tags: ['watering', 'tomatoes'],
          createdAt: new Date('2024-05-10')
        },
        {
          id: 2,
          title: 'Harvest lettuce',
          description: 'Harvest mature lettuce heads from plot B-05',
          status: 'in-progress',
          priority: 'medium',
          category: 'harvesting',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          estimatedDuration: 45,
          assignedTo: [{ user: user.id, role: 'assignee' }],
          createdBy: user.id,
          garden: { id: 1, name: 'Sunny Acres Community Garden' },
          plot: { id: 2, number: 'B-05' },
          progress: { percentage: 25 },
          tags: ['harvesting', 'lettuce'],
          createdAt: new Date('2024-05-12'),
          startedAt: new Date('2024-05-14')
        },
        {
          id: 3,
          title: 'Weed garden beds',
          description: 'Remove weeds from community herb garden area',
          status: 'overdue',
          priority: 'low',
          category: 'weeding',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          estimatedDuration: 60,
          assignedTo: [{ user: user.id, role: 'assignee' }],
          createdBy: user.id,
          garden: { id: 1, name: 'Sunny Acres Community Garden' },
          plot: null,
          progress: { percentage: 0 },
          tags: ['weeding', 'maintenance'],
          createdAt: new Date('2024-05-08')
        },
        {
          id: 4,
          title: 'Plant spring seeds',
          description: 'Plant carrot and radish seeds in designated area',
          status: 'completed',
          priority: 'medium',
          category: 'planting',
          dueDate: new Date('2024-05-10'),
          estimatedDuration: 90,
          assignedTo: [{ user: user.id, role: 'assignee' }],
          createdBy: user.id,
          garden: { id: 1, name: 'Sunny Acres Community Garden' },
          plot: { id: 1, number: 'A-12' },
          progress: { percentage: 100 },
          tags: ['planting', 'seeds'],
          createdAt: new Date('2024-05-05'),
          completedAt: new Date('2024-05-10')
        }
      ];

      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="status-icon completed" />;
      case 'in-progress': return <FiPlay className="status-icon in-progress" />;
      case 'overdue': return <FiAlertCircle className="status-icon overdue" />;
      default: return <FiClock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'overdue': return 'red';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      switch (action) {
        case 'start':
          showSuccess('Task started');
          break;
        case 'complete':
          showSuccess('Task completed');
          break;
        case 'delete':
          showSuccess('Task deleted');
          break;
        default:
          break;
      }
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      showError(`Failed to ${action} task`);
    }
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.status === 'overdue').length
    };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="tasks-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="tasks-header">
        <div className="header-content">
          <div className="header-left">
            <h1>My Tasks</h1>
            <p>Manage your garden tasks and activities</p>
          </div>
          <div className="header-actions">
            <Link to="/tasks/new" className="btn btn-primary">
              <FiPlus /> Create Task
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="tasks-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-item pending">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item in-progress">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item completed">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          {stats.overdue > 0 && (
            <div className="stat-item overdue">
              <span className="stat-number">{stats.overdue}</span>
              <span className="stat-label">Overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="tasks-controls">
        <div className="controls-left">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="filter-dropdown">
              <FiFilter className="filter-icon" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="filter-dropdown">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="controls-right">
          <div className="sort-dropdown">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
              <option value="created">Sort by Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-container">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="empty-state">
            <FiClock className="empty-icon" />
            <h3>No tasks found</h3>
            <p>
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any tasks yet. Create one to get started!'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && filterPriority === 'all' && (
              <Link to="/tasks/new" className="btn btn-primary">
                <FiPlus /> Create Task
              </Link>
            )}
          </div>
        ) : (
          <div className="tasks-list">
            {filteredAndSortedTasks.map(task => (
              <div key={task.id} className={`task-card ${task.status}`}>
                <div className="task-header">
                  <div className="task-status">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="task-title">
                    <h3>
                      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                    </h3>
                    <div className="task-meta">
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="category-badge">
                        {task.category}
                      </span>
                      {task.plot && (
                        <span className="plot-badge">
                          <FiMapPin /> {task.plot.number}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <Link to={`/tasks/${task.id}/edit`} className="action-btn">
                      <FiEdit3 />
                    </Link>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleTaskAction(task.id, 'delete')}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="task-content">
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-details">
                    <div className="detail-item">
                      <FiCalendar className="detail-icon" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="detail-item">
                      <FiClock className="detail-icon" />
                      <span>Est: {formatDuration(task.estimatedDuration)}</span>
                    </div>
                    <div className="detail-item">
                      <FiUser className="detail-icon" />
                      <span>{task.garden.name}</span>
                    </div>
                  </div>

                  {task.progress.percentage > 0 && (
                    <div className="task-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${task.progress.percentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{task.progress.percentage}%</span>
                    </div>
                  )}

                  {task.tags.length > 0 && (
                    <div className="task-tags">
                      {task.tags.map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="task-footer">
                  <div className="task-dates">
                    <span className="created-date">
                      Created {formatDate(task.createdAt)}
                    </span>
                    {task.startedAt && (
                      <span className="started-date">
                        Started {formatDate(task.startedAt)}
                      </span>
                    )}
                    {task.completedAt && (
                      <span className="completed-date">
                        Completed {formatDate(task.completedAt)}
                      </span>
                    )}
                  </div>

                  <div className="task-buttons">
                    {task.status === 'pending' && (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleTaskAction(task.id, 'start')}
                      >
                        <FiPlay /> Start
                      </button>
                    )}
                    {task.status === 'in-progress' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleTaskAction(task.id, 'complete')}
                      >
                        <FiCheckCircle /> Complete
                      </button>
                    )}
                    <Link 
                      to={`/tasks/${task.id}`}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
