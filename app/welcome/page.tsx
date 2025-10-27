'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
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
        // Stay on welcome page
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
    <div className="min-h-screen bg-lcc-ap-bg lcc-ap-radial">
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

      {/* Welcome Content */}
      <div className="lcc-ap-welcome-content">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4" style={{color: 'white'}}>Welcome to Legal Command Center</h2>
        </div>
      </div>
    </div>
  )
}
