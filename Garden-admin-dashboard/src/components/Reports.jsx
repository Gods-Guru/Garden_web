"use client"

import { useState } from "react"
import { Download, RefreshCw, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import GardenPerformance from "./GardenPerformance"
import PlotUtilization from "./PlotUtilization"
import TaskAnalytics from "./TaskAnalytics"
import WaterUsageReport from "./WaterUsageReport"
import MemberActivity from "./MemberActivity"
import HarvestTracking from "./HarvestTracking"
import FinancialReport from "./FinancialReport"
import EnvironmentalTrends from "./EnvironmentalTrends"

const Reports = () => {
  const [activeReport, setActiveReport] = useState("performance")
  const [dateRange, setDateRange] = useState("30")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const reportTabs = [
    { id: "performance", label: "Garden Performance", icon: TrendingUp },
    { id: "plots", label: "Plot Utilization", icon: TrendingDown },
    { id: "tasks", label: "Task Analytics", icon: AlertTriangle },
    { id: "water", label: "Water Usage", icon: TrendingUp },
    { id: "members", label: "Member Activity", icon: TrendingUp },
    { id: "harvest", label: "Harvest Tracking", icon: TrendingUp },
    { id: "financial", label: "Financial Report", icon: TrendingUp },
    { id: "environmental", label: "Environmental", icon: TrendingUp },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const handleExport = () => {
    alert("Exporting report...")
  }

  const renderActiveReport = () => {
    switch (activeReport) {
      case "performance":
        return <GardenPerformance dateRange={dateRange} />
      case "plots":
        return <PlotUtilization dateRange={dateRange} />
      case "tasks":
        return <TaskAnalytics dateRange={dateRange} />
      case "water":
        return <WaterUsageReport dateRange={dateRange} />
      case "members":
        return <MemberActivity dateRange={dateRange} />
      case "harvest":
        return <HarvestTracking dateRange={dateRange} />
      case "financial":
        return <FinancialReport dateRange={dateRange} />
      case "environmental":
        return <EnvironmentalTrends dateRange={dateRange} />
      default:
        return <GardenPerformance dateRange={dateRange} />
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into garden operations</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200 overflow-x-auto">
          {reportTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                  activeReport === tab.id ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">{renderActiveReport()}</div>
    </div>
  )
}

export default Reports
