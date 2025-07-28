import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

const GardenForm = ({ garden, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    garden?.location || { lat: 0, lng: 0 }
  );

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: garden || {
      name: '',
      description: '',
      address: '',
      size: '',
      plotCount: 0,
      rules: '',
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      // Handle file uploads here
      setUploading(false);
    }
  });

  const onSubmit = async (data) => {
    const gardenData = {
      ...data,
      location: selectedLocation,
      // Add other fields as needed
    };

    try {
      if (garden) {
        // Update existing garden
        // await updateGarden(garden._id, gardenData);
      } else {
        // Create new garden
        // await createGarden(gardenData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save garden:', error);
    }
  };

  return (
    <div className="garden-form">
      <div className="form-header">
        <h2>{garden ? 'Edit Garden' : 'Create New Garden'}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Garden Name*</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Garden name is required' })}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address*</label>
            <input
              type="text"
              id="address"
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && <span className="error">{errors.address.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="size">Garden Size (sq ft)*</label>
            <input
              type="number"
              id="size"
              {...register('size', { required: 'Size is required' })}
            />
            {errors.size && <span className="error">{errors.size.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="plotCount">Number of Plots*</label>
            <input
              type="number"
              id="plotCount"
              {...register('plotCount', { required: 'Plot count is required' })}
            />
            {errors.plotCount && <span className="error">{errors.plotCount.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="rules">Garden Rules</label>
            <textarea
              id="rules"
              {...register('rules')}
              rows={4}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Garden Photos</h3>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag & drop garden photos here, or click to select files</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : (garden ? 'Update Garden' : 'Create Garden')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GardenForm;
