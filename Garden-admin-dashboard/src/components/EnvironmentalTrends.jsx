import { Thermometer, Cloud, Droplets, Sun, Leaf } from "lucide-react"

const EnvironmentalTrends = ({ dateRange }) => {
  const environmentalMetrics = [
    {
      label: "Avg Temperature",
      value: "74°F",
      change: "+2°F",
      icon: Thermometer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    { label: "Rainfall", value: "3.2in", change: "-0.8in", icon: Cloud, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Humidity", value: "68%", change: "+5%", icon: Droplets, color: "text-blue-600", bgColor: "bg-blue-50" },
    {
      label: "Soil Quality",
      value: "8.2/10",
      change: "+0.3",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  const weatherData = [
    { day: "Mon", temp: 72, humidity: 65, rainfall: 0.2, sunshine: 8.5 },
    { day: "Tue", temp: 75, humidity: 70, rainfall: 0.0, sunshine: 9.2 },
    { day: "Wed", temp: 78, humidity: 72, rainfall: 0.5, sunshine: 7.8 },
    { day: "Thu", temp: 71, humidity: 68, rainfall: 1.2, sunshine: 6.5 },
    { day: "Fri", temp: 74, humidity: 66, rainfall: 0.0, sunshine: 9.0 },
    { day: "Sat", temp: 76, humidity: 69, rainfall: 0.3, sunshine: 8.2 },
    { day: "Sun", temp: 73, humidity: 64, rainfall: 0.0, sunshine: 8.8 },
  ]

  const soilAnalysis = [
    { parameter: "pH Level", value: 6.8, optimal: "6.0-7.0", status: "Good", trend: "stable" },
    { parameter: "Nitrogen", value: 45, optimal: "40-60 ppm", status: "Good", trend: "increasing" },
    { parameter: "Phosphorus", value: 32, optimal: "30-50 ppm", status: "Good", trend: "stable" },
    { parameter: "Potassium", value: 180, optimal: "150-200 ppm", status: "Good", trend: "stable" },
    { parameter: "Organic Matter", value: 4.2, optimal: "3-5%", status: "Excellent", trend: "increasing" },
    { parameter: "Moisture", value: 28, optimal: "25-35%", status: "Good", trend: "stable" },
  ]

  const climateImpacts = [
    {
      factor: "Temperature Rise",
      impact: "Extended growing season",
      severity: "Low",
      adaptation: "Heat-resistant varieties",
    },
    {
      factor: "Irregular Rainfall",
      impact: "Water stress periods",
      severity: "Medium",
      adaptation: "Improved irrigation",
    },
    { factor: "Extreme Weather", impact: "Crop damage risk", severity: "High", adaptation: "Protective structures" },
    {
      factor: "Pest Pressure",
      impact: "Increased infestations",
      severity: "Medium",
      adaptation: "Integrated pest management",
    },
  ]

  const sustainabilityMetrics = [
    { metric: "Water Conservation", value: 87, target: 85, unit: "%" },
    { metric: "Composting Rate", value: 92, target: 90, unit: "%" },
    { metric: "Renewable Energy", value: 45, target: 60, unit: "%" },
    { metric: "Waste Reduction", value: 78, target: 80, unit: "%" },
  ]

  const seasonalForecast = [
    {
      season: "Summer",
      temp: "75-85°F",
      rainfall: "Low",
      challenges: ["Heat stress", "Water demand"],
      opportunities: ["Peak harvest", "Extended daylight"],
    },
    {
      season: "Fall",
      temp: "60-75°F",
      rainfall: "Medium",
      challenges: ["Shorter days", "First frost"],
      opportunities: ["Cool season crops", "Soil preparation"],
    },
    {
      season: "Winter",
      temp: "40-60°F",
      rainfall: "High",
      challenges: ["Limited growth", "Cold damage"],
      opportunities: ["Planning", "Infrastructure"],
    },
    {
      season: "Spring",
      temp: "55-70°F",
      rainfall: "Medium",
      challenges: ["Late frost", "Soil preparation"],
      opportunities: ["New plantings", "Growth season"],
    },
  ]

  const airQualityData = [
    { pollutant: "PM2.5", level: 12, limit: 35, status: "Good", unit: "μg/m³" },
    { pollutant: "PM10", level: 28, limit: 150, status: "Good", unit: "μg/m³" },
    { pollutant: "Ozone", level: 0.065, limit: 0.07, status: "Moderate", unit: "ppm" },
    { pollutant: "NO2", level: 0.025, limit: 0.053, status: "Good", unit: "ppm" },
  ]

  const biodiversityIndex = [
    { category: "Beneficial Insects", count: 23, trend: "increasing", impact: "Positive" },
    { category: "Bird Species", count: 18, trend: "stable", impact: "Positive" },
    { category: "Soil Microbes", count: 156, trend: "increasing", impact: "Positive" },
    { category: "Plant Varieties", count: 45, trend: "increasing", impact: "Positive" },
  ]

  return (
    <div className="space-y-6">
      {/* Environmental Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {environmentalMetrics.map((metric, index) => {
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
        {/* Weather Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Weather Trends</h3>
          <div className="space-y-4">
            {weatherData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 w-12">{day.day}</span>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span>{day.temp}°F</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>{day.humidity}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Cloud className="w-4 h-4 text-gray-500" />
                    <span>{day.rainfall}in</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span>{day.sunshine}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Soil Health Analysis</h3>
          <div className="space-y-4">
            {soilAnalysis.map((soil, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{soil.parameter}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        soil.status === "Excellent"
                          ? "bg-green-100 text-green-700"
                          : soil.status === "Good"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {soil.status}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{soil.value}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      soil.status === "Excellent"
                        ? "bg-green-500"
                        : soil.status === "Good"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }`}
                    style={{ width: "85%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Optimal: {soil.optimal}</span>
                  <span
                    className={`${
                      soil.trend === "increasing"
                        ? "text-green-600"
                        : soil.trend === "decreasing"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {soil.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Climate Impact Assessment */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Climate Impact Assessment</h3>
          <div className="space-y-4">
            {climateImpacts.map((impact, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{impact.factor}</h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      impact.severity === "High"
                        ? "bg-red-100 text-red-700"
                        : impact.severity === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {impact.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{impact.impact}</p>
                <p className="text-sm text-blue-600">Adaptation: {impact.adaptation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sustainability Metrics</h3>
          <div className="space-y-4">
            {sustainabilityMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Target: {metric.target}
                      {metric.unit}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {metric.value}
                      {metric.unit}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${metric.value >= metric.target ? "bg-green-500" : "bg-yellow-500"}`}
                    style={{ width: `${Math.min(metric.value, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Current: {metric.value}
                    {metric.unit}
                  </span>
                  <span className={metric.value >= metric.target ? "text-green-600" : "text-yellow-600"}>
                    {metric.value >= metric.target ? "Target Met" : "Below Target"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonal Forecast */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Forecast & Planning</h3>
          <div className="space-y-4">
            {seasonalForecast.map((season, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{season.season}</h4>
                  <span className="text-sm text-gray-600">{season.temp}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Rainfall: {season.rainfall}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-red-600 font-medium">Challenges:</p>
                    <ul className="text-gray-600 text-xs">
                      {season.challenges.map((challenge, i) => (
                        <li key={i}>• {challenge}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-green-600 font-medium">Opportunities:</p>
                    <ul className="text-gray-600 text-xs">
                      {season.opportunities.map((opportunity, i) => (
                        <li key={i}>• {opportunity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Air Quality & Biodiversity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Air Quality & Biodiversity</h3>

          {/* Air Quality */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Air Quality Index</h4>
            <div className="space-y-3">
              {airQualityData.map((air, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{air.pollutant}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        air.status === "Good" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {air.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {air.level} {air.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Biodiversity */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Biodiversity Index</h4>
            <div className="space-y-3">
              {biodiversityIndex.map((bio, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{bio.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${bio.trend === "increasing" ? "text-green-600" : "text-gray-600"}`}>
                      {bio.trend}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{bio.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnvironmentalTrends
