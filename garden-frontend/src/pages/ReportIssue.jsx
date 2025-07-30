import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Camera, Send, CheckCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import useAuthStore from '../store/useAuthStore';
import api from '../api/api';
import '../styles/pagestyles/ReportIssue.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ReportIssue = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    issueType: '',
    subject: '',
    description: '',
    priority: 'medium',
    photo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const issueTypes = [
    { value: 'plot', label: 'Plot Issue', description: 'Problems with your assigned plot' },
    { value: 'facility', label: 'Facility Issue', description: 'Issues with garden facilities (water, tools, etc.)' },
    { value: 'pest', label: 'Pest Problem', description: 'Pest or disease affecting plants' },
    { value: 'maintenance', label: 'Maintenance Request', description: 'General maintenance needed' },
    { value: 'safety', label: 'Safety Concern', description: 'Safety hazards or concerns' },
    { value: 'community', label: 'Community Issue', description: 'Issues with other gardeners or behavior' },
    { value: 'other', label: 'Other', description: 'Any other garden-related issue' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#48bb78' },
    { value: 'medium', label: 'Medium', color: '#ed8936' },
    { value: 'high', label: 'High', color: '#f56565' },
    { value: 'urgent', label: 'Urgent', color: '#e53e3e' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('issueType', formData.issueType);
      submitData.append('subject', formData.subject);
      submitData.append('description', formData.description);
      submitData.append('priority', formData.priority);
      
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      await api.post('/complaints', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit issue report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="report-issue-page">
        <Navbar />
        <main className="report-main">
          <motion.div 
            className="success-container"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="container">
              <div className="success-content">
                <CheckCircle size={64} className="success-icon" />
                <h1>Issue Reported Successfully!</h1>
                <p>
                  Thank you for reporting this issue. Our team has been notified and will 
                  review your report shortly. You'll receive updates on the status of your 
                  report via email.
                </p>
                <div className="success-actions">
                  <a href="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                  </a>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        issueType: '',
                        subject: '',
                        description: '',
                        priority: 'medium',
                        photo: null
                      });
                    }}
                  >
                    Report Another Issue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="report-issue-page">
      <Navbar />
      
      <main className="report-main">
        <motion.div 
          className="report-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <div className="report-header">
              <AlertTriangle size={48} className="header-icon" />
              <h1>Report an Issue</h1>
              <p>Help us maintain a great garden community by reporting any issues or concerns</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-section">
                <h2>Issue Type</h2>
                <div className="issue-types-grid">
                  {issueTypes.map(type => (
                    <label key={type.value} className="issue-type-card">
                      <input
                        type="radio"
                        name="issueType"
                        value={type.value}
                        checked={formData.issueType === type.value}
                        onChange={handleChange}
                        required
                      />
                      <div className="card-content">
                        <h3>{type.label}</h3>
                        <p>{type.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>Issue Details</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Brief summary of the issue"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    >
                      {priorityLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Please provide detailed information about the issue, including when it occurred, where it's located, and any other relevant details..."
                    rows={6}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Photo (Optional)</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="upload-label">
                      <Camera size={20} />
                      {formData.photo ? formData.photo.name : 'Add a photo to help us understand the issue'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-small"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportIssue;
