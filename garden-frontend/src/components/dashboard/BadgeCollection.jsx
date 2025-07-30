import React from 'react';
import './BadgeCollection.scss';

const BadgeCollection = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="badge-collection empty">
        <div className="empty-state">
          <span className="empty-icon">🏆</span>
          <p>No badges earned yet</p>
          <p className="empty-subtitle">Complete tasks and participate in events to earn badges!</p>
        </div>
      </div>
    );
  }

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="badge-collection">
      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="badges-section earned">
          <h4>Earned Badges ({earnedBadges.length})</h4>
          <div className="badges-grid">
            {earnedBadges.slice(0, 3).map((badge) => (
              <div key={badge.id} className="badge-item earned">
                <div className="badge-icon">
                  {badge.icon}
                </div>
                <div className="badge-info">
                  <h5>{badge.name}</h5>
                  <p>{badge.description}</p>
                </div>
                <div className="badge-status earned">
                  ✅ Earned
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div className="badges-section available">
          <h4>Available Badges ({availableBadges.length})</h4>
          <div className="badges-grid">
            {availableBadges.slice(0, 3).map((badge) => (
              <div key={badge.id} className="badge-item available">
                <div className="badge-icon locked">
                  {badge.icon}
                </div>
                <div className="badge-info">
                  <h5>{badge.name}</h5>
                  <p>{badge.description}</p>
                </div>
                <div className="badge-status available">
                  🔒 Locked
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="badge-progress">
        <div className="progress-header">
          <span>Badge Progress</span>
          <span>{earnedBadges.length} of {badges.length} earned</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection;
