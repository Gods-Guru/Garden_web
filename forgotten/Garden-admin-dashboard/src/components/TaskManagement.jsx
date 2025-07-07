"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Clock, User, CheckCircle, AlertTriangle, Edit, Trash2, Eye } from "lucide-react"
import TaskForm from "./TaskForm"
import TaskDetails from "./TaskDetails"
import ConfirmDialog from "./ConfirmDialog"

const TaskManagement = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editMode, setEditMode] = useState(false)

  // Initialize dummy data
  useEffect(() => {
    const gardeners = [
      "John Smith",
      "Sarah Johnson",
      "Mike Davis",
      "Emily Brown",
      "David Wilson",
      "Lisa Garcia",
      "Tom Anderson",
      "Maria Rodriguez",
      "James Taylor",
      "Jennifer Lee",
    ]

    const taskTypes = [
      "watering",
      "weeding",
      "harvesting",
      "maintenance",
      "planting",
      "fertilizing",
      "pest_control",
      "general",
    ]
    const priorities = ["low", "medium", "high", "urgent"]
    const statuses = ["pending", "in_progress", "completed", "cancelled", "overdue"]

    const taskTitles = {
      watering: ["Water tomato plots", "Check irrigation system", "Water herb garden", "Deep water fruit trees"],
      weeding: [
        "Remove weeds from Section A",
        "Weed around pathways",
        "Clear invasive plants",
        "Maintain plot borders",
      ],
      harvesting: [
        "Harvest ripe tomatoes",
        "Collect herbs for drying",
        "Pick seasonal vegetables",
        "Gather seeds for storage",
      ],
      maintenance: ["Repair garden fence", "Fix broken tools", "Clean storage shed", "Maintain compost bins"],
      planting: ["Plant spring vegetables", "Sow herb seeds", "Transplant seedlings", "Plant cover crops"],
      fertilizing: [
        "Apply compost to plots",
        "Fertilize fruit trees",
        "Add nutrients to soil",
        "Organic feeding schedule",
      ],
      pest_control: ["Check for aphids", "Set up pest traps", "Apply organic pesticide", "Monitor plant health"],
      general: ["Organize tool shed", "Update plot assignments", "Community meeting prep", "Garden tour preparation"],
    }

    const dummyTasks = Array.from({ length: 32 }, (_, i) => {
      const type = taskTypes[Math.floor(Math.random() * taskTypes.length)]
      const priority = priorities[Math.floor(Math.random() * priorities.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const assignedTo = Math.random() > 0.2 ? [gardeners[Math.floor(Math.random() * gardeners.length)]] : []
      const createdBy = gardeners[Math.floor(Math.random() * gardeners.length)]

      // Generate realistic due dates
      const now = new Date()
      const dueDate = new Date(now.getTime() + (Math.random() * 14 - 7) * 24 * 60 * 60 * 1000) // ±7 days

      // Determine if task is overdue
      const isOverdue = dueDate < now && status !== "completed" && status !== "cancelled"
      const finalStatus = isOverdue ? "overdue" : status

      return {
        id: i + 1,
        title: taskTitles[type][Math.floor(Math.random() * taskTitles[type].length)],
        description: `Detailed description for ${taskTitles[type][Math.floor(Math.random() * taskTitles[type].length)].toLowerCase()}. This task requires attention and proper execution.`,
        type: type,
        priority: priority,
        status: finalStatus,
        assignedTo: assignedTo,
        createdBy: createdBy,
        plotId: Math.random() > 0.3 ? `P${String(Math.floor(Math.random() * 24) + 1).padStart(3, "0")}` : null,
        dueDate: dueDate.toISOString().split("T")[0],
        estimatedDuration: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
        completedAt:
          finalStatus === "completed"
            ? new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        completedBy: finalStatus === "completed" ? assignedTo[0] || createdBy : null,
        notes: Math.random() > 0.7 ? "Additional notes and observations about this task." : "",
        images: [],
        createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })

    setTasks(dummyTasks)
    setFilteredTasks(dummyTasks)
  }, [])

  // Filter tasks
  useEffect(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignedTo.some((assignee) => assignee.toLowerCase().includes(searchTerm.toLowerCase())) ||
          task.plotId?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter((task) =>
        assigneeFilter === "unassigned" ? task.assignedTo.length === 0 : task.assignedTo.includes(assigneeFilter),
      )
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter, assigneeFilter])

  const handleCreateTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Math.max(...tasks.map((t) => t.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
    setShowForm(false)
  }

  const handleUpdateTask = (taskData) => {
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id ? { ...taskData, id: selectedTask.id, updatedAt: new Date().toISOString() } : task,
    )
    setTasks(updatedTasks)
    setShowForm(false)
    setEditMode(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = () => {
    setTasks(tasks.filter((task) => task.id !== selectedTask.id))
    setShowDeleteConfirm(false)
    setSelectedTask(null)
  }

  const handleCompleteTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: "completed",
            completedAt: new Date().toISOString(),
            completedBy: task.assignedTo[0] || "System",
            updatedAt: new Date().toISOString(),
          }
        : task,
    )
    setTasks(updatedTasks)
  }

  const openEditForm = (task) => {
    setSelectedTask(task)
    setEditMode(true)
    setShowForm(true)
  }

  const openDetails = (task) => {
    setSelectedTask(task)
    setShowDetails(true)
  }

  const openDeleteConfirm = (task) => {
    setSelectedTask(task)
    setShowDeleteConfirm(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUniqueAssignees = () => {
    const assignees = new Set()
    tasks.forEach((task) => {
      task.assignedTo.forEach((assignee) => assignees.add(assignee))
    })
    return Array.from(assignees).sort()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Assign, track, and manage garden tasks efficiently</p>
        </div>
        <button
          onClick={() => {
            setSelectedTask(null)
            setEditMode(false)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tasks, assignees, or plots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {getUniqueAssignees().map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-600">{tasks.filter((t) => t.status === "pending").length}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "in_progress").length}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{tasks.filter((t) => t.status === "overdue").length}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Task</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Priority</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Assigned To</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Due Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Plot</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-sm text-gray-900">{task.type.replace("_", " ")}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(task.status)}`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {task.assignedTo.length > 0 ? task.assignedTo.join(", ") : "Unassigned"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</div>
                    <div
                      className={`text-xs ${new Date(task.dueDate) < new Date() && task.status !== "completed" ? "text-red-600" : "text-gray-500"}`}
                    >
                      {new Date(task.dueDate) < new Date() && task.status !== "completed" ? "Overdue" : ""}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{task.plotId || "General"}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {task.status !== "completed" && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                          title="Mark Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openDetails(task)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditForm(task)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Edit Task"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(task)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <TaskForm
          task={editMode ? selectedTask : null}
          onSubmit={editMode ? handleUpdateTask : handleCreateTask}
          onClose={() => {
            setShowForm(false)
            setEditMode(false)
            setSelectedTask(null)
          }}
        />
      )}

      {showDetails && selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => {
            setShowDetails(false)
            setSelectedTask(null)
          }}
          onEdit={() => {
            setShowDetails(false)
            openEditForm(selectedTask)
          }}
          onComplete={() => handleCompleteTask(selectedTask.id)}
        />
      )}

      {showDeleteConfirm && selectedTask && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${selectedTask.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteTask}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setSelectedTask(null)
          }}
        />
      )}
    </div>
  )
}

export default TaskManagement
