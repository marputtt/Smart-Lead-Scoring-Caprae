import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import CSVUploader from './components/CSVUploader';
import LeadDetailModal from './components/LeadDetailModal';
import { calculateLeadScore, categorizeLead } from './utils/scoringEngine';

function App() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    location: '',
    productCategory: '',
    businessType: '',
    scoreRange: [0, 100],
    showUncontactedOnly: false
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('leadScoringData');
    if (savedLeads) {
      const parsedLeads = JSON.parse(savedLeads);
      setLeads(parsedLeads);
      setFilteredLeads(parsedLeads);
    }
  }, []);

  // Save data to localStorage whenever leads change
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('leadScoringData', JSON.stringify(leads));
    }
  }, [leads]);

  // Apply filters whenever filters or leads change
  useEffect(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = (lead.company || '').toLowerCase().includes(filters.search.toLowerCase());
      const matchesIndustry = !filters.industry || lead.industry === filters.industry;
      const matchesLocation = !filters.location || lead.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCategory = !filters.productCategory || lead.productCategory === filters.productCategory;
      const matchesBusinessType = !filters.businessType || lead.businessType === filters.businessType;
      const matchesScore = lead.rawScore >= filters.scoreRange[0] && lead.rawScore <= filters.scoreRange[1];
      const matchesContacted = !filters.showUncontactedOnly || !lead.contacted;
      
      return matchesSearch && matchesIndustry && matchesLocation && matchesCategory && matchesBusinessType && matchesScore && matchesContacted;
    });
    setFilteredLeads(filtered);
  }, [leads, filters]);

  const handleCSVUpload = (csvData) => {
    const processedLeads = csvData.map(row => {
      const lead = {
        id: Math.random().toString(36).substr(2, 9),
        company: row['Company'] || 'Unknown Company',
        website: row['Website'] || '',
        industry: row['Industry'] || 'Unknown',
        productCategory: row['Product/Service Category'] || '',
        businessType: row['Business Type (B2B B2B2C)'] || '',
        employeeCount: parseInt(row['Employees Count'] || '0'),
        revenue: row['Revenue'] || '',
        yearFounded: row['Year Founded'] || '',
        bbbRating: row['BBB Rating'] || '',
        street: row['Street'] || '',
        city: row['City'] || '',
        state: row['State'] || '',
        companyPhone: row['Company Phone'] || '',
        companyLinkedIn: row['Company LinkedIn'] || '',
        ownerFirstName: row["Owner's First Name"] || '',
        ownerLastName: row["Owner's Last Name"] || '',
        ownerTitle: row["Owner's Title"] || '',
        ownerLinkedIn: row["Owner's LinkedIn"] || '',
        ownerPhone: row["Owner's Phone Number"] || '',
        ownerEmail: row["Owner's Email"] || '',
        source: row['Source'] || '',
        contacted: false,
        notes: '',
        uploadDate: new Date().toISOString(),
        location: `${row['City'] || ''}, ${row['State'] || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Unknown',
      };

      // Calculate score and add score components
      const scoreData = calculateLeadScore(lead);
      lead.rawScore = scoreData.totalScore;
      lead.scoreComponents = scoreData.components;
      lead.priorityLevel = categorizeLead(scoreData.totalScore);

      return lead;
    });

    setLeads(processedLeads);
  };

  const handleLeadUpdate = (updatedLead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    // Clear all data
    setLeads([]);
    setFilteredLeads([]);
    setSelectedLead(null);
    
    // Reset filters to default
    setFilters({
      search: '',
      industry: '',
      location: '',
      productCategory: '',
      businessType: '',
      scoreRange: [0, 100],
      showUncontactedOnly: false
    });
    
    // Clear localStorage
    localStorage.removeItem('leadScoringData');
    
    // Close confirmation dialog
    setShowResetConfirm(false);
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Smart Lead Scoring & Qualification Tool</h1>
        <div className="header-actions">
          {leads.length > 0 && (
            <button 
              className="btn btn-outline"
              onClick={handleReset}
              title="Clear all data and start fresh"
            >
              🔄 Reset
            </button>
          )}
          <CSVUploader onUpload={handleCSVUpload} />
        </div>
      </header>

      <main className="app-main">
        {leads.length === 0 ? (
          <div className="welcome-screen">
            <h2>Welcome to Smart Lead Scoring</h2>
            <p>Upload your CSV file to get started with intelligent lead scoring and qualification.</p>
            <CSVUploader onUpload={handleCSVUpload} />
          </div>
        ) : (
          <Dashboard 
            leads={filteredLeads}
            allLeads={leads}
            filters={filters}
            onFilterChange={handleFilterChange}
            onLeadSelect={setSelectedLead}
            onLeadUpdate={handleLeadUpdate}
          />
        )}
      </main>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleLeadUpdate}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="reset-modal">
            <div className="reset-modal-header">
              <h3>⚠️ Confirm Reset</h3>
            </div>
            <div className="reset-modal-content">
              <p>Are you sure you want to reset all data?</p>
              <p><strong>This will permanently delete:</strong></p>
              <ul>
                <li>All uploaded lead data ({leads.length} leads)</li>
                <li>All scoring information</li>
                <li>Contact status and notes</li>
                <li>Applied filters</li>
              </ul>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="reset-modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={cancelReset}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={confirmReset}
                style={{ backgroundColor: '#ef4444' }}
              >
                🗑️ Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
