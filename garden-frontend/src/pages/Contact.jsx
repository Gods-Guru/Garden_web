import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/pagestyles/Contact.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'garden', label: 'Garden Management' },
    { value: 'community', label: 'Community Issues' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'partnership', label: 'Partnership Opportunities' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful submission
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1>📞 Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="alert alert-success">
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="alert alert-error">
                <h3>Failed to Send Message</h3>
                <p>There was an error sending your message. Please try again or contact us directly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief description of your inquiry"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📧</div>
                <div className="method-content">
                  <h3>Email</h3>
                  <p>support@gardenmanagement.com</p>
                  <small>We typically respond within 24 hours</small>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">📱</div>
                <div className="method-content">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                  <small>Monday - Friday, 9 AM - 5 PM EST</small>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">📍</div>
                <div className="method-content">
                  <h3>Address</h3>
                  <p>123 Garden Street<br />Green City, GC 12345</p>
                  <small>Visit us by appointment</small>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">💬</div>
                <div className="method-content">
                  <h3>Community Forum</h3>
                  <p>Join our community discussions</p>
                  <Link to="/community" className="forum-link">
                    Visit Forum →
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <p>Find quick answers to common questions in our help center.</p>
              <Link to="/help" className="btn btn-secondary">
                Visit Help Center
              </Link>
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#facebook" className="social-link">
                  📘 Facebook
                </a>
                <a href="#twitter" className="social-link">
                  🐦 Twitter
                </a>
                <a href="#instagram" className="social-link">
                  📷 Instagram
                </a>
                <a href="#linkedin" className="social-link">
                  💼 LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="contact-quick-links">
          <h3>Quick Links</h3>
          <div className="quick-links-grid">
            <Link to="/help" className="quick-link">
              🆘 Help Center
            </Link>
            <Link to="/about" className="quick-link">
              ℹ️ About Us
            </Link>
            <Link to="/gardens" className="quick-link">
              🌱 Browse Gardens
            </Link>
            <Link to="/community" className="quick-link">
              👥 Community
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
