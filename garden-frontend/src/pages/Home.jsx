import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/pagestyles/Home.scss';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import myGardenImg from '../assets/images/commun-garden.jpg';
import createImg from '../assets/images/create.jpg';
import joinGardenImg from '../assets/images/join-garden.jpg';
import getPlotImg from '../assets/images/get-plot.jpg';
import growingPlantImg from '../assets/images/growing-plant.jpg';
import mariaAvatar from '../assets/images/kelsey-he-J9s9GQSRX6U-unsplash.jpg';
import jamesAvatar from '../assets/images/jonathan-kemper-3fgC5r65CU0-unsplash.jpg';
import sarahAvatar from '../assets/images/graig-durant-qc6r9yOOr5k-unsplash.jpg';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Home() {
  return (
    <div className="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <header className="home-header">
        <div className="header-container">
          <motion.div 
            className="header-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp}>
              <span className="icon">🌱</span> Cultivate Community with Rooted
            </motion.h1>
            <motion.p variants={fadeInUp}>
              Your all-in-one platform for managing community gardens, connecting with fellow gardeners, and tracking your green journey.
            </motion.p>
            <motion.div className="home-cta" variants={fadeInUp}>
              <Link to="/register" className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Join Now
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign In
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            className="hero-image-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <img 
              src={myGardenImg} 
              alt="Beautiful Community Garden" 
              className="hero-image" 
              loading="lazy"
            />
          </motion.div>
        </div>
      </header>

      {/* Stats Bar */}
      <motion.section 
        className="stats-bar"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="stats-container">
          {[
            { number: '250+', label: 'Community Gardens' },
            { number: '10K+', label: 'Active Gardeners' },
            { number: '500+', label: 'Events Yearly' },
            { number: '95%', label: 'Success Rate' }
          ].map((stat, index) => (
            <motion.div 
              className="stat-item" 
              key={index}
              whileHover={{ y: -5 }}
            >
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="home-features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2 variants={fadeInUp}>Everything You Need to Grow Together</motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp}>
              Our platform provides all the tools for successful community gardening
            </motion.p>
          </motion.div>
          
          <div className="features-grid">
            {[
              {
                icon: '🌿',
                title: 'Plot Management',
                description: 'Track your assigned plots, log activities, and monitor plant health with our intuitive dashboard.',
              },
              {
                icon: '✅',
                title: 'Task System',
                description: 'Receive personalized tasks, mark them complete, and get reminders for watering and maintenance.',
              },
              {
                icon: '📸',
                title: 'Garden Journal',
                description: 'Document your garden\'s progress with photos and notes to track growth over time.',
              },
              {
                icon: '👥',
                title: 'Community Hub',
                description: 'Connect with other gardeners, share tips, and join local events in your area.',
              },
              {
                icon: '📊',
                title: 'Analytics',
                description: 'View harvest yields, plant success rates, and garden participation metrics.',
              },
              {
                icon: '🛠️',
                title: 'Admin Tools',
                description: 'Manage members, plots, and garden resources with powerful administrative features.',
              }
            ].map((feature, index) => (
              <motion.div 
                className="feature-card" 
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to="/features" className="feature-link">
                  Learn more 
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="home-how">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeInUp}>Getting Started is Easy</motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp}>
              Join thousands of gardeners in just a few simple steps
            </motion.p>
          </motion.div>
          
          <div className="steps-container">
            {[
              {
                number: '1',
                title: 'Create Your Account',
                description: 'Sign up in minutes with your email address and basic information.',
                image: createImg,
                alt: 'Create Account'
              },
              {
                number: '2',
                title: 'Join a Garden',
                description: 'Find and request to join a community garden near you or start your own.',
                image: joinGardenImg,
                alt: 'Join a Garden'
              },
              {
                number: '3',
                title: 'Get Your Plot',
                description: 'Work with garden admins to get assigned your growing space.',
                image: getPlotImg,
                alt: 'Get Your Plot'
              },
              {
                number: '4',
                title: 'Start Growing',
                description: 'Use our tools to plan, track, and share your gardening journey.',
                image: growingPlantImg,
                alt: 'Start Growing'
              }
            ].map((step, index) => (
              <motion.div 
                className="step" 
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <motion.img 
                  src={step.image} 
                  alt={step.alt} 
                  className="step-image" 
                  loading="lazy"
                  whileHover={{ scale: 1.03 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeInUp}>What Our Gardeners Say</motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp}>
              Hear from our thriving community members
            </motion.p>
          </motion.div>
          
          <div className="testimonial-grid">
            {[
              {
                quote: "Rooted transformed how our community garden operates. Coordination is so much easier now!",
                name: "Maria Gonzalez",
                role: "Community Garden Leader",
                image: mariaAvatar
              },
              {
                quote: "As a beginner gardener, the task reminders and plant tracking have been invaluable to my success.",
                name: "James Wilson",
                role: "Urban Gardener",
                image: jamesAvatar
              },
              {
                quote: "Our yield increased by 40% after implementing the planning tools from Rooted.",
                name: "Sarah Chen",
                role: "Farm Coordinator",
                image: sarahAvatar
              }
            ].map((testimonial, index) => (
              <motion.div 
                className="testimonial-card" 
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="testimonial-content">
                  <p>{testimonial.quote}</p>
                </div>
                <div className="testimonial-author">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="author-avatar" 
                    loading="lazy"
                  />
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <motion.div 
            className="newsletter-content"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.div className="newsletter-text" variants={fadeInUp}>
              <h2>Stay Updated</h2>
              <p>Subscribe to our newsletter for gardening tips, feature updates, and community stories.</p>
            </motion.div>
            <motion.form className="newsletter-form" variants={fadeInUp}>
              <input 
                type="email" 
                placeholder="Your email address" 
                required 
                aria-label="Email address for newsletter subscription"
              />
              <button type="submit" className="btn btn-primary">
                Subscribe
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.form>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default Home;