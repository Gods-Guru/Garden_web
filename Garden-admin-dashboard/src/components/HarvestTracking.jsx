import { Leaf, TrendingUp, Scale, DollarSign } from "lucide-react"

const HarvestTracking = ({ dateRange }) => {
  const harvestMetrics = [
    {
      label: "Total Harvest",
      value: "1,247kg",
      change: "+18%",
      icon: Scale,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Plots Harvesting",
      value: "89",
      change: "+12",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Avg per Plot",
      value: "14.2kg",
      change: "+8%",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Market Value",
      value: "$3,741",
      change: "+22%",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const harvestByCrop = [
    { crop: "Tomatoes", quantity: 342, percentage: 27, value: "$1,026", plots: 45, avgYield: 7.6 },
    { crop: "Lettuce", quantity: 189, percentage: 15, value: "$567", plots: 32, avgYield: 5.9 },
    { crop: "Peppers", quantity: 156, percentage: 13, value: "$468", plots: 28, avgYield: 5.6 },
    { crop: "Herbs", quantity: 134, percentage: 11, value: "$402", plots: 38, avgYield: 3.5 },
    { crop: "Carrots", quantity: 123, percentage: 10, value: "$369", plots: 25, avgYield: 4.9 },
    { crop: "Beans", quantity: 98, percentage: 8, value: "$294", plots: 22, avgYield: 4.5 },
    { crop: "Other", quantity: 205, percentage: 16, value: "$615", plots: 35, avgYield: 5.9 },
  ]

  const monthlyHarvest = [
    { month: "Jan", quantity: 145, value: 435, plots: 32 },
    { month: "Feb", quantity: 167, value: 501, plots: 38 },
    { month: "Mar", quantity: 234, value: 702, plots: 52 },
    { month: "Apr", quantity: 298, value: 894, plots: 67 },
    { month: "May", quantity: 356, value: 1068, plots: 78 },
    { month: "Jun", quantity: 289, value: 867, plots: 71 },
  ]

  const topProducers = [
    { plot: "A-12", owner: "Sarah Johnson", harvest: 45.2, crops: "Tomatoes, Basil", value: "$135.60" },
    { plot: "B-08", owner: "Mike Chen", harvest: 38.7, crops: "Peppers, Herbs", value: "$116.10" },
    { plot: "C-15", owner: "Emma Davis", harvest: 35.4, crops: "Lettuce, Spinach", value: "$106.20" },
    { plot: "A-05", owner: "David Wilson", harvest: 32.8, crops: "Carrots, Radish", value: "$98.40" },
    { plot: "B-22", owner: "Lisa Brown", harvest: 29.6, crops: "Beans, Peas", value: "$88.80" },
  ]

  const harvestQuality = [
    { grade: "Premium", percentage: 45, quantity: 561, value: "$1,683" },
    { grade: "Standard", percentage: 38, quantity: 474, value: "$1,422" },
    { grade: "Below Standard", percentage: 17, quantity: 212, value: "$636" },
  ]

  const seasonalTrends = [
    { season: "Spring", crops: ["Lettuce", "Spinach", "Radish"], peak: "March-May", yield: "High" },
    { season: "Summer", crops: ["Tomatoes", "Peppers", "Herbs"], peak: "June-August", yield: "Very High" },
    { season: "Fall", crops: ["Carrots", "Beans", "Squash"], peak: "September-November", yield: "Medium" },
    { season: "Winter", crops: ["Kale", "Brussels Sprouts"], peak: "December-February", yield: "Low" },
  ]

  const wasteAnalysis = [
    { reason: "Overripening", quantity: 23, percentage: 8, prevention: "More frequent harvesting" },
    { reason: "Pest Damage", quantity: 18, percentage: 6, prevention: "Better pest control" },
    { reason: "Weather Damage", quantity: 15, percentage: 5, prevention: "Protective covers" },
    { reason: "Disease", quantity: 12, percentage: 4, prevention: "Disease management" },
  ]

  return (
    <div className="space-y-6">
      {/* Harvest Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {harvestMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">{metric.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm">{metric.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Harvest by Crop */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Harvest by Crop Type</h3>
          <div className="space-y-4">
            {harvestByCrop.map((crop, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{crop.crop}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{crop.quantity}kg</span>
                    <span className="text-sm font-semibold text-gray-900">{crop.value}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${crop.percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{crop.plots} plots</span>
                  <span>Avg: {crop.avgYield}kg/plot</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Harvest Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Harvest Trends</h3>
          <div className="space-y-4">
            {monthlyHarvest.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{month.quantity}kg</span>
                    <span>${month.value}</span>
                    <span>{month.plots} plots</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(month.quantity / 400) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 w-16 text-right">{month.plots} plots</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Producers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Producing Plots</h3>
          <div className="space-y-4">
            {topProducers.map((producer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{producer.plot}</p>
                    <p className="text-sm text-gray-600">{producer.owner}</p>
                    <p className="text-xs text-gray-500">{producer.crops}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{producer.harvest}kg</p>
                  <p className="text-sm text-green-600">{producer.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Harvest Quality */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Harvest Quality Distribution</h3>
          <div className="space-y-4">
            {harvestQuality.map((quality, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{quality.grade}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{quality.quantity}kg</span>
                    <span className="text-sm font-semibold text-gray-900">{quality.value}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      quality.grade === "Premium"
                        ? "bg-green-500"
                        : quality.grade === "Standard"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${quality.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{quality.percentage}% of total harvest</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonal Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Harvest Patterns</h3>
          <div className="space-y-4">
            {seasonalTrends.map((season, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{season.season}</h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      season.yield === "Very High"
                        ? "bg-green-100 text-green-700"
                        : season.yield === "High"
                          ? "bg-blue-100 text-blue-700"
                          : season.yield === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {season.yield} Yield
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Peak: {season.peak}</p>
                <p className="text-sm text-gray-600">Main crops: {season.crops.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Waste Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Harvest Waste Analysis</h3>
          <div className="space-y-4">
            {wasteAnalysis.map((waste, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{waste.reason}</h4>
                  <span className="text-sm text-gray-600">
                    {waste.quantity}kg ({waste.percentage}%)
                  </span>
                </div>
                <p className="text-sm text-gray-600">Prevention: {waste.prevention}</p>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div className="bg-red-500 h-1 rounded-full" style={{ width: `${waste.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Waste:</span>
              <span className="font-semibold text-red-600">68kg (5.5%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HarvestTracking
