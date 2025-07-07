"use client"

import { X, Edit, CheckCircle, Calendar, Clock, User, MapPin, AlertTriangle } from "lucide-react"

const TaskDetails = ({ task, onClose, onEdit, onComplete }) => {
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

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
          <div className="flex items-center space-x-2">
            {task.status !== "completed" && (
              <button
                onClick={() => onComplete(task.id)}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Complete</span>
              </button>
            )}
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Task Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <p className="text-gray-600">{task.description}</p>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(task.status)}`}
              >
                {task.status.replace("_", " ")}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full capitalize ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
              <p className="text-lg font-semibold text-gray-900 capitalize">{task.type.replace("_", " ")}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Duration</h3>
              <p className="text-lg font-semibold text-gray-900">{task.estimatedDuration} min</p>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Assignment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned To</p>
                <div className="mt-1">
                  {task.assignedTo.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {task.assignedTo.map((assignee, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {assignee}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-900">Unassigned</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p className="text-gray-900">{task.createdBy}</p>
              </div>
            </div>
          </div>

          {/* Scheduling Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Scheduling Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Due Date</p>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</p>
                  {isOverdue && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Overdue
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Duration</p>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{task.estimatedDuration} minutes</p>
                </div>
              </div>
              {task.completedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed At</p>
                  <p className="text-gray-900">{new Date(task.completedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Plot Information */}
          {task.plotId && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Related Plot
              </h3>
              <p className="text-gray-900 font-medium">{task.plotId}</p>
            </div>
          )}

          {/* Completion Information */}
          {task.status === "completed" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Completion Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-green-700">Completed By</p>
                  <p className="text-green-900">{task.completedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Completed At</p>
                  <p className="text-green-900">{new Date(task.completedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-700">{task.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">Created At</p>
                <p className="text-gray-900">{new Date(task.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Last Updated</p>
                <p className="text-gray-900">{new Date(task.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails
