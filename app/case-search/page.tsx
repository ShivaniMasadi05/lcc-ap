'use client'

import { useState, FormEvent } from 'react'
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
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
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
        
        .fade-in-form {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .fade-in-card {
          animation: fadeIn 0.4s ease-in-out;
        }
      `}</style>

      <div style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: '#f0f2f5',
        padding: '30px',
        color: '#333',
        minHeight: '100vh'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            flex: 1,
            textAlign: 'center',
            margin: 0,
            color: '#1a202c',
            fontSize: '2rem',
            fontWeight: 'normal'
          }}>
            🔍 High Court Case Search
          </h2>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 15px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7f8c8d'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#95a5a6'
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

        <form 
          id="caseForm"
          onSubmit={handleSubmit}
          className="fade-in-form"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="case_type"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#2d3748'
              }}
            >
              Case Type
            </label>
            <input
              type="text"
              id="case_type"
              name="case_type"
              placeholder="e.g., WA"
              required
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3182ce'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="case_number"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#2d3748'
              }}
            >
              Case Number
            </label>
            <input
              type="text"
              id="case_number"
              name="case_number"
              placeholder="e.g., 1055"
              required
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3182ce'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label 
              htmlFor="case_year"
              style={{
                display: 'block',
                fontWeight: 600,
                marginBottom: '6px',
                color: '#2d3748'
              }}
            >
              Case Year
            </label>
            <input
              type="text"
              id="case_year"
              name="case_year"
              placeholder="e.g., 2024"
              required
              value={caseYear}
              onChange={(e) => setCaseYear(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3182ce'}
              onBlur={(e) => e.target.style.borderColor = '#ccc'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
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

        <div 
          id="result"
          style={{
            marginTop: '40px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          {loading && (
            <p style={{ textAlign: 'center' }}>🔄 Searching case details...</p>
          )}

          {error && (
            <p style={{ textAlign: 'center', color: '#e53e3e' }}>❌ {error}</p>
          )}

          {results.map((item, index) => (
            <div
              key={index}
              className="fade-in-card"
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                marginBottom: '25px'
              }}
            >
              <h3 style={{
                color: '#2c5282',
                marginBottom: '15px',
                fontSize: '1.25rem'
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
    </>
  )
}

