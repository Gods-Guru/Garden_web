"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, TrendingUp, Droplets, BarChart3 } from "lucide-react"
import WaterLogForm from "./WaterLogForm"
import WaterAnalytics from "./WaterAnalytics"
import ConservationInsights from "./ConservationInsights"

const WaterTracking = () => {
  const [waterLogs, setWaterLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [plotFilter, setPlotFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [activeView, setActiveView] = useState("logs") // logs, analytics, insights

  // Initialize dummy data
  useEffect(() => {
    const gardeners = [
      "John Smith",
      "Sarah Johnson",
      "Mike Davis",
      "Emily Brown",
      "David Wilson",
      "Lisa Garcia",
      "Tom Anderson",
      "Maria Rodriguez",
      "James Taylor",
      "Jennifer Lee",
    ]

    const plots = Array.from({ length: 24 }, (_, i) => `P${String(i + 1).padStart(3, "0")}`)
    const methods = ["sprinkler", "drip", "hand", "soaker_hose", "misting"]
    const weatherConditions = [
      { temp: 75, humidity: 65, rainfall: 0 },
      { temp: 82, humidity: 45, rainfall: 0.2 },
      { temp: 68, humidity: 80, rainfall: 1.5 },
      { temp: 79, humidity: 55, rainfall: 0 },
      { temp: 85, humidity: 40, rainfall: 0 },
    ]

    const dummyLogs = Array.from({ length: 150 }, (_, i) => {
      const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Last 90 days
      const method = methods[Math.floor(Math.random() * methods.length)]
      const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

      // Generate realistic water amounts based on method and plot size
      let baseAmount = 0
      switch (method) {
        case "sprinkler":
          baseAmount = 15 + Math.random() * 25 // 15-40 gallons
          break
        case "drip":
          baseAmount = 8 + Math.random() * 12 // 8-20 gallons
          break
        case "hand":
          baseAmount = 3 + Math.random() * 7 // 3-10 gallons
          break
        case "soaker_hose":
          baseAmount = 10 + Math.random() * 15 // 10-25 gallons
          break
        case "misting":
          baseAmount = 2 + Math.random() * 4 // 2-6 gallons
          break
      }

      const duration = method === "hand" ? 15 + Math.random() * 30 : 30 + Math.random() * 90

      return {
        id: i + 1,
        plotId: plots[Math.floor(Math.random() * plots.length)],
        userId: gardeners[Math.floor(Math.random() * gardeners.length)],
        date: date.toISOString().split("T")[0],
        time: `${String(Math.floor(Math.random() * 12) + 6).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        amount: Math.round(baseAmount * 10) / 10,
        method: method,
        duration: Math.round(duration),
        notes: Math.random() > 0.7 ? "Plants looking healthy after watering" : "",
        weather: weather,
        efficiency: Math.round((baseAmount / duration) * 60 * 10) / 10, // gallons per hour
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      }
    })

    // Sort by date (newest first)
    dummyLogs.sort((a, b) => new Date(b.date) - new Date(a.date))

    setWaterLogs(dummyLogs)
    setFilteredLogs(dummyLogs)
  }, [])

  // Filter logs
  useEffect(() => {
    let filtered = waterLogs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.plotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.method.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const startDate = new Date()

      switch (dateFilter) {
        case "today":
          startDate.setHours(0, 0, 0, 0)
          break
        case "week":
          startDate.setDate(now.getDate() - 7)
          break
        case "month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          startDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((log) => new Date(log.date) >= startDate)
    }

    if (plotFilter !== "all") {
      filtered = filtered.filter((log) => log.plotId === plotFilter)
    }

    if (methodFilter !== "all") {
      filtered = filtered.filter((log) => log.method === methodFilter)
    }

    setFilteredLogs(filtered)
  }, [waterLogs, searchTerm, dateFilter, plotFilter, methodFilter])

  const handleCreateLog = (logData) => {
    const newLog = {
      ...logData,
      id: Math.max(...waterLogs.map((l) => l.id)) + 1,
      efficiency: Math.round((logData.amount / logData.duration) * 60 * 10) / 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedLogs = [newLog, ...waterLogs]
    setWaterLogs(updatedLogs)
    setShowForm(false)
  }

  const handleUpdateLog = (logData) => {
    const updatedLogs = waterLogs.map((log) =>
      log.id === selectedLog.id
        ? {
            ...logData,
            id: selectedLog.id,
            efficiency: Math.round((logData.amount / logData.duration) * 60 * 10) / 10,
            updatedAt: new Date().toISOString(),
          }
        : log,
    )
    setWaterLogs(updatedLogs)
    setShowForm(false)
    setEditMode(false)
    setSelectedLog(null)
  }

  const openEditForm = (log) => {
    setSelectedLog(log)
    setEditMode(true)
    setShowForm(true)
  }

  const getMethodColor = (method) => {
    switch (method) {
      case "sprinkler":
        return "bg-blue-100 text-blue-800"
      case "drip":
        return "bg-green-100 text-green-800"
      case "hand":
        return "bg-yellow-100 text-yellow-800"
      case "soaker_hose":
        return "bg-purple-100 text-purple-800"
      case "misting":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUniqueValues = (field) => {
    const values = new Set(waterLogs.map((log) => log[field]))
    return Array.from(values).sort()
  }

  // Calculate summary statistics
  const totalWaterUsed = filteredLogs.reduce((sum, log) => sum + log.amount, 0)
  const averageDaily =
    filteredLogs.length > 0
      ? totalWaterUsed /
        Math.max(
          1,
          Math.ceil(
            (Date.now() - new Date(Math.min(...filteredLogs.map((l) => new Date(l.date))))) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0
  const mostEfficientMethod = waterLogs.reduce((acc, log) => {
    if (!acc[log.method]) acc[log.method] = { total: 0, count: 0 }
    acc[log.method].total += log.efficiency
    acc[log.method].count += 1
    return acc
  }, {})

  const efficiencyRanking = Object.entries(mostEfficientMethod)
    .map(([method, data]) => ({ method, avgEfficiency: data.total / data.count }))
    .sort((a, b) => b.avgEfficiency - a.avgEfficiency)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Water Usage Tracking</h1>
          <p className="text-gray-600">Monitor water consumption and optimize irrigation efficiency</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView("logs")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === "logs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveView("analytics")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === "analytics" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveView("insights")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === "insights" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Insights
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedLog(null)
              setEditMode(false)
              setShowForm(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Water Usage</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Water Used</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(totalWaterUsed)} gal</p>
              <p className="text-xs text-gray-500">
                Last {dateFilter === "all" ? "90" : dateFilter === "month" ? "30" : dateFilter === "week" ? "7" : "1"}{" "}
                days
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-green-600">{Math.round(averageDaily * 10) / 10} gal</p>
              <p className="text-xs text-gray-500">Per day</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Most Efficient</p>
              <p className="text-lg font-bold text-purple-600 capitalize">
                {efficiencyRanking[0]?.method.replace("_", " ") || "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round((efficiencyRanking[0]?.avgEfficiency || 0) * 10) / 10} gal/hr
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Plots</p>
              <p className="text-2xl font-bold text-orange-600">{getUniqueValues("plotId").length}</p>
              <p className="text-xs text-gray-500">Being watered</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === "logs" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search plots, users, methods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>

              <select
                value={plotFilter}
                onChange={(e) => setPlotFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Plots</option>
                {getUniqueValues("plotId").map((plot) => (
                  <option key={plot} value={plot}>
                    {plot}
                  </option>
                ))}
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Methods</option>
                <option value="sprinkler">Sprinkler</option>
                <option value="drip">Drip Irrigation</option>
                <option value="hand">Hand Watering</option>
                <option value="soaker_hose">Soaker Hose</option>
                <option value="misting">Misting</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("")
                  setDateFilter("all")
                  setPlotFilter("all")
                  setMethodFilter("all")
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Water Logs Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Date & Time</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Plot</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Gardener</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Method</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Duration</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Efficiency</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Weather</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.slice(0, 50).map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{new Date(log.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{log.time}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900">{log.plotId}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{log.userId}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getMethodColor(log.method)}`}
                        >
                          {log.method.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">{log.amount} gal</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">{log.duration} min</td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{log.efficiency} gal/hr</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs text-gray-600">
                          <div>{log.weather.temp}°F</div>
                          <div>{log.weather.humidity}% humidity</div>
                          {log.weather.rainfall > 0 && <div>{log.weather.rainfall}" rain</div>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => openEditForm(log)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeView === "analytics" && <WaterAnalytics waterLogs={waterLogs} />}
      {activeView === "insights" && <ConservationInsights waterLogs={waterLogs} />}

      {/* Modals */}
      {showForm && (
        <WaterLogForm
          log={editMode ? selectedLog : null}
          onSubmit={editMode ? handleUpdateLog : handleCreateLog}
          onClose={() => {
            setShowForm(false)
            setEditMode(false)
            setSelectedLog(null)
          }}
        />
      )}
    </div>
  )
}

export default WaterTracking
