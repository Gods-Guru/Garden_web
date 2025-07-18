"use client"

import { useState, useEffect } from "react"
import GardenCard from "./GardenCard"
import PlotGrid from "./PlotGrid"
import "./GardenOverview.scss"
import API from '../../api'

const GardenOverview = ({ user }) => {
  const [gardens, setGardens] = useState([])
  const [selectedGarden, setSelectedGarden] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    API.get('/gardens')
      .then((res) => {
        setGardens(res.data)
        setSelectedGarden(res.data[0] || null)
      })
      .catch(() => {
        setGardens([])
      })
      .finally(() => setLoading(false))
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
