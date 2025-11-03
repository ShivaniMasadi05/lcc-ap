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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [isPrayerOpen, setIsPrayerOpen] = useState<boolean>(false);
  const [prayerTitle, setPrayerTitle] = useState<string>("");
  const [prayerContent, setPrayerContent] = useState<string>("");

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

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/check", {
        credentials: "include",
      });
      const data = await response.json();
      const authenticated = response.ok && data.message !== "Guest";
      setIsAuthenticated(authenticated);
      return authenticated;
    } catch (err) {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

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

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    
    try {
      const formData = new URLSearchParams();
      formData.append("usr", username);
      formData.append("pwd", password);
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        credentials: "include",
      });
      
      const data = await response.json();
      
      if (response.ok && data.message === "Logged In") {
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setUsername("");
        setPassword("");
        fetchData();
      } else {
        setLoginError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setLoginError("An error occurred during login. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }, [username, password, fetchData]);

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
    document.title = 'highpriorityv2'
    
    // Load FontAwesome
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    
    const init = async () => {
      const authenticated = await checkAuth();
      if (authenticated) {
        fetchData();
      } else {
        setIsLoading(false);
        setError("Please login to view cases");
      }
    };
    init();
  }, [checkAuth, fetchData]);

  useEffect(() => {
    if (isAuthenticated) {
      const id = setInterval(fetchData, 5 * 60 * 1000);
      return () => clearInterval(id);
    }
  }, [isAuthenticated, fetchData]);

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
          <h1 className="main-title"><i className="fas fa-balance-scale"></i>Legal Command Centre (Powered by Valuepitch)</h1>
        </div>
        {isAuthenticated ? (
          <button 
            className="lcc-ap-signout-btn"
            onClick={handleLogout}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        ) : (
          <button 
            className="lcc-ap-signout-btn"
            onClick={() => setShowLoginModal(true)}
          >
            🔐 Login to View Cases
          </button>
        )}
      </div>
      
      <div className="header">
        <div className="header-content">
          <div className="header-text">
            <h2> High Priority Cases Dashboard</h2>
            <p>Real-time monitoring of critical CCMS2 cases</p>
          </div>
        </div>
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
              {filteredCases.map((c) => {
                const status = getCaseStatus(c.next_hearing_date);
                const hearingFormatted = formatDate(c.next_hearing_date);
                return (
                  <div key={c.name || Math.random()} className={`case-card ${status}`}>
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

      {showLoginModal && (
        <div className="modal" onClick={(e) => e.currentTarget === e.target && setShowLoginModal(false)}>
          <div className="modal-content login-modal">
            <div className="modal-header">
              <div className="modal-title">🔐 Login Required</div>
              <span className="close" onClick={() => setShowLoginModal(false)}>&times;</span>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 20, color: "#6c757d" }}>
                Please login with your CCMS2 credentials to view high priority cases
              </p>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={isLoggingIn}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoggingIn}
                  />
                </div>
                {loginError && (
                  <div className="login-error">
                    ❌ {loginError}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f6fa; min-height: 100vh; color: #333; }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .main-header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .main-title { font-size: 24px; font-weight: 700; color: #2c3e50; display: inline-flex; align-items: center; gap: 10px; }
        .main-title i { color: #3498db; }
        .main-header .lcc-ap-signout-btn { flex-shrink: 0; }
        .header { margin-bottom: 30px; color: #2c3e50; }
        .header-content { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .header-text { text-align: center; flex: 1; }
        .header h2 { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
        .header p { font-size: 15px; opacity: 0.7; color: #6c757d; }
        .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 25px 20px; border-radius: 16px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; position: relative; overflow: hidden; }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--accent-color, #007bff), var(--accent-light, #4dabf7)); }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(0,0,0,0.15); }
        .stat-card.active { background: #3498db; ; color: white; transform: translateY(-3px); }
        .stat-card.overdue { --accent-color:  #3498db;  --accent-light: #3498db;  }
        .stat-card.today { --accent-color:  #3498db;  --accent-light: #3498db; }
        .stat-card.tomorrow { --accent-color:  #3498db;  --accent-light: #3498db;  }
        .stat-card.upcoming { --accent-color: #3498db; --accent-light:  #3498db;  }
        .stat-card.total { --accent-color:  #3498db;  --accent-light:  #3498db; }
        .stat-number { font-size: 2.5rem; font-weight: 700; margin-bottom: 8px; color: var(--accent-color, #007bff); }
        .stat-card.active .stat-number { color: white; }
        .stat-label { font-size: 0.9rem; font-weight: 500; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-icon { font-size: 1.5rem; margin-bottom: 10px; }
        .cases-container { background: white; border-radius: 20px; box-shadow: 0 20px 64px rgba(0,0,0,0.1); overflow: hidden; min-height: 500px; }
        .cases-header { background: #ffffff; padding: 20px 30px; border-bottom: 1px solid #e9ecef; }
        .cases-title { font-size: 20px; font-weight: 600; color: #2c3e50; margin-bottom: 5px; }
        .cases-subtitle { color: #6c757d; font-size: 12px; font-style: italic; }
        .cases-content { padding: 0; max-height: 70vh; overflow-y: auto; }
        .case-card { padding: 20px 30px; border-bottom: 1px solid #f1f3f4; transition: all 0.3s ease; position: relative; }
        .case-card:hover { background: #f8f9fa; padding-left: 35px; }
        .case-card:last-child { border-bottom: none; }
        .case-card::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--status-color, #007bff); opacity: 0; transition: opacity 0.3s ease; }
        .case-card:hover::before { opacity: 1; }
        .case-card.overdue { --status-color: #3498db;; background: rgba(248, 245, 245, 0.05); }
        .case-card.today { --status-color: #3498db; background: rgba(39, 174, 96, 0.05); }
        .case-card.tomorrow { --status-color: #3498db; background: rgba(243, 156, 18, 0.05); }
        .case-card.upcoming { --status-color: #3498db; }
        .case-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; flex-wrap: wrap; gap: 15px; }
        .case-info { flex: 1; min-width: 250px; }
        .case-title { font-size: 15px; font-weight: 600; color: #2c3e50; margin-bottom: 8px; line-height: 1.3; }
        .case-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 10px; }
        .meta-item { display: flex; align-items: center; gap: 5px; font-size: 15px; color: #6c757d; }
        .meta-icon { font-size: 0.9rem; }
        .case-status { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; }
        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; }
        .status-priority { background: #3498db; color: white; }
        .status-stage { background: #e9ecef; color: #495057; }
        .status-repeat { background: #d5f4e6; color: #27ae60; }
        .status-hearing { background: var(--status-color, #007bff); color: white; font-weight: 600; }
        .case-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
        .party { min-width: 0; }
        .party-label { font-size: 0.75rem; font-weight: 600; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .party-name { font-weight: 500; color: #2c3e50; word-wrap: break-word; }
        .case-synopsis { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-size: 0.9rem; line-height: 1.5; color: #495057; border-left: 3px solid var(--status-color, #007bff); }
        .case-actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: flex-end; }
        .btn { padding: 8px 16px; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-primary { background: #3498db; color: white; }
        .btn-success { background: #3498db; color: white; }
        .btn-warning { background: #3498db; color: white; }
        .btn-danger { background: #3498db; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .loading, .no-cases { text-align: center; padding: 60px 20px; color: #6c757d; }
        .loading { font-size: 1.1rem; }
        .loading::after { content: ''; display: inline-block; width: 20px; height: 20px; border: 2px solid #6c757d; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .no-cases { font-size: 1.2rem; }
        .error { color: #721c24; background: #f8d7da; padding: 20px; border-radius: 8px; border: 1px solid #f5c6cb; margin: 20px; }
        .modal { display: flex; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(5px); align-items: center; justify-content: center; }
        .modal-content { background-color: white; margin: 5% auto; padding: 0; border-radius: 16px; width: 90%; max-width: 700px; box-shadow: 0 20px 64px rgba(0,0,0,0.3); overflow: hidden; max-height: 80vh; }
        .modal-header { background: #495057; color: white; padding: 25px 30px; display: flex; justify-content: space-between; align-items: center; }
        .modal-title { font-size: 1.3rem; font-weight: 600; }
        .close { font-size: 24px; font-weight: bold; cursor: pointer; color: white; opacity: 0.8; transition: opacity 0.3s ease; }
        .close:hover { opacity: 1; }
        .modal-body { padding: 30px; line-height: 1.6; color: #495057; max-height: 60vh; overflow-y: auto; }
        .login-modal { max-width: 450px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50; font-size: 14px; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 15px; transition: border-color 0.3s ease; font-family: inherit; }
        .form-input:focus { outline: none; border-color: #3498db; }
        .form-input:disabled { background: #f8f9fa; cursor: not-allowed; }
        .btn-block { width: 100%; justify-content: center; }
        .login-error { background: #fee; color: #c33; padding: 12px 16px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; border: 1px solid #fcc; }
        /* Page-scoped font setup for High Priority V2 */
        .hpv2-container, .hpv2-container * { font-family: Arial, 'Helvetica', sans-serif; }
        .hpv2-container h1 { font-size: 24px; font-weight: 700; font-style: normal; }
        .hpv2-container h2, .hpv2-container h3 { font-weight: 600; font-style: normal; }
        .hpv2-container h2 { font-size: 20px; }
        .hpv2-container h3 { font-size: 18px; }
        .hpv2-container p, .hpv2-container .case-title, .hpv2-container .party-name, .hpv2-container .meta-item, .hpv2-container .btn { font-size: 15px; font-weight: 400; font-style: normal; }
        .hpv2-container .cases-subtitle, .hpv2-container .caption { font-size: 12px; font-style: italic; }
        @media (max-width: 768px) {
          .container { padding: 15px; }
          .main-header { flex-direction: column; align-items: stretch; gap: 15px; }
          .main-title { font-size: 20px; justify-content: center; }
          .main-header .lcc-ap-signout-btn { width: 100%; justify-content: center; }
          .header-content { flex-direction: column; text-align: center; }
          .header-text { text-align: center; }
          .header h2 { font-size: 1.8rem; }
          .stats-container { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
          .stat-number { font-size: 2rem; }
          .case-header { flex-direction: column; align-items: stretch; }
          .case-parties { grid-template-columns: 1fr; gap: 15px; }
          .case-actions { justify-content: center; }
          .cases-content { max-height: 60vh; }
        }
      `}</style>
    </div>
  );
}

 