"use client"

import { useState, useEffect } from "react"
import TaskColumn from "./TaskColumn"
import TaskModal from "./TaskModal"
import API from "../../api"
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
    setLoading(true)
    API.get("/tasks")
      .then((res) => {
        setTasks(res.data)
      })
      .catch(() => {
        setTasks({ todo: [], inProgress: [], completed: [] })
      })
      .finally(() => setLoading(false))
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
