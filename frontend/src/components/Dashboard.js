import React, { useState, useMemo } from 'react';
import './Dashboard.css';
import LeadCard from './LeadCard';
import FilterPanel from './FilterPanel';
import StatsCards from './StatsCards';
import ScoreDistribution from './ScoreDistribution';
import SmartInsights from './SmartInsights';
import ExportPanel from './ExportPanel';

const Dashboard = ({ 
  leads, 
  allLeads, 
  filters, 
  onFilterChange, 
  onLeadSelect, 
  onLeadUpdate 
}) => {
  const [sortBy, setSortBy] = useState('score'); // score, alphabetical, industry
  const [showInsights, setShowInsights] = useState(true);

  // Categorize and sort leads
  const categorizedLeads = useMemo(() => {
    const hot = [];
    const warm = [];
    const cold = [];

    leads.forEach(lead => {
      switch (lead.priorityLevel) {
        case 'Hot':
          hot.push(lead);
          break;
        case 'Warm':
          warm.push(lead);
          break;
        case 'Cold':
          cold.push(lead);
          break;
        default:
          cold.push(lead);
      }
    });

    // Sort function
    const sortLeads = (leadsArray) => {
      return [...leadsArray].sort((a, b) => {
        switch (sortBy) {
          case 'score':
            return b.rawScore - a.rawScore;
          case 'alphabetical':
            return a.company.localeCompare(b.company);
          case 'industry':
            return a.industry.localeCompare(b.industry);
          default:
            return b.rawScore - a.rawScore;
        }
      });
    };

    return {
      hot: sortLeads(hot),
      warm: sortLeads(warm),
      cold: sortLeads(cold)
    };
  }, [leads, sortBy]);

  const stats = useMemo(() => {
    const total = allLeads.length;
    const avgScore = total > 0 ? Math.round(allLeads.reduce((sum, lead) => sum + lead.rawScore, 0) / total) : 0;
    
    // Find top industry
    const industryCount = allLeads.reduce((acc, lead) => {
      acc[lead.industry] = (acc[lead.industry] || 0) + 1;
      return acc;
    }, {});
    
    const topIndustry = Object.entries(industryCount)
      .filter(([industry]) => industry !== 'Unknown')
      .sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      avgScore,
      topIndustry: topIndustry ? topIndustry[0] : 'N/A',
      hot: categorizedLeads.hot.length,
      warm: categorizedLeads.warm.length,
      cold: categorizedLeads.cold.length,
      contacted: allLeads.filter(lead => lead.contacted).length
    };
  }, [allLeads, categorizedLeads]);

  const handleExport = (type, priority = null) => {
    let exportLeads = [];
    
    switch (type) {
      case 'all':
        exportLeads = leads;
        break;
      case 'top10':
        exportLeads = [...leads].sort((a, b) => b.rawScore - a.rawScore).slice(0, 10);
        break;
      case 'priority':
        exportLeads = priority ? categorizedLeads[priority.toLowerCase()] : [];
        break;
      default:
        exportLeads = leads;
    }

    // New headers for the new structure
    const headers = [
      'Company', 'Website', 'Industry', 'Product/Service Category', 'Business Type (B2B, B2B2C)', 'Employees Count', 'Revenue', 'Year Founded', 'BBB Rating', 'Street', 'City', 'State', 'Company Phone', 'Company LinkedIn', "Owner's First Name", "Owner's Last Name", "Owner's Title", "Owner's LinkedIn", "Owner's Phone Number", "Owner's Email", 'Source', 'Score', 'Priority', 'Contacted', 'Company Size Score', 'Industry Score', 'Location Score', 'Data Completeness Score'
    ];

    const csvContent = [
      headers.join(','),
      ...exportLeads.map(lead => [
        `"${lead.company || ''}"`,
        `"${lead.website || ''}"`,
        `"${lead.industry || ''}"`,
        `"${lead.productCategory || ''}"`,
        `"${lead.businessType || ''}"`,
        lead.employeeCount || 0,
        `"${lead.revenue || ''}"`,
        `"${lead.yearFounded || ''}"`,
        `"${lead.bbbRating || ''}"`,
        `"${lead.street || ''}"`,
        `"${lead.city || ''}"`,
        `"${lead.state || ''}"`,
        `"${lead.companyPhone || ''}"`,
        `"${lead.companyLinkedIn || ''}"`,
        `"${lead.ownerFirstName || ''}"`,
        `"${lead.ownerLastName || ''}"`,
        `"${lead.ownerTitle || ''}"`,
        `"${lead.ownerLinkedIn || ''}"`,
        `"${lead.ownerPhone || ''}"`,
        `"${lead.ownerEmail || ''}"`,
        `"${lead.source || ''}"`,
        lead.rawScore,
        lead.priorityLevel,
        lead.contacted ? 'Yes' : 'No',
        lead.scoreComponents.companySize,
        lead.scoreComponents.industry,
        lead.scoreComponents.location,
        lead.scoreComponents.dataCompleteness
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${type}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      {/* Dashboard Controls */}
      <div className="dashboard-controls-section">
        <div className="dashboard-controls">
          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score">Score (High to Low)</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="industry">Industry</option>
            </select>
          </div>
          
          <button 
            className={`insights-toggle ${showInsights ? 'active' : ''}`}
            onClick={() => setShowInsights(!showInsights)}
          >
            💡 Smart Insights
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Filter Panel */}
      <FilterPanel 
        filters={filters}
        onFilterChange={onFilterChange}
        allLeads={allLeads}
      />

      {/* Smart Insights Panel */}
      {showInsights && (
        <SmartInsights leads={allLeads} />
      )}

      {/* Score Distribution Chart */}
      <ScoreDistribution leads={leads} />

      {/* Export Panel */}
      <ExportPanel onExport={handleExport} stats={stats} />

      {/* Main Leads Grid */}
      <div className="leads-grid">
        {/* Hot Leads Column */}
        <div className="leads-column hot-column">
          <div className="column-header">
            <h3>🔥 Hot Leads</h3>
            <span className="count">{categorizedLeads.hot.length}</span>
          </div>
          <div className="leads-list">
            {categorizedLeads.hot.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onSelect={onLeadSelect}
                onUpdate={onLeadUpdate}
              />
            ))}
            {categorizedLeads.hot.length === 0 && (
              <div className="empty-state">
                <p>No hot leads yet</p>
                <small>Leads with scores 80+ will appear here</small>
              </div>
            )}
          </div>
        </div>

        {/* Warm Leads Column */}
        <div className="leads-column warm-column">
          <div className="column-header">
            <h3>🔶 Warm Leads</h3>
            <span className="count">{categorizedLeads.warm.length}</span>
          </div>
          <div className="leads-list">
            {categorizedLeads.warm.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onSelect={onLeadSelect}
                onUpdate={onLeadUpdate}
              />
            ))}
            {categorizedLeads.warm.length === 0 && (
              <div className="empty-state">
                <p>No warm leads</p>
                <small>Leads with scores 50-79 will appear here</small>
              </div>
            )}
          </div>
        </div>

        {/* Cold Leads Column */}
        <div className="leads-column cold-column">
          <div className="column-header">
            <h3>❄️ Cold Leads</h3>
            <span className="count">{categorizedLeads.cold.length}</span>
          </div>
          <div className="leads-list">
            {categorizedLeads.cold.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onSelect={onLeadSelect}
                onUpdate={onLeadUpdate}
              />
            ))}
            {categorizedLeads.cold.length === 0 && (
              <div className="empty-state">
                <p>No cold leads</p>
                <small>Leads with scores below 50 will appear here</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn"
          onClick={() => handleExport('top10')}
          disabled={leads.length === 0}
        >
          📊 Export Top 10
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => handleExport('priority', 'Hot')}
          disabled={categorizedLeads.hot.length === 0}
        >
          🔥 Export Hot Leads
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => handleExport('all')}
          disabled={leads.length === 0}
        >
          📋 Export All Filtered
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 