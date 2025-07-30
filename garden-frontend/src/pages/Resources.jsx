import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, BookOpen, FileText, Video, ExternalLink } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../api/api';
import '../styles/pagestyles/Resources.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    'Soil & Composting',
    'Plant Care',
    'Pest Management',
    'Seasonal Gardening',
    'Tools & Equipment',
    'Harvesting',
    'Garden Planning',
    'Organic Methods'
  ];

  const sampleResources = [
    {
      _id: '1',
      title: 'Complete Guide to Soil Preparation',
      description: 'Learn how to prepare and maintain healthy soil for optimal plant growth.',
      category: 'Soil & Composting',
      type: 'PDF',
      downloadUrl: '/resources/soil-guide.pdf',
      downloadCount: 245,
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      title: 'Organic Pest Control Methods',
      description: 'Natural and effective ways to protect your plants from common pests.',
      category: 'Pest Management',
      type: 'PDF',
      downloadUrl: '/resources/pest-control.pdf',
      downloadCount: 189,
      createdAt: '2024-01-20'
    },
    {
      _id: '3',
      title: 'Seasonal Planting Calendar',
      description: 'Know exactly when to plant different crops throughout the year.',
      category: 'Seasonal Gardening',
      type: 'PDF',
      downloadUrl: '/resources/planting-calendar.pdf',
      downloadCount: 312,
      createdAt: '2024-02-01'
    },
    {
      _id: '4',
      title: 'Composting 101 Video Series',
      description: 'Step-by-step video guide to creating nutrient-rich compost.',
      category: 'Soil & Composting',
      type: 'Video',
      downloadUrl: 'https://youtube.com/watch?v=example',
      downloadCount: 156,
      createdAt: '2024-02-10'
    },
    {
      _id: '5',
      title: 'Garden Tool Maintenance Guide',
      description: 'Keep your gardening tools in perfect condition with proper care.',
      category: 'Tools & Equipment',
      type: 'PDF',
      downloadUrl: '/resources/tool-maintenance.pdf',
      downloadCount: 98,
      createdAt: '2024-02-15'
    }
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      // For now, use sample data. In production, this would be:
      // const response = await api.get('/resources/all');
      // setResources(response.data.resources);
      setResources(sampleResources);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setResources(sampleResources); // Fallback to sample data
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getResourceIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText size={20} />;
      case 'Video':
        return <Video size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };

  const handleDownload = async (resource) => {
    try {
      // Track download
      await api.post(`/resources/${resource._id}/download`);
      
      // Open resource
      if (resource.type === 'Video' || resource.downloadUrl.startsWith('http')) {
        window.open(resource.downloadUrl, '_blank');
      } else {
        // For PDFs and other files, trigger download
        const link = document.createElement('a');
        link.href = resource.downloadUrl;
        link.download = resource.title;
        link.click();
      }
    } catch (err) {
      console.error('Failed to track download:', err);
      // Still allow the download even if tracking fails
      window.open(resource.downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="resources-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading garden resources...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="resources-page">
      <Navbar />
      
      <main className="resources-main">
        <motion.div 
          className="resources-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <div className="resources-header">
              <h1>🌿 Garden Resources</h1>
              <p>Expert guides, tips, and tools to help you grow the perfect garden</p>
            </div>

            <div className="resources-filters">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-filter"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="resources-grid">
              {filteredResources.length === 0 ? (
                <div className="no-resources">
                  <BookOpen size={48} />
                  <h3>No resources found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredResources.map((resource, index) => (
                  <motion.div 
                    key={resource._id}
                    className="resource-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="resource-header">
                      <div className="resource-type">
                        {getResourceIcon(resource.type)}
                        <span>{resource.type}</span>
                      </div>
                      <div className="resource-category">
                        {resource.category}
                      </div>
                    </div>
                    
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    
                    <div className="resource-meta">
                      <span className="download-count">
                        <Download size={14} />
                        {resource.downloadCount} downloads
                      </span>
                      <span className="resource-date">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <button 
                      className="download-btn"
                      onClick={() => handleDownload(resource)}
                    >
                      {resource.type === 'Video' ? (
                        <>
                          <ExternalLink size={16} />
                          Watch Now
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          Download
                        </>
                      )}
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
