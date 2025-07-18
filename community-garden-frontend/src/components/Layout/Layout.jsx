"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import "./Layout.scss"

const Layout = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} user={user} />
      <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Header toggleSidebar={toggleSidebar} user={user} />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export default Layout
