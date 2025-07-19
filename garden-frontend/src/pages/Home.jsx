import React from 'react';
import '../styles/pagestyles/Home.scss';
import { Navbar } from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import myGardenImg from '../assets/images/my-garden.jpg';
import createImg from '../assets/images/create.jpg';
import joinGardenImg from '../assets/images/join-garden.jpg';
import getPlotImg from '../assets/images/get-plot.jpg';
import growingPlantImg from '../assets/images/growing-plant.jpg';
import mariaAvatar from '../assets/images/kelsey-he-J9s9GQSRX6U-unsplash.jpg';
import jamesAvatar from '../assets/images/jonathan-kemper-3fgC5r65CU0-unsplash.jpg';
import sarahAvatar from '../assets/images/graig-durant-qc6r9yOOr5k-unsplash.jpg';

export function Home() {
  return (
    <div className="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <header className="home-header">
        <div className="header-content">
          <h1>🌱 Cultivate Community with Rooted</h1>
          <p>Your all-in-one platform for managing community gardens, connecting with fellow gardeners, and tracking your green journey.</p>
          <div className="home-cta">
            <a href="/register" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Join Now
            </a>
            <a href="/login" className="btn btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign In
            </a>
          </div>
        </div>
        <img src={myGardenImg} alt="Beautiful Garden" className="hero-image" />
      </header>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">250+</span>
          <span className="stat-label">Community Gardens</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Active Gardeners</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">Events Yearly</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">95%</span>
          <span className="stat-label">Success Rate</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features">
        <div className="section-header">
          <h2>Everything You Need to Grow Together</h2>
          <p className="section-subtitle">Our platform provides all the tools for successful community gardening</p>
        </div>
        <div className="features-list">
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3>Plot Management</h3>
            <p>Track your assigned plots, log activities, and monitor plant health with our intuitive dashboard.</p>
            <a href="#" className="feature-link">Learn more →</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Task System</h3>
            <p>Receive personalized tasks, mark them complete, and get reminders for watering and maintenance.</p>
            <a href="#" className="feature-link">Learn more →</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Garden Journal</h3>
            <p>Document your garden's progress with photos and notes to track growth over time.</p>
            <a href="#" className="feature-link">Learn more →</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Hub</h3>
            <p>Connect with other gardeners, share tips, and join local events in your area.</p>
            <a href="#" className="feature-link">Learn more →</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>View harvest yields, plant success rates, and garden participation metrics.</p>
            <a href="#" className="feature-link">Learn more →</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Admin Tools</h3>
            <p>Manage members, plots, and garden resources with powerful administrative features.</p>
            <a href="#" className="feature-link">Learn more →</a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-how">
        <div className="section-header">
          <h2>Getting Started is Easy</h2>
          <p className="section-subtitle">Join thousands of gardeners in just a few simple steps</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Account</h3>
              <p>Sign up in minutes with your email address and basic information.</p>
            </div>
            <img src={createImg} alt="Create Account" className="step-image" />
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Join a Garden</h3>
              <p>Find and request to join a community garden near you or start your own.</p>
            </div>
            <img src={joinGardenImg} alt="Join a Garden" className="step-image" />
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Your Plot</h3>
              <p>Work with garden admins to get assigned your growing space.</p>
            </div>
            <img src={getPlotImg} alt="Get Your Plot" className="step-image" />
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Start Growing</h3>
              <p>Use our tools to plan, track, and share your gardening journey.</p>
            </div>
            <img src={growingPlantImg} alt="Start Growing" className="step-image" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <h2>What Our Gardeners Say</h2>
          <p className="section-subtitle">Hear from our thriving community members</p>
        </div>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Rooted transformed how our community garden operates. Coordination is so much easier now!"</p>
            </div>
            <div className="testimonial-author">
              <img src={mariaAvatar} alt="Maria Gonzalez" className="author-avatar" />
              <div className="author-info">
                <h4>Maria Gonzalez</h4>
                <p>Community Garden Leader</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"As a beginner gardener, the task reminders and plant tracking have been invaluable to my success."</p>
            </div>
            <div className="testimonial-author">
              <img src={jamesAvatar} alt="James Wilson" className="author-avatar" />
              <div className="author-info">
                <h4>James Wilson</h4>
                <p>Urban Gardener</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Our yield increased by 40% after implementing the planning tools from Rooted."</p>
            </div>
            <div className="testimonial-author">
              <img src={sarahAvatar} alt="Sarah Chen" className="author-avatar" />
              <div className="author-info">
                <h4>Sarah Chen</h4>
                <p>Farm Coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for gardening tips, feature updates, and community stories.</p>
          </div>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className="btn btn-primary">
              Subscribe
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </section>
        {/* Footer */}
        <Footer/>
    </div>
  );
}