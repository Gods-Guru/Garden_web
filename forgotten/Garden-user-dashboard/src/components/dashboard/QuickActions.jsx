// QuickActions Component
import React from 'react';
import { Droplets, AlertCircle, Camera, CheckSquare, PlusCircle, Zap } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      id: 'logWater',
      label: 'Log Water Usage',
      icon: <Droplets size={20} className="text-blue-500 group-hover:text-blue-600" />,
      color: 'blue',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      id: 'reportIssue',
      label: 'Report Issue',
      icon: <AlertCircle size={20} className="text-red-500 group-hover:text-red-600" />,
      color: 'red',
      bgColor: 'bg-red-50 hover:bg-red-100',
      borderColor: 'border-red-200'
    },
    {
      id: 'uploadPhoto',
      label: 'Upload Plot Photo',
      icon: <Camera size={20} className="text-purple-500 group-hover:text-purple-600" />,
      color: 'purple',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      id: 'completeTask',
      label: 'Complete Task',
      icon: <CheckSquare size={20} className="text-green-500 group-hover:text-green-600" />,
      color: 'green',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      id: 'addPlant',
      label: 'Add New Plant',
      icon: <PlusCircle size={20} className="text-teal-500 group-hover:text-teal-600" />,
      color: 'teal',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
      borderColor: 'border-teal-200'
    },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-semibold text-primary-700 mb-6 flex items-center">
        <Zap size={28} className="mr-2 text-primary-500" /> Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map(action => (
          <button
            key={action.id}
            className={`group flex items-center p-3 rounded-md border shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                        ${action.bgColor} ${action.borderColor} hover:shadow-md`}
            // Example onClick: onClick={() => console.log(`${action.label} clicked`)}
          >
            <div className="flex-shrink-0 mr-3 p-1.5 bg-card rounded-full border border-border group-hover:border-transparent transition-colors">
              {action.icon}
            </div>
            <span className={`text-sm font-medium text-${action.color}-700 group-hover:text-${action.color}-800`}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
