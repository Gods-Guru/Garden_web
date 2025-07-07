// MyTasks Component
import React, { useState } from 'react';
import { ListChecks, CheckCircle2, Circle, AlertOctagon, CalendarClock, Filter } from 'lucide-react';

const MyTasks = () => {
  // Dummy task data
  const initialTasks = [
    { id: 1, description: "Weed Plot A-01 (Tomatoes & Basil)", priority: "High", dueDate: "Today", completed: false, plot: "Plot A-01" },
    { id: 2, description: "Fertilize roses in community flower bed", priority: "Medium", dueDate: "Tomorrow", completed: false, plot: "Community Area" },
    { id: 3, description: "Harvest ripe strawberries from Plot B-05", priority: "High", dueDate: "Today", completed: false, plot: "Plot B-05" },
    { id: 4, description: "Attend garden workshop: Organic Pest Control", priority: "Low", dueDate: "2024-07-28", completed: false, category: "Event" },
    { id: 5, description: "Water community herb garden", priority: "Medium", dueDate: "Tomorrow", completed: true, plot: "Community Area" },
    { id: 6, description: "Check Plot B-05 for squash bugs", priority: "High", dueDate: "Today", completed: false, plot: "Plot B-05" },
    { id: 7, description: "Turn compost pile", priority: "Low", dueDate: "This Week", completed: false, category: "General" },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("All"); // All, Today, This Week, Overdue

  // UX Idea: Add a subtle animation on task completion or a "Task Complete!" toast message.
  // For example, when a task is marked complete, it could fade out or move to a "Completed" section.
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "All") return !task.completed; // Show only pending by default or add another filter for "Completed"
    if (filter === "Today") return !task.completed && task.dueDate === "Today";
    if (filter === "This Week") return !task.completed && (task.dueDate === "Today" || task.dueDate === "Tomorrow" || task.dueDate === "This Week"); // Simple week logic
    // Add Overdue logic here if date parsing is implemented
    return !task.completed;
  }).sort((a, b) => b.completed - a.completed || new Date(a.dueDate) - new Date(b.dueDate)); // sort by completion then due date

  const pendingTasks = tasks.filter(task => !task.completed);


  return (
    <div className="bg-card p-6 rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-semibold text-primary-700 mb-1 flex items-center">
        <ListChecks size={28} className="mr-2 text-primary-500" /> My Tasks
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {pendingTasks.length > 0 ? `You have ${pendingTasks.length} pending task(s).` : "No pending tasks. Great job!"}
      </p>

      {/* Filter Buttons - Non-functional for now, just UI */}
      <div className="mb-4 flex space-x-2 items-center">
        <Filter size={18} className="text-muted-foreground" />
        {["All", "Today", "This Week"].map(f => (
            <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors
                    ${filter === f
                        ? 'bg-primary-500 text-primary-foreground border-primary-500'
                        : 'bg-transparent text-muted-foreground hover:bg-primary-50 hover:text-primary-600 border-border'}`}
            >
                {f}
            </button>
        ))}
        {/* <button className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:bg-gray-50">Today</button>
        <button className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:bg-gray-50">This Week</button>
        <button className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:bg-gray-50">Overdue</button> */}
      </div>

      {filteredTasks.length === 0 && filter !== "All" ? (
         <p className="text-muted-foreground text-center py-4">No tasks match the current filter.</p>
      ) : filteredTasks.length === 0 && pendingTasks.length === 0 && filter === "All" ? (
        <div className="text-center py-6">
          <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3" />
          <p className="text-lg font-semibold text-foreground">All tasks completed!</p>
          <p className="text-muted-foreground">Enjoy your well-maintained garden.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className={`flex items-start justify-between p-3 rounded-md border transition-all duration-300 ease-in-out
                         ${task.completed ? 'bg-green-50 border-green-200 opacity-60' : 'bg-background border-border hover:shadow-sm'}`}
            >
              <div className="flex items-start space-x-3">
                <button onClick={() => toggleTaskCompletion(task.id)} className="mt-1 focus:outline-none">
                  {task.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-muted-foreground hover:text-primary-500" />}
                </button>
                <div>
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityClass(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <CalendarClock size={12} className="mr-1" /> {task.dueDate}
                    </span>
                    {task.plot && <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">{task.plot}</span>}
                  </div>
                </div>
              </div>
              {task.priority === "High" && !task.completed && (
                <AlertOctagon size={18} className="text-red-500 flex-shrink-0 ml-2" title="High Priority" />
              )}
            </li>
          ))}
        </ul>
      )}
      {/* UX Comment: How can we make task completion feel rewarding?
          - Visual feedback: Change icon to a filled checkmark (implemented).
          - Style change: Line-through text, slightly faded background for completed tasks (implemented).
          - Animation: A subtle animation when checking off (e.g., checkmark draws itself, item shrinks/fades).
          - Sound effect: A small, satisfying "ding" (use with caution, can be annoying).
          - Confetti/Celebration: For completing all tasks or a major task (probably overkill for individual small tasks).
          - Progress update: Update a progress bar or "X tasks completed today" counter.
      */}
    </div>
  );
};

export default MyTasks;
