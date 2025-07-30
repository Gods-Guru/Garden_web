import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './AddCrop.scss';

const AddCrop = () => {
  const navigate = useNavigate();
  const { plotId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plots, setPlots] = useState([]);
  const [cropTypes, setCropTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    plotId: plotId || '',
    cropType: '',
    variety: '',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    quantity: 1,
    notes: ''
  });

  useEffect(() => {
    fetchPlots();
    fetchCropTypes();
  }, []);

  const fetchPlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/plots/my-plots', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPlots(data.plots || []);
      }
    } catch (error) {
      console.error('Error fetching plots:', error);
    }
  };

  const fetchCropTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crops/types', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCropTypes(data.cropTypes || []);
      }
    } catch (error) {
      console.error('Error fetching crop types:', error);
      // Fallback crop types
      setCropTypes([
        { id: 'tomato', name: 'Tomato', category: 'Fruit' },
        { id: 'lettuce', name: 'Lettuce', category: 'Leafy Green' },
        { id: 'carrot', name: 'Carrot', category: 'Root Vegetable' },
        { id: 'pepper', name: 'Pepper', category: 'Fruit' },
        { id: 'spinach', name: 'Spinach', category: 'Leafy Green' },
        { id: 'radish', name: 'Radish', category: 'Root Vegetable' },
        { id: 'cucumber', name: 'Cucumber', category: 'Fruit' },
        { id: 'herbs', name: 'Herbs', category: 'Herbs' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/crops', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add crop');
      }

      // Success - redirect to my plot or crops page
      navigate('/my-plot');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-crop-page">
      <Navbar />
      
      <div className="add-crop-container">
        <div className="add-crop-header">
          <h1>Add New Crop</h1>
          <p>Plant a new crop in your garden plot</p>
        </div>

        <form onSubmit={handleSubmit} className="add-crop-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="plotId">Select Plot *</label>
            <select
              id="plotId"
              name="plotId"
              value={formData.plotId}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose a plot...</option>
              {plots.map(plot => (
                <option key={plot.id} value={plot.id}>
                  {plot.plotNumber} - {plot.garden?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cropType">Crop Type *</label>
            <select
              id="cropType"
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose a crop type...</option>
              {cropTypes.map(crop => (
                <option key={crop.id} value={crop.id}>
                  {crop.name} ({crop.category})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="variety">Variety</label>
            <input
              type="text"
              id="variety"
              name="variety"
              value={formData.variety}
              onChange={handleInputChange}
              placeholder="e.g., Cherry Tomato, Romaine Lettuce"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plantingDate">Planting Date *</label>
              <input
                type="date"
                id="plantingDate"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expectedHarvestDate">Expected Harvest Date</label>
              <input
                type="date"
                id="expectedHarvestDate"
                name="expectedHarvestDate"
                value={formData.expectedHarvestDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              placeholder="Number of plants/seeds"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Any additional notes about this crop..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding Crop...' : 'Add Crop'}
            </button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default AddCrop;
