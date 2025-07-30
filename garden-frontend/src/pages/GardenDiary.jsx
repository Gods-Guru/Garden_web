import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Filter, Search, Camera, Leaf } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import useAuthStore from '../store/useAuthStore';
import api from '../api/api';
import '../styles/pagestyles/GardenDiary.scss';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const GardenDiary = () => {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const activityIcons = {
    'Watering': '💧',
    'Planting': '🌱',
    'Weeding': '🌿',
    'Harvesting': '🥕',
    'Fertilizing': '🌾',
    'Pruning': '✂️',
    'Pest Control': '🐛',
    'Soil Preparation': '🪴',
    'Mulching': '🍂',
    'Other': '📝'
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const response = await api.get(`/logs/user/${user.id}`);
      setLogs(response.data.logs.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.activity === filter;
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.activity.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const logDate = new Date(log.date);
      const now = new Date();
      
      switch (dateRange) {
        case 'week':
          matchesDate = (now - logDate) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesDate = (now - logDate) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case 'season':
          matchesDate = (now - logDate) <= 90 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const groupLogsByMonth = (logs) => {
    const grouped = {};
    logs.forEach(log => {
      const date = new Date(log.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          name: monthName,
          logs: []
        };
      }
      grouped[monthKey].logs.push(log);
    });
    
    return Object.values(grouped);
  };

  const groupedLogs = groupLogsByMonth(filteredLogs);

  if (loading) {
    return (
      <div className="garden-diary-page">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your garden diary...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="garden-diary-page">
      <Navbar />
      
      <main className="diary-main">
        <motion.div 
          className="diary-container"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <div className="diary-header">
              <div className="header-content">
                <h1>🌱 My Garden Diary</h1>
                <p>A chronological journey through your gardening adventures</p>
              </div>
              
              <div className="diary-stats">
                <div className="stat-item">
                  <span className="stat-number">{logs.length}</span>
                  <span className="stat-label">Total Entries</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{new Set(logs.map(log => log.activity)).size}</span>
                  <span className="stat-label">Activity Types</span>
                </div>
              </div>
            </div>

            <div className="diary-filters">
              <div className="filter-group">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Activities</option>
                  {Object.keys(activityIcons).map(activity => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
                
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="season">Past Season</option>
                </select>
              </div>
            </div>

            <div className="diary-timeline">
              {groupedLogs.length === 0 ? (
                <div className="no-entries">
                  <Leaf size={48} />
                  <h3>No diary entries found</h3>
                  <p>Start logging your garden activities to build your diary!</p>
                  <a href="/activity-log" className="btn btn-primary">
                    Add First Entry
                  </a>
                </div>
              ) : (
                groupedLogs.map((month, monthIndex) => (
                  <motion.div 
                    key={month.name}
                    className="month-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: monthIndex * 0.1 }}
                  >
                    <div className="month-header">
                      <h2>{month.name}</h2>
                      <span className="entry-count">{month.logs.length} entries</span>
                    </div>
                    
                    <div className="timeline-entries">
                      {month.logs.map((log, logIndex) => (
                        <motion.div 
                          key={log._id}
                          className="timeline-entry"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (monthIndex * 0.1) + (logIndex * 0.05) }}
                        >
                          <div className="entry-marker">
                            <div className="activity-icon">
                              {activityIcons[log.activity] || '📝'}
                            </div>
                          </div>
                          
                          <div className="entry-content">
                            <div className="entry-header">
                              <h3>{log.activity}</h3>
                              <span className="entry-date">
                                {new Date(log.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            
                            <p className="entry-description">{log.description}</p>
                            
                            {log.photo && (
                              <div className="entry-photo">
                                <img src={log.photo} alt="Garden activity" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
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

export default GardenDiary;
