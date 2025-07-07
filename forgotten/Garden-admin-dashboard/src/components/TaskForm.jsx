"use client"

import { useState, useEffect } from "react"
import { X, Save, Calendar, Clock, User, AlertTriangle, MapPin } from "lucide-react"

const TaskForm = ({ task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "general",
    priority: "medium",
    status: "pending",
    assignedTo: [],
    createdBy: "Current User",
    plotId: "",
    dueDate: "",
    estimatedDuration: 60,
    notes: "",
  })

  const [errors, setErrors] = useState({})
  const [newAssignee, setNewAssignee] = useState("")

  const availableGardeners = [
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

  const availablePlots = Array.from({ length: 24 }, (_, i) => `P${String(i + 1).padStart(3, "0")}`)

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: task.dueDate || "",
        assignedTo: task.assignedTo || [],
      })
    } else {
      // Set default due date to tomorrow
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setFormData((prev) => ({
        ...prev,
        dueDate: tomorrow.toISOString().split("T")[0],
      }))
    }
  }, [task])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    if (!formData.estimatedDuration || formData.estimatedDuration < 1) {
      newErrors.estimatedDuration = "Valid estimated duration is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const addAssignee = () => {
    if (newAssignee && !formData.assignedTo.includes(newAssignee)) {
      setFormData((prev) => ({
        ...prev,
        assignedTo: [...prev.assignedTo, newAssignee],
      }))
      setNewAssignee("")
    }
  }

  const removeAssignee = (assigneeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((assignee) => assignee !== assigneeToRemove),
    }))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      case "low":
        return "border-green-500 bg-green-50"
      default:
        return "border-gray-300"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{task ? "Edit Task" : "Create New Task"}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter task title..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                placeholder="Describe the task in detail..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="watering">Watering</option>
                  <option value="weeding">Weeding</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="planting">Planting</option>
                  <option value="fertilizing">Fertilizing</option>
                  <option value="pest_control">Pest Control</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Related Plot (Optional)
                </label>
                <select
                  value={formData.plotId}
                  onChange={(e) => handleInputChange("plotId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">No specific plot</option>
                  {availablePlots.map((plot) => (
                    <option key={plot} value={plot}>
                      {plot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Priority and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Priority & Status</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Priority Level
                </label>
                <div className="space-y-2">
                  {["low", "medium", "high", "urgent"].map((priority) => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={formData.priority === priority}
                        onChange={(e) => handleInputChange("priority", e.target.value)}
                        className="mr-2"
                      />
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          priority === "urgent"
                            ? "bg-red-100 text-red-800"
                            : priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Task Assignment
            </h3>

            <div className="flex gap-2">
              <select
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a gardener...</option>
                {availableGardeners
                  .filter((gardener) => !formData.assignedTo.includes(gardener))
                  .map((gardener) => (
                    <option key={gardener} value={gardener}>
                      {gardener}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addAssignee}
                disabled={!newAssignee}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.assignedTo.map((assignee, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {assignee}
                  <button
                    type="button"
                    onClick={() => removeAssignee(assignee)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Scheduling
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Estimated Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange("estimatedDuration", Number.parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.estimatedDuration ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.estimatedDuration && <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration}</p>}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              placeholder="Any additional notes or special instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{task ? "Update Task" : "Create Task"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
