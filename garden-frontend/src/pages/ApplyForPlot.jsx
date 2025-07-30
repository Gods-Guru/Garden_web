import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGardenStore from '../../store/useGardenStore';
import useAuthStore from '../../store/useAuthStore';
import { AlertTriangle, Loader } from 'lucide-react';
import './ApplyForPlot.scss';

const ApplyForPlot = () => {
  const { gardenId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    getGardenDetails,
    applyForPlot,
    isLoading,
    error 
  } = useGardenStore();
  
  const [garden, setGarden] = useState(null);
  const [formData, setFormData] = useState({
    plotSize: '',
    purpose: '',
    experience: '',
    schedule: '',
    additionalInfo: ''
  });
  
  const [touched, setTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loadGardenDetails = async () => {
      try {
        const details = await getGardenDetails(gardenId);
        setGarden(details);
      } catch (err) {
        console.error('Error loading garden details:', err);
      }
    };

    loadGardenDetails();
  }, [gardenId, getGardenDetails]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.plotSize) {
      errors.plotSize = 'Plot size is required';
    }
    
    if (!formData.purpose) {
      errors.purpose = 'Purpose is required';
    } else if (formData.purpose.length < 50) {
      errors.purpose = 'Please provide more details about your purpose (at least 50 characters)';
    }
    
    if (!formData.experience) {
      errors.experience = 'Previous experience is required';
    }
    
    if (!formData.schedule) {
      errors.schedule = 'Time commitment is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await applyForPlot(gardenId, formData);
      navigate('/applications', { 
        state: { message: 'Application submitted successfully!' }
      });
    } catch (err) {
      console.error('Error submitting application:', err);
    }
  };

  if (isLoading || !garden) {
    return (
      <div className="apply-loading">
        <Loader size={40} className="spinner" />
        <p>Loading garden details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apply-error">
        <AlertTriangle size={40} />
        <h2>Error Loading Garden</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-btn"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <header className="apply-header">
        <h1>Apply for a Plot</h1>
        <p>at {garden.name}</p>
      </header>

      <div className="apply-container">
        <div className="garden-info">
          <img 
            src={garden.imageUrl || '/placeholder-garden.jpg'} 
            alt={garden.name}
            className="garden-image" 
          />
          
          <div className="info-content">
            <h2>Garden Details</h2>
            <p>{garden.description}</p>
            
            <div className="plot-details">
              <h3>Available Plot Sizes</h3>
              <ul>
                {garden.plotSizes.map((size, index) => (
                  <li key={index}>{size}</li>
                ))}
              </ul>
            </div>
            
            <div className="requirements">
              <h3>Requirements</h3>
              <ul>
                {garden.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="apply-form">
          <div className="form-group">
            <label htmlFor="plotSize">Preferred Plot Size *</label>
            <select
              id="plotSize"
              name="plotSize"
              value={formData.plotSize}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, plotSize: true }))}
              className={formErrors.plotSize && touched.plotSize ? 'error' : ''}
              disabled={isLoading}
            >
              <option value="">Select a plot size</option>
              {garden.plotSizes.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
            {formErrors.plotSize && touched.plotSize && (
              <span className="error-text">{formErrors.plotSize}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose of Garden Plot *</label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, purpose: true }))}
              className={formErrors.purpose && touched.purpose ? 'error' : ''}
              placeholder="What do you plan to grow? How will you use the produce?"
              disabled={isLoading}
              rows={4}
            />
            {formErrors.purpose && touched.purpose && (
              <span className="error-text">{formErrors.purpose}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="experience">Gardening Experience *</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, experience: true }))}
              className={formErrors.experience && touched.experience ? 'error' : ''}
              placeholder="Describe your previous gardening experience"
              disabled={isLoading}
              rows={4}
            />
            {formErrors.experience && touched.experience && (
              <span className="error-text">{formErrors.experience}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="schedule">Time Commitment *</label>
            <select
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, schedule: true }))}
              className={formErrors.schedule && touched.schedule ? 'error' : ''}
              disabled={isLoading}
            >
              <option value="">Select your availability</option>
              <option value="daily">Daily</option>
              <option value="weekly">2-3 times per week</option>
              <option value="weekends">Weekends only</option>
            </select>
            {formErrors.schedule && touched.schedule && (
              <span className="error-text">{formErrors.schedule}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any other relevant information you'd like to share"
              disabled={isLoading}
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForPlot;
