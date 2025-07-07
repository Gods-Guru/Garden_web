"use client"

import { useState } from "react"
import Dashboard from "./components/Dashboard"
import PlotsManagement from "./components/PlotsManagement"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import TaskManagement from "./components/TaskManagement"
import WaterTracking from "./components/WaterTracking"
import PlantGuide from "./components/PlantGuide"
import Community from "./components/Community"
import Reports from "./components/Reports"

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "plots" && <PlotsManagement />}
            {activeTab === "tasks" && <TaskManagement />}
            {activeTab === "water" && <WaterTracking />}
            {activeTab === "plants" && <PlantGuide />}
            {activeTab === "community" && <Community />}
            {activeTab === "reports" && <Reports />}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
