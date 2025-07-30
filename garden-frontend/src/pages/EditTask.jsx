import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './EditTask.scss';

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [task, setTask] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    priority: 'medium',
    difficulty: 'medium',
    estimatedTime: '',
    dueDate: '',
    notes: '',
    status: 'pending'
  });

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
      const taskData = data.task || data;
      setTask(taskData);
      
      // Populate form with existing data
      setFormData({
        title: taskData.title || '',
        description: taskData.description || '',
        instructions: taskData.instructions || '',
        priority: taskData.priority || 'medium',
        difficulty: taskData.difficulty || 'medium',
        estimatedTime: taskData.estimatedTime || '',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : '',
        notes: taskData.notes || '',
        status: taskData.status || 'pending'
      });
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task');
      }

      // Success - redirect back to task details
      navigate(`/tasks/${taskId}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-task-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading task details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="edit-task-page">
        <Navbar />
        <div className="error-container">
          <div className="error-content">
            <span className="error-icon">❌</span>
            <h2>Error Loading Task</h2>
            <p>{error}</p>
            <button onClick={fetchTaskDetails} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="edit-task-page">
      <Navbar />
      
      <div className="edit-task-container">
        <div className="edit-task-header">
          <h1>Edit Task</h1>
          <p>Update task details and progress</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-task-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe what needs to be done..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows="4"
              placeholder="Step-by-step instructions..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                type="text"
                id="estimatedTime"
                name="estimatedTime"
                value={formData.estimatedTime}
                onChange={handleInputChange}
                placeholder="e.g., 2 hours, 30 minutes"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Progress Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Add any progress notes or updates..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(`/tasks/${taskId}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditTask;
