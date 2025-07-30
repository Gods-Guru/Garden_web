import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Calendar, Upload, Edit3, Save, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import useAuthStore from '../store/useAuthStore';
import api from '../api/api';
import '../styles/pagestyles/MyPlot.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const MyPlot = () => {
  const { user } = useAuthStore();
  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchMyPlot();
  }, []);

  const fetchMyPlot = async () => {
    try {
      const response = await api.get('/plots/my-plot');
      setPlot(response.data.plot);
      setNotes(response.data.plot?.notes || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch plot details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const response = await api.post('/plots/my-plot/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setPlot(prev => ({
        ...prev,
        images: [...(prev.images || []), response.data.imageUrl]
      }));
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await api.patch('/plots/my-plot/notes', { notes });
      setPlot(prev => ({ ...prev, notes }));
      setEditingNotes(false);
    } catch (err) {
      setError('Failed to save notes');
    }
  };

  if (loading) {
    return (
      <div className="my-plot-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your plot details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="my-plot-page">
        <Navbar />
        <div className="no-plot-container">
          <h2>No Plot Assigned</h2>
          <p>You don't have a garden plot assigned yet.</p>
          <a href="/apply-for-plot" className="btn btn-primary">Apply for a Plot</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="my-plot-page">
      <Navbar />
      
      <main className="my-plot-main">
        <motion.div 
          className="plot-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <div className="plot-header">
              <h1>My Garden Plot</h1>
              <div className="plot-id">Plot #{plot.plotNumber}</div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="plot-content">
              <div className="plot-info-section">
                <div className="plot-details-card">
                  <h2>Plot Details</h2>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <MapPin className="icon" />
                      <div>
                        <span className="label">Garden</span>
                        <span className="value">{plot.garden?.name}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="icon">📏</div>
                      <div>
                        <span className="label">Size</span>
                        <span className="value">{plot.size?.width}' × {plot.size?.height}' ({plot.size?.area} sq ft)</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Calendar className="icon" />
                      <div>
                        <span className="label">Assigned</span>
                        <span className="value">{new Date(plot.assignedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <div className="icon">📍</div>
                      <div>
                        <span className="label">Location</span>
                        <span className="value">Section {plot.location?.section}, Row {plot.location?.row}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="plot-notes-card">
                  <div className="notes-header">
                    <h2>My Notes</h2>
                    {!editingNotes ? (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setEditingNotes(true)}
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={handleSaveNotes}
                        >
                          <Save size={16} />
                          Save
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingNotes(false);
                            setNotes(plot.notes || '');
                          }}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingNotes ? (
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your personal notes about this plot..."
                      rows={6}
                      className="notes-textarea"
                    />
                  ) : (
                    <div className="notes-display">
                      {notes || 'No notes added yet. Click Edit to add your thoughts about this plot.'}
                    </div>
                  )}
                </div>
              </div>

              <div className="plot-images-section">
                <div className="images-header">
                  <h2>Plot Photos</h2>
                  <label className="upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <span>Uploading...</span>
                    ) : (
                      <>
                        <Camera size={16} />
                        Add Photo
                      </>
                    )}
                  </label>
                </div>

                <div className="images-grid">
                  {plot.images && plot.images.length > 0 ? (
                    plot.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Plot photo ${index + 1}`} />
                      </div>
                    ))
                  ) : (
                    <div className="no-images">
                      <Upload size={48} />
                      <p>No photos uploaded yet</p>
                      <p>Share your garden's progress by uploading photos!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPlot;
