/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * REFERENCE Pixel War - Main Application
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Pages
import LandingPage from './pages/LandingPage'
import JoinPage from './pages/JoinPage'
import ParticipantPage from './pages/ParticipantPage'
import InstructorPage from './pages/InstructorPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'

// Components
import { ToastContainer } from './components/ui/Toast'

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing - Role Selection */}
        <Route path="/" element={<LandingPage />} />

        {/* Participant Flow */}
        <Route path="/join" element={<JoinPage />} />
        <Route path="/play" element={<ParticipantPage />} />

        {/* Instructor Console */}
        <Route path="/instructor" element={<InstructorPage />} />

        {/* Common Dashboard (Broadcast View) */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Fallback - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Container */}
      <ToastContainer />
    </Router>
  )
}

export default App
