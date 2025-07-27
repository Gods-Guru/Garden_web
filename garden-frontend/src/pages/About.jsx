import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/pagestyles/About.scss';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="floating-elements">
            <div className="element element-1">🌱</div>
            <div className="element element-2">🌿</div>
            <div className="element element-3">🍃</div>
            <div className="element element-4">🌾</div>
            <div className="element element-5">🌳</div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1>About <span className="brand-highlight">Rooted</span></h1>
            <p className="hero-subtitle">
              Cultivating stronger communities through sustainable gardening and meaningful connections
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">250+</span>
                <span className="stat-label">Community Gardens</span>
              </div>
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Active Gardeners</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Mission</h2>
            <p>Building sustainable communities one garden at a time</p>
          </div>
          <div className="mission-content">
            <div className="mission-text">
              <h3>Empowering Communities Through Gardening</h3>
              <p>
                At Rooted, we believe that community gardens are more than just places to grow food—they're 
                spaces where neighbors become friends, where knowledge is shared, and where sustainable 
                practices take root. Our platform connects gardeners, streamlines garden management, and 
                fosters the growth of vibrant, self-sustaining communities.
              </p>
              <p>
                Founded with the vision of making community gardening accessible to everyone, Rooted provides 
                the tools and technology needed to transform empty lots into thriving green spaces, and 
                strangers into gardening partners.
              </p>
            </div>
            <div className="mission-visual">
              <div className="mission-card">
                <div className="card-icon">🌱</div>
                <h4>Grow Together</h4>
                <p>Connect with fellow gardeners and share knowledge, resources, and harvests</p>
              </div>
              <div className="mission-card">
                <div className="card-icon">🌍</div>
                <h4>Sustainable Future</h4>
                <p>Promote eco-friendly practices and local food production</p>
              </div>
              <div className="mission-card">
                <div className="card-icon">🤝</div>
                <h4>Strong Communities</h4>
                <p>Build lasting relationships and strengthen neighborhood bonds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do-section">
        <div className="container">
          <div className="section-header">
            <h2>What We Do</h2>
            <p>Comprehensive tools for modern community garden management</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏡</div>
              <h3>Garden Management</h3>
              <p>
                Complete tools for creating, organizing, and managing community gardens. 
                From plot assignments to maintenance schedules, we handle the logistics 
                so you can focus on growing.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Building</h3>
              <p>
                Connect gardeners through our integrated community features. Share tips, 
                organize events, and build lasting relationships with fellow garden enthusiasts.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Digital Platform</h3>
              <p>
                Modern, user-friendly interface accessible on any device. Track your garden's 
                progress, manage tasks, and stay connected wherever you are.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics & Insights</h3>
              <p>
                Data-driven insights to help gardens thrive. Track growth, monitor success 
                rates, and make informed decisions for better harvests.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Education & Resources</h3>
              <p>
                Access to gardening guides, best practices, and expert advice. Learn from 
                experienced gardeners and share your own knowledge.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Sustainability Focus</h3>
              <p>
                Promote environmentally conscious gardening practices. From composting 
                to water conservation, we support sustainable growing methods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-content">
            <div className="value-item">
              <div className="value-icon">🌱</div>
              <div className="value-text">
                <h3>Growth</h3>
                <p>We believe in continuous growth—of plants, people, and communities. Every garden tells a story of transformation and progress.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <div className="value-text">
                <h3>Community</h3>
                <p>Stronger together. We foster connections that go beyond gardening, creating lasting bonds between neighbors and friends.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-icon">🌍</div>
              <div className="value-text">
                <h3>Sustainability</h3>
                <p>Environmental stewardship is at our core. We promote practices that nurture both the earth and future generations.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-icon">💡</div>
              <div className="value-text">
                <h3>Innovation</h3>
                <p>We embrace technology to make gardening more accessible, efficient, and enjoyable for everyone.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-icon">🎯</div>
              <div className="value-text">
                <h3>Accessibility</h3>
                <p>Gardening should be for everyone. We work to remove barriers and make community gardening inclusive and welcoming.</p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-icon">📚</div>
              <div className="value-text">
                <h3>Knowledge Sharing</h3>
                <p>Learning never stops. We facilitate the exchange of wisdom between experienced gardeners and enthusiastic beginners.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Impact</h2>
            <p>Making a difference in communities worldwide</p>
          </div>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-number">250+</div>
              <div className="impact-label">Community Gardens</div>
              <div className="impact-description">Active gardens across multiple cities and regions</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">10,000+</div>
              <div className="impact-label">Active Gardeners</div>
              <div className="impact-description">Passionate individuals growing together</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">500,000+</div>
              <div className="impact-label">Pounds of Produce</div>
              <div className="impact-description">Fresh, local food grown by our communities</div>
            </div>
            <div className="impact-card">
              <div className="impact-number">95%</div>
              <div className="impact-label">Success Rate</div>
              <div className="impact-description">Gardens that thrive and continue growing</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Rooted?</h2>
            <p>
              Join thousands of gardeners who are already growing stronger communities. 
              Whether you're starting a new garden or joining an existing one, we're here to help you succeed.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Join Our Community
              </Link>
              <Link to="/gardens" className="btn btn-secondary">
                Find a Garden Near You
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
