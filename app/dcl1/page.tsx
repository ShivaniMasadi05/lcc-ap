'use client'

export default function DCL1Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Legal Case Management System</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<style>
  /* Reset and base styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f7fa;
  }
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* Header styles */
  header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px 0;
    margin-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
    gap: 15px;
  }
  header h1 {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    align-items: center;
    color: #2c3e50;
    text-align: left;
  }
  header h1 i {
    margin-right: 10px;
    color: #3498db;
  }
  .header-actions {
    display: flex;
    align-items: center;
  }


  .search-bar {
    position: relative;
    margin-right: 60px;
  }
  .search-bar input {
    padding: 8px 15px 8px 35px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 795px;
    font-size: 14px;
  }
  .search-bar i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #95a5a6;
  }

  
  
  /* Button styles */
  .btn {
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: none;
  }
  .btn i {
    margin-right: 8px;
  }
  #home-btn {
    margin-right: 15px;
  }
  #refresh-btn {
    margin-left: 90px;
  }
  .btn-primary {
    background-color: #3498db;
    color: white;
  }
  .btn-primary:hover {
    background-color: #2980b9;
  }
  .btn-secondary {
    background-color: #95a5a6;
    color: white;
  }
  .btn-secondary:hover {
    background-color: #7f8c8d;
  }
  #signout-btn {
    background: linear-gradient(135deg, #6aa6ff, #7ad1ff);
    color: #0b1020;
    font-weight: 600;
    margin-left: 15px;
  }
  #signout-btn:hover {
    background: linear-gradient(135deg, #6aa6ff, #7ad1ff);
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
  .btn-success {
    background-color: #2ecc71;
    color: white;
  }
  .btn-success:hover {
    background-color: #27ae60;
  }
  .btn-danger {
    background-color: #e74c3c;
    color: white;
  }
  .btn-danger:hover {
    background-color: #c0392b;
  }
  .btn-warning {
    background-color: #f39c12;
    color: white;
  }
  .btn-warning:hover {
    background-color: #d35400;
  }
  .btn-sm {
    padding: 4px 10px;
    font-size: 12px;
  }
  
  /* Tab navigation */
  .tabs {
    display: flex;
    overflow-x: auto;
    margin-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
    white-space: nowrap;
  }
  .tab-btn {
    padding: 10px 15px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 14px;
    color: #7f8c8d;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
  }
  .tab-btn i {
    margin-right: 8px;
  }
  .tab-btn:hover {
    color: #3498db;
  }
  .tab-btn.active {
    color: #3498db;
    border-bottom-color: #3498db;
    font-weight: bold;
  }
  .count {
    display: inline-block;
    background: #eee;
    color: #666;
    border-radius: 10px;
    padding: 2px 8px;
    font-size: 12px;
    margin-left: 8px;
    font-weight: normal;
  }
  
  /* Filters section */
  .filters-container {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
  }
  .filter-group {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 10px;
  }
  .filter-item {
    min-width: 200px;
  }
  .filter-item select {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ced4da;
  }
  /* Highlight selected filters */
  .filter-item select:not([value=""]) {
    border: 2px solid #3498db;
    background-color: #e3f2fd;
  }
  .filter-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  /* Active filters display */
  .active-filters {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
  .active-filter-tag {
    background-color: #3498db;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
  }
  .active-filter-tag .remove-filter {
    margin-left: 5px;
    cursor: pointer;
    background: none;
    border: none;
    color: white;
    font-size: 14px;
  }
  .filter-results-count {
    font-weight: bold;
    color: #2c3e50;
    background-color: #ecf0f1;
    padding: 5px 10px;
    border-radius: 5px;
  }
  
  /* Table styling */
  .table-responsive {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-radius: 5px;
    margin-bottom: 20px;
  }
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  th {
    background-color: #f8f9fa;
    font-weight: bold;
    color: #2c3e50;
    position: sticky;
    top: 0;
  }
  tr:hover {
    background-color: #f5f7fa;
  }
  
  /* Priority styling */
  .priority-High {
    color: #e74c3c;
    font-weight: bold;
  }
  .priority-Medium {
    color: #f39c12;
    font-weight: bold;
  }
  .priority-Low {
    color: #2ecc71;
    font-weight: bold;
  }
  
  /* Priority Buttons */
  .priority-buttons {
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
  }
  .btn-outline-danger, .btn-outline-warning, .btn-outline-success, .btn-outline-secondary {
    background-color: transparent;
  }
  .btn-outline-danger {
    border: 1px solid #e74c3c;
    color: #e74c3c;
  }
  .btn-outline-warning {
    border: 1px solid #f39c12;
    color: #f39c12;
  }
  .btn-outline-success {
    border: 1px solid #2ecc71;
    color: #2ecc71;
  }
  .btn-outline-secondary {
    border: 1px solid #95a5a6;
    color: #95a5a6;
  }
  
  /* Status styling */
  .status-Completed {
    color: #2ecc71;
    font-weight: bold;
    background-color: rgba(46, 204, 113, 0.1);
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid rgba(46, 204, 113, 0.2);
  }
  .status-In-progress {
    color: #f39c12;
    font-weight: bold;
    background-color: rgba(243, 156, 18, 0.1);
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid rgba(243, 156, 18, 0.2);
  }
  .status-Pending {
    color: #e74c3c;
    font-weight: bold;
    background-color: rgba(231, 76, 60, 0.1);
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid rgba(231, 76, 60, 0.2);
  }
  
  /* Date highlighting */
  .date-highlight {
    font-weight: bold;
  }
  .date-today {
    color: #e74c3c;
  }
  .date-upcoming {
    color: #f39c12;
  }
  
  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .empty-state i {
    font-size: 48px;
    color: #95a5a6;
    margin-bottom: 20px;
  }
  .empty-state h3 {
    margin-bottom: 10px;
    color: #2c3e50;
  }
  .empty-state p {
    color: #7f8c8d;
    margin-bottom: 20px;
  }
  
  /* Loading spinner */
  .loading {
    text-align: center;
    padding: 40px 20px;
  }
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Serial number column */
  .serial-column {
    width: 50px;
    text-align: center;
    font-weight: bold;
  }
  
  /* Modal styles */
  .modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    overflow: auto;
  }
  .modal-content {
    background-color: white;
    margin: 50px auto;
    padding: 0;
    width: 80%;
    max-width: 800px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    animation: modalFadeIn 0.3s;
    max-height: 90vh;
    overflow-y: auto;
    /* Prevent modal from jumping to top */
    position: relative;
  }
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(-50px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 8px 8px 0 0;
  }
  .modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #2c3e50;
    display: flex;
    align-items: center;
  }
  .modal-header h2 i {
    margin-right: 10px;
    color: #3498db;
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #95a5a6;
  }
  .modal-body {
    padding: 20px;
  }
  
  /* Prayer content styling */
  .prayer-content {
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 15px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    max-height: 400px;
    overflow-y: auto;
  }
  
  /* Form styles */
  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 15px;
  }
  .form-group {
    flex: 1;
    min-width: 200px;
    margin-bottom: 15px;
  }
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #2c3e50;
  }
  .form-control {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  .form-control-textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  /* Editable synopsis field */
  .synopsis-editable {
    cursor: pointer;
    min-height: 20px;
    padding: 5px;
    border: 1px solid transparent;
  }
  .synopsis-editable:hover {
    border: 1px solid #ddd;
    background-color: #f8f9fa;
  }
  .synopsis-editable:focus {
    outline: none;
    border: 1px solid #3498db;
    background-color: white;
  }
  
  /* View link styles */
  .view-link {
    display: inline-block;
    margin-left: 10px;
  }
  
  /* Prayer link styles */
  .prayer-link {
    color: #9b59b6;
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
  }
  .prayer-link:hover {
    text-decoration: underline;
  }
  
  /* Notification styles */
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* Add missing case button styling */
  .add-missing-case-btn {
    background-color: #f39c12;
    color: white;
    margin-left: 10px;
  }
  .add-missing-case-btn:hover {
    background-color: #d35400;
  }

  /* Confirmation dialog styling */
  .confirmation-dialog {
    background-color: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 5px;
    padding: 15px;
    margin: 15px 0;
  }
  .confirmation-dialog h4 {
    color: #856404;
    margin-bottom: 10px;
  }
  .confirmation-dialog p {
    color: #856404;
    margin-bottom: 15px;
  }
  
  /* Home button styling */
  .home-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    margin-right: 15px;
  }
  .home-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
  .home-btn svg {
    width: 20px;
    height: 20px;
  }
</style>
</head>
<body>
<div class="container">
  <header>
    <div style="display: flex; align-items: center;">
      <button class="home-btn" id="home-btn" title="Home">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </button>
      <h1><i class="fas fa-balance-scale"></i>Legal Command Centre (Powered by Valuepitch)</h1>
    </div>
    <div class="header-actions">
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Search cases, parties, CNR...">
        <i class="fas fa-search"></i>
      </div>
      <button class="btn btn-primary" id="refresh-btn">
        <i class="fas fa-sync-alt"></i> Refresh
      </button>
      <button class="btn add-missing-case-btn" id="add-missing-case-btn">
        <i class="fas fa-plus-circle"></i> Add Missing Case
      </button>
      <button class="btn btn-secondary" id="signout-btn">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-right: 8px;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  </header>

  <!-- Tab Navigation -->
  <div id="tab-container" class="tabs"></div>

  <!-- Filters Section -->
  <div class="filters-container">
    <h3><i class="fas fa-filter"></i> Filters</h3>
    
    <!-- Active filters display -->
    <div id="active-filters" class="active-filters" style="display: none;">
      <span>Active Filters:</span>
      <div id="active-filter-tags"></div>
      <div id="filter-results-count" class="filter-results-count"></div>
    </div>
    
    <div class="filter-group">
      <div class="filter-item">
        <div class="filter-title">Priority</div>
        <select id="priority-filter">
          <option value="">All Priorities</option>
        </select>
      </div>
      
      <div class="filter-item">
        <div class="filter-title">Case Age</div>
        <select id="case-age-filter">
          <option value="">All Cases</option>
        </select>
      </div>
      
      <div class="filter-item">
        <div class="filter-title">Case Categories</div>
        <select id="case-category-filter">
          <option value="">All Categories</option>
          <!-- Options will be populated dynamically with counts -->
        </select>
      </div>
      
      <div class="filter-item">
        <div class="filter-title">Case Type</div>
        <select id="case-type-filter">
          <option value="">All Types</option>
          <!-- Options will be populated dynamically with counts -->
        </select>
      </div>
      
      <div class="filter-item">
        <div class="filter-title">Case Stage</div>
        <select id="case-stage-filter">
          <option value="">All Stages</option>
          <!-- Options will be populated dynamically with counts -->
        </select>
      </div>
      
      <div class="filter-item">
        <div class="filter-title">Match Keyword</div>
        <select id="match-keyword-filter">
          <option value="">All Keywords</option>
          <!-- Options will be populated dynamically with counts -->
        </select>
      </div>
      
      <div class="filter-item">
        <div class="filter-title">Court Number</div>
        <select id="court-no-filter">
          <option value="">All Courts</option>
          <!-- Options will be populated dynamically with counts -->
        </select>
      </div>
    </div>
    
    <button class="btn btn-primary" id="clear-filters-btn">
      <i class="fas fa-times-circle"></i> Clear Filters
    </button>
  </div>

  <!-- Cases Container -->
  <div id="case-container"></div>

  <!-- Prayer Modal -->
  <div id="prayer-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="fas fa-pray"></i> Case Prayer</h2>
        <button class="modal-close" onclick="closeModal('prayer-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <div id="prayer-content" class="prayer-content">
          <!-- Prayer content will be loaded here -->
        </div>
      </div>
    </div>
  </div>

  <!-- Alert Modal -->
  <div id="alert-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="fas fa-bell"></i> Send Alert</h2>
        <button class="modal-close" onclick="closeModal('alert-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="alert-to-select">Alert To</label>
          <select id="alert-to-select" class="form-control">
            <option value="">Select Department</option>
            <option value="SP, Srikakulam">SP, Srikakulam</option>
            <option value="SP, Vizianagaram">SP, Vizianagaram</option>
            <option value="SP, Parvathipuram Manyam">SP, Parvathipuram Manyam</option>
            <option value="SP, Anakapalli">SP, Anakapalli</option>
            <option value="SP, Alluri Sitharamaraju">SP, Alluri Sitharamaraju</option>
            <option value="SP, East Godavari">SP, East Godavari</option>
            <option value="SP, Kakinada">SP, Kakinada</option>
            <option value="SP, Konaseema">SP, Konaseema</option>
            <option value="SP, Eluru">SP, Eluru</option>
            <option value="SP, West Godavari">SP, West Godavari</option>
            <option value="SP, Krishna">SP, Krishna</option>
            <option value="SP, Guntur">SP, Guntur</option>
            <option value="SP, Palnadu">SP, Palnadu</option>
            <option value="SP, Prakasam">SP, Prakasam</option>
            <option value="SP, Bapatla">SP, Bapatla</option>
            <option value="SP, Nellore">SP, Nellore</option>
            <option value="SP, Kadapa">SP, Kadapa</option>
            <option value="SP, Kurnool">SP, Kurnool</option>
            <option value="SP, Nandyal">SP, Nandyal</option>
            <option value="SP, Ananthapuram">SP, Ananthapuram</option>
            <option value="SP, Chittoor">SP, Chittoor</option>
            <option value="SP, Tirupathi">SP, Tirupathi</option>
            <option value="SP, Annamayya">SP, Annamayya</option>
            <option value="SP, Sri Satya Sai">SP, Sri Satya Sai</option>
            <option value="Commandant, SAR CPL">Commandant, SAR CPL</option>
            <option value="DIG, Visakhapatnam Range">DIG, Visakhapatnam Range</option>
            <option value="IG, Eluru Range">IG, Eluru Range</option>
            <option value="IG, Guntur Range">IG, Guntur Range</option>
            <option value="DIG, Kurnool Range">DIG, Kurnool Range</option>
            <option value="DIG, Ananthapuram Range">DIG, Ananthapuram Range</option>
            <option value="PTC, Ananthapuram">PTC, Ananthapuram</option>
            <option value="PTC, Ongole">PTC, Ongole</option>
            <option value="PTC, Tirupati">PTC, Tirupati</option>
            <option value="PTC, Vizianagaram">PTC, Vizianagaram</option>
            <option value="SP, PTO">SP, PTO</option>
            <option value="IG, Coastal Security">IG, Coastal Security</option>
            <option value="SP, GRP Gunthakal">SP, GRP Gunthakal</option>
            <option value="SP, GRP Vijayawada">SP, GRP Vijayawada</option>
            <option value="IG, Provision & Logistics">IG, Provision & Logistics</option>
            <option value="IG, Personnel">IG, Personnel</option>
            <option value="IG, Training">IG, Training</option>
            <option value="IG, Sports">IG, Sports</option>
            <option value="IG, EAGLE">IG, EAGLE</option>
            <option value="IG, Home Guards">IG, Home Guards</option>
            <option value="IG, Railways">IG, Railways</option>
            <option value="JD, Accounts, DGP Office">JD, Accounts, DGP Office</option>
            <option value="DIG, Communication">DIG, Communication</option>
            <option value="IG, Technical Services">IG, Technical Services</option>
            <option value="SP, Red Sandal Task Force">SP, Red Sandal Task Force</option>
            <option value="CP, Visakhapatnam City">CP, Visakhapatnam City</option>
            <option value="CP, NTR City">CP, NTR City</option>
            <option value="ADGP, APSP Battalions">ADGP, APSP Battalions</option>
            <option value="ADGP, Operations">ADGP, Operations</option>
            <option value="ADGP, Intelligence">ADGP, Intelligence</option>
            <option value="DGP, CID">DGP, CID</option>
            <option value="Director, Police Academy">Director, Police Academy</option>
            <option value="Director, FSL">Director, FSL</option>
            <option value="Chairman, SLPRB">Chairman, SLPRB</option>
            <option value="Chief Vigilance Officer, TTD">Chief Vigilance Officer, TTD</option>
            <option value="DGP, ACB">DGP, ACB</option>
          </select>
        </div>
        
        <button class="btn btn-primary" onclick="sendAlert()">
          <i class="fas fa-paper-plane"></i> Send Alert
        </button>
      </div>
    </div>
  </div>

  <!-- Missing Case Modal -->
  <div id="missing-case-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2><i class="fas fa-plus-circle"></i> Add Missing Case</h2>
        <button class="modal-close" onclick="closeModal('missing-case-modal')">&times;</button>
      </div>
      <div class="modal-body">
        <form id="missing-case-form">
          <div class="form-row">
            <div class="form-group">
              <label for="missing-main-number">Main Number *</label>
              <input type="text" id="missing-main-number" class="form-control" required placeholder="Enter main number">
            </div>
            <div class="form-group">
              <label for="missing-court-number">Court Number *</label>
              <select id="missing-court-number" class="form-control" required>
                <option value="">Select Court Number</option>
                <option value="COURT NO. 1">COURT NO. 1</option>
                <option value="COURT NO. 2">COURT NO. 2</option>
                <option value="COURT NO. 3">COURT NO. 3</option>
                <option value="COURT NO. 4">COURT NO. 4</option>
                <option value="COURT NO. 5">COURT NO. 5</option>
                <option value="COURT NO. 6">COURT NO. 6</option>
                <option value="COURT NO. 7">COURT NO. 7</option>
                <option value="COURT NO. 8">COURT NO. 8</option>
                <option value="COURT NO. 9">COURT NO. 9</option>
                <option value="COURT NO. 10">COURT NO. 10</option>
                <option value="COURT NO. 11">COURT NO. 11</option>
                <option value="COURT NO. 12">COURT NO. 12</option>
                <option value="COURT NO. 13">COURT NO. 13</option>
                <option value="COURT NO. 14">COURT NO. 14</option>
                <option value="COURT NO. 15">COURT NO. 15</option>
                <option value="COURT NO. 16">COURT NO. 16</option>
                <option value="COURT NO. 17">COURT NO. 17</option>
                <option value="COURT NO. 18">COURT NO. 18</option>
                <option value="COURT NO. 19">COURT NO. 19</option>
                <option value="COURT NO. 20">COURT NO. 20</option>
                <option value="COURT NO. 21">COURT NO. 21</option>
                <option value="COURT NO. 22">COURT NO. 22</option>
                <option value="COURT NO. 23">COURT NO. 23</option>
                <option value="COURT NO. 24">COURT NO. 24</option>
                <option value="COURT NO. 25">COURT NO. 25</option>
                <option value="COURT NO. 26">COURT NO. 26</option>
                <option value="COURT NO. 27">COURT NO. 27</option>
                <option value="COURT NO. 28">COURT NO. 28</option>
                <option value="COURT NO. 29">COURT NO. 29</option>
                <option value="COURT NO. 30">COURT NO. 30</option>
                <option value="COURT NO. 31">COURT NO. 31</option>
               <option value="COURT NO. 32">COURT NO. 32</option>
               <option value="COURT NO. 33">COURT NO. 33</option>
             </select>
           </div>
         </div>
         
         <div class="form-group">
           <label for="missing-cause-list-date">Cause List Date *</label>
           <input type="date" id="missing-cause-list-date" class="form-control" required>
         </div>
         
         <div class="form-group">
           <label for="missing-additional-context">Additional Context</label>
           <textarea id="missing-additional-context" class="form-control form-control-textarea" placeholder="Enter any additional context or information about the missing case..."></textarea>
         </div>

         <div id="confirmation-section" class="confirmation-dialog" style="display: none;">
           <h4><i class="fas fa-question-circle"></i> Confirmation Required</h4>
           <p id="confirmation-text"></p>
           <div>
             <button type="button" class="btn btn-success" onclick="confirmAndSubmitMissingCase()">
               <i class="fas fa-check"></i> Yes, Submit
             </button>
             <button type="button" class="btn btn-secondary" onclick="hideConfirmation()">
               <i class="fas fa-times"></i> Cancel
             </button>
           </div>
         </div>
         
         <button type="submit" class="btn btn-primary" id="submit-missing-case-btn">
           <i class="fas fa-paper-plane"></i> Submit Missing Case
         </button>
       </form>
     </div>
   </div>
 </div>
</div>

<script>
 let currentDocname = '';
 let allCases = [];
 let filteredCases = [];
 let currentViewMode = 'table';
 let activeTab = 'today_cause_list';
 
 let causeDates = {
   previous: null,
   today: new Date().toISOString().split('T')[0],
   next: null,
   lastWeek: []
 };
 
 window.onload = function() {
   console.log('Initializing application...');
   renderTabs();
   renderEmptyLoading();
   
   document.getElementById('missing-cause-list-date').value = causeDates.today;
   
   document.getElementById('priority-filter').addEventListener('change', function() {
     console.log('Priority filter changed to:', this.value);
     applyFilters();
   });
   
   document.getElementById('case-age-filter').addEventListener('change', function() {
     console.log('Case age filter changed to:', this.value);
     applyFilters();
   });
   
   document.getElementById('case-category-filter').addEventListener('change', function() {
     console.log('Category filter changed to:', this.value);
     applyFilters();
   });
   
   document.getElementById('case-type-filter').addEventListener('change', function() {
     console.log('Case type filter changed to:', this.value);
     applyFilters();
   });
   
   document.getElementById('case-stage-filter').addEventListener('change', function() {
     console.log('Stage filter changed to:', this.value);
     applyFilters();
   });
   
   document.getElementById('match-keyword-filter').addEventListener('change', function() {
     console.log('Keyword filter changed to:', this.value);
     applyFilters();
   });
   
   document.getElementById('court-no-filter').addEventListener('change', function() {
     console.log('Court filter changed to:', this.value);
     applyFilters();
   });
   
   document.getElementById('clear-filters-btn').addEventListener('click', function() {
     clearFilters();
   });
   
   document.getElementById('add-missing-case-btn').addEventListener('click', function() {
     openMissingCaseModal();
   });
   
   document.getElementById('missing-case-form').addEventListener('submit', function(e) {
     e.preventDefault();
     showMissingCaseConfirmation();
   });
   
   fetchCauseDates();
 };
 
 function renderEmptyLoading() {
   console.log('Rendering loading state...');
   document.getElementById('case-container').innerHTML = \`
     <div class="loading">
       <div class="loading-spinner"></div>
       <p>Loading cases, please wait...</p>
     </div>
   \`;
 }
 
 function inNext7Days(dateStr) {
   if (!dateStr) return false;
   const date = new Date(dateStr);
   const now = new Date();
   const diff = (date - now) / (1000 * 60 * 60 * 24);
   return diff > 0 && diff <= 7;
 }
 
 function formatDate(dateStr) {
   if (!dateStr) return '';
   const date = new Date(dateStr);
   const formattedDate = dateStr;
   
   if (dateStr === causeDates.today) {
     return \`<span class="date-highlight date-today">\${formattedDate} (Today)</span>\`;
   } else if (inNext7Days(dateStr)) {
     return \`<span class="date-highlight date-upcoming">\${formattedDate}</span>\`;
   }
   
   return formattedDate;
 }
 
 async function fetchCauseDates() {
   console.log('Fetching available cause list dates...');
   
   try {
     const res = await fetch('/api/resource/CCMS3?fields=["cause_list_date"]&limit=0');
     const data = await res.json();
     
     const allDates = [...new Set(data.data
       .filter(d => d.cause_list_date)
       .map(d => d.cause_list_date))].sort();
     
     console.log(\`Found \${allDates.length} unique cause list dates\`);
     
     const today = causeDates.today;
     
     const previousDates = allDates.filter(date => date < today).sort().reverse();
     causeDates.previous = previousDates.length > 0 ? previousDates[0] : null;
     
     const nextDates = allDates.filter(date => date > today).sort();
     causeDates.next = nextDates.length > 0 ? nextDates[0] : null;
     
     causeDates.lastWeek = previousDates.slice(0, 7);
     
     console.log('Cause list dates:', causeDates);
     
     fetchCasesForActiveTab();
   } catch (error) {
     console.error('Error fetching cause list dates:', error);
     document.getElementById('case-container').innerHTML = \`
       <div class="empty-state">
         <i class="fas fa-exclamation-triangle"></i>
         <h3>Error Loading Dates</h3>
         <p>There was a problem fetching cause list dates. Please try again.</p>
         <button class="btn btn-primary" onclick="fetchCauseDates()">
           <i class="fas fa-sync-alt"></i> Retry
         </button>
       </div>
     \`;
   }
 }
 
 async function fetchCasesForActiveTab() {
   console.log(\`Fetching cases for \${activeTab}...\`);
   renderEmptyLoading();
   
   try {
     let targetDates = [];
     
     if (activeTab === 'previous_cause_list') {
       if (causeDates.previous) targetDates = [causeDates.previous];
     } else if (activeTab === 'today_cause_list') {
       targetDates = [causeDates.today];
     } else if (activeTab === 'next_cause_list') {
       if (causeDates.next) targetDates = [causeDates.next];
     } else if (activeTab === 'last_week_cause_list') {
       targetDates = causeDates.lastWeek;
     }
     
     if (targetDates.length === 0) {
       allCases = [];
       filteredCases = [];
       renderTabs();
       document.getElementById('case-container').innerHTML = \`
         <div class="empty-state">
           <i class="fas fa-calendar-times"></i>
           <h3>No Cases Found</h3>
           <p>There are no cases scheduled for this date range.</p>
         </div>
       \`;
       return;
     }
     
     console.log(\`Fetching cases for dates:\`, targetDates);
     
     let allRelevantCases = [];
     
     for (const targetDate of targetDates) {
       const res = await fetch(\`/api/resource/CCMS3?filters=[["cause_list_date","=","\${targetDate}"]]&limit=0\`);
       const data = await res.json();
       
       const relevantCases = data.data.filter(doc => (doc.relevancy || '').toLowerCase() !== 'not relevant');
       allRelevantCases = allRelevantCases.concat(relevantCases);
     }
     
     console.log(\`Found \${allRelevantCases.length} cases for selected date range\`);
     
     allCases = allRelevantCases;
     filteredCases = allCases;
     
     renderTabs();
     populateFilterOptions();
     renderCases();
     
     let processedCount = 0;
     const batchSize = 10;
    
     for (let i = 0; i < allRelevantCases.length; i += batchSize) {
       const batch = allRelevantCases.slice(i, i + batchSize);
       console.log(\`Fetching details for batch \${i/batchSize + 1} (\${batch.length} cases)\`);
       
       const batchDetails = await Promise.all(
         batch.map(doc =>
           fetch(\`/api/resource/CCMS3/\${doc.name}\`)
             .then(r => r.json())
             .then(d => {
               processedCount++;
               console.log(\`Fetched details for case \${processedCount}/\${allRelevantCases.length}\`);
               return d.data;
             })
         )
       );
       
       const fullCases = batchDetails.filter(d => (d.relevancy || '').toLowerCase() !== 'not relevant');
       
       fullCases.forEach(fullCase => {
         const index = allCases.findIndex(c => c.name === fullCase.name);
         if (index !== -1) {
           allCases[index] = fullCase;
         } else {
           allCases.push(fullCase);
         }
       });
       
       filteredCases = allCases;
       
       console.log(\`Updated UI with \${processedCount} detailed cases\`);
       renderTabs();
       populateFilterOptions();
       renderCases();
     }
     
     console.log('All case details fetched successfully');
   } catch (error) {
     console.error('Error loading cases:', error);
     document.getElementById('case-container').innerHTML = \`
       <div class="empty-state">
         <i class="fas fa-exclamation-triangle"></i>
         <h3>Error Loading Cases</h3>
         <p>There was a problem fetching case data. Please try again.</p>
         <button class="btn btn-primary" onclick="fetchCasesForActiveTab()">
           <i class="fas fa-sync-alt"></i> Retry
         </button>
       </div>
     \`;
   }
 }
 
 function renderTabs() {
   console.log('Rendering tabs with counts...');
   
   const previousCount = causeDates.previous ? allCases.filter(d => d.cause_list_date === causeDates.previous).length : 0;
   const todayCount = allCases.filter(d => d.cause_list_date === causeDates.today).length;
   const nextCount = causeDates.next ? allCases.filter(d => d.cause_list_date === causeDates.next).length : 0;
   const lastWeekCount = causeDates.lastWeek.length > 0 ? allCases.filter(d => causeDates.lastWeek.includes(d.cause_list_date)).length : 0;
   
   const previousDateText = causeDates.previous ? \` (\${causeDates.previous})\` : '';
   const nextDateText = causeDates.next ? \` (\${causeDates.next})\` : '';
   const lastWeekDateText = causeDates.lastWeek.length > 0 ? \` (\${causeDates.lastWeek.length} dates)\` : '';
   
   const tabContainer = document.getElementById('tab-container');
   tabContainer.innerHTML = \`
     <button class="tab-btn \${activeTab === 'last_week_cause_list' ? 'active' : ''}" onclick="changeTab('last_week_cause_list')">
       <i class="fas fa-calendar-week"></i> Last Week's List\${lastWeekDateText} <span class="count">\${lastWeekCount}</span>
     </button>
     <button class="tab-btn \${activeTab === 'previous_cause_list' ? 'active' : ''}" onclick="changeTab('previous_cause_list')">
       <i class="fas fa-calendar-minus"></i> Previous Cause List\${previousDateText} <span class="count">\${previousCount}</span>
     </button>
     <button class="tab-btn \${activeTab === 'today_cause_list' ? 'active' : ''}" onclick="changeTab('today_cause_list')">
       <i class="fas fa-calendar-day"></i> Today's Cause List <span class="count">\${todayCount}</span>
     </button>
     <button class="tab-btn \${activeTab === 'next_cause_list' ? 'active' : ''}" onclick="changeTab('next_cause_list')">
       <i class="fas fa-calendar-plus"></i> Next Cause List\${nextDateText} <span class="count">\${nextCount}</span>
     </button>
   \`;
   console.log('Tabs rendered with latest counts');
 }
 
 function changeTab(newTab) {
   if (newTab === activeTab) return;
   
   console.log(\`Changing tab from \${activeTab} to \${newTab}\`);
   activeTab = newTab;
   
   renderTabs();
   
   fetchCasesForActiveTab();
 }
 
 function displayActiveFilters(casesToDisplay) {
   const activeFiltersContainer = document.getElementById('active-filters');
   const activeFilterTags = document.getElementById('active-filter-tags');
   const filterResultsCount = document.getElementById('filter-results-count');
   
   const activeFilters = [];
   
   const priorityFilter = document.getElementById('priority-filter')?.value;
   const caseAgeFilter = document.getElementById('case-age-filter')?.value;
   const categoryFilter = document.getElementById('case-category-filter')?.value;
   const caseTypeFilter = document.getElementById('case-type-filter')?.value;
   const stageFilter = document.getElementById('case-stage-filter')?.value;
   const keywordFilter = document.getElementById('match-keyword-filter')?.value;
   const courtFilter = document.getElementById('court-no-filter')?.value;
   const searchQuery = document.getElementById('search-input')?.value;
   
   if (priorityFilter) activeFilters.push({ type: 'priority', value: priorityFilter, label: \`Priority: \${priorityFilter}\` });
   if (caseAgeFilter) {
     const ageLabel = caseAgeFilter === "1" ? "New Cases" : "Old/Repeat Cases";
     activeFilters.push({ type: 'case-age', value: caseAgeFilter, label: \`Age: \${ageLabel}\` });
   }
   if (categoryFilter) activeFilters.push({ type: 'category', value: categoryFilter, label: \`Category: \${categoryFilter}\` });
   if (caseTypeFilter) activeFilters.push({ type: 'case-type', value: caseTypeFilter, label: \`Type: \${caseTypeFilter}\` });
   if (stageFilter) activeFilters.push({ type: 'stage', value: stageFilter, label: \`Stage: \${stageFilter}\` });
   if (keywordFilter) activeFilters.push({ type: 'keyword', value: keywordFilter, label: \`Keyword: \${keywordFilter}\` });
   if (courtFilter) activeFilters.push({ type: 'court', value: courtFilter, label: \`Court: \${courtFilter}\` });
   if (searchQuery) activeFilters.push({ type: 'search', value: searchQuery, label: \`Search: "\${searchQuery}"\` });
   
   if (activeFilters.length === 0) {
     activeFiltersContainer.style.display = 'none';
     return;
   }
   
   activeFiltersContainer.style.display = 'flex';
   
   activeFilterTags.innerHTML = activeFilters.map(filter => \`
     <div class="active-filter-tag">
       \${filter.label}
       <button class="remove-filter" onclick="removeFilter('\${filter.type}')">×</button>
     </div>
   \`).join('');
   
   filterResultsCount.textContent = \`Showing \${casesToDisplay.length} cases\`;
 }
 
 function removeFilter(filterType) {
   console.log(\`Removing filter: \${filterType}\`);
   
   switch(filterType) {
     case 'priority':
       document.getElementById('priority-filter').value = '';
       break;
     case 'case-age':
       document.getElementById('case-age-filter').value = '';
       break;
     case 'category':
       document.getElementById('case-category-filter').value = '';
       break;
     case 'case-type':
       document.getElementById('case-type-filter').value = '';
       break;
     case 'stage':
       document.getElementById('case-stage-filter').value = '';
       break;
     case 'keyword':
       document.getElementById('match-keyword-filter').value = '';
       break;
     case 'court':
       document.getElementById('court-no-filter').value = '';
       break;
     case 'search':
       document.getElementById('search-input').value = '';
       break;
   }
   
   applyFilters();
 }
 
 function populateFilterOptions() {
   console.log('Populating filter options with counts...');
   
   let currentCases = getCurrentTabCases();
   
   const prioritySelect = document.getElementById('priority-filter');
   if (prioritySelect) {
     const currentValue = prioritySelect.value;
     prioritySelect.innerHTML = '<option value="">All Priorities</option>';
     const priorityOptions = ['High', 'Medium', 'Low'];
     priorityOptions.forEach(priority => {
       const count = currentCases.filter(d => (d.priority || '').toUpperCase() === priority.toUpperCase()).length;
       const option = document.createElement('option');
       option.value = priority;
       option.textContent = \`\${priority} (\${count})\`;
       prioritySelect.appendChild(option);
     });
     prioritySelect.value = currentValue;
   }
   
   const caseAgeSelect = document.getElementById('case-age-filter');
   if (caseAgeSelect) {
     const currentValue = caseAgeSelect.value;
     caseAgeSelect.innerHTML = '<option value="">All Cases</option>';
     
     const newCaseCount = currentCases.filter(d => d.old_new === 1 || d.old_new === '1').length;
     const oldCaseCount = currentCases.filter(d => d.old_new === 0 || d.old_new === '0' || d.old_new === null).length;
     
     const newOption = document.createElement('option');
     newOption.value = "1";
     newOption.textContent = \`New Cases (\${newCaseCount})\`;
     caseAgeSelect.appendChild(newOption);
     
     const oldOption = document.createElement('option');
     oldOption.value = "0";
     oldOption.textContent = \`Old/Repeat Cases (\${oldCaseCount})\`;
     caseAgeSelect.appendChild(oldOption);
     caseAgeSelect.value = currentValue;
   }
   
   const categorySelect = document.getElementById('case-category-filter');
   if (categorySelect) {
     const currentValue = categorySelect.value;
     categorySelect.innerHTML = '<option value="">All Categories</option>';
     const categoryOptions = ['NON-SERVICE', 'SERVICE', 'NA'];
     categoryOptions.forEach(category => {
       const count = currentCases.filter(d => (d.case_categories || '').toUpperCase() === category).length;
       const option = document.createElement('option');
       option.value = category;
       option.textContent = \`\${category} (\${count})\`;
       categorySelect.appendChild(option);
     });
     categorySelect.value = currentValue;
   }
   
   const caseTypeSelect = document.getElementById('case-type-filter');
   if (caseTypeSelect) {
     const currentValue = caseTypeSelect.value;
     caseTypeSelect.innerHTML = '<option value="">All Types</option>';
     
     const caseTypes = {};
     currentCases.forEach(d => {
       if (d.case_type) {
         const caseType = d.case_type.toUpperCase();
         caseTypes[caseType] = (caseTypes[caseType] || 0) + 1;
       }
     });
     
     Object.keys(caseTypes).sort().forEach(caseType => {
       const option = document.createElement('option');
       option.value = caseType;
       option.textContent = \`\${caseType} (\${caseTypes[caseType]})\`;
       caseTypeSelect.appendChild(option);
     });
     caseTypeSelect.value = currentValue;
   }
   
   const stageSelect = document.getElementById('case-stage-filter');
   if (stageSelect) {
     const currentValue = stageSelect.value;
     stageSelect.innerHTML = '<option value="">All Stages</option>';
     
     const caseStages = {};
     currentCases.forEach(d => {
       if (d.case_stage) {
         const caseStage = d.case_stage.toUpperCase();
         caseStages[caseStage] = (caseStages[caseStage] || 0) + 1;
       }
     });
     
     Object.keys(caseStages).sort().forEach(caseStage => {
       const option = document.createElement('option');
       option.value = caseStage;
       option.textContent = \`\${caseStage} (\${caseStages[caseStage]})\`;
       stageSelect.appendChild(option);
     });
     stageSelect.value = currentValue;
   }
   
   const keywordSelect = document.getElementById('match-keyword-filter');
   if (keywordSelect) {
     const currentValue = keywordSelect.value;
     keywordSelect.innerHTML = '<option value="">All Keywords</option>';
     
     const matchKeywords = {};
     currentCases.forEach(d => {
       if (d.match_keyword) {
         const keywords = d.match_keyword.split(',').map(kw => kw.trim());
         
         keywords.forEach(keyword => {
           if (keyword) {
             matchKeywords[keyword] = (matchKeywords[keyword] || 0) + 1;
           }
         });
       }
     });
     
     Object.keys(matchKeywords).sort().forEach(keyword => {
       const option = document.createElement('option');
       option.value = keyword;
       option.textContent = \`\${keyword} (\${matchKeywords[keyword]})\`;
       keywordSelect.appendChild(option);
     });
     keywordSelect.value = currentValue;
   }
   
   const courtSelect = document.getElementById('court-no-filter');
   if (courtSelect) {
     const currentValue = courtSelect.value;
     courtSelect.innerHTML = '<option value="">All Courts</option>';
     const courtOptions = Array.from({length: 33}, (_, i) => \`COURT NO. \${i+1}\`);
     courtOptions.push('NA');
     
     courtOptions.forEach(court => {
       const count = currentCases.filter(d => (d.court_no || '').toUpperCase() === court).length;
       const option = document.createElement('option');
       option.value = court;
       option.textContent = \`\${court} (\${count})\`;
       courtSelect.appendChild(option);
     });
     courtSelect.value = currentValue;
   }
   
   console.log('Filter options populated with counts for the current tab');
 }
 
 function getCurrentTabCases() {
   let targetDates = [];
   
   if (activeTab === 'previous_cause_list') {
     if (causeDates.previous) targetDates = [causeDates.previous];
   } else if (activeTab === 'today_cause_list') {
     targetDates = [causeDates.today];
   } else if (activeTab === 'next_cause_list') {
     if (causeDates.next) targetDates = [causeDates.next];
   } else if (activeTab === 'last_week_cause_list') {
     targetDates = causeDates.lastWeek;
   }
   
   return targetDates.length > 0 ? allCases.filter(d => targetDates.includes(d.cause_list_date)) : [];
 }
 
 function clearFilters() {
   console.log('Clearing all filters');
   const filters = [
     'priority-filter',
     'case-age-filter',
     'case-category-filter',
     'case-type-filter',
     'case-stage-filter',
     'match-keyword-filter',
     'court-no-filter',
     'search-input'
   ];
   
   filters.forEach(id => {
     const element = document.getElementById(id);
     if (element) element.value = '';
   });
   
   applyFilters();
 }
 
 function applyFilters() {
   console.log('Applying filters...');
   renderCases();
 }
 
 function renderCases() {
   console.log(\`Rendering cases for \${activeTab}...\`);
   
   const container = document.getElementById('case-container');
   
   let casesToDisplay = getCurrentTabCases();
   
   console.log(\`Found \${casesToDisplay.length} cases for the current tab\`);
   
   const priorityFilter = document.getElementById('priority-filter')?.value;
   const caseAgeFilter = document.getElementById('case-age-filter')?.value;
   const categoryFilter = document.getElementById('case-category-filter')?.value;
   const caseTypeFilter = document.getElementById('case-type-filter')?.value;
   const stageFilter = document.getElementById('case-stage-filter')?.value;
   const keywordFilter = document.getElementById('match-keyword-filter')?.value;
   const courtFilter = document.getElementById('court-no-filter')?.value;
   
   console.log('Active filters:', {
     tab: activeTab,
     priority: priorityFilter,
     caseAge: caseAgeFilter,
     category: categoryFilter,
     caseType: caseTypeFilter,
     stage: stageFilter,
     keyword: keywordFilter,
     court: courtFilter
   });
   
   if (priorityFilter) {
     console.log(\`Applying priority filter: \${priorityFilter}\`);
     const before = casesToDisplay.length;
     casesToDisplay = casesToDisplay.filter(d => 
       (d.priority || '').toLowerCase() === priorityFilter.toLowerCase()
     );
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by priority\`);
   }
   
   if (caseAgeFilter) {
     console.log(\`Applying case age filter: \${caseAgeFilter}\`);
     const before = casesToDisplay.length;
     if (caseAgeFilter === "1") {
       casesToDisplay = casesToDisplay.filter(d => d.old_new === 1 || d.old_new === '1');
     } else if (caseAgeFilter === "0") {
       casesToDisplay = casesToDisplay.filter(d => d.old_new === 0 || d.old_new === '0' || d.old_new === null);
     }
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by case age\`);
   }
   
   if (categoryFilter) {
     console.log(\`Applying category filter: \${categoryFilter}\`);
     const before = casesToDisplay.length;
     casesToDisplay = casesToDisplay.filter(d => (d.case_categories || '').toUpperCase() === categoryFilter);
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by category\`);
   }
   
   if (caseTypeFilter) {
       console.log(\`Applying case type filter: \${caseTypeFilter}\`);
     const before = casesToDisplay.length;
     casesToDisplay = casesToDisplay.filter(d => (d.case_type || '').toUpperCase() === caseTypeFilter);
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by case type\`);
   }
   
   if (stageFilter) {
     console.log(\`Applying stage filter: \${stageFilter}\`);
     const before = casesToDisplay.length;
     casesToDisplay = casesToDisplay.filter(d => (d.case_stage || '').toUpperCase() === stageFilter);
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by stage\`);
   }
   
   if (keywordFilter) {
     console.log(\`Applying keyword filter: \${keywordFilter}\`);
     const before = casesToDisplay.length;
     casesToDisplay = casesToDisplay.filter(d => {
       return d.match_keyword && d.match_keyword.split(',').map(kw => kw.trim()).includes(keywordFilter);
     });
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by keyword\`);
   }
   
   if (courtFilter) {
     console.log(\`Applying court filter: \${courtFilter}\`);
     const before = casesToDisplay.length;
     casesToDisplay = casesToDisplay.filter(d => (d.court_no || '').toUpperCase() === courtFilter);
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by court\`);
   }
   
   const searchQuery = document.getElementById('search-input')?.value.toLowerCase();
   if (searchQuery) {
       console.log(\`Filtering by search query: \${searchQuery}\`);
     const before = casesToDisplay.length;
     casesToDisplay = casesToDisplay.filter(d => 
       (d.case_type && d.case_type.toLowerCase().includes(searchQuery)) ||
       (d.pet_name && d.pet_name.toLowerCase().includes(searchQuery)) ||
       (d.res_name && d.res_name.toLowerCase().includes(searchQuery)) ||
       (d.cnr && d.cnr.toLowerCase().includes(searchQuery)) ||
       (d.filing_no && d.filing_no.toLowerCase().includes(searchQuery))
     );
     console.log(\`Filtered from \${before} to \${casesToDisplay.length} cases by search query\`);
   }
   
   displayActiveFilters(casesToDisplay);
   
   populateFilterOptions();
   
   if (casesToDisplay.length === 0) {
     container.innerHTML = \`
       <div class="empty-state">
         <i class="fas fa-search"></i>
         <h3>No Cases Found</h3>
         <p>No cases match your current filter criteria.</p>
         <button class="btn btn-primary" onclick="clearFilters()">
           <i class="fas fa-times-circle"></i> Clear Filters
         </button>
       </div>
     \`;
     return;
   }
   
   renderTableView(casesToDisplay, container);
 }
 
 function renderTableView(cases, container) {
   console.log(\`Rendering \${cases.length} cases in table view\`);
   
   const sortedCases = cases.sort((a, b) => {
     const courtA = a.court_no || '';
     const courtB = b.court_no || '';
     const courtComparison = courtA.localeCompare(courtB);
     
     if (courtComparison !== 0) {
       return courtComparison;
     }
     
     const itemA = parseInt(a.item_no) || 0;
     const itemB = parseInt(b.item_no) || 0;
     return itemA - itemB;
   });
   
   container.innerHTML = \`
     <div class="table-responsive">
       <table>
         <thead>
           <tr>
             <th class="serial-column">#</th>
             <th>Item No</th>
             <th>Case Info</th>
             <th>Parties</th>
             <th>AI Synopsis</th>
             <th>Last Proceedings</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody id="cases-table-body"></tbody>
       </table>
     </div>
   \`;
   
   const tableBody = document.getElementById('cases-table-body');
   
   sortedCases.forEach((caseDoc, index) => {
     const tr = document.createElement('tr');
     
     const viewLink = caseDoc.s3_html_link ? 
       \`<a href="\${caseDoc.s3_html_link}" target="_blank" class="btn btn-sm btn-primary view-link">
         <i class="fas fa-external-link-alt"></i> View
       </a>\` : '';
     
     const viewPrayerLink = caseDoc.prayer ? 
       \`<span class="prayer-link" onclick="openPrayerModal('\${caseDoc.name}'); event.preventDefault(); return false;">
         View Prayer
       </span>\` : '';
     
     const orderLink = caseDoc.order_link ? 
       \`<a href="\${caseDoc.order_link}" target="_blank" class="btn btn-sm btn-success">
         <i class="fas fa-gavel"></i> View Order
       </a>\` : '';
     
     const caseAgeTag = caseDoc.old_new === 1 || caseDoc.old_new === '1' ? 
       '<span class="status-In-progress">New Case</span>' : 
       '<span class="status-Completed">Repeat Case</span>';
     
     const priorityClass = caseDoc.priority ? \`priority-\${caseDoc.priority}\` : '';
     const priorityTag = caseDoc.priority ? 
       \`<span class="\${priorityClass}">\${caseDoc.priority} Priority</span>\` : '';
     
     const categoryDisplay = caseDoc.case_categories || 'N/A';
     const mainNumberDisplay = caseDoc.main_number ? \` | Main #: \${caseDoc.main_number}\` : '';
     
     tr.innerHTML = \`
       <td class="serial-column">\${index + 1}</td>
       <td>\${caseDoc.item_no || 'N/A'}</td>
       <td>
         <strong>\${caseDoc.case_type || 'Unnamed Case'}</strong> \${viewLink}
         <br>\${caseDoc.case_status || 'Unknown'} @ \${caseDoc.case_stage || 'Unknown'}
         <br>Category: \${categoryDisplay}\${mainNumberDisplay} \${caseAgeTag}
         <br><strong>Court:</strong> \${caseDoc.court_no || 'Unknown'}
         <br>\${caseDoc.court_number_and_judge || 'N/A'}
         <br><strong>Next:</strong> \${formatDate(caseDoc.next_hearing_date)}
         \${caseDoc.cause_list_date ? \`<br><strong>Cause List:</strong> \${formatDate(caseDoc.cause_list_date)}\` : ''}
         \${priorityTag ? \`<br>\${priorityTag}\` : ''}
         \${viewPrayerLink ? \`<br>\${viewPrayerLink}\` : ''}
       </td>
       <td>
         <strong>Pet:</strong> \${caseDoc.pet_name || 'Unknown'}
         <br><strong>Res:</strong> \${caseDoc.res_name || 'Unknown'}
       </td>
       <td>
         <div class="synopsis-editable" contenteditable="true" oninput="saveEdits('\${caseDoc.name}', this.innerText)" tabindex="0">
           \${caseDoc.synopsis || 'Click to edit'}
         </div>
       </td>
       <td>
         \${caseDoc.last_proceedings || 'No proceedings recorded'} 
         \${orderLink}
       </td>
       <td>
         <button class="btn btn-danger btn-sm" onclick="setHighPriority('\${caseDoc.name}')">
           <i class="fas fa-exclamation-circle"></i> High Priority
         </button>
         <br>
         <button class="btn btn-primary btn-sm" onclick="openAlertModal('\${caseDoc.name}')">
           <i class="fas fa-bell"></i> Send Alert
         </button>
       </td>
     \`;
     tableBody.appendChild(tr);
   });
 }
 
 function openPrayerModal(docname) {
   console.log(\`Opening prayer modal for case \${docname}\`);
   
   const currentCase = allCases.find(c => c.name === docname);
   if (currentCase && currentCase.prayer) {
     document.getElementById('prayer-content').textContent = currentCase.prayer;
   } else {
     document.getElementById('prayer-content').textContent = 'No prayer content available for this case.';
   }
   
   event.preventDefault();
   event.stopPropagation();
   
   openModal('prayer-modal');
   
   return false;
 }
 
 function openMissingCaseModal() {
   console.log('Opening missing case modal');
   
   document.getElementById('missing-case-form').reset();
   
   document.getElementById('missing-cause-list-date').value = causeDates.today;
   
   document.getElementById('confirmation-section').style.display = 'none';
   document.getElementById('submit-missing-case-btn').style.display = 'inline-flex';
   
   openModal('missing-case-modal');
 }
 
 function showMissingCaseConfirmation() {
   const mainNumber = document.getElementById('missing-main-number').value;
   const courtNumber = document.getElementById('missing-court-number').value;
   const causeListDate = document.getElementById('missing-cause-list-date').value;
   
   if (!mainNumber || !courtNumber || !causeListDate) {
     showNotification('Please fill in all required fields', 'error');
     return;
   }
   
   const isTodaysCauseList = causeListDate === causeDates.today;
   
   const confirmationText = isTodaysCauseList 
     ? \`Are you sure you want to submit this missing case for TODAY'S cause list (\${causeListDate})?\`
     : \`Are you sure you want to submit this missing case for \${causeListDate}? This is NOT today's cause list.\`;
   
   document.getElementById('confirmation-text').textContent = confirmationText;
   document.getElementById('confirmation-section').style.display = 'block';
   document.getElementById('submit-missing-case-btn').style.display = 'none';
 }
 
 function hideConfirmation() {
   document.getElementById('confirmation-section').style.display = 'none';
   document.getElementById('submit-missing-case-btn').style.display = 'inline-flex';
 }
 
 function confirmAndSubmitMissingCase() {
   const mainNumber = document.getElementById('missing-main-number').value;
   const courtNumber = document.getElementById('missing-court-number').value;
   const causeListDate = document.getElementById('missing-cause-list-date').value;
   const additionalContext = document.getElementById('missing-additional-context').value;
   
   console.log('Submitting missing case:', {
     mainNumber,
     courtNumber,
     causeListDate,
     additionalContext
   });
   
   const webhookData = {
     missing_case_main_number: mainNumber,
     court_number: courtNumber,
     cause_list_date: causeListDate,
     additional_context: additionalContext,
     is_todays_cause_list: causeListDate === causeDates.today,
     submitted_at: new Date().toISOString(),
     submitted_by: 'Legal Command Centre User'
   };
   
   fetch('https://automation.lendingcube.ai/webhook/missing-cases', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(webhookData)
   })
   .then(response => {
     if (!response.ok) {
       throw new Error('Webhook response was not ok');
     }
     return response.text();
   })
   .then(responseText => {
     console.log('Missing case webhook response:', responseText);
     
     showNotification('Missing case submitted successfully');
     closeModal('missing-case-modal');
     
     document.getElementById('missing-case-form').reset();
     document.getElementById('missing-cause-list-date').value = causeDates.today;
   })
   .catch(error => {
     console.error('Error submitting missing case:', error);
     showNotification('Failed to submit missing case: ' + error.message, 'error');
   });
 }
 
 function setHighPriority(docname) {
   console.log(\`Setting priority for case \${docname} to High\`);
   
   fetch(\`/api/resource/CCMS3/\${docname}\`, {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
       'X-Frappe-CSRF-Token': frappe.csrf_token || getCookie('csrftoken')
     },
     body: JSON.stringify({ 
       priority: 'High',
       synopsis_status: 'Pending' 
     })
   })
   .then(response => {
     if (!response.ok) {
       throw new Error('Network response was not ok');
     }
     return response.json();
   })
   .then(() => {
     console.log(\`Successfully updated priority to High and synopsis_status to ready to create\`);
     const caseIndex = allCases.findIndex(c => c.name === docname);
     if (caseIndex >= 0) {
       allCases[caseIndex].priority = 'High';
       allCases[caseIndex].synopsis_status = 'ready to create';
     }
     
     renderTabs();
     renderCases();
     
     showNotification('Priority set to High');
   })
   .catch(error => {
     console.error('Error updating priority:', error);
     showNotification('Failed to update priority', 'error');
   });
 }
 
 function saveEdits(docname, newSynopsis) {
   console.log(\`Saving synopsis for case \${docname}\`);
   
   clearTimeout(window.synopsisTimeout);
   window.synopsisTimeout = setTimeout(() => {
     fetch(\`/api/resource/CCMS3/\${docname}\`, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json',
         'X-Frappe-CSRF-Token': frappe.csrf_token || getCookie('csrftoken')
       },
       body: JSON.stringify({ synopsis: newSynopsis })
     })
     .then(response => {
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       return response.json();
     })
     .then(() => {
       console.log('Successfully updated synopsis');
       const caseIndex = allCases.findIndex(c => c.name === docname);
       if (caseIndex >= 0) {
         allCases[caseIndex].synopsis = newSynopsis;
       }
     })
     .catch(error => {
       console.error('Error updating synopsis:', error);
     });
   }, 1000);
 }
 
 function openAlertModal(docname) {
   console.log(\`Opening alert modal for case \${docname}\`);
   currentDocname = docname;
   
   const currentCase = allCases.find(c => c.name === docname);
   if (currentCase && currentCase.alert_to) {
     const selectElement = document.getElementById('alert-to-select');
     const matchingOption = Array.from(selectElement.options).find(option => 
       option.value === currentCase.alert_to
     );
     
     if (matchingOption) {
       selectElement.value = currentCase.alert_to;
     } else {
       selectElement.value = '';
     }
   } else {
     document.getElementById('alert-to-select').value = '';
   }
   
   openModal('alert-modal');
 }
 
 function sendAlert() {
   const alertTo = document.getElementById('alert-to-select').value;
   
   if (!alertTo) {
     showNotification('Please select a department', 'error');
     return;
   }
   
   console.log(\`Sending alert for case \${currentDocname} to \${alertTo}\`);
   
   const caseDoc = allCases.find(c => c.name === currentDocname);
   if (!caseDoc) {
     showNotification('Case data not found', 'error');
     return;
   }
   
   const webhookData = {
     _id: caseDoc.name,
     case_info: {
       case_type: caseDoc.case_type,
       case_status: caseDoc.case_status,
       case_stage: caseDoc.case_stage,
       case_categories: caseDoc.case_categories,
       item_no: caseDoc.item_no
     },
     parties: {
       pet_name: caseDoc.pet_name,
       res_name: caseDoc.res_name
     },
     court_info: {
       court_no: caseDoc.court_no,
       court_number_and_judge: caseDoc.court_number_and_judge
     },
     timeline: {
       filing_date: caseDoc.filing_date,
       next_hearing_date: caseDoc.next_hearing_date,
       cause_list_date: caseDoc.cause_list_date
     },
     last_proceedings: caseDoc.last_proceedings,
     synopsis: caseDoc.synopsis,
     alert_to: alertTo
   };
   
   fetch('https://lead.marketleap.in/webhook/synopsis1', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(webhookData)
   })
   .then(response => {
     if (!response.ok) {
       throw new Error('Webhook response was not ok');
     }
     return response.text();
   })
   .then(responseText => {
     console.log('Webhook response:', responseText);
     
     console.log('Alert sent successfully');
     showNotification('Alert sent successfully');
     closeModal('alert-modal');
   })
   .catch(error => {
     console.error('Error sending alert:', error);
     showNotification('Failed to send alert: ' + error.message, 'error');
   });
 }
 
 function openModal(modalId) {
   console.log(\`Opening modal: \${modalId}\`);
   document.getElementById(modalId).style.display = 'block';
   document.body.style.overflow = 'hidden';
 }
 
 function closeModal(modalId) {
   console.log(\`Closing modal: \${modalId}\`);
   document.getElementById(modalId).style.display = 'none';
   document.body.style.overflow = '';
 }
 
 function showNotification(message, type = 'success') {
   console.log(\`Showing notification: \${message} (\${type})\`);
   let container = document.getElementById('notification-container');
   if (!container) {
     container = document.createElement('div');
     container.id = 'notification-container';
     container.style.position = 'fixed';
     container.style.top = '20px';
     container.style.right = '20px';
     container.style.zIndex = '1000';
     document.body.appendChild(container);
   }
   
   const notification = document.createElement('div');
   notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
   notification.style.color = 'white';
   notification.style.padding = '12px 20px';
   notification.style.marginBottom = '10px';
   notification.style.borderRadius = '4px';
   notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
   notification.style.display = 'flex';
   notification.style.alignItems = 'center';
   notification.style.justifyContent = 'space-between';
   notification.style.minWidth = '250px';
   notification.style.animation = 'slideIn 0.3s ease-out';
   
   const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
   
   notification.innerHTML = \`
     <div style="display: flex; align-items: center;">
       <i class="\${icon}" style="margin-right: 10px;"></i>
       <span>\${message}</span>
     </div>
     <button style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">
       <i class="fas fa-times"></i>
     </button>
   \`;
   
   container.appendChild(notification);
   
   const closeBtn = notification.querySelector('button');
   closeBtn.addEventListener('click', () => {
     container.removeChild(notification);
   });
   
   setTimeout(() => {
     if (container.contains(notification)) {
       container.removeChild(notification);
     }
   }, 5000);
 }
 
 function getCookie(name) {
   const value = \`; \${document.cookie}\`;
   const parts = value.split(\`; \${name}=\`);
   if (parts.length === 2) return parts.pop().split(';').shift();
 }
 
 document.getElementById('search-input').addEventListener('input', debounce(() => {
   console.log('Search input changed');
   renderCases();
}, 300));

// Event listener for home button
document.getElementById('home-btn').addEventListener('click', () => {
  window.location.href = '/todaycauselist';
});
 
document.getElementById('refresh-btn').addEventListener('click', () => {
  console.log('Refresh button clicked');
  fetchCauseDates();
});

 document.getElementById('home-btn').addEventListener('click', () => {
   window.location.href = '/todaycauselist';
 });

 document.getElementById('signout-btn').addEventListener('click', async () => {
   try {
     const response = await fetch('/api/auth/logout', {
       method: 'POST',
       credentials: 'include'
     });
     
     if (response.ok) {
       localStorage.removeItem('lcc_ap_remember');
       window.location.href = '/';
     } else {
       console.error('Logout failed');
       window.location.href = '/';
     }
   } catch (error) {
     console.error('Logout error:', error);
     window.location.href = '/';
   }
 });
 
 window.addEventListener('click', (event) => {
   const alertModal = document.getElementById('alert-modal');
   const prayerModal = document.getElementById('prayer-modal');
   const missingCaseModal = document.getElementById('missing-case-modal');
   
   if (event.target === alertModal) {
     closeModal('alert-modal');
   }
   if (event.target === prayerModal) {
     closeModal('prayer-modal');
   }
   if (event.target === missingCaseModal) {
     closeModal('missing-case-modal');
   }
 });
 
 document.addEventListener('keydown', (e) => {
   if (e.key === 'Escape') {
     console.log('Escape key pressed, closing any open modals');
     closeModal('alert-modal');
     closeModal('prayer-modal');
     closeModal('missing-case-modal');
   }
 });
 
 function debounce(func, delay) {
   let timer;
   return function() {
     const context = this;
     const args = arguments;
     clearTimeout(timer);
     timer = setTimeout(() => func.apply(context, args), delay);
   };
 }
</script>
</body>
</html>
` }} />
  )
}

