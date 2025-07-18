"use client"

import { useState, useEffect } from "react"
import StatsCards from "./StatsCards"
import RecentActivity from "./RecentActivity"
import TaskOverview from "./TaskOverview"
import WeatherWidget from "./WeatherWidget"
import "./Dashboard.scss"

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalGardens: 0,
    totalPlots: 0,
    activeTasks: 0,
    totalVolunteers: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalGardens: 12,
        totalPlots: 156,
        activeTasks: 23,
        totalVolunteers: 89,
      })
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 🌱</h1>
        <p>Here's what's happening in your community gardens today.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stats-section">
          <StatsCards stats={stats} loading={loading} userRole={user?.role} />
        </div>

        <div className="weather-section">
          <WeatherWidget />
        </div>

        <div className="tasks-section">
          <TaskOverview userRole={user?.role} />
        </div>

        <div className="activity-section">
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
