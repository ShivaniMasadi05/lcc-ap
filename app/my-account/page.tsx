'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MyAccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ message?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set page title
    document.title = 'My Account'
    
    // Load FontAwesome
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    
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
      }
    } catch (error) {
      router.push('/')
    }
  }

  // Get user's initial for avatar
  const getInitialLetter = () => {
    if (!user || !user.message) return 'U'
    const email = user.message
    return email.charAt(0).toUpperCase()
  }

  // Get user's display name (extract from email or use email)
  const getUserDisplayName = () => {
    if (!user || !user.message) return 'User'
    const email = user.message
    // Try to extract name from email (part before @)
    const namePart = email.split('@')[0]
    // Capitalize first letter
    return namePart.charAt(0).toUpperCase() + namePart.slice(1)
  }

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    alert('Edit Profile feature coming soon!')
  }

  const handleResetPassword = () => {
    // TODO: Implement reset password functionality
    alert('Reset Password feature coming soon!')
  }

  const handleManageApps = () => {
    // TODO: Implement manage third party apps functionality
    alert('Manage Third Party Apps feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <div className="gradient-text text-xl font-semibold">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-account-page">
      <style jsx>{`
        .my-account-page {
          min-height: 100vh;
          background-color: #ffffff;
          padding: 40px 20px;
        }

        .my-account-container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #ffffff;
        }

        .page-header {
          margin-bottom: 30px;
        }

        .page-label {
          font-size: 14px;
          color: #4a5568;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
        }

        .account-card {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .account-section {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .account-section:last-child {
          border-bottom: none;
        }

        .section-content {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .profile-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          color: #4a5568;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .section-info {
          flex: 1;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 4px 0;
        }

        .section-description {
          font-size: 14px;
          color: #718096;
          margin: 0;
        }

        .section-action {
          margin-left: 16px;
        }

        .action-link {
          color: #1a202c;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
        }

        .action-link:hover {
          color: #2d3748;
        }

        .action-link i {
          font-size: 12px;
        }

        .action-button {
          background: none;
          border: none;
          color: #1a202c;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .action-button:hover {
          color: #2d3748;
        }

        @media (max-width: 768px) {
          .my-account-page {
            padding: 20px 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .account-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .section-content {
            width: 100%;
          }

          .section-action {
            margin-left: 0;
            width: 100%;
          }

          .action-link,
          .action-button {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>

      <div className="my-account-container">
        <div className="page-header">
          <div className="page-label">My Account</div>
          <h1 className="page-title">My Account</h1>
        </div>

        <div className="account-card">
          {/* User Profile Section */}
          <div className="account-section">
            <div className="section-content">
              <div className="profile-avatar">
                {getInitialLetter()}
              </div>
              <div className="section-info">
                <h2 className="section-title">{getUserDisplayName()}</h2>
              </div>
            </div>
            <div className="section-action">
              <button className="action-link" onClick={handleEditProfile}>
                <i className="fas fa-pencil-alt"></i>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Reset Password Section */}
          <div className="account-section">
            <div className="section-content">
              <div className="section-info">
                <h2 className="section-title">Reset Password</h2>
                <p className="section-description">Reset the password for your account</p>
              </div>
            </div>
            <div className="section-action">
              <button className="action-button" onClick={handleResetPassword}>
                Reset Password
              </button>
            </div>
          </div>

          {/* Manage Third Party Apps Section */}
          <div className="account-section">
            <div className="section-content">
              <div className="section-info">
                <h2 className="section-title">Manage third party apps</h2>
                <p className="section-description">To manage your authorized third party apps</p>
              </div>
            </div>
            <div className="section-action">
              <button className="action-button" onClick={handleManageApps}>
                Manage your apps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



