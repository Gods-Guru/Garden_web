import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useAuthStore from '../../../../store/useAuthStore';
import './AssignPlotModal.css';

const AssignPlotModal = ({ plot, onAssign, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchGardenMembers = async () => {
      try {
        const response = await fetch(`/api/gardens/${plot.gardenId}/members`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch garden members');
        }

        const data = await response.json();
        setUsers(data.members.filter(member => member.status === 'active'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGardenMembers();
  }, [plot.gardenId, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedUser) {
      onAssign(plot._id, selectedUser);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Assign Plot: {plot.name}</h2>
        
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userId">Select User</label>
              <select
                id="userId"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
              >
                <option value="">Choose a user...</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={!selectedUser}>
                Assign Plot
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

AssignPlotModal.propTypes = {
  plot: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    gardenId: PropTypes.string.isRequired,
  }).isRequired,
  onAssign: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AssignPlotModal;
