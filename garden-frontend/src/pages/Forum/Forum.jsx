import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import './Forum.scss';

function Forum() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [activeCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/forum/categories', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const queryParams = new URLSearchParams({
        category: activeCategory !== 'all' ? activeCategory : '',
        sort: sortBy
      });

      const res = await fetch(`/api/forum/posts?${queryParams}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/forum/create');
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setLoading(true);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setLoading(true);
  };

  if (loading) {
    return <div className="loading">Loading forum posts...</div>;
  }

  return (
    <div className="forum">
      <div className="forum-header">
        <h2>Community Forum</h2>
        <button 
          className="create-post-btn"
          onClick={handleCreatePost}
        >
          Create New Post
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="forum-controls">
        <div className="categories">
          <button
            className={activeCategory === 'all' ? 'active' : ''}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category._id}
              className={activeCategory === category._id ? 'active' : ''}
              onClick={() => handleCategoryChange(category._id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="sort-control">
          <select value={sortBy} onChange={handleSortChange}>
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="comments">Most Comments</option>
          </select>
        </div>
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts found in this category.</p>
            <button onClick={handleCreatePost}>Create the first post</button>
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-card" onClick={() => navigate(`/forum/posts/${post._id}`)}>
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className="category-tag">{post.category.name}</span>
              </div>
              <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
              <div className="post-footer">
                <div className="post-meta">
                  <span className="author">
                    <img src={post.author.avatar || '/default-avatar.png'} alt="Author" />
                    {post.author.name}
                  </span>
                  <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="post-stats">
                  <span className="likes">{post.likes} likes</span>
                  <span className="comments">{post.comments.length} comments</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Forum;
