"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Ccms2Case = {
  name?: string;
  case_type?: string;
  case_status?: string;
  case_stage?: string;
  case_categories?: string;
  item_no?: string;
  main_number?: string;
  cnr?: string;
  filing_no?: string;
  court_no?: string;
  court_number_and_judge?: string;
  pet_name?: string;
  res_name?: string;
  cause_list_date?: string;
  next_hearing_date?: string;
  filing_date?: string;
  priority?: string;
  old_new?: string;
  synopsis?: string;
  synopsis_status?: string;
  prayer?: string;
  relevancy?: string;
  s3_html_link?: string;
  order_link?: string;
  match_keyword?: string;
  alert_to?: string;
};

const filterConfig: Record<
  "all" | "overdue" | "today" | "tomorrow" | "upcoming",
  { title: string; description: string }
> = {
  all: {
    title: "All High Priority Cases",
    description: "Showing all high priority cases in the system",
  },
  overdue: {
    title: "Overdue Cases",
    description: "Cases with hearing dates in the past",
  },
  today: {
    title: "Today's Cases",
    description: "Cases scheduled for hearing today",
  },
  tomorrow: {
    title: "Tomorrow's Cases",
    description: "Cases scheduled for hearing tomorrow",
  },
  upcoming: {
    title: "Upcoming Cases",
    description: "Cases scheduled within the next 15 days",
  },
};

function toISODateOnly(date: Date): string {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Not scheduled";
  const date = new Date(dateStr);
  const today = toISODateOnly(new Date());
  const tomorrow = toISODateOnly(new Date(Date.now() + 86400000));
  const dateOnly = toISODateOnly(date);

  if (dateOnly === today) return "🔴 Today";
  if (dateOnly === tomorrow) return "🟡 Tomorrow";
  if (date < new Date()) return "⚠️ Overdue";
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCaseStatus(hearingDate?: string): "overdue" | "today" | "tomorrow" | "upcoming" | "" {
  if (!hearingDate) return "";
  const today = toISODateOnly(new Date());
  const tomorrow = toISODateOnly(new Date(Date.now() + 86400000));
  if (hearingDate < today) return "overdue";
  if (hearingDate === today) return "today";
  if (hearingDate === tomorrow) return "tomorrow";
  return "upcoming";
}

export default function HighPriorityV2Page(): JSX.Element {
  const router = useRouter();
  const [cases, setCases] = useState<Ccms2Case[]>([]);
  const [currentFilter, setCurrentFilter] = useState<
    "all" | "overdue" | "today" | "tomorrow" | "upcoming"
  >("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isPrayerOpen, setIsPrayerOpen] = useState<boolean>(false);
  const [prayerTitle, setPrayerTitle] = useState<string>("");
  const [prayerContent, setPrayerContent] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 10;
  const [pageInputValue, setPageInputValue] = useState<string>("");

  const today = useMemo(() => toISODateOnly(new Date()), []);
  const tomorrow = useMemo(
    () => toISODateOnly(new Date(Date.now() + 86400000)),
    []
  );
  const after15Days = useMemo(
    () => toISODateOnly(new Date(Date.now() + 15 * 86400000)),
    []
  );

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const date = c.next_hearing_date;
      switch (currentFilter) {
        case "all":
          return true;
        case "overdue":
          return Boolean(date && date < today);
        case "today":
          return date === today;
        case "tomorrow":
          return date === tomorrow;
        case "upcoming":
          return Boolean(date && date > tomorrow && date <= after15Days);
        default:
          return true;
      }
    });
  }, [cases, currentFilter, today, tomorrow, after15Days]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setPageInputValue("");
  }, [currentFilter]);

  // Sync pageInputValue with currentPage
  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  // Pagination calculations
  const totalCases = filteredCases.length;
  const totalPages = useMemo(() => Math.ceil(totalCases / recordsPerPage), [totalCases]);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedCases = useMemo(() => {
    return filteredCases.slice(startIndex, endIndex);
  }, [filteredCases, startIndex, endIndex]);

  // Check if Go button should be disabled
  const isGoButtonDisabled = useMemo(() => {
    const trimmedValue = pageInputValue.trim();
    if (!trimmedValue || trimmedValue === '') return true;
    const page = parseInt(trimmedValue, 10);
    return isNaN(page) || page < 1 || page > totalPages || page === currentPage;
  }, [pageInputValue, totalPages, currentPage]);

  const counts = useMemo(() => {
    return {
      all: cases.length,
      overdue: cases.filter((c) => c.next_hearing_date && c.next_hearing_date < today).length,
      today: cases.filter((c) => c.next_hearing_date === today).length,
      tomorrow: cases.filter((c) => c.next_hearing_date === tomorrow).length,
      upcoming: cases.filter(
        (c) => c.next_hearing_date && c.next_hearing_date > tomorrow && c.next_hearing_date <= after15Days
      ).length,
    };
  }, [cases, today, tomorrow, after15Days]);

  const openPrayer = useCallback((prayer: string, caseName: string) => {
    setPrayerTitle(`Prayer Details - ${caseName || ""}`);
    setPrayerContent(prayer || "No prayer details available");
    setIsPrayerOpen(true);
  }, []);

  const closePrayer = useCallback(() => setIsPrayerOpen(false), []);

  // Pagination navigation functions
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setPageInputValue(page.toString());
    // Scroll to top of cases container
    const casesContainer = document.getElementById("casesContent");
    if (casesContainer) {
      casesContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [totalPages]);

  const handlePageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for typing, but validate on submit
    // Only allow numbers and empty string
    if (value === '' || /^\d+$/.test(value)) {
      setPageInputValue(value);
    }
  }, []);

  const handlePageInputSubmit = useCallback(() => {
    // Trim and check if empty
    const trimmedValue = pageInputValue.trim();
    if (!trimmedValue || trimmedValue === '') {
      setPageInputValue(currentPage.toString());
      return;
    }
    
    const page = parseInt(trimmedValue, 10);
    if (isNaN(page) || page < 1) {
      alert("Please enter a valid page number");
      setPageInputValue(currentPage.toString());
      return;
    }
    if (page > totalPages) {
      alert(`Page number cannot exceed ${totalPages}`);
      setPageInputValue(currentPage.toString());
      return;
    }
    if (page === currentPage) {
      // Already on this page, just reset the input
      setPageInputValue(currentPage.toString());
      return;
    }
    goToPage(page);
  }, [pageInputValue, totalPages, currentPage, goToPage]);

  const handlePageInputKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePageInputSubmit();
    }
  }, [handlePageInputSubmit]);

  const handlePageInputBlur = useCallback(() => {
    // If input is empty or invalid, reset to current page
    const trimmedValue = pageInputValue.trim();
    if (!trimmedValue || trimmedValue === '') {
      setPageInputValue(currentPage.toString());
      return;
    }
    const page = parseInt(trimmedValue, 10);
    if (isNaN(page) || page < 1 || page > totalPages) {
      setPageInputValue(currentPage.toString());
    }
  }, [pageInputValue, currentPage, totalPages]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fields = [
        "name",
        "case_type",
        "case_status",
        "case_stage",
        "case_categories",
        "item_no",
        "main_number",
        "cnr",
        "filing_no",
        "court_no",
        "court_number_and_judge",
        "pet_name",
        "res_name",
        "cause_list_date",
        "next_hearing_date",
        "filing_date",
        "priority",
        "old_new",
        "synopsis",
        "synopsis_status",
        "prayer",
        "relevancy",
        "s3_html_link",
        "order_link",
        "match_keyword",
        "alert_to",
      ];

      const filters = [["priority", "=", "High"]];
      const url = `/api/frappe/cases?limit=0&fields=${encodeURIComponent(
        JSON.stringify(fields)
      )}&filters=${encodeURIComponent(JSON.stringify(filters))}`;

      const headers: Record<string, string> = {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };
      // Best-effort pass-through of Frappe CSRF if present in global scope
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const maybeFrappe = (globalThis as any)?.frappe;
      if (maybeFrappe?.csrf_token) {
        headers["X-Frappe-CSRF-Token"] = String(maybeFrappe.csrf_token);
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errText}`);
      }

      const data = (await response.json()) as { data?: Ccms2Case[] };
      setCases(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      if (response.ok) {
        localStorage.removeItem("lcc_ap_remember");
        router.push('/');
      } else {
        console.error("Logout failed");
        router.push('/');
      }
    } catch (error) {
      console.error("Logout error:", error);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    // Set page title
    if (typeof document !== 'undefined') {
      document.title = 'highpriorityv2'
      
      // Load FontAwesome only if not already loaded
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link')
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
    }
    
    // Fetch data immediately
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Refresh data every 5 minutes
    const id = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="hpv2-container container">
      <div className="main-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="lcc-ap-home-btn"
            onClick={() => router.push('/todaycauselist')}
            title="Home"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </button>
          <div className="header-title-section">
          <h1 className="main-title"><i className="fa fa-balance-scale" aria-hidden="true"></i>Legal Command Centre (Powered by Valuepitch)</h1>
            <p className="header-subtitle">High Priority Cases Dashboard - Real-time monitoring of critical CCMS2 cases</p>
          </div>
        </div>
        <button 
          className="lcc-ap-signout-btn"
          onClick={handleLogout}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      <div className="stats-container">
        <div
          className={`stat-card total ${currentFilter === "all" ? "active" : ""}`}
          data-filter="all"
          onClick={() => setCurrentFilter("all")}
        >
          <div className="stat-icon">📊</div>
          <div className="stat-number" id="count-all">
            {counts.all}
          </div>
          <div className="stat-label">Total Cases</div>
        </div>

        <div
          className={`stat-card overdue ${currentFilter === "overdue" ? "active" : ""}`}
          data-filter="overdue"
          onClick={() => setCurrentFilter("overdue")}
        >
          <div className="stat-icon">⚠️</div>
          <div className="stat-number" id="count-overdue">
            {counts.overdue}
          </div>
          <div className="stat-label">Overdue</div>
        </div>

        <div
          className={`stat-card today ${currentFilter === "today" ? "active" : ""}`}
          data-filter="today"
          onClick={() => setCurrentFilter("today")}
        >
          <div className="stat-icon">📅</div>
          <div className="stat-number" id="count-today">
            {counts.today}
          </div>
          <div className="stat-label">Today</div>
        </div>

        <div
          className={`stat-card tomorrow ${currentFilter === "tomorrow" ? "active" : ""}`}
          data-filter="tomorrow"
          onClick={() => setCurrentFilter("tomorrow")}
        >
          <div className="stat-icon">📆</div>
          <div className="stat-number" id="count-tomorrow">
            {counts.tomorrow}
          </div>
          <div className="stat-label">Tomorrow</div>
        </div>

        <div
          className={`stat-card upcoming ${currentFilter === "upcoming" ? "active" : ""}`}
          data-filter="upcoming"
          onClick={() => setCurrentFilter("upcoming")}
        >
          <div className="stat-icon">📋</div>
          <div className="stat-number" id="count-upcoming">
            {counts.upcoming}
          </div>
          <div className="stat-label">Next 15 Days</div>
        </div>
      </div>

      <div className="cases-container">
        <div className="cases-header">
          <h2 className="cases-title" id="currentFilter">
            {filterConfig[currentFilter].title}
          </h2>
          <p className="cases-subtitle" id="filterDescription">
            {filterConfig[currentFilter].description}
          </p>
        </div>

        <div className="cases-content" id="casesContent">
          {isLoading && <div className="loading">Loading cases...</div>}
          {!isLoading && error && (
            <div className="error">
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>❌</div>
              <strong>Error fetching data:</strong>
              <br />
              <code>{error}</code>
            </div>
          )}
          {!isLoading && !error && filteredCases.length === 0 && (
            <div className="no-cases">
              <div style={{ fontSize: "3rem", marginBottom: 15 }}>📝</div>
              <div>No cases found for this filter</div>
            </div>
          )}

          {!isLoading && !error && filteredCases.length > 0 && (
            <>
              {paginatedCases.map((c, index) => {
                const status = getCaseStatus(c.next_hearing_date);
                const hearingFormatted = formatDate(c.next_hearing_date);
                return (
                  <div key={c.name || `case-${index}`} className={`case-card ${status}`}>
                    <div className="case-header">
                      <div className="case-info">
                        <div className="case-title">
                          {(c.case_type || "Unknown Type") + " - " + (c.name || "N/A")}
                        </div>
                        <div className="case-meta">
                          <div className="meta-item">
                            <span className="meta-icon">🏛️</span>
                            <span>{c.court_number_and_judge || c.court_no || "N/A"}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-icon">📋</span>
                            <span>{`CNR: ${c.cnr || "N/A"}`}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-icon">📄</span>
                            <span>{`Item: ${c.item_no || "N/A"}`}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-icon">📅</span>
                            <span>{`Next Hearing: ${c.next_hearing_date || "Not scheduled"}`}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="case-status">
                      <span className="status-badge status-priority">High Priority</span>
                      <span className="status-badge status-stage">{c.case_stage || "Unknown Stage"}</span>
                      {c.old_new === "Repeat" ? (
                        <span className="status-badge status-repeat">Repeat Case</span>
                      ) : null}
                      {c.next_hearing_date ? (
                        <span className="status-badge status-hearing">{hearingFormatted}</span>
                      ) : null}
                    </div>

                    <div className="case-parties">
                      <div className="party">
                        <div className="party-label">Petitioner</div>
                        <div className="party-name">{c.pet_name || "Not specified"}</div>
                      </div>
                      <div className="party">
                        <div className="party-label">Respondent</div>
                        <div className="party-name">{c.res_name || "Not specified"}</div>
                      </div>
                    </div>

                    {c.synopsis ? (
                      <div className="case-synopsis">
                        <strong>AI Synopsis:</strong> {c.synopsis}
                      </div>
                    ) : null}

                    <div className="case-actions">
                      {c.s3_html_link ? (
                        <a
                          href={c.s3_html_link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                        >
                          📄 View Case
                        </a>
                      ) : null}
                      {c.prayer ? (
                        <button
                          className="btn btn-success"
                          onClick={() => openPrayer(c.prayer || "", c.name || "")}
                        >
                          📋 Prayer
                        </button>
                      ) : null}
                      <button
                        className="btn btn-warning"
                        onClick={() => alert(`Alert sent for case "${c.name || ""}"`)}
                      >
                        🔔 Alert
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          // Placeholder for remove priority action
                          // eslint-disable-next-line no-alert
                          if (confirm(`Remove "${c.name || ""}" from high priority?`)) {
                            alert(
                              `Case "${c.name || ""}" would be removed from high priority (API call needed)`
                            );
                          }
                        }}
                      >
                        Remove Priority
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Pagination Component */}
        {!isLoading && !error && filteredCases.length > 0 && (
          <div className="pagination-container">
            {totalPages <= 1 ? (
              <div className="pagination-info">
                Showing all {totalCases} cases
              </div>
            ) : (
              <>
                <div className="pagination-info">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalCases)} of {totalCases} cases (Page {currentPage} of {totalPages})
                </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-angle-double-left"></i>
              </button>
              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="fas fa-angle-left"></i> Prev
              </button>
              {(() => {
                // Calculate which page numbers to show
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, currentPage + 2);
                
                // Adjust if we're near the beginning or end
                if (currentPage <= 3) {
                  endPage = Math.min(5, totalPages);
                }
                if (currentPage >= totalPages - 2) {
                  startPage = Math.max(1, totalPages - 4);
                }
                
                const pageButtons = [];
                for (let i = startPage; i <= endPage; i++) {
                  pageButtons.push(i);
                }
                
                return (
                  <>
                    {startPage > 1 && (
                      <>
                        <button className="pagination-btn" onClick={() => goToPage(1)}>1</button>
                        {startPage > 2 && <span>...</span>}
                      </>
                    )}
                    {pageButtons.map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${page === currentPage ? "active" : ""}`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    {endPage < totalPages && (
                      <>
                        {endPage < totalPages - 1 && <span>...</span>}
                        <button className="pagination-btn" onClick={() => goToPage(totalPages)}>
                          {totalPages}
                        </button>
                      </>
                    )}
                  </>
                );
              })()}
              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <i className="fas fa-angle-right"></i>
              </button>
              <button
                className="pagination-btn"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
              <span style={{ marginLeft: "10px" }}>Go to:</span>
              <input
                type="number"
                className="pagination-input"
                min={1}
                max={totalPages}
                value={pageInputValue}
                onChange={handlePageInputChange}
                onKeyPress={handlePageInputKeyPress}
                onBlur={handlePageInputBlur}
                placeholder={currentPage.toString()}
              />
              <button 
                className="pagination-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  if (!isGoButtonDisabled) {
                    handlePageInputSubmit();
                  }
                }}
                disabled={isGoButtonDisabled}
                title={isGoButtonDisabled ? "Enter a valid page number" : "Go to page"}
              >
                Go
              </button>
            </div>
              </>
            )}
          </div>
        )}
      </div>

      {isPrayerOpen && (
        <div className="modal" onClick={(e) => e.currentTarget === e.target && closePrayer()}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">{prayerTitle}</div>
              <span className="close" onClick={closePrayer}>&times;</span>
            </div>
            <div className="modal-body">
              <div style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", lineHeight: 1.8 }}>
                {prayerContent}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .main-title { 
          font-size: 22px; 
          font-weight: 700; 
          color: #2c3e50; 
          display: inline-flex; 
          align-items: center; 
          gap: 10px; 
          margin: 0;
        }
        .main-title i { color: #3498db; }
        @media (max-width: 768px) {
          .main-title { font-size: 18px; }
          .hpv2-container .header-title-section { gap: 2px; }
          .hpv2-container .header-subtitle { font-size: 11px; }
          
          .pagination-container {
            padding: 10px 15px;
            flex-direction: column;
            gap: 8px;
          }
          
          .pagination-info {
            font-size: 12px;
            text-align: center;
            width: 100%;
          }
          
          .pagination-controls {
            width: 100%;
            justify-content: center;
          }
        }

        /* Pagination styles */
        .pagination-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background-color: #ffffff;
          border-top: 2px solid #e0e0e0;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        @media (min-width: 1400px) {
          .pagination-container {
            max-width: 1400px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .pagination-info {
          font-size: 14px;
          color: #2c3e50;
          font-weight: 500;
        }
        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-wrap: wrap;
        }
        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
          color: #2c3e50;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          min-width: 40px;
          text-align: center;
        }
        .pagination-btn:hover:not(:disabled) {
          background-color: #3498db;
          color: white;
          border-color: #3498db;
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .pagination-btn.active {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          border-color: #2980b9;
          font-weight: bold;
          font-size: 15px;
          padding: 10px 14px;
          box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4), 0 0 0 2px rgba(52, 152, 219, 0.2);
          transform: scale(1.05);
          border-width: 2px;
          position: relative;
          z-index: 1;
        }
        
        .pagination-btn.active:hover {
          background: linear-gradient(135deg, #2980b9, #1f5f8b);
          box-shadow: 0 3px 12px rgba(52, 152, 219, 0.5), 0 0 0 2px rgba(52, 152, 219, 0.3);
          transform: scale(1.08);
        }
        .pagination-input {
          width: 60px;
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
          font-size: 14px;
        }
        .pagination-input:focus {
          outline: none;
          border-color: #3498db;
        }
      `}</style>
    </div>
  );
}

 