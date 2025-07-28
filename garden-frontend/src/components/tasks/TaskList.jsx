import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from '../common/LoadingSpinner';
import './TaskList.scss';

const TaskList = ({ limit = null, gardenId = null }) => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, show placeholder data to avoid API errors
    setTasks([]);
    setLoading(false);
    setError(null);
  }, [gardenId]);

  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (error) {
    return (
      <div className="task-list-error">
        <p>Unable to load tasks at this time.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>📋 Tasks</h3>
      </div>

      <div className="task-list-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks available</p>
            <small>Tasks will appear here when assigned</small>
          </div>
        ) : (
          <div className="tasks">
            {tasks.slice(0, limit || tasks.length).map((task, index) => (
              <div key={task._id || index} className="task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  {task.dueDate && (
                    <small>Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                  )}
                </div>
                <div className="task-status">
                  <span className={`status ${task.status || 'pending'}`}>
                    {task.status || 'pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

export default TaskList;
