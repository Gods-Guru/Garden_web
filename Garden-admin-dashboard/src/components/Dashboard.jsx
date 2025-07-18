import { Thermometer, Droplets, Sun, Users, CheckCircle, AlertTriangle, Calendar } from "lucide-react"
import PlotGrid from "./PlotGrid"
import MetricCard from "./MetricCard"
import ProgressCard from "./ProgressCard"

const Dashboard = () => {
  const metrics = [
    {
      title: "Air Temp",
      value: "72°F",
      icon: Thermometer,
      color: "bg-orange-500",
    },
    {
      title: "Soil Moisture",
      value: "65%",
      icon: Droplets,
      color: "bg-blue-500",
    },
    {
      title: "Sunlight",
      value: "8.5hrs",
      icon: Sun,
      color: "bg-yellow-500",
    },
  ]

  const progressData = [
    { label: "Plot Occupancy", value: 85, color: "bg-green-500" },
    { label: "Task Completion", value: 72, color: "bg-blue-500" },
    { label: "Harvest Ready", value: 45, color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Environmental Metrics */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Plot Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Garden Plot Overview</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">Vacant</span>
                </div>
              </div>
            </div>
            <PlotGrid />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Progress Cards */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Garden Stats</h3>
            <div className="space-y-4">
              {progressData.map((item, index) => (
                <ProgressCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4">
            <MetricCard title="Active Gardeners" value="24" icon={Users} color="text-green-600" bgColor="bg-green-50" />
            <MetricCard
              title="Completed Tasks"
              value="18"
              icon={CheckCircle}
              color="text-blue-600"
              bgColor="bg-blue-50"
            />
            <MetricCard
              title="Pending Issues"
              value="3"
              icon={AlertTriangle}
              color="text-orange-600"
              bgColor="bg-orange-50"
            />
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Spring Planting Workshop</p>
                  <p className="text-xs text-gray-500">March 20, 2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Community Harvest Day</p>
                  <p className="text-xs text-gray-500">March 25, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
