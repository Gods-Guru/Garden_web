import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './Forum.scss';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, questions, discussions, tips
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filter]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = `/api/forum/posts?page=${currentPage}&limit=${itemsPerPage}`;
      if (filter !== 'all') {
        endpoint += `&category=${filter}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch forum posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      setError(error.message);
      // Fallback mock data for development
      setPosts([
        {
          id: 1,
          title: 'Best practices for tomato growing?',
          content: 'I\'m new to growing tomatoes and would love some advice...',
          author: { name: 'Sarah Johnson', avatar: null },
          category: 'questions',
          replies: 5,
          likes: 12,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          lastReply: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 2,
          title: 'Community Garden Cleanup Day Success!',
          content: 'Thanks to everyone who participated in yesterday\'s cleanup...',
          author: { name: 'Mike Wilson', avatar: null },
          category: 'discussions',
          replies: 8,
          likes: 25,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          lastReply: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 3,
          title: 'Composting 101: Getting Started',
          content: 'Here\'s a beginner\'s guide to composting in your garden plot...',
          author: { name: 'Emma Davis', avatar: null },
          category: 'tips',
          replies: 3,
          likes: 18,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          lastReply: new Date(Date.now() - 12 * 60 * 60 * 1000)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      questions: '❓',
      discussions: '💬',
      tips: '💡',
      announcements: '📢'
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category) => {
    const colors = {
      questions: '#2563eb',
      discussions: '#059669',
      tips: '#d97706',
      announcements: '#dc2626'
    };
    return colors[category] || '#6b7280';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const getFilteredPosts = () => {
    if (filter === 'all') return posts;
    return posts.filter(post => post.category === filter);
  };

  if (loading) {
    return (
      <div className="forum-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading forum posts...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="forum-page">
      <Navbar />
      
      <div className="forum-container">
        <div className="forum-header">
          <h1>Community Forum</h1>
          <p>Connect with fellow gardeners, ask questions, and share knowledge</p>
        </div>

        <div className="forum-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Posts
            </button>
            <button 
              className={`filter-btn ${filter === 'questions' ? 'active' : ''}`}
              onClick={() => setFilter('questions')}
            >
              ❓ Questions
            </button>
            <button 
              className={`filter-btn ${filter === 'discussions' ? 'active' : ''}`}
              onClick={() => setFilter('discussions')}
            >
              💬 Discussions
            </button>
            <button 
              className={`filter-btn ${filter === 'tips' ? 'active' : ''}`}
              onClick={() => setFilter('tips')}
            >
              💡 Tips & Guides
            </button>
          </div>

          <Link to="/forum/new-post" className="btn btn-primary">
            Create New Post
          </Link>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>Error loading forum posts: {error}</span>
          </div>
        )}

        <div className="forum-posts">
          {getFilteredPosts().length > 0 ? (
            getFilteredPosts().map((post) => (
              <div key={post.id} className="forum-post">
                <div className="post-header">
                  <div className="post-category">
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {getCategoryIcon(post.category)} {post.category}
                    </span>
                  </div>
                  <div className="post-meta">
                    <span className="post-time">{getTimeAgo(post.createdAt)}</span>
                  </div>
                </div>

                <div className="post-content">
                  <h3 className="post-title">
                    <Link to={`/forum/posts/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="post-excerpt">
                    {post.content.length > 150 
                      ? `${post.content.substring(0, 150)}...` 
                      : post.content
                    }
                  </p>
                </div>

                <div className="post-footer">
                  <div className="post-author">
                    <div className="author-avatar">
                      {post.author.avatar ? (
                        <img src={post.author.avatar} alt={post.author.name} />
                      ) : (
                        <span className="avatar-placeholder">
                          {post.author.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="author-name">{post.author.name}</span>
                  </div>

                  <div className="post-stats">
                    <span className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-count">{post.replies}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">👍</span>
                      <span className="stat-count">{post.likes}</span>
                    </span>
                    {post.lastReply && (
                      <span className="last-reply">
                        Last reply {getTimeAgo(post.lastReply)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-forum">
              <span className="empty-icon">💬</span>
              <h3>No posts found</h3>
              <p>
                {filter === 'all' 
                  ? "Be the first to start a conversation!"
                  : `No posts in the ${filter} category yet.`
                }
              </p>
              <Link to="/forum/new-post" className="btn btn-primary">
                Create First Post
              </Link>
            </div>
          )}
        </div>

        {posts.length > itemsPerPage && (
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
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Forum;
