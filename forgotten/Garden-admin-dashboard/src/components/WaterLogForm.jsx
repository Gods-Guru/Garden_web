"use client"

import { useState, useEffect } from "react"
import { X, Save, Droplets, Clock, MapPin, User, Cloud } from "lucide-react"

const WaterLogForm = ({ log, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    plotId: "",
    userId: "Current User",
    date: "",
    time: "",
    amount: "",
    method: "hand",
    duration: "",
    notes: "",
    weather: {
      temperature: "",
      humidity: "",
      rainfall: "",
    },
  })

  const [errors, setErrors] = useState({})

  const availablePlots = Array.from({ length: 24 }, (_, i) => `P${String(i + 1).padStart(3, "0")}`)
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

  useEffect(() => {
    if (log) {
      setFormData({
        ...log,
        date: log.date || "",
        time: log.time || "",
        weather: log.weather || { temperature: "", humidity: "", rainfall: "" },
      })
    } else {
      // Set default values for new log
      const now = new Date()
      setFormData((prev) => ({
        ...prev,
        date: now.toISOString().split("T")[0],
        time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      }))
    }
  }, [log])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.plotId) {
      newErrors.plotId = "Plot selection is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.time) {
      newErrors.time = "Time is required"
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Valid water amount is required"
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Valid duration is required"
    }

    if (formData.weather.temperature && (formData.weather.temperature < -50 || formData.weather.temperature > 150)) {
      newErrors.temperature = "Temperature must be between -50°F and 150°F"
    }

    if (formData.weather.humidity && (formData.weather.humidity < 0 || formData.weather.humidity > 100)) {
      newErrors.humidity = "Humidity must be between 0% and 100%"
    }

    if (formData.weather.rainfall && formData.weather.rainfall < 0) {
      newErrors.rainfall = "Rainfall cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      const submitData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        duration: Number.parseInt(formData.duration),
        weather: {
          temp: formData.weather.temperature ? Number.parseFloat(formData.weather.temperature) : null,
          humidity: formData.weather.humidity ? Number.parseFloat(formData.weather.humidity) : null,
          rainfall: formData.weather.rainfall ? Number.parseFloat(formData.weather.rainfall) : null,
        },
      }
      onSubmit(submitData)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.startsWith("weather.")) {
      const weatherField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        weather: {
          ...prev.weather,
          [weatherField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const getMethodDescription = (method) => {
    switch (method) {
      case "sprinkler":
        return "Overhead sprinkler system - good coverage but higher water usage"
      case "drip":
        return "Drip irrigation - most water efficient, delivers water directly to roots"
      case "hand":
        return "Hand watering with hose or watering can - precise but time consuming"
      case "soaker_hose":
        return "Soaker hose - efficient ground-level watering"
      case "misting":
        return "Misting system - gentle watering for delicate plants"
      default:
        return ""
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-blue-600" />
            {log ? "Edit Water Usage Log" : "Log Water Usage"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Plot
                </label>
                <select
                  value={formData.plotId}
                  onChange={(e) => handleInputChange("plotId", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.plotId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a plot...</option>
                  {availablePlots.map((plot) => (
                    <option key={plot} value={plot}>
                      {plot}
                    </option>
                  ))}
                </select>
                {errors.plotId && <p className="text-red-500 text-sm mt-1">{errors.plotId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Gardener
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) => handleInputChange("userId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableGardeners.map((gardener) => (
                    <option key={gardener} value={gardener}>
                      {gardener}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>
          </div>

          {/* Water Usage Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Water Usage Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Watering Method</label>
              <div className="space-y-3">
                {["sprinkler", "drip", "hand", "soaker_hose", "misting"].map((method) => (
                  <label key={method} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="method"
                      value={method}
                      checked={formData.method === method}
                      onChange={(e) => handleInputChange("method", e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium capitalize">{method.replace("_", " ")}</div>
                      <div className="text-sm text-gray-600">{getMethodDescription(method)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Water Amount (gallons)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="e.g., 15.5"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="e.g., 30"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Cloud className="w-5 h-5 mr-2" />
              Weather Conditions (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
                <input
                  type="number"
                  value={formData.weather.temperature}
                  onChange={(e) => handleInputChange("weather.temperature", e.target.value)}
                  placeholder="e.g., 75"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.temperature ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.weather.humidity}
                  onChange={(e) => handleInputChange("weather.humidity", e.target.value)}
                  placeholder="e.g., 65"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.humidity ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.humidity && <p className="text-red-500 text-sm mt-1">{errors.humidity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (inches)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weather.rainfall}
                  onChange={(e) => handleInputChange("weather.rainfall", e.target.value)}
                  placeholder="e.g., 0.5"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.rainfall ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.rainfall && <p className="text-red-500 text-sm mt-1">{errors.rainfall}</p>}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              placeholder="Any observations about plant health, soil conditions, or watering effectiveness..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Efficiency Preview */}
          {formData.amount && formData.duration && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Efficiency Preview</h4>
              <p className="text-blue-800">
                Water efficiency:{" "}
                {Math.round((Number.parseFloat(formData.amount) / Number.parseInt(formData.duration)) * 60 * 10) / 10}{" "}
                gallons per hour
              </p>
            </div>
          )}

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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{log ? "Update Log" : "Save Log"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WaterLogForm
