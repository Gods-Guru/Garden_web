"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, MapPin, User, Calendar } from "lucide-react"
import PlotForm from "./PlotForm"
import PlotDetails from "./PlotDetails"
import ConfirmDialog from "./ConfirmDialog"

const PlotsManagement = () => {
  const [plots, setPlots] = useState([])
  const [filteredPlots, setFilteredPlots] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState(null)
  const [editMode, setEditMode] = useState(false)

  // Initialize dummy data
  useEffect(() => {
    const dummyPlots = Array.from({ length: 24 }, (_, i) => {
      const statuses = ["active", "vacant", "maintenance", "reserved"]
      const sizes = ["10x10", "10x15", "15x15", "20x10"]
      const soilTypes = ["Loamy", "Clay", "Sandy", "Silty"]
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
      const crops = ["Tomatoes", "Lettuce", "Carrots", "Herbs", "Peppers", "Spinach", "Radishes", "Beans"]

      const status = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        id: i + 1,
        plotNumber: `P${String(i + 1).padStart(3, "0")}`,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        location: {
          section: `Section ${String.fromCharCode(65 + Math.floor(i / 6))}`,
          coordinates: `${(40.7128 + Math.random() * 0.01).toFixed(6)}, ${(-74.006 + Math.random() * 0.01).toFixed(6)}`,
          description: `Row ${Math.floor(i / 6) + 1}, Position ${(i % 6) + 1}`,
        },
        status: status,
        assignedTo: status === "active" ? gardeners[Math.floor(Math.random() * gardeners.length)] : null,
        assignedDate:
          status === "active"
            ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
            : null,
        soil: {
          type: soilTypes[Math.floor(Math.random() * soilTypes.length)],
          ph: (6.0 + Math.random() * 2).toFixed(1),
          lastTested: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
        currentPlants:
          status === "active"
            ? Array.from(
                { length: Math.floor(Math.random() * 3) + 1 },
                () => crops[Math.floor(Math.random() * crops.length)],
              )
            : [],
        notes:
          status === "maintenance" ? "Requires soil amendment" : status === "reserved" ? "Reserved for new member" : "",
        images: [],
        waterAccess: Math.random() > 0.3,
        sunlightHours: Math.floor(Math.random() * 4) + 6,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    })
    setPlots(dummyPlots)
    setFilteredPlots(dummyPlots)
  }, [])

  // Filter plots based on search and status
  useEffect(() => {
    let filtered = plots

    if (searchTerm) {
      filtered = filtered.filter(
        (plot) =>
          plot.plotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plot.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plot.location.section.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((plot) => plot.status === statusFilter)
    }

    setFilteredPlots(filtered)
  }, [plots, searchTerm, statusFilter])

  const handleCreatePlot = (plotData) => {
    const newPlot = {
      ...plotData,
      id: Math.max(...plots.map((p) => p.id)) + 1,
      plotNumber: `P${String(Math.max(...plots.map((p) => p.id)) + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPlots([...plots, newPlot])
    setShowForm(false)
  }

  const handleUpdatePlot = (plotData) => {
    const updatedPlots = plots.map((plot) =>
      plot.id === selectedPlot.id ? { ...plotData, id: selectedPlot.id, updatedAt: new Date().toISOString() } : plot,
    )
    setPlots(updatedPlots)
    setShowForm(false)
    setEditMode(false)
    setSelectedPlot(null)
  }

  const handleDeletePlot = () => {
    setPlots(plots.filter((plot) => plot.id !== selectedPlot.id))
    setShowDeleteConfirm(false)
    setSelectedPlot(null)
  }

  const openEditForm = (plot) => {
    setSelectedPlot(plot)
    setEditMode(true)
    setShowForm(true)
  }

  const openDetails = (plot) => {
    setSelectedPlot(plot)
    setShowDetails(true)
  }

  const openDeleteConfirm = (plot) => {
    setSelectedPlot(plot)
    setShowDeleteConfirm(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "vacant":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "reserved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Garden Plots Management</h1>
          <p className="text-gray-600">Manage and track all garden plots in your community</p>
        </div>
        <button
          onClick={() => {
            setSelectedPlot(null)
            setEditMode(false)
            setShowForm(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search plots by number, gardener, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="vacant">Vacant</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plots</p>
              <p className="text-2xl font-bold text-gray-900">{plots.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Plots</p>
              <p className="text-2xl font-bold text-green-600">{plots.filter((p) => p.status === "active").length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vacant Plots</p>
              <p className="text-2xl font-bold text-gray-600">{plots.filter((p) => p.status === "vacant").length}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {plots.filter((p) => p.status === "maintenance").length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Plots Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Plot</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Location</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Size</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Assigned To</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Current Plants</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlots.map((plot) => (
                <tr key={plot.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{plot.plotNumber}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{plot.location.section}</div>
                    <div className="text-xs text-gray-500">{plot.location.description}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{plot.size} ft</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(plot.status)}`}
                    >
                      {plot.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{plot.assignedTo || "Unassigned"}</td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {plot.currentPlants.length > 0 ? plot.currentPlants.join(", ") : "None"}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openDetails(plot)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditForm(plot)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Edit Plot"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(plot)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete Plot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <PlotForm
          plot={editMode ? selectedPlot : null}
          onSubmit={editMode ? handleUpdatePlot : handleCreatePlot}
          onClose={() => {
            setShowForm(false)
            setEditMode(false)
            setSelectedPlot(null)
          }}
        />
      )}

      {showDetails && selectedPlot && (
        <PlotDetails
          plot={selectedPlot}
          onClose={() => {
            setShowDetails(false)
            setSelectedPlot(null)
          }}
          onEdit={() => {
            setShowDetails(false)
            openEditForm(selectedPlot)
          }}
        />
      )}

      {showDeleteConfirm && selectedPlot && (
        <ConfirmDialog
          title="Delete Plot"
          message={`Are you sure you want to delete plot ${selectedPlot.plotNumber}? This action cannot be undone.`}
          onConfirm={handleDeletePlot}
          onCancel={() => {
            setShowDeleteConfirm(false)
            setSelectedPlot(null)
          }}
        />
      )}
    </div>
  )
}

export default PlotsManagement
