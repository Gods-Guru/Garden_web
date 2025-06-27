"use client"

import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"

const GardenPerformance = ({ dateRange }) => {
  const performanceMetrics = [
    {
      title: "Overall Garden Health",
      value: "87%",
      change: "+5%",
      trend: "up",
      description: "Based on plant health, soil quality, and maintenance",
    },
    {
      title: "Plot Occupancy Rate",
      value: "94%",
      change: "+2%",
      trend: "up",
      description: "Percentage of plots currently in use",
    },
    {
      title: "Task Completion Rate",
      value: "78%",
      change: "-3%",
      trend: "down",
      description: "Tasks completed on time this period",
    },
    {
      title: "Member Satisfaction",
      value: "4.6/5",
      change: "+0.2",
      trend: "up",
      description: "Average rating from member surveys",
    },
  ]

  const topPerformingPlots = [
    { id: "A-12", gardener: "Sarah Johnson", health: 95, yield: "High", issues: 0 },
    { id: "B-08", gardener: "Mike Chen", health: 92, yield: "High", issues: 1 },
    { id: "C-15", gardener: "Emma Davis", health: 90, yield: "Medium", issues: 0 },
    { id: "A-03", gardener: "John Smith", health: 88, yield: "High", issues: 2 },
    { id: "D-22", gardener: "Lisa Wilson", health: 87, yield: "Medium", issues: 1 },
  ]

  const recentIssues = [
    {
      id: 1,
      plot: "B-15",
      issue: "Pest infestation detected",
      severity: "High",
      reported: "2 hours ago",
      status: "In Progress",
    },
    {
      id: 2,
      plot: "C-08",
      issue: "Irrigation system malfunction",
      severity: "Medium",
      reported: "1 day ago",
      status: "Resolved",
    },
    {
      id: 3,
      plot: "A-20",
      issue: "Soil pH imbalance",
      severity: "Low",
      reported: "3 days ago",
      status: "Pending",
    },
  ]

  const monthlyTrends = [
    { month: "Jan", health: 82, occupancy: 89, completion: 75 },
    { month: "Feb", health: 84, occupancy: 91, completion: 78 },
    { month: "Mar", health: 86, occupancy: 93, completion: 80 },
    { month: "Apr", health: 87, occupancy: 94, completion: 78 },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Garden Performance Overview</h2>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              {metric.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {metric.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Plots */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Plots</h3>
            <p className="text-sm text-gray-600">Highest health scores this period</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPerformingPlots.map((plot, index) => (
                <div key={plot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Plot {plot.id}</p>
                      <p className="text-sm text-gray-600">{plot.gardener}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{plot.health}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${plot.health}%` }}></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          plot.yield === "High" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {plot.yield} Yield
                      </span>
                      {plot.issues === 0 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="text-xs text-red-600">{plot.issues} issues</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
            <p className="text-sm text-gray-600">Issues reported in the last week</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle
                        className={`w-4 h-4 ${
                          issue.severity === "High"
                            ? "text-red-500"
                            : issue.severity === "Medium"
                              ? "text-yellow-500"
                              : "text-blue-500"
                        }`}
                      />
                      <span className="font-medium text-gray-900">Plot {issue.plot}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        issue.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : issue.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{issue.issue}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Reported {issue.reported}</span>
                    <span
                      className={`px-2 py-1 rounded ${
                        issue.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : issue.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Performance Trends</h3>
          <p className="text-sm text-gray-600">Key metrics over the last 4 months</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {monthlyTrends.map((month, index) => (
              <div key={month.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Health</span>
                    <span className="text-sm font-medium">{month.health}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${month.health}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Occupancy</span>
                    <span className="text-sm font-medium">{month.occupancy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${month.occupancy}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Task Completion</span>
                    <span className="text-sm font-medium">{month.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${month.completion}%` }}></div>
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

export default GardenPerformance
