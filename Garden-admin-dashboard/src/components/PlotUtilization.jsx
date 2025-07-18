"use client"

import { Users, MapPin, Clock, AlertTriangle } from "lucide-react"

const PlotUtilization = ({ dateRange }) => {
  const utilizationStats = [
    { title: "Total Plots", value: "156", change: "+4", trend: "up" },
    { title: "Occupied Plots", value: "147", change: "+3", trend: "up" },
    { title: "Available Plots", value: "9", change: "-3", trend: "down" },
    { title: "Waitlist Members", value: "23", change: "+5", trend: "up" },
  ]

  const plotsBySize = [
    { size: "Small (4x4)", total: 45, occupied: 43, percentage: 96 },
    { size: "Medium (6x8)", total: 67, occupied: 62, percentage: 93 },
    { size: "Large (8x12)", total: 32, occupied: 30, percentage: 94 },
    { size: "Extra Large (10x16)", total: 12, occupied: 12, percentage: 100 },
  ]

  const plotsBySection = [
    { section: "Section A", plots: 40, occupied: 38, health: 92, issues: 2 },
    { section: "Section B", plots: 39, occupied: 37, health: 88, issues: 4 },
    { section: "Section C", plots: 38, occupied: 36, health: 90, issues: 1 },
    { section: "Section D", plots: 39, occupied: 36, health: 85, issues: 6 },
  ]

  const waitlistData = [
    { name: "Jennifer Martinez", requested: "Small", waitTime: "45 days", priority: "High" },
    { name: "Robert Taylor", requested: "Medium", waitTime: "32 days", priority: "Medium" },
    { name: "Amanda White", requested: "Large", waitTime: "67 days", priority: "High" },
    { name: "David Brown", requested: "Small", waitTime: "12 days", priority: "Low" },
    { name: "Maria Garcia", requested: "Medium", waitTime: "28 days", priority: "Medium" },
  ]

  const seasonalTrends = [
    { month: "Jan", occupancy: 89, newPlots: 2, vacated: 5 },
    { month: "Feb", occupancy: 91, newPlots: 4, vacated: 2 },
    { month: "Mar", occupancy: 93, newPlots: 6, vacated: 3 },
    { month: "Apr", occupancy: 94, newPlots: 3, vacated: 1 },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Plot Utilization Analysis</h2>

      {/* Utilization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {utilizationStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <MapPin className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Plot Distribution by Size */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Plot Distribution by Size</h3>
            <p className="text-sm text-gray-600">Utilization rates across different plot sizes</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {plotsBySize.map((plot, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{plot.size}</span>
                    <span className="text-sm text-gray-600">
                      {plot.occupied}/{plot.total} occupied
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${plot.percentage}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{plot.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Analysis */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Section Analysis</h3>
            <p className="text-sm text-gray-600">Performance by garden section</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {plotsBySection.map((section, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{section.section}</h4>
                    <div className="flex items-center space-x-2">
                      {section.issues > 0 && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      <span className="text-sm text-gray-600">
                        {section.occupied}/{section.plots}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Occupancy</span>
                      <div className="font-medium">{Math.round((section.occupied / section.plots) * 100)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Health Score</span>
                      <div className="font-medium">{section.health}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Issues</span>
                      <div className={`font-medium ${section.issues > 3 ? "text-red-600" : "text-gray-900"}`}>
                        {section.issues}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Management */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Waitlist Management</h3>
          <p className="text-sm text-gray-600">Members waiting for plot assignments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wait Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {waitlistData.map((member, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.requested}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{member.waitTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : member.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {member.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Assign Plot</button>
                    <button className="text-gray-600 hover:text-gray-900">Contact</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seasonal Trends */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Seasonal Utilization Trends</h3>
          <p className="text-sm text-gray-600">Plot occupancy and turnover by month</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {seasonalTrends.map((month, index) => (
              <div key={month.month} className="flex items-center space-x-6">
                <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Occupancy</span>
                      <span className="text-sm font-medium">{month.occupancy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${month.occupancy}%` }}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">New Plots</div>
                    <div className="text-lg font-semibold text-green-600">+{month.newPlots}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Vacated</div>
                    <div className="text-lg font-semibold text-red-600">-{month.vacated}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlotUtilization
