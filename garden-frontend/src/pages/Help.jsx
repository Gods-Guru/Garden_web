import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/pagestyles/Help.scss';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'gardens', name: 'Garden Management', icon: '🌱' },
    { id: 'plots', name: 'Plot Management', icon: '🏡' },
    { id: 'community', name: 'Community Features', icon: '👥' },
    { id: 'account', name: 'Account & Settings', icon: '⚙️' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' }
  ];

  const helpArticles = [
    {
      id: 1,
      title: 'How to Create Your First Garden',
      category: 'getting-started',
      description: 'Step-by-step guide to setting up your community garden',
      content: 'Learn how to create and configure your first garden space...',
      tags: ['garden', 'setup', 'beginner']
    },
    {
      id: 2,
      title: 'Managing Garden Members',
      category: 'gardens',
      description: 'Add, remove, and manage permissions for garden members',
      content: 'Comprehensive guide to member management...',
      tags: ['members', 'permissions', 'management']
    },
    {
      id: 3,
      title: 'Plot Assignment and Management',
      category: 'plots',
      description: 'How to assign plots to members and track usage',
      content: 'Everything you need to know about plot management...',
      tags: ['plots', 'assignment', 'tracking']
    },
    {
      id: 4,
      title: 'Using the Community Forum',
      category: 'community',
      description: 'Connect with other gardeners and share experiences',
      content: 'Make the most of community features...',
      tags: ['community', 'forum', 'social']
    },
    {
      id: 5,
      title: 'Account Settings and Privacy',
      category: 'account',
      description: 'Manage your account settings and privacy preferences',
      content: 'Control your account and privacy settings...',
      tags: ['account', 'privacy', 'settings']
    },
    {
      id: 6,
      title: 'Common Issues and Solutions',
      category: 'troubleshooting',
      description: 'Troubleshoot common problems and find solutions',
      content: 'Quick fixes for common issues...',
      tags: ['troubleshooting', 'issues', 'solutions']
    }
  ];

  const faqItems = [
    {
      question: 'How do I join a community garden?',
      answer: 'You can browse available gardens on our Gardens page and submit an application to join. Garden managers will review your application and get back to you.'
    },
    {
      question: 'Can I create my own garden?',
      answer: 'Yes! Any registered user can create a new garden. You\'ll become the garden owner and can invite others to join your community.'
    },
    {
      question: 'How much does it cost to use the platform?',
      answer: 'The basic platform is free to use. Individual gardens may have their own membership fees or plot rental costs set by garden owners.'
    },
    {
      question: 'What if I forget my password?',
      answer: 'Use the "Forgot Password" link on the login page to reset your password. You\'ll receive an email with instructions to create a new password.'
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team through the contact form below, or email us directly at support@gardenmanagement.com.'
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="help-page">
      <Navbar />
      
      <div className="help-container">
        {/* Header */}
        <div className="help-header">
          <h1>🆘 Help Center</h1>
          <p>Find answers to your questions and learn how to make the most of our platform</p>
        </div>

        {/* Search */}
        <div className="help-search">
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Categories */}
        <div className="help-categories">
          {helpCategories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Help Articles */}
        <div className="help-content">
          <div className="help-articles">
            <h2>Help Articles</h2>
            {filteredArticles.length === 0 ? (
              <div className="empty-state">
                <p>No articles found matching your search.</p>
              </div>
            ) : (
              <div className="articles-grid">
                {filteredArticles.map(article => (
                  <div key={article.id} className="article-card">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div className="article-tags">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                    <Link to={`/help/article/${article.id}`} className="read-more">
                      Read More →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqItems.map((item, index) => (
                <details key={index} className="faq-item">
                  <summary className="faq-question">{item.question}</summary>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="contact-support">
            <h2>Still Need Help?</h2>
            <p>Can't find what you're looking for? Our support team is here to help!</p>
            
            <div className="contact-options">
              <div className="contact-option">
                <div className="contact-icon">📧</div>
                <h3>Email Support</h3>
                <p>Get help via email</p>
                <a href="mailto:support@gardenmanagement.com" className="btn btn-primary">
                  Send Email
                </a>
              </div>
              
              <div className="contact-option">
                <div className="contact-icon">💬</div>
                <h3>Community Forum</h3>
                <p>Ask the community</p>
                <Link to="/community" className="btn btn-secondary">
                  Visit Forum
                </Link>
              </div>
              
              <div className="contact-option">
                <div className="contact-icon">📚</div>
                <h3>Documentation</h3>
                <p>Detailed guides and API docs</p>
                <a href="#docs" className="btn btn-secondary">
                  View Docs
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="help-quick-links">
            <h3>Quick Links</h3>
            <div className="quick-links-grid">
              <Link to="/about" className="quick-link">
                ℹ️ About Us
              </Link>
              <Link to="/gardens" className="quick-link">
                🌱 Browse Gardens
              </Link>
              <Link to="/community" className="quick-link">
                👥 Community
              </Link>
              <Link to="/dashboard" className="quick-link">
                🏠 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Help;
