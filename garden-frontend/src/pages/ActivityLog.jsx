import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Calendar, Camera, Save, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import useAuthStore from '../store/useAuthStore';
import api from '../api/api';
import '../styles/pagestyles/ActivityLog.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ActivityLog = () => {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [formData, setFormData] = useState({
    activity: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    photo: null
  });

  const activityTypes = [
    'Watering', 'Planting', 'Weeding', 'Harvesting', 'Fertilizing', 
    'Pruning', 'Pest Control', 'Soil Preparation', 'Mulching', 'Other'
  ];

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const response = await api.get(`/logs/user/${user.id}`);
      setLogs(response.data.logs);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const logData = new FormData();
    logData.append('activity', formData.activity);
    logData.append('description', formData.description);
    logData.append('date', formData.date);
    if (formData.photo) {
      logData.append('photo', formData.photo);
    }

    try {
      if (editingLog) {
        const response = await api.put(`/logs/${editingLog._id}`, logData);
        setLogs(logs.map(log => log._id === editingLog._id ? response.data.log : log));
        setEditingLog(null);
      } else {
        const response = await api.post('/logs', logData);
        setLogs([response.data.log, ...logs]);
        setShowAddForm(false);
      }
      
      setFormData({
        activity: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        photo: null
      });
    } catch (err) {
      console.error('Failed to save activity log:', err);
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      activity: log.activity,
      description: log.description,
      date: new Date(log.date).toISOString().split('T')[0],
      photo: null
    });
    setShowAddForm(true);
  };

  const handleDelete = async (logId) => {
    if (!confirm('Are you sure you want to delete this activity log?')) return;
    
    try {
      await api.delete(`/logs/${logId}`);
      setLogs(logs.filter(log => log._id !== logId));
    } catch (err) {
      console.error('Failed to delete activity log:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      activity: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      photo: null
    });
    setShowAddForm(false);
    setEditingLog(null);
  };

  if (loading) {
    return (
      <div className="activity-log-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your activity logs...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="activity-log-page">
      <Navbar />
      
      <main className="activity-log-main">
        <motion.div 
          className="activity-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <div className="activity-header">
              <h1>Garden Activity Log</h1>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={16} />
                Add Activity
              </button>
            </div>

            {(showAddForm || editingLog) && (
              <motion.div 
                className="add-form-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <form onSubmit={handleSubmit} className="activity-form">
                  <h3>{editingLog ? 'Edit Activity' : 'Add New Activity'}</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Activity Type</label>
                      <select
                        value={formData.activity}
                        onChange={(e) => setFormData({...formData, activity: e.target.value})}
                        required
                      >
                        <option value="">Select activity type</option>
                        {activityTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe what you did in your garden..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Photo (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      <Save size={16} />
                      {editingLog ? 'Update' : 'Save'} Activity
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="activity-list">
              {logs.length === 0 ? (
                <div className="no-logs">
                  <Calendar size={48} />
                  <h3>No activities logged yet</h3>
                  <p>Start tracking your garden activities to monitor your progress!</p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <motion.div 
                    key={log._id}
                    className="activity-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="activity-content">
                      <div className="activity-header-item">
                        <h3>{log.activity}</h3>
                        <div className="activity-actions">
                          <button 
                            className="btn-icon"
                            onClick={() => handleEdit(log)}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            className="btn-icon delete"
                            onClick={() => handleDelete(log._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="activity-meta">
                        <span className="activity-date">
                          <Calendar size={14} />
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="activity-description">{log.description}</p>
                      
                      {log.photo && (
                        <div className="activity-photo">
                          <img src={log.photo} alt="Activity photo" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ActivityLog;
