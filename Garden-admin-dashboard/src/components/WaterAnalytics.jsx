"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, TrendingUp, Droplets, BarChart3 } from "lucide-react"

const WaterAnalytics = ({ waterLogs }) => {
  const [timeRange, setTimeRange] = useState("month") // week, month, quarter, year
  const [chartType, setChartType] = useState("daily") // daily, weekly, monthly, method, plot

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    return waterLogs.filter((log) => new Date(log.date) >= startDate)
  }, [waterLogs, timeRange])

  // Generate chart data based on chart type
  const chartData = useMemo(() => {
    switch (chartType) {
      case "daily":
        return generateDailyData(filteredData)
      case "weekly":
        return generateWeeklyData(filteredData)
      case "monthly":
        return generateMonthlyData(filteredData)
      case "method":
        return generateMethodData(filteredData)
      case "plot":
        return generatePlotData(filteredData)
      default:
        return []
    }
  }, [filteredData, chartType])

  function generateDailyData(logs) {
    const dailyData = {}
    logs.forEach((log) => {
      const date = log.date
      if (!dailyData[date]) {
        dailyData[date] = { date, totalWater: 0, sessions: 0, avgEfficiency: 0, totalEfficiency: 0 }
      }
      dailyData[date].totalWater += log.amount
      dailyData[date].sessions += 1
      dailyData[date].totalEfficiency += log.efficiency
    })

    return Object.values(dailyData)
      .map((day) => ({
        ...day,
        avgEfficiency: Math.round((day.totalEfficiency / day.sessions) * 10) / 10,
        date: new Date(day.date).toLocaleDateString(),
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30) // Last 30 days
  }

  function generateWeeklyData(logs) {
    const weeklyData = {}
    logs.forEach((log) => {
      const date = new Date(log.date)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { week: weekKey, totalWater: 0, sessions: 0 }
      }
      weeklyData[weekKey].totalWater += log.amount
      weeklyData[weekKey].sessions += 1
    })

    return Object.values(weeklyData)
      .map((week) => ({
        ...week,
        week: `Week of ${new Date(week.week).toLocaleDateString()}`,
      }))
      .sort((a, b) => new Date(a.week) - new Date(b.week))
  }

  function generateMonthlyData(logs) {
    const monthlyData = {}
    logs.forEach((log) => {
      const date = new Date(log.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, totalWater: 0, sessions: 0 }
      }
      monthlyData[monthKey].totalWater += log.amount
      monthlyData[monthKey].sessions += 1
    })

    return Object.values(monthlyData)
      .map((month) => ({
        ...month,
        month: new Date(month.month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" }),
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  function generateMethodData(logs) {
    const methodData = {}
    logs.forEach((log) => {
      if (!methodData[log.method]) {
        methodData[log.method] = {
          method: log.method,
          totalWater: 0,
          sessions: 0,
          avgEfficiency: 0,
          totalEfficiency: 0,
        }
      }
      methodData[log.method].totalWater += log.amount
      methodData[log.method].sessions += 1
      methodData[log.method].totalEfficiency += log.efficiency
    })

    return Object.values(methodData).map((method) => ({
      ...method,
      method: method.method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      avgEfficiency: Math.round((method.totalEfficiency / method.sessions) * 10) / 10,
    }))
  }

  function generatePlotData(logs) {
    const plotData = {}
    logs.forEach((log) => {
      if (!plotData[log.plotId]) {
        plotData[log.plotId] = { plot: log.plotId, totalWater: 0, sessions: 0 }
      }
      plotData[log.plotId].totalWater += log.amount
      plotData[log.plotId].sessions += 1
    })

    return Object.values(plotData)
      .sort((a, b) => b.totalWater - a.totalWater)
      .slice(0, 10) // Top 10 plots
  }

  const totalWaterUsed = filteredData.reduce((sum, log) => sum + log.amount, 0)
  const averageDaily =
    filteredData.length > 0
      ? totalWaterUsed /
        Math.max(
          1,
          Math.ceil(
            (Date.now() - new Date(Math.min(...filteredData.map((l) => new Date(l.date))))) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0
  const totalSessions = filteredData.length
  const avgEfficiency =
    filteredData.length > 0 ? filteredData.reduce((sum, log) => sum + log.efficiency, 0) / filteredData.length : 0

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Daily Usage</option>
            <option value="weekly">Weekly Usage</option>
            <option value="monthly">Monthly Usage</option>
            <option value="method">By Method</option>
            <option value="plot">By Plot</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Water Used</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(totalWaterUsed)} gal</p>
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
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Watering Sessions</p>
              <p className="text-2xl font-bold text-purple-600">{totalSessions}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              <p className="text-2xl font-bold text-orange-600">{Math.round(avgEfficiency * 10) / 10} gal/hr</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {chartType === "daily" && "Daily Water Usage"}
          {chartType === "weekly" && "Weekly Water Usage"}
          {chartType === "monthly" && "Monthly Water Usage"}
          {chartType === "method" && "Usage by Watering Method"}
          {chartType === "plot" && "Top 10 Plots by Water Usage"}
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {(chartType === "daily" || chartType === "weekly" || chartType === "monthly") && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={chartType === "daily" ? "date" : chartType === "weekly" ? "week" : "month"}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalWater" fill="#3B82F6" name="Water Used (gal)" />
                <Bar dataKey="sessions" fill="#10B981" name="Sessions" />
              </BarChart>
            )}

            {chartType === "method" && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalWater" fill="#3B82F6" name="Total Water (gal)" />
                <Bar dataKey="avgEfficiency" fill="#F59E0B" name="Avg Efficiency (gal/hr)" />
              </BarChart>
            )}

            {chartType === "plot" && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plot" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalWater" fill="#3B82F6" name="Total Water (gal)" />
                <Bar dataKey="sessions" fill="#10B981" name="Sessions" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Method Efficiency Comparison */}
      {chartType === "method" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Water Distribution by Method</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalWater"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Rankings</h3>
            <div className="space-y-3">
              {chartData
                .sort((a, b) => b.avgEfficiency - a.avgEfficiency)
                .map((method, index) => (
                  <div key={method.method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full`}
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium">{method.method}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{method.avgEfficiency} gal/hr</div>
                      <div className="text-sm text-gray-500">{method.sessions} sessions</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WaterAnalytics
