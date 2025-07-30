import React from 'react';
import './VolunteerActivity.scss';

const VolunteerActivity = ({ volunteers }) => {
  if (!volunteers || volunteers.length === 0) {
    return (
      <div className="volunteer-activity empty">
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <p>No volunteer activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-activity">
      <div className="volunteers-list">
        {volunteers.slice(0, 4).map((volunteer) => (
          <div key={volunteer.id} className="volunteer-item">
            <div className="volunteer-avatar">
              <img 
                src={volunteer.avatar || '/default-avatar.png'} 
                alt={volunteer.name}
              />
              <div className={`status-indicator ${volunteer.status}`}></div>
            </div>
            <div className="volunteer-info">
              <h4>{volunteer.name}</h4>
              <div className="volunteer-stats">
                <span>✅ {volunteer.tasksCompleted} tasks</span>
                <span>⏰ {volunteer.hoursVolunteered}h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerActivity;
