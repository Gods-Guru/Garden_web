import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import '../styles/pagestyles/Features.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Features = () => {
  const userFeatures = [
    {
      icon: '🌱',
      title: 'Plot Application',
      description: 'Apply for garden plots with detailed preferences and requirements'
    },
    {
      icon: '📝',
      title: 'Activity Logging',
      description: 'Track your gardening activities, progress, and maintenance tasks'
    },
    {
      icon: '📅',
      title: 'Event Participation',
      description: 'Join community events, workshops, and gardening activities'
    },
    {
      icon: '💡',
      title: 'Garden Tips',
      description: 'Access expert gardening guides, tips, and best practices'
    }
  ];

  const managerFeatures = [
    {
      icon: '✅',
      title: 'Plot Assignment',
      description: 'Review and approve plot applications from community members'
    },
    {
      icon: '🎯',
      title: 'Event Creation',
      description: 'Organize local garden events and community activities'
    },
    {
      icon: '🛠️',
      title: 'Issue Resolution',
      description: 'Handle complaints and resolve garden-related issues'
    },
    {
      icon: '👥',
      title: 'User Oversight',
      description: 'Monitor garden activity and support community members'
    }
  ];

  const adminFeatures = [
    {
      icon: '🏗️',
      title: 'Full System Control',
      description: 'Complete platform management with all administrative privileges'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Comprehensive reports on garden usage, user activity, and trends'
    },
    {
      icon: '⚙️',
      title: 'Platform Customization',
      description: 'Configure system settings, rules, and platform-wide features'
    },
    {
      icon: '🔧',
      title: 'Advanced Tools',
      description: 'Bulk operations, audit logs, and system maintenance tools'
    }
  ];

  return (
    <div className="features-page">
      <Navbar />
      
      <main className="features-main">
        <motion.section 
          className="features-hero"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="container">
            <motion.h1 variants={fadeInUp}>
              Powerful Features for Every Role
            </motion.h1>
            <motion.p variants={fadeInUp}>
              Discover how our Community Garden Management System empowers gardeners, 
              managers, and administrators with tailored tools and features.
            </motion.p>
          </div>
        </motion.section>

        <motion.section 
          className="role-features"
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
          viewport={{ once: true }}
        >
          <div className="container">
            {/* User Features */}
            <motion.div className="feature-category" variants={fadeInUp}>
              <h2>👤 For Gardeners</h2>
              <p>Everything you need to manage your garden plot and connect with the community</p>
              <div className="features-grid">
                {userFeatures.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="feature-card"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Manager Features */}
            <motion.div className="feature-category" variants={fadeInUp}>
              <h2>🧑‍🌾 For Managers</h2>
              <p>Tools to oversee gardens, support users, and build thriving communities</p>
              <div className="features-grid">
                {managerFeatures.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="feature-card"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Admin Features */}
            <motion.div className="feature-category" variants={fadeInUp}>
              <h2>👨‍💼 For Administrators</h2>
              <p>Complete platform control with advanced management and analytics tools</p>
              <div className="features-grid">
                {adminFeatures.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="feature-card"
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
