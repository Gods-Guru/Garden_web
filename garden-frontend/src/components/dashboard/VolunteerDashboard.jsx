import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import EventsList from './EventsList';
import TasksList from './TasksList';
import BadgeCollection from './BadgeCollection';
import './VolunteerDashboard.scss';

const VolunteerDashboard = ({ user, gardens }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    tasksCompleted: 0,
    hoursVolunteered: 0,
    badgesEarned: 0,
    upcomingEvents: 0,
    currentLevel: 'Bronze'
  });
  const [myEvents, setMyEvents] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myBadges, setMyBadges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteerStats();
    fetchMyEvents();
    fetchAvailableTasks();
    fetchMyBadges();
    fetchRecentActivity();
  }, []);

  const fetchVolunteerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch volunteer statistics from backend
      const response = await fetch('/api/volunteer/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch volunteer stats');
      }

      const data = await response.json();
      setStats({
        eventsRegistered: data.eventsRegistered || 0,
        tasksCompleted: data.tasksCompleted || 0,
        hoursVolunteered: data.hoursVolunteered || 0,
        badgesEarned: data.badgesEarned || 0,
        upcomingEvents: data.upcomingEvents || 0,
        currentLevel: data.currentLevel || 'Bronze'
      });
    } catch (error) {
      console.error('Error fetching volunteer stats:', error);
      // Fallback to default values on error
      setStats({
        eventsRegistered: 0,
        tasksCompleted: 0,
        hoursVolunteered: 0,
        badgesEarned: 0,
        upcomingEvents: 0,
        currentLevel: 'Bronze'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    try {
      setMyEvents([
        { 
          id: 1, 
          title: 'Community Composting Workshop', 
          date: '2024-02-15', 
          time: '10:00 AM',
          location: 'Sunset Garden',
          status: 'registered',
          type: 'workshop'
        },
        { 
          id: 2, 
          title: 'Spring Planting Day', 
          date: '2024-02-20', 
          time: '9:00 AM',
          location: 'Green Valley Garden',
          status: 'registered',
          type: 'volunteer'
        },
        { 
          id: 3, 
          title: 'Garden Maintenance', 
          date: '2024-02-25', 
          time: '2:00 PM',
          location: 'Community Garden',
          status: 'completed',
          type: 'maintenance'
        }
      ]);
    } catch (error) {
      console.error('Error fetching my events:', error);
    }
  };

  const fetchAvailableTasks = async () => {
    try {
      setAvailableTasks([
        { id: 1, title: 'Water greenhouse plants', garden: 'Sunset Garden', points: 10, difficulty: 'Easy', estimatedTime: '30 min' },
        { id: 2, title: 'Weed community plot area', garden: 'Green Valley', points: 15, difficulty: 'Medium', estimatedTime: '1 hour' },
        { id: 3, title: 'Harvest vegetables for food bank', garden: 'Community Garden', points: 20, difficulty: 'Easy', estimatedTime: '45 min' },
        { id: 4, title: 'Repair garden fence', garden: 'Sunset Garden', points: 25, difficulty: 'Hard', estimatedTime: '2 hours' }
      ]);
    } catch (error) {
      console.error('Error fetching available tasks:', error);
    }
  };

  const fetchMyBadges = async () => {
    try {
      setMyBadges([
        { id: 1, name: 'First Volunteer', icon: '🌟', description: 'Completed first volunteer task', earned: true },
        { id: 2, name: 'Green Thumb', icon: '👍', description: 'Helped with 10 planting tasks', earned: true },
        { id: 3, name: 'Community Helper', icon: '🤝', description: 'Volunteered 20+ hours', earned: true },
        { id: 4, name: 'Event Organizer', icon: '📅', description: 'Helped organize 3 events', earned: false },
        { id: 5, name: 'Master Gardener', icon: '🏆', description: 'Complete 50 garden tasks', earned: false },
        { id: 6, name: 'Mentor', icon: '👨‍🏫', description: 'Train 5 new volunteers', earned: false }
      ]);
    } catch (error) {
      console.error('Error fetching my badges:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      setRecentActivity([
        { id: 1, type: 'task_completed', message: 'Completed watering task at Sunset Garden', time: '2 hours ago' },
        { id: 2, type: 'event_joined', message: 'Registered for Spring Planting Day', time: '1 day ago' },
        { id: 3, type: 'badge_earned', message: 'Earned "Community Helper" badge', time: '3 days ago' },
        { id: 4, type: 'task_completed', message: 'Helped with greenhouse maintenance', time: '5 days ago' },
        { id: 5, type: 'feedback_given', message: 'Left feedback for composting workshop', time: '1 week ago' }
      ]);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const quickActions = [
    {
      label: 'Join Event',
      icon: '📅',
      action: () => navigate('/events/available'),
      color: '#2563eb'
    },
    {
      label: 'Mark Task Done',
      icon: '✅',
      action: () => navigate('/tasks/complete'),
      color: '#059669'
    },
    {
      label: 'Message Manager',
      icon: '💬',
      action: () => navigate('/messages/compose?to=manager'),
      color: '#7c2d12'
    },
    {
      label: 'View Opportunities',
      icon: '🌟',
      action: () => navigate('/volunteer/opportunities'),
      color: '#d97706'
    }
  ];

  const dashboardCards = [
    {
      title: 'Events Registered',
      value: stats.eventsRegistered,
      icon: '📅',
      color: '#2563eb',
      change: 'This year',
      link: '/events/my-events'
    },
    {
      title: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: '✅',
      color: '#059669',
      change: '+3 this week',
      link: '/tasks/completed'
    },
    {
      title: 'Hours Volunteered',
      value: stats.hoursVolunteered,
      icon: '⏰',
      color: '#d97706',
      change: 'Total contribution',
      link: '/volunteer/hours'
    },
    {
      title: 'Badges Earned',
      value: stats.badgesEarned,
      icon: '🏆',
      color: '#dc2626',
      change: `${stats.currentLevel} level`,
      link: '/volunteer/badges'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: '🎪',
      color: '#7c2d12',
      change: 'Next 30 days',
      link: '/events/upcoming'
    },
    {
      title: 'Volunteer Points',
      value: '340',
      icon: '⭐',
      color: '#059669',
      change: '+25 this week',
      link: '/volunteer/points'
    }
  ];

  if (loading) {
    return (
      <div className="volunteer-dashboard loading">
        <div className="loading-spinner">Loading volunteer dashboard...</div>
      </div>
    );
  }

  return (
    <div className="volunteer-dashboard">
      {/* Stats Cards Grid */}
      <div className="dashboard-cards-grid">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            change={card.change}
            link={card.link}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        {/* My Events */}
        <div className="dashboard-section events-section">
          <h3>My Events</h3>
          <EventsList events={myEvents} showStatus={true} />
          <Link to="/events/my-events" className="view-all-link">
            View All Events →
          </Link>
        </div>

        {/* Available Tasks */}
        <div className="dashboard-section tasks-section">
          <h3>Available Tasks</h3>
          <TasksList tasks={availableTasks} showPoints={true} />
          <Link to="/tasks/available" className="view-all-link">
            View All Tasks →
          </Link>
        </div>

        {/* Badge Collection */}
        <div className="dashboard-section badges-section">
          <h3>My Badges</h3>
          <BadgeCollection badges={myBadges} />
          <Link to="/volunteer/badges" className="view-all-link">
            View All Badges →
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section activity-section">
          <h3>Recent Activity</h3>
          <RecentActivity activities={recentActivity} />
          <Link to="/volunteer/activity" className="view-all-link">
            View Full Activity →
          </Link>
        </div>
      </div>

      {/* Volunteer Progress */}
      <div className="dashboard-section progress-section">
        <h3>Volunteer Progress</h3>
        <div className="progress-overview">
          <div className="level-info">
            <div className="current-level">
              <span className="level-badge">{stats.currentLevel}</span>
              <span className="level-text">Current Level</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '65%' }}></div>
            </div>
            <div className="next-level">
              <span className="next-level-text">Next: Gold Level</span>
              <span className="points-needed">Need 160 more points</span>
            </div>
          </div>
          
          <div className="achievements-summary">
            <div className="achievement-item">
              <span className="achievement-icon">🎯</span>
              <span className="achievement-text">Monthly Goal: 8/10 hours</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-icon">🏃‍♂️</span>
              <span className="achievement-text">Streak: 3 weeks active</span>
            </div>
            <div className="achievement-item">
              <span className="achievement-icon">👥</span>
              <span className="achievement-text">Impact: Helped 15 gardeners</span>
            </div>
          </div>
        </div>
        <Link to="/volunteer/progress" className="view-all-link">
          View Detailed Progress →
        </Link>
      </div>

      {/* Feedback Box */}
      <div className="dashboard-section feedback-section">
        <h3>Quick Feedback</h3>
        <div className="feedback-box">
          <textarea 
            placeholder="Share your volunteer experience or suggestions..."
            className="feedback-textarea"
          ></textarea>
          <button className="feedback-submit-btn">
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
