"use client"

import { X, Calendar, Droplets, Sun, Thermometer, Leaf, Users, AlertTriangle, Lightbulb } from "lucide-react"

const PlantDetails = ({ plant, onClose }) => {
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

  const getSunRequirementText = (sunRequirement) => {
    switch (sunRequirement) {
      case "full_sun":
        return "Full Sun (6+ hours direct sunlight)"
      case "partial_shade":
        return "Partial Shade (3-6 hours direct sunlight)"
      case "full_shade":
        return "Full Shade (Less than 3 hours direct sunlight)"
      default:
        return sunRequirement
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{plant.name}</h2>
            <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={plant.image || "/placeholder.svg"}
                  alt={plant.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getDifficultyColor(plant.difficulty)}`}
                  >
                    {plant.difficulty}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Facts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium capitalize">{plant.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variety:</span>
                    <span className="font-medium">{plant.variety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Height:</span>
                    <span className="font-medium">{plant.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spacing:</span>
                    <span className="font-medium">{plant.spacing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days to Maturity:</span>
                    <span className="font-medium">{plant.daysToMaturity} days</span>
                  </div>
                </div>
              </div>

              {/* Nutritional Info */}
              {plant.nutritionalInfo.vitamins.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">Nutritional Benefits</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-green-700 font-medium">Vitamins:</span>
                      <p className="text-green-800">{plant.nutritionalInfo.vitamins.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Minerals:</span>
                      <p className="text-green-800">{plant.nutritionalInfo.minerals.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Calories:</span>
                      <p className="text-green-800">{plant.nutritionalInfo.calories}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Column - Growing Conditions */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700">{plant.description}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-600" />
                  Growing Conditions
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900">Sun Requirements</p>
                      <p className="text-sm text-gray-600">{getSunRequirementText(plant.sunRequirement)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">Water Needs</p>
                      <p className="text-sm text-gray-600 capitalize">{plant.waterNeeds} watering requirements</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">Temperature Range</p>
                      <p className="text-sm text-gray-600">
                        {plant.temperature.min}°F - {plant.temperature.max}°F
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-1">Soil Type</p>
                    <div className="flex flex-wrap gap-1">
                      {plant.soilType.map((soil) => (
                        <span
                          key={soil}
                          className="px-2 py-1 text-xs bg-brown-100 text-brown-800 rounded-full capitalize"
                        >
                          {soil}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">pH Range</p>
                    <p className="text-sm text-gray-600">
                      {plant.phRange.min} - {plant.phRange.max}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Planting & Harvest Schedule
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Planting Seasons</p>
                    <div className="flex flex-wrap gap-1">
                      {plant.plantingSeasons.map((season) => (
                        <span
                          key={season}
                          className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full capitalize"
                        >
                          {season.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Harvest Time</p>
                    <div className="flex flex-wrap gap-1">
                      {plant.harvestTime.map((season) => (
                        <span
                          key={season}
                          className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full capitalize"
                        >
                          {season.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Care Instructions */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Care Instructions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center mb-2">
                      <Droplets className="w-4 h-4 mr-1 text-blue-500" />
                      Watering
                    </h4>
                    <p className="text-sm text-gray-700">{plant.careInstructions.watering}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center mb-2">
                      <Leaf className="w-4 h-4 mr-1 text-green-500" />
                      Fertilizing
                    </h4>
                    <p className="text-sm text-gray-700">{plant.careInstructions.fertilizing}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pruning</h4>
                    <p className="text-sm text-gray-700">{plant.careInstructions.pruning}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  Common Issues
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Common Pests</h4>
                    <div className="flex flex-wrap gap-1">
                      {plant.careInstructions.pests.map((pest) => (
                        <span key={pest} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          {pest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Common Diseases</h4>
                    <div className="flex flex-wrap gap-1">
                      {plant.careInstructions.diseases.map((disease) => (
                        <span key={disease} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                          {disease}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Companion Planting
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Good Companions</h4>
                    <div className="flex flex-wrap gap-1">
                      {plant.companionPlants.map((companion) => (
                        <span key={companion} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {companion}
                        </span>
                      ))}
                    </div>
                  </div>
                  {plant.avoidPlants.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Avoid Planting With</h4>
                      <div className="flex flex-wrap gap-1">
                        {plant.avoidPlants.map((avoid) => (
                          <span key={avoid} className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            {avoid}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Pro Tips
                </h3>
                <ul className="space-y-2">
                  {plant.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetails
