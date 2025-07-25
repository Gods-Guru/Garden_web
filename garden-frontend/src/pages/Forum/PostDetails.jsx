import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PostDetails.scss';

function PostDetails() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPost(data.post);
      setIsLiked(data.post.likes.includes(user?._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setComments(data.comments);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/forum/posts/${postId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPost(prev => ({
        ...prev,
        likes: data.likes
      }));
      setIsLiked(!isLiked);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setComments(prev => [...prev, data.comment]);
      setNewComment('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/forum/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      navigate('/forum');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  return (
    <div className="post-details">
      {error && <div className="error">{error}</div>}
      
      <div className="post-content">
        <div className="post-header">
          <h2>{post.title}</h2>
          <div className="post-meta">
            <span className="author">
              <img src={post.author.avatar || '/default-avatar.png'} alt="Author" />
              {post.author.name}
            </span>
            <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="category-tags">
          <span className="category">{post.category.name}</span>
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="main-content">
          {post.content}
        </div>

        <div className="post-actions">
          <button 
            className={`like-button ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={!user}
          >
            {post.likes.length} Likes
          </button>

          {(user?._id === post.author._id || user?.isAdmin) && (
            <button 
              className="delete-button"
              onClick={handleDeletePost}
            >
              Delete Post
            </button>
          )}
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <p className="login-prompt">Please login to comment</p>
        )}

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <div className="comment-meta">
                  <img 
                    src={comment.author.avatar || '/default-avatar.png'} 
                    alt="Commenter" 
                  />
                  <span className="author">{comment.author.name}</span>
                  <span className="date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {(user?._id === comment.author._id || user?.isAdmin) && (
                  <button
                    className="delete-comment"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
