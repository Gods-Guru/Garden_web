"use client"

import React from "react"

import { useState } from "react"
import { Droplets, Leaf, Scissors, Bug, AlertTriangle, Lightbulb, Users, Sun } from "lucide-react"

const CareGuide = ({ plants }) => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCareType, setSelectedCareType] = useState("watering")

  const categories = ["all", "vegetables", "herbs", "flowers", "fruits"]
  const careTypes = [
    { id: "watering", label: "Watering", icon: Droplets },
    { id: "fertilizing", label: "Fertilizing", icon: Leaf },
    { id: "pruning", label: "Pruning", icon: Scissors },
    { id: "pests", label: "Pest Control", icon: Bug },
    { id: "diseases", label: "Disease Prevention", icon: AlertTriangle },
    { id: "companions", label: "Companion Planting", icon: Users },
  ]

  const filteredPlants =
    selectedCategory === "all" ? plants : plants.filter((plant) => plant.category === selectedCategory)

  const getCareContent = (plant, careType) => {
    switch (careType) {
      case "watering":
        return {
          content: plant.careInstructions.watering,
          tips: [
            `Water needs: ${plant.waterNeeds}`,
            `Soil should be ${plant.waterNeeds === "high" ? "consistently moist" : plant.waterNeeds === "moderate" ? "moderately moist" : "allowed to dry between waterings"}`,
          ],
        }
      case "fertilizing":
        return {
          content: plant.careInstructions.fertilizing,
          tips: [`pH range: ${plant.phRange.min} - ${plant.phRange.max}`, "Soil type: " + plant.soilType.join(", ")],
        }
      case "pruning":
        return {
          content: plant.careInstructions.pruning,
          tips: [`Mature height: ${plant.height}`, `Spacing: ${plant.spacing}`],
        }
      case "pests":
        return {
          content: `Common pests include: ${plant.careInstructions.pests.join(", ")}. Regular inspection and early intervention are key to pest management.`,
          tips: plant.careInstructions.pests.map((pest) => `Watch for ${pest}`),
        }
      case "diseases":
        return {
          content: `Common diseases include: ${plant.careInstructions.diseases.join(", ")}. Prevention through proper spacing, watering, and sanitation is essential.`,
          tips: plant.careInstructions.diseases.map((disease) => `Prevent ${disease}`),
        }
      case "companions":
        return {
          content: `Good companion plants: ${plant.companionPlants.join(", ")}. ${plant.avoidPlants.length > 0 ? `Avoid planting with: ${plant.avoidPlants.join(", ")}.` : ""}`,
          tips: [`Benefits from companion planting`, "Consider plant spacing and growth habits"],
        }
      default:
        return { content: "", tips: [] }
    }
  }

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

  const getGeneralTips = (careType) => {
    const tips = {
      watering: [
        "Water early morning or late evening to reduce evaporation",
        "Check soil moisture by inserting finger 1-2 inches deep",
        "Water deeply but less frequently to encourage deep root growth",
        "Use mulch to retain soil moisture and reduce watering needs",
      ],
      fertilizing: [
        "Test soil pH before planting to ensure optimal nutrient uptake",
        "Organic compost provides slow-release nutrients and improves soil structure",
        "Follow package directions - over-fertilizing can harm plants",
        "Different growth stages require different nutrient ratios",
      ],
      pruning: [
        "Use clean, sharp tools to prevent disease transmission",
        "Prune during the plant's dormant season when possible",
        "Remove dead, diseased, or damaged parts first",
        "Make cuts at a 45-degree angle just above a node or bud",
      ],
      pests: [
        "Inspect plants regularly for early pest detection",
        "Encourage beneficial insects with diverse plantings",
        "Use integrated pest management (IPM) approaches",
        "Remove affected plant parts immediately to prevent spread",
      ],
      diseases: [
        "Provide adequate air circulation between plants",
        "Avoid overhead watering to reduce fungal diseases",
        "Rotate crops annually to break disease cycles",
        "Remove and dispose of infected plant material properly",
      ],
      companions: [
        "Consider plant heights and growth habits when planning",
        "Some plants repel pests that affect their companions",
        "Nitrogen-fixing plants can benefit nearby heavy feeders",
        "Avoid overcrowding - give each plant adequate space",
      ],
    }
    return tips[careType] || []
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plant Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Care Topic</label>
            <div className="grid grid-cols-3 gap-2">
              {careTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCareType(type.id)}
                    className={`p-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center space-y-1 ${
                      selectedCareType === type.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* General Tips */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          General {careTypes.find((t) => t.id === selectedCareType)?.label} Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getGeneralTips(selectedCareType).map((tip, index) => (
            <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plant-Specific Care Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlants.map((plant) => {
          const careInfo = getCareContent(plant, selectedCareType)
          return (
            <div key={plant.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
                  <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getDifficultyColor(plant.difficulty)}`}
                >
                  {plant.difficulty}
                </span>
              </div>

              <div className="mb-4">
                <img
                  src={plant.image || "/placeholder.svg"}
                  alt={plant.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    {React.createElement(careTypes.find((t) => t.id === selectedCareType)?.icon, {
                      className: "w-4 h-4 mr-1 text-green-600",
                    })}
                    {careTypes.find((t) => t.id === selectedCareType)?.label} Guide
                  </h4>
                  <p className="text-sm text-gray-700">{careInfo.content}</p>
                </div>

                {careInfo.tips.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Quick Tips</h5>
                    <ul className="space-y-1">
                      {careInfo.tips.map((tip, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="text-green-600 mr-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Additional plant-specific info */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Sun className="w-3 h-3 text-yellow-500" />
                      <span className="text-gray-600">{plant.sunRequirement.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-600">{plant.waterNeeds}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600">Try selecting a different category.</p>
        </div>
      )}
    </div>
  )
}

export default CareGuide
