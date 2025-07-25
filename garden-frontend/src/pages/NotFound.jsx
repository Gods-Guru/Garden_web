import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

// SVG Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

function NotFound() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        {/* Animated 404 */}
        <div className="error-code">
          <span className="four">4</span>
          <span className="zero">
            <div className="plant-pot">
              🪴
            </div>
          </span>
          <span className="four">4</span>
        </div>

        {/* Error Message */}
        <div className="error-content">
          <h1>Oops! Page Not Found</h1>
          <p className="error-description">
            Looks like this page got lost in the garden! The page you're looking for
            doesn't exist or may have been moved to a different location.
          </p>

          {/* Helpful suggestions */}
          <div className="suggestions">
            <h3>Here's what you can do:</h3>
            <ul>
              <li>Check the URL for any typos</li>
              <li>Go back to the previous page</li>
              <li>Visit our homepage</li>
              <li>Search for what you're looking for</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="error-actions">
            <button onClick={handleGoBack} className="btn btn-secondary">
              <ArrowLeftIcon />
              Go Back
            </button>
            <button onClick={handleGoHome} className="btn btn-primary">
              <HomeIcon />
              {isAuthenticated ? 'Dashboard' : 'Home'}
            </button>
          </div>

          {/* Quick links */}
          <div className="quick-links">
            <h4>Quick Links:</h4>
            <div className="links-grid">
              {isAuthenticated ? (
                <>
                  <Link to="/gardens" className="quick-link">
                    🌱 My Gardens
                  </Link>
                  <Link to="/community" className="quick-link">
                    👥 Community
                  </Link>
                  <Link to="/tasks" className="quick-link">
                    ✅ Tasks
                  </Link>
                  <Link to="/events" className="quick-link">
                    📅 Events
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="quick-link">
                    🔐 Login
                  </Link>
                  <Link to="/register" className="quick-link">
                    📝 Register
                  </Link>
                  <Link to="/gardens" className="quick-link">
                    🌱 Browse Gardens
                  </Link>
                  <Link to="/" className="quick-link">
                    🏠 Home
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Contact support */}
          <div className="support-section">
            <p>Still can't find what you're looking for?</p>
            <Link to="/contact" className="support-link">
              Contact Support
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="decorative-plants">
          <div className="plant plant-1">🌿</div>
          <div className="plant plant-2">🍃</div>
          <div className="plant plant-3">🌱</div>
          <div className="plant plant-4">🌾</div>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .not-found-container {
          max-width: 800px;
          text-align: center;
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 2;
        }

        .error-code {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 8rem;
          font-weight: 900;
          color: #10b981;
          margin-bottom: 2rem;
          font-family: 'Arial', sans-serif;
        }

        .four {
          animation: bounce 2s infinite;
        }

        .zero {
          position: relative;
          margin: 0 1rem;
        }

        .plant-pot {
          font-size: 6rem;
          animation: sway 3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        .error-content h1 {
          font-size: 2.5rem;
          color: #1f2937;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .error-description {
          font-size: 1.1rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .suggestions {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: left;
        }

        .suggestions h3 {
          color: #1f2937;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .suggestions ul {
          list-style: none;
          padding: 0;
        }

        .suggestions li {
          padding: 0.5rem 0;
          color: #4b5563;
          position: relative;
          padding-left: 1.5rem;
        }

        .suggestions li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .btn-primary {
          background: #10b981;
          color: white;
        }

        .btn-primary:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
        }

        .quick-links {
          margin: 2rem 0;
        }

        .quick-links h4 {
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .quick-link {
          display: block;
          padding: 1rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          text-decoration: none;
          color: #065f46;
          font-weight: 500;
          transition: all 0.2s;
        }

        .quick-link:hover {
          background: #dcfce7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
        }

        .support-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .support-section p {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .support-link {
          color: #10b981;
          text-decoration: none;
          font-weight: 600;
        }

        .support-link:hover {
          text-decoration: underline;
        }

        .decorative-plants {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .plant {
          position: absolute;
          font-size: 2rem;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .plant-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .plant-2 {
          top: 20%;
          right: 15%;
          animation-delay: 1s;
        }

        .plant-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 2s;
        }

        .plant-4 {
          bottom: 10%;
          right: 10%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @media (max-width: 768px) {
          .not-found-container {
            padding: 2rem;
            margin: 1rem;
          }

          .error-code {
            font-size: 4rem;
          }

          .plant-pot {
            font-size: 3rem;
          }

          .error-content h1 {
            font-size: 2rem;
          }

          .error-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 200px;
          }

          .links-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default NotFound;