import { Droplets, TrendingUp, TrendingDown, Leaf } from "lucide-react"

const WaterUsageReport = ({ dateRange }) => {
  const waterMetrics = [
    {
      label: "Total Usage",
      value: "2,847L",
      change: "-12%",
      trend: "down",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Daily Average",
      value: "94.9L",
      change: "-8%",
      trend: "down",
      icon: TrendingDown,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Cost Savings",
      value: "$127",
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Efficiency Score",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  const usageBySection = [
    { section: "Section A", usage: 785, plots: 30, avgPerPlot: 26.2, efficiency: 92, trend: "stable" },
    { section: "Section B", usage: 892, plots: 35, avgPerPlot: 25.5, efficiency: 89, trend: "improving" },
    { section: "Section C", usage: 634, plots: 25, avgPerPlot: 25.4, efficiency: 94, trend: "improving" },
    { section: "Section D", usage: 536, plots: 30, avgPerPlot: 17.9, efficiency: 85, trend: "declining" },
  ]

  const usageByMethod = [
    { method: "Drip Irrigation", usage: 1245, percentage: 44, efficiency: 95, cost: "$45" },
    { method: "Sprinkler System", usage: 892, percentage: 31, efficiency: 78, cost: "$38" },
    { method: "Hand Watering", usage: 456, percentage: 16, efficiency: 65, cost: "$28" },
    { method: "Soaker Hoses", usage: 254, percentage: 9, efficiency: 88, cost: "$15" },
  ]

  const dailyUsage = [
    { day: "Mon", usage: 420, weather: "Sunny", temp: "75°F" },
    { day: "Tue", usage: 385, weather: "Cloudy", temp: "72°F" },
    { day: "Wed", usage: 445, weather: "Sunny", temp: "78°F" },
    { day: "Thu", usage: 320, weather: "Rainy", temp: "68°F" },
    { day: "Fri", usage: 410, weather: "Partly Cloudy", temp: "74°F" },
    { day: "Sat", usage: 480, weather: "Sunny", temp: "80°F" },
    { day: "Sun", usage: 387, weather: "Cloudy", temp: "71°F" },
  ]

  const conservationTips = [
    { tip: "Install drip irrigation systems", impact: "30-50% water savings", status: "Recommended" },
    { tip: "Use mulch around plants", impact: "25% reduction in evaporation", status: "In Progress" },
    { tip: "Water during early morning hours", impact: "15% efficiency improvement", status: "Implemented" },
    { tip: "Collect rainwater for irrigation", impact: "20% cost reduction", status: "Planned" },
  ]

  const topWaterUsers = [
    { plot: "B-15", owner: "John Smith", usage: 145, efficiency: 72, issue: "Possible leak" },
    { plot: "A-08", owner: "Mary Johnson", usage: 132, efficiency: 68, issue: "Overwatering" },
    { plot: "C-22", owner: "David Brown", usage: 128, efficiency: 75, issue: "Inefficient system" },
    { plot: "B-03", owner: "Lisa Wilson", usage: 118, efficiency: 78, issue: "Large plot size" },
  ]

  return (
    <div className="space-y-6">
      {/* Water Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {waterMetrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    metric.trend === "up" ? "text-green-600" : "text-green-600"
                  }`}
                >
                  <TrendIcon className="w-4 h-4" />
                  <span>{metric.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage by Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Usage by Section</h3>
          <div className="space-y-4">
            {usageBySection.map((section, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{section.section}</h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        section.trend === "improving"
                          ? "bg-green-100 text-green-700"
                          : section.trend === "stable"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {section.trend}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{section.efficiency}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Usage</p>
                    <p className="font-semibold">{section.usage}L</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Plots</p>
                    <p className="font-semibold">{section.plots}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg/Plot</p>
                    <p className="font-semibold">{section.avgPerPlot}L</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage by Method */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Usage by Method</h3>
          <div className="space-y-4">
            {usageByMethod.map((method, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{method.method}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{method.efficiency}% efficient</span>
                    <span className="text-sm font-semibold text-gray-900">{method.cost}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${method.percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {method.usage}L ({method.percentage}%)
                  </span>
                  <span>Efficiency: {method.efficiency}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Usage Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Usage Trends</h3>
          <div className="space-y-3">
            {dailyUsage.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 w-12">{day.day}</span>
                  <div>
                    <p className="text-sm text-gray-600">{day.weather}</p>
                    <p className="text-xs text-gray-500">{day.temp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(day.usage / 500) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 w-12">{day.usage}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conservation Opportunities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conservation Opportunities</h3>
          <div className="space-y-4">
            {conservationTips.map((tip, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{tip.tip}</h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      tip.status === "Implemented"
                        ? "bg-green-100 text-green-700"
                        : tip.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : tip.status === "Planned"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tip.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tip.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Usage Alert */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">High Water Usage Alert</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Plot</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Usage (L)</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Efficiency</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Potential Issue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {topWaterUsers.map((user, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{user.plot}</td>
                  <td className="py-3 px-4 text-gray-600">{user.owner}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">{user.usage}L</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.efficiency}%</td>
                  <td className="py-3 px-4 text-gray-600">{user.issue}</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Investigate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default WaterUsageReport
