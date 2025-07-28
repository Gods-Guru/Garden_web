import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

function MediaGallery() {
  const { user } = useAuthStore();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      try {
        const res = await fetch('/api/media', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch media');
        setMedia(data.media || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMedia([data.media, ...media]);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredMedia = selectedCategory === 'all'
    ? media
    : media.filter(m => m.category === selectedCategory);

  return (
    <div className="media-gallery">
      <header className="gallery-header">
        <h1>Garden Media Gallery</h1>
        <p>Share and view photos and videos from our community gardens</p>
        
        {user && (
          <div className="upload-section">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              id="media-upload"
              className="hidden"
            />
            <label htmlFor="media-upload" className="btn btn-primary">
              Upload Media
            </label>
            {uploadProgress > 0 && (
              <div className="upload-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        <div className="category-filter">
          <button 
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Media
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'photos' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('photos')}
          >
            Photos
          </button>
          <button 
            className={`filter-btn ${selectedCategory === 'videos' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('videos')}
          >
            Videos
          </button>
        </div>
      </header>

      <main className="gallery-content">
        {loading ? (
          <div className="loading">Loading media...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredMedia.length === 0 ? (
          <div className="empty">No media found.</div>
        ) : (
          <div className="media-grid">
            {filteredMedia.map(item => (
              <div key={item._id} className="media-card">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.title} loading="lazy" />
                ) : (
                  <video src={item.url} controls></video>
                )}
                <div className="media-info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="media-meta">
                    <span>{item.uploadedBy?.name}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MediaGallery;
