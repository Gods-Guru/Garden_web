"use client"

import { useState, useEffect } from "react"
import { X, Save, MapPin, Ruler, User, Droplets, Sun } from "lucide-react"

const PlotForm = ({ plot, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    size: "",
    location: {
      section: "",
      coordinates: "",
      description: "",
    },
    status: "vacant",
    assignedTo: "",
    assignedDate: "",
    soil: {
      type: "Loamy",
      ph: "7.0",
      lastTested: "",
    },
    currentPlants: [],
    notes: "",
    waterAccess: true,
    sunlightHours: 8,
  })

  const [errors, setErrors] = useState({})
  const [newPlant, setNewPlant] = useState("")

  useEffect(() => {
    if (plot) {
      setFormData({
        ...plot,
        assignedDate: plot.assignedDate || "",
        soil: {
          ...plot.soil,
          lastTested: plot.soil.lastTested || "",
        },
      })
    }
  }, [plot])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.size.trim()) {
      newErrors.size = "Size is required"
    }

    if (!formData.location.section.trim()) {
      newErrors.locationSection = "Section is required"
    }

    if (!formData.location.description.trim()) {
      newErrors.locationDescription = "Location description is required"
    }

    if (formData.status === "active" && !formData.assignedTo.trim()) {
      newErrors.assignedTo = "Assigned gardener is required for active plots"
    }

    if (formData.status === "active" && !formData.assignedDate) {
      newErrors.assignedDate = "Assignment date is required for active plots"
    }

    if (!formData.soil.ph || isNaN(formData.soil.ph) || formData.soil.ph < 0 || formData.soil.ph > 14) {
      newErrors.soilPh = "Valid pH value (0-14) is required"
    }

    if (
      !formData.sunlightHours ||
      isNaN(formData.sunlightHours) ||
      formData.sunlightHours < 0 ||
      formData.sunlightHours > 24
    ) {
      newErrors.sunlightHours = "Valid sunlight hours (0-24) is required"
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
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const addPlant = () => {
    if (newPlant.trim() && !formData.currentPlants.includes(newPlant.trim())) {
      setFormData((prev) => ({
        ...prev,
        currentPlants: [...prev.currentPlants, newPlant.trim()],
      }))
      setNewPlant("")
    }
  }

  const removePlant = (plantToRemove) => {
    setFormData((prev) => ({
      ...prev,
      currentPlants: prev.currentPlants.filter((plant) => plant !== plantToRemove),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {plot ? `Edit Plot ${plot.plotNumber}` : "Create New Plot"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Ruler className="w-4 h-4 inline mr-1" />
                Plot Size
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                placeholder="e.g., 10x15"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.size ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="vacant">Vacant</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input
                  type="text"
                  value={formData.location.section}
                  onChange={(e) => handleInputChange("location.section", e.target.value)}
                  placeholder="e.g., Section A"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.locationSection ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.locationSection && <p className="text-red-500 text-sm mt-1">{errors.locationSection}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coordinates</label>
                <input
                  type="text"
                  value={formData.location.coordinates}
                  onChange={(e) => handleInputChange("location.coordinates", e.target.value)}
                  placeholder="e.g., 40.7128, -74.0060"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={formData.location.description}
                onChange={(e) => handleInputChange("location.description", e.target.value)}
                placeholder="e.g., Row 1, Position 3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.locationDescription ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.locationDescription && <p className="text-red-500 text-sm mt-1">{errors.locationDescription}</p>}
            </div>
          </div>

          {/* Assignment Information */}
          {(formData.status === "active" || formData.status === "reserved") && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Assignment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                    placeholder="Gardener name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.assignedTo ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Date</label>
                  <input
                    type="date"
                    value={formData.assignedDate}
                    onChange={(e) => handleInputChange("assignedDate", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.assignedDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.assignedDate && <p className="text-red-500 text-sm mt-1">{errors.assignedDate}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Soil Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Soil Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select
                  value={formData.soil.type}
                  onChange={(e) => handleInputChange("soil.type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silty">Silty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={formData.soil.ph}
                  onChange={(e) => handleInputChange("soil.ph", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.soilPh ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.soilPh && <p className="text-red-500 text-sm mt-1">{errors.soilPh}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Tested</label>
                <input
                  type="date"
                  value={formData.soil.lastTested}
                  onChange={(e) => handleInputChange("soil.lastTested", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Environmental Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Sun className="w-4 h-4 inline mr-1" />
                  Daily Sunlight Hours
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.sunlightHours}
                  onChange={(e) => handleInputChange("sunlightHours", Number.parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.sunlightHours ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.sunlightHours && <p className="text-red-500 text-sm mt-1">{errors.sunlightHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Water Access
                </label>
                <select
                  value={formData.waterAccess}
                  onChange={(e) => handleInputChange("waterAccess", e.target.value === "true")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={true}>Available</option>
                  <option value={false}>Not Available</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Plants */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Current Plants</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlant}
                onChange={(e) => setNewPlant(e.target.value)}
                placeholder="Add a plant..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPlant())}
              />
              <button
                type="button"
                onClick={addPlant}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.currentPlants.map((plant, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {plant}
                  <button
                    type="button"
                    onClick={() => removePlant(plant)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              placeholder="Additional notes about this plot..."
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
              <span>{plot ? "Update Plot" : "Create Plot"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlotForm
