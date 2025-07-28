import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { useDropzone } from 'react-dropzone';
import './MediaGallery.scss';

function MediaGallery() {
  const { user } = useAuthStore();
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm']
    },
    onDrop: handleFileDrop
  });

  useEffect(() => {
    fetchMedia();
    fetchTags();
  }, [filter, selectedTags]);

  const fetchMedia = async () => {
    try {
      const queryParams = new URLSearchParams({
        filter,
        tags: selectedTags.join(',')
      });

      const res = await fetch(`/api/media?${queryParams}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMedia(data.media);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/media/tags', {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTags(data.tags);
    } catch (err) {
      setError(err.message);
    }
  };

  async function handleFileDrop(acceptedFiles) {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files', file);
      });

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMedia(prev => [...data.media, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return;

    try {
      const res = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      setMedia(prev => prev.filter(item => item._id !== mediaId));
      if (selectedMedia?._id === mediaId) {
        setSelectedMedia(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTagUpdate = async (mediaId, tags) => {
    try {
      const res = await fetch(`/api/media/${mediaId}/tags`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ tags })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMedia(prev => prev.map(item => 
        item._id === mediaId ? { ...item, tags: data.tags } : item
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  };

  return (
    <div className="media-gallery">
      <div className="gallery-header">
        <h2>Media Gallery</h2>
        <div className="gallery-controls">
          <div className="view-toggle">
            <button 
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
            >
              Grid View
            </button>
            <button 
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              List View
            </button>
          </div>
          <div className="filter-controls">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Media</option>
              <option value="images">Images Only</option>
              <option value="videos">Videos Only</option>
              <option value="my">My Uploads</option>
            </select>
          </div>
        </div>
      </div>

      <div className="tags-filter">
        {tags.map(tag => (
          <button
            key={tag}
            className={selectedTags.includes(tag) ? 'active' : ''}
            onClick={() => setSelectedTags(prev => 
              prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
            )}
          >
            #{tag}
          </button>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop media files here, or click to select files</p>
        {uploading && <div className="uploading">Uploading files...</div>}
      </div>

      {loading ? (
        <div className="loading">Loading media...</div>
      ) : (
        <div className={`media-container ${view}`}>
          {media.length === 0 ? (
            <div className="empty-state">
              <p>No media found</p>
              <p>Drop files above to upload</p>
            </div>
          ) : (
            media.map(item => (
              <div 
                key={item._id} 
                className="media-item"
                onClick={() => setSelectedMedia(item)}
              >
                {isImage(item.url) ? (
                  <img src={item.url} alt={item.title} loading="lazy" />
                ) : (
                  <video src={item.url} />
                )}
                <div className="media-info">
                  <p className="title">{item.title}</p>
                  <p className="uploader">{item.uploader.name}</p>
                  <div className="tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedMedia && (
        <div className="media-modal">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setSelectedMedia(null)}
            >
              ×
            </button>
            <div className="media-view">
              {isImage(selectedMedia.url) ? (
                <img src={selectedMedia.url} alt={selectedMedia.title} />
              ) : (
                <video src={selectedMedia.url} controls />
              )}
            </div>
            <div className="media-details">
              <h3>{selectedMedia.title}</h3>
              <p className="uploader">
                Uploaded by {selectedMedia.uploader.name} on{' '}
                {new Date(selectedMedia.createdAt).toLocaleDateString()}
              </p>
              {(user?._id === selectedMedia.uploader._id || user?.isAdmin) && (
                <div className="media-actions">
                  <input
                    type="text"
                    placeholder="Add tags (comma-separated)"
                    value={selectedMedia.tags.join(', ')}
                    onChange={(e) => handleTagUpdate(
                      selectedMedia._id,
                      e.target.value.split(',').map(tag => tag.trim())
                    )}
                  />
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(selectedMedia._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaGallery;
