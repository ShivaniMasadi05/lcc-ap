'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CaseResult {
  main_case: string
  case_status: string
  case_stage: string
  district: string
  next_hearing_date?: string
  court_no: string
  pet_name?: string[]
  res_name?: string[]
  pet_adv?: string
  res_adv?: string
  prayer?: string
  order_url: string
  s3_html_link: string
}

export default function CaseSearchPage() {
  const router = useRouter()
  const [caseType, setCaseType] = useState('')
  const [caseNumber, setCaseNumber] = useState('')
  const [caseYear, setCaseYear] = useState('')
  const [results, setResults] = useState<CaseResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load FontAwesome
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })
      
      if (response.ok) {
        localStorage.removeItem("lcc_ap_remember")
        router.push('/')
      } else {
        console.error("Logout failed")
        router.push('/')
      }
    } catch (error) {
      console.error("Logout error:", error)
      router.push('/')
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults([])

    const formData = new FormData()
    formData.append('case_type', caseType)
    formData.append('case_number', caseNumber)
    formData.append('case_year', caseYear)

    try {
      const response = await fetch('https://automation.lendingcube.ai/webhook/case-search', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to fetch case details')
      }

      const data: CaseResult[] = await response.json()
      
      if (!data || data.length === 0) {
        setError('No case found.')
      } else {
        setResults(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav className="lcc-ap-navbar">
        <div className="lcc-ap-nav-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => router.push('/todaycauselist')}
              className="lcc-ap-home-btn"
              title="Home"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </button>
            <h1 className="lcc-ap-nav-title">
              <i className="fas fa-balance-scale"></i>Legal Command Centre (Powered by Valuepitch)
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="lcc-ap-signout-btn"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </nav>

       {/* Main Content */}
       <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'white',
        padding: '30px',
        color: '#333',
        height: 'calc(100vh - 80px)',
        overflow: 'hidden'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#1a202c'
        }}>
         High Court Case Search
        </h2>

        <form 
          onSubmit={handleSubmit}
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            background: '#f8f9fa',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <label 
              htmlFor="case_type"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#2d3748',
                textAlign: 'left'
              }}
            >
              Case Type
            </label>
            <input
              type="text"
              id="case_type"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              placeholder="e.g., WA"
              required
              style={{
                width: '100%',
                padding: '12px 20px 12px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                transition: 'border 0.3s',
                display: 'block',
                margin: '0 auto',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <label 
              htmlFor="case_number"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#2d3748',
                textAlign: 'left'
              }}
            >
              Case Number
            </label>
            <input
              type="text"
              id="case_number"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="e.g., 1055"
              required
              style={{
                width: '100%',
                padding: '12px 20px 12px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                transition: 'border 0.3s',
                display: 'block',
                margin: '0 auto',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <label 
              htmlFor="case_year"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#2d3748',
                textAlign: 'left'
              }}
            >
              Case Year
            </label>
            <input
              type="text"
              id="case_year"
              value={caseYear}
              onChange={(e) => setCaseYear(e.target.value)}
              placeholder="e.g., 2024"
              required
              style={{
                width: '100%',
                padding: '12px 20px 12px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                transition: 'border 0.3s',
                display: 'block',
                margin: '0 auto',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: loading ? '#93c5fd' : '#3182ce',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#2b6cb0'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#3182ce'
            }}
          >
            {loading ? '🔄 Searching...' : 'Search Case'}
          </button>
        </form>

        <div style={{
          marginTop: '40px',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxHeight: 'calc(100vh - 400px)',
          overflowY: 'auto'
        }}>
          {loading && (
            <p style={{ textAlign: 'center', color: '#333' }}>🔄 Searching case details...</p>
          )}

          {error && (
            <p style={{ textAlign: 'center', color: '#e53e3e' }}>❌ {error}</p>
          )}

          {results.map((item, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                marginBottom: '25px',
                animation: 'fadeIn 0.4s ease-in-out'
              }}
            >
              <h3 style={{
                color: '#2c5282',
                marginBottom: '15px'
              }}>
                {item.main_case}
              </h3>
              
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Status:</strong> {item.case_status}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Stage:</strong> {item.case_stage}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>District:</strong> {item.district}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Next Hearing:</strong> {item.next_hearing_date || 'N/A'}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Court:</strong> {item.court_no}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Petitioners:</strong> {item.pet_name?.join(', ') || 'N/A'}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Respondents:</strong> {item.res_name?.join(', ') || 'N/A'}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Petitioner Advocate:</strong> {item.pet_adv || 'N/A'}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Respondent Advocate:</strong> {item.res_adv || 'N/A'}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <strong>Prayer:</strong> {item.prayer || 'N/A'}
              </p>
              <p style={{ margin: '6px 0', lineHeight: '1.5' }}>
                <a 
                  href={item.order_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#3182ce',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  📄 Order PDF
                </a>
                {' | '}
                <a 
                  href={item.s3_html_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#3182ce',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  📑 Cause List View
                </a>
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        input:focus {
          border-color: #3182ce !important;
          outline: none;
        }
      `}</style>
    </>
  )
}
