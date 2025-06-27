"use client"

import { Clock, Droplets, Sun, Thermometer, Eye } from "lucide-react"

const PlantCard = ({ plant, onViewDetails }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSunIcon = (sunRequirement) => {
    switch (sunRequirement) {
      case "full_sun":
        return <Sun className="w-4 h-4 text-yellow-500" />
      case "partial_shade":
        return <Sun className="w-4 h-4 text-yellow-400" />
      case "full_shade":
        return <Sun className="w-4 h-4 text-gray-400" />
      default:
        return <Sun className="w-4 h-4 text-yellow-500" />
    }
  }

  const getWaterIcon = (waterNeeds) => {
    const color =
      waterNeeds === "high" ? "text-blue-600" : waterNeeds === "moderate" ? "text-blue-400" : "text-blue-300"
    return <Droplets className={`w-4 h-4 ${color}`} />
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={plant.image || "/placeholder.svg"} alt={plant.name} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getDifficultyColor(plant.difficulty)}`}
          >
            {plant.difficulty}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-white text-gray-800 capitalize">
            {plant.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
          <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
          <p className="text-sm text-gray-600">{plant.variety}</p>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{plant.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            {getSunIcon(plant.sunRequirement)}
            <span className="text-xs text-gray-600 capitalize">{plant.sunRequirement.replace("_", " ")}</span>
          </div>
          <div className="flex items-center space-x-2">
            {getWaterIcon(plant.waterNeeds)}
            <span className="text-xs text-gray-600 capitalize">{plant.waterNeeds}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">{plant.daysToMaturity} days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-600">
              {plant.temperature.min}-{plant.temperature.max}°F
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Planting Seasons:</p>
          <div className="flex flex-wrap gap-1">
            {plant.plantingSeasons.map((season) => (
              <span key={season} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full capitalize">
                {season.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onViewDetails(plant)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  )
}

export default PlantCard
