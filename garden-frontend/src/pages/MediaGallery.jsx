import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MediaGallery.scss';

const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, images, videos, documents
  const [selectedMedia, setSelectedMedia] = useState(null);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchMedia();
  }, [currentPage, filter]);

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let endpoint = `/api/media?page=${currentPage}&limit=${itemsPerPage}`;
      if (filter !== 'all') {
        endpoint += `&type=${filter}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      setMedia(data.media || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      setError(error.message);
      // Fallback mock data
      setMedia([
        {
          id: 1,
          type: 'image',
          title: 'Spring Garden Bloom',
          url: '/api/placeholder/400/300',
          thumbnail: '/api/placeholder/200/150',
          uploadedBy: { name: 'Sarah Johnson' },
          uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          description: 'Beautiful spring flowers in the community garden',
          tags: ['spring', 'flowers', 'garden']
        },
        {
          id: 2,
          type: 'image',
          title: 'Harvest Festival 2024',
          url: '/api/placeholder/400/300',
          thumbnail: '/api/placeholder/200/150',
          uploadedBy: { name: 'Mike Wilson' },
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          description: 'Community members celebrating the harvest',
          tags: ['harvest', 'festival', 'community']
        },
        {
          id: 3,
          type: 'video',
          title: 'Composting Tutorial',
          url: '/api/placeholder/video',
          thumbnail: '/api/placeholder/200/150',
          uploadedBy: { name: 'Emma Davis' },
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          description: 'Step-by-step guide to composting',
          tags: ['tutorial', 'composting', 'education']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getMediaIcon = (type) => {
    const icons = {
      image: '🖼️',
      video: '🎥',
      document: '📄'
    };
    return icons[type] || '📁';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const openMediaModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <div className="media-gallery-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading media gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="media-gallery-page">
      <div className="media-gallery-container">
        <div className="gallery-header">
          <h1>Media Gallery</h1>
          <p>Browse photos, videos, and documents from our community garden</p>
        </div>

        <div className="gallery-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Media
            </button>
            <button 
              className={`filter-btn ${filter === 'images' ? 'active' : ''}`}
              onClick={() => setFilter('images')}
            >
              🖼️ Images
            </button>
            <button 
              className={`filter-btn ${filter === 'videos' ? 'active' : ''}`}
              onClick={() => setFilter('videos')}
            >
              🎥 Videos
            </button>
            <button 
              className={`filter-btn ${filter === 'documents' ? 'active' : ''}`}
              onClick={() => setFilter('documents')}
            >
              📄 Documents
            </button>
          </div>

          <Link to="/media/upload" className="btn btn-primary">
            Upload Media
          </Link>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            <span>Error loading media: {error}</span>
          </div>
        )}

        <div className="media-grid">
          {media.length > 0 ? (
            media.map((item) => (
              <div key={item.id} className="media-item" onClick={() => openMediaModal(item)}>
                <div className="media-thumbnail">
                  {item.type === 'image' ? (
                    <img src={item.thumbnail} alt={item.title} />
                  ) : item.type === 'video' ? (
                    <div className="video-thumbnail">
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="play-overlay">
                        <span className="play-icon">▶️</span>
                      </div>
                    </div>
                  ) : (
                    <div className="document-thumbnail">
                      <span className="document-icon">📄</span>
                    </div>
                  )}
                  <div className="media-type-badge">
                    {getMediaIcon(item.type)}
                  </div>
                </div>

                <div className="media-info">
                  <h3>{item.title}</h3>
                  <p className="media-description">{item.description}</p>
                  <div className="media-meta">
                    <span className="uploaded-by">By {item.uploadedBy.name}</span>
                    <span className="uploaded-time">{getTimeAgo(item.uploadedAt)}</span>
                  </div>
                  {item.tags && (
                    <div className="media-tags">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-gallery">
              <span className="empty-icon">📸</span>
              <h3>No media found</h3>
              <p>No media files match your current filter. Try uploading some photos or videos!</p>
              <Link to="/media/upload" className="btn btn-primary">
                Upload First Media
              </Link>
            </div>
          )}
        </div>

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
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div className="media-modal" onClick={closeMediaModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeMediaModal}>×</button>
            
            <div className="modal-media">
              {selectedMedia.type === 'image' ? (
                <img src={selectedMedia.url} alt={selectedMedia.title} />
              ) : selectedMedia.type === 'video' ? (
                <video controls>
                  <source src={selectedMedia.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="document-preview">
                  <span className="document-icon">📄</span>
                  <p>Document preview not available</p>
                  <a href={selectedMedia.url} download className="btn btn-primary">
                    Download Document
                  </a>
                </div>
              )}
            </div>

            <div className="modal-info">
              <h2>{selectedMedia.title}</h2>
              <p>{selectedMedia.description}</p>
              <div className="modal-meta">
                <span>Uploaded by {selectedMedia.uploadedBy.name}</span>
                <span>{getTimeAgo(selectedMedia.uploadedAt)}</span>
              </div>
              {selectedMedia.tags && (
                <div className="modal-tags">
                  {selectedMedia.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
