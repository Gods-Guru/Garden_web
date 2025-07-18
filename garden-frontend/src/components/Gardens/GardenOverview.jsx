"use client"

import { useState, useEffect } from "react"
import GardenCard from "./GardenCard"
import PlotGrid from "./PlotGrid"
import "./GardenOverview.scss"

const GardenOverview = ({ user }) => {
  const [gardens, setGardens] = useState([])
  const [selectedGarden, setSelectedGarden] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockGardens = [
        {
          id: 1,
          name: "Sunset Community Garden",
          description: "A beautiful garden with 50 plots overlooking the sunset.",
          location: "Downtown District",
          totalPlots: 50,
          occupiedPlots: 42,
          image: "/placeholder.svg?height=200&width=300",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        {
          id: 2,
          name: "Riverside Green Space",
          description: "Peaceful garden by the river with organic focus.",
          location: "Riverside Area",
          totalPlots: 35,
          occupiedPlots: 28,
          image: "/placeholder.svg?height=200&width=300",
          coordinates: { lat: 40.7589, lng: -73.9851 },
        },
        {
          id: 3,
          name: "Urban Oasis Garden",
          description: "Modern urban garden with innovative growing techniques.",
          location: "City Center",
          totalPlots: 75,
          occupiedPlots: 65,
          image: "/placeholder.svg?height=200&width=300",
          coordinates: { lat: 40.7505, lng: -73.9934 },
        },
      ]
      setGardens(mockGardens)
      setSelectedGarden(mockGardens[0])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="garden-overview">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading gardens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="garden-overview fade-in">
      <div className="page-header">
        <h1>Community Gardens</h1>
        <p>Manage and explore our community garden spaces</p>
        {(user?.role === "admin" || user?.role === "manager") && (
          <button className="btn btn-primary">
            <span>➕</span> Add New Garden
          </button>
        )}
      </div>

      <div className="gardens-grid">
        {gardens.map((garden) => (
          <GardenCard
            key={garden.id}
            garden={garden}
            isSelected={selectedGarden?.id === garden.id}
            onClick={() => setSelectedGarden(garden)}
            userRole={user?.role}
          />
        ))}
      </div>

      {selectedGarden && (
        <div className="garden-details">
          <PlotGrid garden={selectedGarden} userRole={user?.role} />
        </div>
      )}
    </div>
  )
}

export default GardenOverview
