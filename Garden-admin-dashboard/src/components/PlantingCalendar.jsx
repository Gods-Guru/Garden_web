"use client"

import { useState } from "react"
import { Calendar, Leaf, Sun, Droplets, Clock } from "lucide-react"

const PlantingCalendar = ({ plants }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const seasons = {
    spring: [2, 3, 4], // March, April, May
    early_summer: [4, 5], // May, June
    summer: [5, 6, 7], // June, July, August
    fall: [8, 9, 10], // September, October, November
    winter: [11, 0, 1], // December, January, February
  }

  const getPlantsForMonth = (monthIndex) => {
    const plantsToPlant = plants.filter((plant) => {
      return plant.plantingSeasons.some((season) => {
        return seasons[season] && seasons[season].includes(monthIndex)
      })
    })

    const plantsToHarvest = plants.filter((plant) => {
      return plant.harvestTime.some((season) => {
        if (season === "year_round") return true
        return seasons[season] && seasons[season].includes(monthIndex)
      })
    })

    return { plantsToPlant, plantsToHarvest }
  }

  const getSeasonColor = (season) => {
    switch (season) {
      case "spring":
        return "bg-green-100 text-green-800"
      case "early_summer":
      case "summer":
        return "bg-yellow-100 text-yellow-800"
      case "fall":
        return "bg-orange-100 text-orange-800"
      case "winter":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const currentMonthData = getPlantsForMonth(selectedMonth)

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Select Month
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(index)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedMonth === index ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Current Month Overview */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{months[selectedMonth]} Garden Calendar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🌱 Plants to Start</h3>
            <p className="text-sm opacity-90">{currentMonthData.plantsToPlant.length} varieties ready for planting</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🌾 Ready to Harvest</h3>
            <p className="text-sm opacity-90">{currentMonthData.plantsToHarvest.length} varieties ready for harvest</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plants to Plant */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Plant This Month
          </h3>
          {currentMonthData.plantsToPlant.length > 0 ? (
            <div className="space-y-4">
              {currentMonthData.plantsToPlant.map((plant) => (
                <div key={plant.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{plant.name}</h4>
                      <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        plant.difficulty === "beginner"
                          ? "bg-green-100 text-green-800"
                          : plant.difficulty === "intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {plant.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Sun className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">{plant.sunRequirement.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-gray-600">{plant.waterNeeds}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{plant.daysToMaturity}d</span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Planting Seasons:</p>
                    <div className="flex flex-wrap gap-1">
                      {plant.plantingSeasons.map((season) => (
                        <span
                          key={season}
                          className={`px-2 py-1 text-xs rounded-full capitalize ${getSeasonColor(season)}`}
                        >
                          {season.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700">{plant.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Leaf className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No plants to start this month</p>
            </div>
          )}
        </div>

        {/* Plants to Harvest */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-600" />
            Harvest This Month
          </h3>
          {currentMonthData.plantsToHarvest.length > 0 ? (
            <div className="space-y-4">
              {currentMonthData.plantsToHarvest.map((plant) => (
                <div key={plant.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{plant.name}</h4>
                      <p className="text-sm text-gray-500">{plant.variety}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 capitalize">
                      {plant.category}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">Harvest Seasons:</p>
                    <div className="flex flex-wrap gap-1">
                      {plant.harvestTime.map((season) => (
                        <span
                          key={season}
                          className={`px-2 py-1 text-xs rounded-full capitalize ${getSeasonColor(season)}`}
                        >
                          {season.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {plant.nutritionalInfo.vitamins.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Rich in:</p>
                      <p className="text-xs text-gray-700">{plant.nutritionalInfo.vitamins.slice(0, 3).join(", ")}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-700">{plant.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No harvests expected this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Year-Round Calendar View */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Year-Round Planting Guide</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-900">Plant</th>
                {months.map((month) => (
                  <th key={month} className="text-center py-2 px-2 font-medium text-gray-900 min-w-[80px]">
                    {month.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plants.slice(0, 10).map((plant) => (
                <tr key={plant.id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-gray-900">{plant.name}</td>
                  {months.map((month, monthIndex) => {
                    const canPlant = plant.plantingSeasons.some(
                      (season) => seasons[season] && seasons[season].includes(monthIndex),
                    )
                    const canHarvest = plant.harvestTime.some((season) => {
                      if (season === "year_round") return true
                      return seasons[season] && seasons[season].includes(monthIndex)
                    })

                    return (
                      <td key={month} className="py-3 px-2 text-center">
                        <div className="flex flex-col space-y-1">
                          {canPlant && <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" title="Plant"></div>}
                          {canHarvest && (
                            <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto" title="Harvest"></div>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Planting Time</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Harvest Time</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantingCalendar
