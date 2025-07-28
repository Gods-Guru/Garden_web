import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useAuthStore from '../../../../store/useAuthStore';

const PlotForm = ({ plot, onSubmit, onClose }) => {
  const { userGardens } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    gardenId: '',
    size: '',
    location: '',
    status: 'available',
    description: '',
    ...plot
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="plot-form-modal">
      <div className="modal-content">
        <h2>{plot ? 'Edit Plot' : 'Create New Plot'}</h2>
        <form onSubmit={handleSubmit} className="plot-form">
          <div className="form-group">
            <label htmlFor="name">Plot Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gardenId">Garden</label>
            <select
              id="gardenId"
              name="gardenId"
              value={formData.gardenId}
              onChange={handleChange}
              required
            >
              <option value="">Select Garden</option>
              {userGardens.map(garden => (
                <option key={garden._id} value={garden._id}>
                  {garden.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="size">Size (sq ft)</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location/Position</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., North-East corner"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add any additional details about the plot"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {plot ? 'Save Changes' : 'Create Plot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PlotForm.propTypes = {
  plot: PropTypes.shape({
    name: PropTypes.string,
    gardenId: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PlotForm;
