import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function Forum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch('/api/community/posts', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="forum">
      <h2>Community Forum</h2>
      {posts.length === 0 ? (
        <div>No posts yet.</div>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              <strong>{post.title}</strong> by {post.author?.name || 'Unknown'}
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Forum;
