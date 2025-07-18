"use client"

import { useState, useEffect } from "react"
import TaskColumn from "./TaskColumn"
import TaskModal from "./TaskModal"
import "./TaskBoard.scss"

const TaskBoard = ({ user }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const columns = [
    { id: "todo", title: "To Do", color: "#ffc107", icon: "📋" },
    { id: "inProgress", title: "In Progress", color: "#17a2b8", icon: "⚡" },
    { id: "completed", title: "Completed", color: "#28a745", icon: "✅" },
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTasks = {
        todo: [
          {
            id: 1,
            title: "Water tomato plants",
            description: "Water all tomato plants in section A",
            priority: "high",
            dueDate: "2024-01-15",
            assignedTo: "John Doe",
            garden: "Sunset Garden",
            plot: "A-12",
          },
          {
            id: 2,
            title: "Harvest lettuce",
            description: "Harvest mature lettuce from plots B-5 to B-8",
            priority: "medium",
            dueDate: "2024-01-16",
            assignedTo: "Jane Smith",
            garden: "Riverside Garden",
            plot: "B-5",
          },
        ],
        inProgress: [
          {
            id: 3,
            title: "Prepare soil for spring planting",
            description: "Till and fertilize soil in preparation for spring crops",
            priority: "medium",
            dueDate: "2024-01-20",
            assignedTo: "Mike Johnson",
            garden: "Urban Oasis",
            plot: "C-3",
          },
        ],
        completed: [
          {
            id: 4,
            title: "Install new irrigation system",
            description: "Set up drip irrigation for section D",
            priority: "high",
            dueDate: "2024-01-10",
            assignedTo: "Sarah Wilson",
            garden: "Sunset Garden",
            plot: "D-1",
            completedAt: "2024-01-10",
          },
        ],
      }
      setTasks(mockTasks)
      setLoading(false)
    }, 1000)
  }, [])

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="task-board">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="task-board fade-in">
      <div className="board-header">
        <div>
          <h1>Task Management</h1>
          <p>Organize and track garden maintenance tasks</p>
        </div>
        {(user?.role === "admin" || user?.role === "manager") && (
          <button className="btn btn-primary" onClick={handleCreateTask}>
            <span>➕</span> Create Task
          </button>
        )}
      </div>

      <div className="kanban-board">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasks[column.id]}
            onTaskClick={handleTaskClick}
            userRole={user?.role}
          />
        ))}
      </div>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onSave={(taskData) => {
            // Handle save logic here
            console.log("Saving task:", taskData)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

export default TaskBoard
