import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/pagestyles/Footer.scss';

export default function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-background">
        <div className="footer-overlay"></div>
        <div className="footer-pattern">
          <div className="pattern-element element-1">🌿</div>
          <div className="pattern-element element-2">🌱</div>
          <div className="pattern-element element-3">🍃</div>
          <div className="pattern-element element-4">🌾</div>
          <div className="pattern-element element-5">🌳</div>
        </div>
      </div>

      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="logo-icon">🌱</div>
              <h3>Rooted</h3>
            </div>
            <p className="brand-description">
              Cultivating stronger communities through sustainable gardening.
              Join thousands of gardeners growing together.
            </p>
            <div className="footer-stats">
              <div className="stat">
                <span className="stat-number">250+</span>
                <span className="stat-label">Gardens</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Members</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success</span>
              </div>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <Link to="/gardens">Find Gardens</Link>
              <Link to="/register">Join Community</Link>
              <Link to="/dashboard">Dashboard</Link>
              <a href="#features">Features</a>
            </div>

            <div className="link-group">
              <h4>Resources</h4>
              <Link to="/help">Garden Guides</Link>
              <Link to="/community">Blog</Link>
              <Link to="/help">Help Center</Link>
              <Link to="/help">API Docs</Link>
            </div>

            <div className="link-group">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Careers</Link>
              <Link to="/contact">Press Kit</Link>
              <Link to="/contact">Contact</Link>
            </div>

            <div className="link-group">
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
              <a href="#security">Security</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Rooted Community Garden Platform. All rights reserved.
            </p>

            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              <a href="#" aria-label="Twitter" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              <a href="#" aria-label="Instagram" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5772 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4228 8.09406 12.5922C7.9604 11.7616 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>

              <a href="#" aria-label="LinkedIn" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
