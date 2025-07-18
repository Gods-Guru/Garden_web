import { useState } from 'react'
import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Garden } from './pages/Garden'
import { Media } from './pages/Media'
import Community from './pages/Community'
import { Payments } from './pages/Payments'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'
import Footer from './components/common/Footer'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gardens/:id" element={<Garden />} />
        <Route path="/media" element={<Media />} />
        <Route path="/community" element={<Community />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </Router>
  )
}
