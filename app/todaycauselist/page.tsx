'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TodaysCauseListPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check", { 
        credentials: "include" 
      })
      
      if (!response.ok) {
        router.push('/')
        return
      }
      
      const data = await response.json()
      if (!data || !data.message || data.message === "Guest") {
        router.push('/')
      } else {
        setUser(data)
        setLoading(false)
        // Stay on this page
      }
    } catch (error) {
      router.push('/')
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })
      
      if (response.ok) {
        // Clear any local storage
        localStorage.removeItem("lcc_ap_remember")
        // Redirect to login page
        router.push('/')
      } else {
        console.error("Logout failed")
        // Still redirect to login page even if logout API fails
        router.push('/')
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect to login page
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-lcc-ap-bg lcc-ap-radial flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <div className="gradient-text text-xl font-semibold">Loading Legal Command Center...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="welcome-page-container">
      {/* Navigation Bar */}
      <nav className="lcc-ap-navbar">
        <div className="lcc-ap-nav-content">
          <h1 className="lcc-ap-nav-title">Legal Command Center</h1>
          <button
            onClick={handleLogout}
            className="lcc-ap-signout-btn"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="welcome-content-wrapper">
        <div className="welcome-header">
          <h1>Today&apos;s Cause List</h1>
          <p>Access court case information and filtered listings</p>
        </div>

        <div className="cards-grid">
          <div className="court-card all-cases" onClick={() => window.open('https://dev2.crimescan.ai/dcl1', '_blank')}>
            <div className="card-badge">Live</div>
            <div className="card-icon">⚖️</div>
            <h2>All Court Cases</h2>
            <p>Access the complete list of all court cases scheduled for today. View comprehensive case details, timings, and courtroom assignments.</p>
          </div>

          <div className="court-card filtered-cases" onClick={() => window.open('http://localhost:3000/dailycauselist507', '_blank')}>
            <div className="card-badge">Filtered</div>
            <div className="card-icon">🔍</div>
            <h2>Filtered Cases</h2>
            <p>Browse through filtered and categorized court cases. Find specific cases based on criteria, case types, or other filtering parameters.</p>
          </div>

          <div className="court-card case-search" onClick={() => window.open('http://localhost:3000/case-search', '_blank')}>
            <div className="card-badge">Search</div>
            <div className="card-icon">🔎</div>
            <h2>Case Search</h2>
            <p>Search for specific court cases using various search criteria. Find cases by case number, party names, date range, or other parameters.</p>
          </div>

          <div className="court-card high-priority-cases" onClick={() => window.open('http://localhost:3000/highpriorityv2', '_blank')}>
            <div className="card-badge priority-badge">Priority</div>
            <div className="card-icon">🚨</div>
            <h2>High Priority Cases</h2>
            <p>Access urgent and high-priority court cases that require immediate attention. View time-sensitive cases and critical proceedings.</p>
          </div>

          <div className="court-card high-court-vc" onClick={() => window.open('https://aphc.gov.in/Hcdbs/vclinks.jsp', '_blank')}>
            <div className="card-badge">VC Links</div>
            <div className="card-icon">🎥</div>
            <h2>High Court VC Meeting Links</h2>
            <p>Access virtual court meeting links for the High Court. Join scheduled video conferencing sessions for today&apos;s hearings.</p>
          </div>
        </div>

        <div className="welcome-footer">
          <p>Click on any card to access the respective court case listings</p>
        </div>
      </div>
    </div>
  )
}

