"use client"

import { X, Edit, MapPin, User, Droplets, Sun, Thermometer } from "lucide-react"

const PlotDetails = ({ plot, onClose, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "vacant":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "reserved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Plot Details - {plot.plotNumber}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
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
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(plot.status)}`}
              >
                {plot.status}
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Size</h3>
              <p className="text-lg font-semibold text-gray-900">{plot.size} ft</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
              <p className="text-lg font-semibold text-gray-900">{new Date(plot.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Section</p>
                <p className="text-gray-900">{plot.location.section}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-900">{plot.location.description}</p>
              </div>
              {plot.location.coordinates && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Coordinates</p>
                  <p className="text-gray-900">{plot.location.coordinates}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Information */}
          {plot.assignedTo && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Assignment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Assigned To</p>
                  <p className="text-gray-900">{plot.assignedTo}</p>
                </div>
                {plot.assignedDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assignment Date</p>
                    <p className="text-gray-900">{new Date(plot.assignedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Soil Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Thermometer className="w-5 h-5 mr-2" />
              Soil Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Soil Type</p>
                <p className="text-gray-900">{plot.soil.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">pH Level</p>
                <p className="text-gray-900">{plot.soil.ph}</p>
              </div>
              {plot.soil.lastTested && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Tested</p>
                  <p className="text-gray-900">{new Date(plot.soil.lastTested).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Sun className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Daily Sunlight</p>
                  <p className="text-gray-900">{plot.sunlightHours} hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Water Access</p>
                  <p className="text-gray-900">{plot.waterAccess ? "Available" : "Not Available"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Plants */}
          {plot.currentPlants.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plants</h3>
              <div className="flex flex-wrap gap-2">
                {plot.currentPlants.map((plant, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {plant}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {plot.notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <p className="text-gray-700">{plot.notes}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-500">Created At</p>
                <p className="text-gray-900">{new Date(plot.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Last Updated</p>
                <p className="text-gray-900">{new Date(plot.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlotDetails
