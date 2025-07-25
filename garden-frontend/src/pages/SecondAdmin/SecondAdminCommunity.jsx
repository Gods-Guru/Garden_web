import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './SecondAdminCommunity.scss';

function SecondAdminCommunity() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else {
      fetchReports();
    }
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/second-admin/community/posts', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      
      setPosts(data.data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/second-admin/community/reports', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch reports');
      }
      
      setReports(data.data.reports);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostModeration = async (postId, action) => {
    try {
      const response = await fetch(`/api/second-admin/community/posts/${postId}/${action}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to moderate post');
      }
      
      // Update posts list after moderation
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReportResolution = async (reportId, resolution) => {
    try {
      const response = await fetch(`/api/second-admin/community/reports/${reportId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ resolution })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to resolve report');
      }
      
      // Update reports list
      setReports(reports.filter(report => report._id !== reportId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading community data...</div>;
  }

  return (
    <div className="second-admin-community">
      <header className="page-header">
        <h1>Community Management</h1>
        <div className="tab-navigation">
          <button 
            className={activeTab === 'posts' ? 'active' : ''} 
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={activeTab === 'reports' ? 'active' : ''} 
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'posts' ? (
        <div className="posts-section">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className="post-meta">
                  by {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-actions">
                <button 
                  onClick={() => handlePostModeration(post._id, 'approve')}
                  className="approve"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handlePostModeration(post._id, 'remove')}
                  className="remove"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="reports-section">
          {reports.map(report => (
            <div key={report._id} className="report-card">
              <div className="report-header">
                <h3>Report #{report._id}</h3>
                <span className={`status ${report.status}`}>{report.status}</span>
              </div>
              <div className="report-details">
                <p><strong>Reported By:</strong> {report.reportedBy.name}</p>
                <p><strong>Type:</strong> {report.type}</p>
                <p><strong>Reason:</strong> {report.reason}</p>
                <p><strong>Content:</strong> {report.content}</p>
              </div>
              <div className="report-actions">
                <button 
                  onClick={() => handleReportResolution(report._id, 'resolved')}
                  className="resolve"
                >
                  Mark Resolved
                </button>
                <button 
                  onClick={() => handleReportResolution(report._id, 'dismissed')}
                  className="dismiss"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SecondAdminCommunity;
