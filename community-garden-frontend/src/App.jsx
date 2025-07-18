"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Dashboard from "./components/Dashboard/Dashboard"
import GardenOverview from "./components/Gardens/GardenOverview"
import TaskBoard from "./components/Tasks/TaskBoard"
import Login from "./components/Auth/Login"
import Feedback from "./components/Feedback/Feedback"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { initSentry } from "./lib/monitoring"
import "./styles/globals.scss"

initSentry()

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem("token")
    if (token) {
      // Simulate user data fetch
      setTimeout(() => {
        setUser({
          id: 1,
          name: "John Gardener",
          email: "john@example.com",
          role: "admin",
          profilePicture: null,
        })
        setLoading(false)
      }, 1000)
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("token", "mock-jwt-token")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading GardenHub...</p>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <ErrorBoundary>
      <Router>
        <Layout user={user}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/gardens" element={<GardenOverview user={user} />} />
            <Route path="/tasks" element={<TaskBoard user={user} />} />
            <Route path="/feedback" element={<Feedback user={user} />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
