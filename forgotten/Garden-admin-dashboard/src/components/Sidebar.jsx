"use client"

import { LayoutDashboard, MapPin, CheckSquare, Droplets, Leaf, Users, BarChart3, Calendar } from "lucide-react"

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "plots", label: "Garden Plots", icon: MapPin },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "water", label: "Water Tracking", icon: Droplets },
    { id: "plants", label: "Plant Guide", icon: Leaf },
    { id: "community", label: "Community", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "my-plots", label: "My Plots", icon: Leaf },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">GreenSpace</span>
        </div>
      </div>

      <nav className="px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id
                  ? "bg-green-50 text-green-700 border-r-2 border-green-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
