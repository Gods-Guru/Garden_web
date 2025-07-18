
import React, { useEffect, useState } from 'react';
import '../styles/pagestyles/Community.scss';
import { Navbar } from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// Simple spinner component
function Spinner() {
  return <div className="spinner" aria-label="Loading" />;
}

// Simple toast component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="toast">
      {message}
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
}


function Community() {
  // State for posts, events, stats, loading, errors, and form
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorPosts, setErrorPosts] = useState(null);
  const [errorEvents, setErrorEvents] = useState(null);
  const [errorStats, setErrorStats] = useState(null);
  const [newPost, setNewPost] = useState({ content: '', image: null });
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [toast, setToast] = useState(null);

  // Helper: fetch JSON with better error handling
  async function fetchJson(url) {
    const res = await fetch(url);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (!res.ok) throw new Error(json.message || 'Error');
      return json;
    } catch (e) {
      throw new Error(text.startsWith('<!DOCTYPE') ? 'API returned HTML (check backend/proxy)' : e.message);
    }
  }

  // Fetch posts
  useEffect(() => {
    let isMounted = true;
    const fetchPosts = () => {
      setLoadingPosts(true);
      fetchJson('/api/posts')
        .then(data => {
          if (isMounted) {
            setPosts(data.posts || []);
            setErrorPosts(null);
          }
        })
        .catch(err => {
          if (isMounted) setErrorPosts(err.message);
        })
        .finally(() => isMounted && setLoadingPosts(false));
    };
    fetchPosts();
    const interval = setInterval(fetchPosts, 15000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  // Fetch events
  useEffect(() => {
    let isMounted = true;
    const fetchEvents = () => {
      setLoadingEvents(true);
      fetchJson('/api/events')
        .then(data => {
          if (isMounted) {
            setEvents(data.events || []);
            setErrorEvents(null);
          }
        })
        .catch(err => {
          if (isMounted) setErrorEvents(err.message);
        })
        .finally(() => isMounted && setLoadingEvents(false));
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  // Fetch stats
  useEffect(() => {
    let isMounted = true;
    const fetchStats = () => {
      setLoadingStats(true);
      fetchJson('/api/community/stats')
        .then(data => {
          if (isMounted) {
            setStats(data.stats || null);
            setErrorStats(null);
          }
        })
        .catch(err => {
          if (isMounted) setErrorStats(err.message);
        })
        .finally(() => isMounted && setLoadingStats(false));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  // Handle post form input
  const handlePostChange = e => {
    setNewPost({ ...newPost, content: e.target.value });
  };
  const handleImageChange = e => {
    setNewPost({ ...newPost, image: e.target.files[0] });
  };

  // Handle post form submit
  const handlePostSubmit = async e => {
    e.preventDefault();
    setPosting(true);
    setPostError(null);
    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      if (newPost.image) formData.append('image', newPost.image);
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(text.startsWith('<!DOCTYPE') ? 'API returned HTML (check backend/proxy)' : e.message);
      }
      if (!res.ok) throw new Error(data.message || 'Failed to post');
      setPosts([data.post, ...posts]);
      setNewPost({ content: '', image: null });
      setToast('Post created!');
    } catch (err) {
      setPostError(err.message);
      setToast(err.message);
    } finally {
      setPosting(false);
    }
  };

  // Animate feed items (simple fade-in)
  // Add .fade-in class to new posts

  return (
    <div className="community-page">
      <Navbar />
      {/* Hero Section */}
      <header className="community-hero">
        <div className="hero-content">
          <h1>🌻 Garden Community Hub</h1>
          <p>Share your journey, ask questions, and connect with fellow gardeners in our vibrant community!</p>
          <div className="community-cta">
            <a href="#create-post" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Post an Update
            </a>
            <a href="#events" className="btn btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Events
            </a>
          </div>
        </div>
        <div className="hero-image image-placeholder"></div>
      </header>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="community-container">
        {/* Main Content */}
        <main className="community-main">
          {/* Create Post Section */}
          <section className="create-post" id="create-post">
            <div className="section-header">
              <h2>Share With the Community</h2>
              <p>Post updates, ask questions, or share your garden photos</p>
            </div>
            <form className="post-form" onSubmit={handlePostSubmit} encType="multipart/form-data">
              <div className="post-input">
                <div className="author-avatar image-placeholder"></div>
                <textarea
                  placeholder="What's happening in your garden?"
                  rows={3}
                  required
                  value={newPost.content}
                  onChange={handlePostChange}
                  disabled={posting}
                ></textarea>
              </div>
              <div className="form-actions">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={posting}
                />
                <button type="submit" className="btn btn-primary" disabled={posting || !newPost.content}>
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
              {postError && <div className="form-error">{postError}</div>}
            </form>
          </section>

          {/* Community Feed */}
          <section className="community-feed">
            <div className="section-header">
              <h2>Community Feed</h2>
              <div className="feed-filter">
                <button className="filter-btn active">Latest</button>
                <button className="filter-btn">Popular</button>
                <button className="filter-btn">Following</button>
              </div>
            </div>
            <div className="feed-list">
              {loadingPosts ? (
                <div className="feed-loading"><Spinner /></div>
              ) : errorPosts ? (
                <div className="feed-error">{errorPosts}</div>
              ) : posts.length === 0 ? (
                <div className="feed-empty">No posts yet. Be the first to post!</div>
              ) : (
                posts.map((post, idx) => (
                  <div className="feed-card fade-in" key={post.id} style={{ animationDelay: `${idx * 60}ms` }}>
                    <div className="feed-author">
                      <div className="author-avatar image-placeholder"></div>
                      <div className="author-info">
                        <h4>{post.author || post.user?.name || 'Anonymous'}</h4>
                        <span>{post.time || post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</span>
                      </div>
                    </div>
                    <div className="feed-content">
                      <p>{post.content}</p>
                      {post.imageUrl || post.image ? (
                        <div className="feed-image image-placeholder">
                          {/* Optionally render image if available */}
                          {/* <img src={post.imageUrl || post.image} alt="Post" /> */}
                        </div>
                      ) : null}
                    </div>
                    <div className="feed-actions">
                      <button className="action-btn like-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {post.likes || 0}
                      </button>
                      <button className="action-btn comment-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {post.comments || 0}
                      </button>
                      <button className="action-btn share-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.59 13.51L15.42 17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                ))
              )}
              <button className="load-more-btn">
                Load More Posts
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 14L12 21M12 21L5 14M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="community-sidebar">
          {/* Popular Topics */}
          <section className="community-topics">
            <div className="section-header">
              <h2>Popular Topics</h2>
              <button className="see-all-btn">See All</button>
            </div>
            <div className="topics-list">
              <button className="topic-btn active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Tips & Tricks
              </button>
              <button className="topic-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Events
              </button>
              <button className="topic-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 13C7 13 8 17 12 17C16 17 17 13 17 13M12 17V22M12 22H7M12 22H17M12 17C12 17 15.5 16 15.5 13V5C15.5 3 15 2 12 2C9 2 8.5 3 8.5 5V13C8.5 16 12 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Harvests
              </button>
              <button className="topic-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Help & Questions
              </button>
              <button className="topic-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46972 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Photos
              </button>
              <button className="topic-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Seasonal
              </button>
            </div>
          </section>

          {/* Events/Announcements */}
          <section className="community-events" id="events">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <button className="see-all-btn">See All</button>
            </div>
            <div className="events-list">
              {loadingEvents ? (
                <div className="events-loading"><Spinner /></div>
              ) : errorEvents ? (
                <div className="events-error">{errorEvents}</div>
              ) : events.length === 0 ? (
                <div className="events-empty">No upcoming events.</div>
              ) : (
                events.map((event, idx) => (
                  <div className="event-card fade-in" key={event.id} style={{ animationDelay: `${idx * 80}ms` }}>
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{event.date} &bull; {event.time}</span>
                    </div>
                    <p>{event.description}</p>
                    <a href="#" className="btn btn-secondary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Learn More
                    </a>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Community Stats */}
          <section className="community-stats">
            <div className="section-header">
              <h2>Community Stats</h2>
            </div>
            {loadingStats ? (
              <div className="stats-loading"><Spinner /></div>
            ) : errorStats ? (
              <div className="stats-error">{errorStats}</div>
            ) : !stats ? (
              <div className="stats-empty">No stats available.</div>
            ) : (
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{stats.activeMembers ?? '-'}</div>
                  <div className="stat-label">Active Members</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.postsToday ?? '-'}</div>
                  <div className="stat-label">Posts Today</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.upcomingEvents ?? '-'}</div>
                  <div className="stat-label">Upcoming Events</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.questionsAnswered ?? '-'}</div>
                  <div className="stat-label">Questions Answered</div>
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default Community;