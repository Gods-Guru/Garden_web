// src/pages/TasksPage.jsx
import React from 'react';
import MyTasks from '../components/dashboard/MyTasks'; // Reusing the existing MyTasks component

const TasksPage = () => {
  return (
    <div className="space-y-6">
      {/* <h1 className="text-3xl font-bold text-primary-700">My Tasks</h1> */}
      <MyTasks />
    </div>
  );
};

export default TasksPage;
