import React, { useState } from 'react';
import './LeadDetailModal.css';
import { getScoreColor, getPriorityColor } from '../utils/scoringEngine';

const LeadDetailModal = ({ lead, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(lead.notes || '');
  const [contacted, setContacted] = useState(lead.contacted || false);

  // Debug: Log the lead object to see its structure
  console.log('Lead object in modal:', lead);

  const handleSave = () => {
    onUpdate({
      ...lead,
      notes,
      contacted
    });
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getScoreExplanation = (component, value) => {
    switch (component) {
      case 'companySize':
        if (value === 25) return 'Large company (200+ employees) - Highest potential';
        if (value === 20) return 'Medium company (51-200 employees) - Good potential';
        if (value === 10) return 'Small company (11-50 employees) - Moderate potential';
        if (value === 5) return 'Very small company (1-10 employees) - Lower potential';
        return 'Unknown company size - Average score applied';
      
      case 'industry':
        if (value === 25) return 'High-growth industry (Tech, Healthcare, Finance) - Excellent fit';
        if (value === 15) return 'Stable industry (Manufacturing, Education) - Good fit';
        if (value === 10) return 'Traditional industry (Retail, Hospitality) - Moderate fit';
        return 'Unknown or other industry - Average score applied';
      
      case 'location':
        if (value === 20) return 'Major metro area - High business activity';
        if (value === 15) return 'Secondary city - Good business activity';
        if (value === 10) return 'Smaller city - Moderate business activity';
        return 'Rural or unknown location - Lower activity';
      
      case 'dataCompleteness':
        if (value === 30) return 'Complete contact info (phone, website, address) - Easy to reach';
        if (value === 20) return 'Good contact info (2 of 3 methods) - Reachable';
        if (value === 10) return 'Limited contact info (1 method) - Harder to reach';
        return 'Missing contact information - Difficult to reach';
      
      default:
        return 'Score component';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="lead-detail-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="company-header">
            <div className="company-logo-placeholder">
              {lead.company ? lead.company.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="company-info">
              <h2>{lead.company}</h2>
              <div className="company-meta">
                <span className="industry-tag">{lead.industry}</span>
                <span className="location-tag">📍 {lead.location}</span>
                {lead.employeeCount > 0 && (
                  <span className="size-tag">👥 {lead.employeeCount} employees</span>
                )}
                {lead.productCategory && (
                  <span className="category-tag">🏷️ {lead.productCategory}</span>
                )}
                {lead.businessType && (
                  <span className="businesstype-tag">🏢 {lead.businessType}</span>
                )}
                {lead.bbbRating && (
                  <span className="bbb-tag">⭐ BBB: {lead.bbbRating}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <div 
              className="score-display"
              style={{ backgroundColor: getScoreColor(lead.rawScore) }}
            >
              <div className="score-value">{lead.rawScore}</div>
              <div className="score-label">Score</div>
            </div>
            <div 
              className="priority-display"
              style={{ color: getPriorityColor(lead.priorityLevel) }}
            >
              {lead.priorityLevel}
            </div>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Score Breakdown */}
          <div className="score-breakdown">
            <h3>📊 Score Breakdown</h3>
            <div className="score-components">
              {Object.entries(lead.scoreComponents).map(([component, value]) => (
                <div key={component} className="score-component">
                  <div className="component-header">
                    <span className="component-name">
                      {component === 'companySize' && '🏢 Company Size'}
                      {component === 'industry' && '🏭 Industry'}
                      {component === 'location' && '📍 Location'}
                      {component === 'dataCompleteness' && '📋 Data Completeness'}
                    </span>
                    <span className="component-score">{value} pts</span>
                  </div>
                  <div className="component-bar">
                    <div 
                      className="component-fill"
                      style={{ 
                        width: `${(value / 30) * 100}%`,
                        backgroundColor: getScoreColor(value * 3.33)
                      }}
                    ></div>
                  </div>
                  <div className="component-explanation">
                    {getScoreExplanation(component, value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company & Owner Info Section */}
          <div className="modal-info-sections">
            {/* Company Info Column */}
            <div className="modal-info-col">
              <h3>🏢 <span className="info-label">Company Info</span></h3>
              <div className="info-list">
                <div className="info-item"><span>📞</span> <span className="info-label">Phone:</span> {lead.companyPhone || 'N/A'}</div>
                <div className="info-item"><span>🌐</span> <span className="info-label">Website:</span> {lead.website ? <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer">{lead.website}</a> : 'N/A'}</div>
                <div className="info-item"><span>🏢</span> <span className="info-label">Street:</span> {lead.street || 'N/A'}</div>
                <div className="info-item"><span>🌎</span> <span className="info-label">City, State:</span> {(lead.city && lead.state) ? `${lead.city}, ${lead.state}` : 'N/A'}</div>
                <div className="info-item"><span>💰</span> <span className="info-label">Revenue:</span> {lead.revenue || 'N/A'}</div>
                <div className="info-item"><span>📅</span> <span className="info-label">Year Founded:</span> {lead.yearFounded || 'N/A'}</div>
                <div className="info-item"><span>🏷️</span> <span className="info-label">Product/Service:</span> {lead.productCategory || 'N/A'}</div>
                <div className="info-item"><span>🏢</span> <span className="info-label">Business Type:</span> {lead.businessType || 'N/A'}</div>
                <div className="info-item"><span>⭐</span> <span className="info-label">BBB Rating:</span> {lead.bbbRating || 'N/A'}</div>
                <div className="info-item"><span>🔗</span> <span className="info-label">LinkedIn:</span> {lead.companyLinkedIn ? <a href={lead.companyLinkedIn} target="_blank" rel="noopener noreferrer">Company LinkedIn</a> : 'N/A'}</div>
                <div className="info-item"><span>📋</span> <span className="info-label">Source:</span> {lead.source || 'N/A'}</div>
              </div>
            </div>
            {/* Owner Info Column */}
            <div className="modal-info-col">
              <h3>👤 <span className="info-label">Owner Info</span></h3>
              <div className="info-list">
                <div className="info-item"><span>👤</span> <span className="info-label">Name:</span> {(lead.ownerFirstName && lead.ownerLastName) ? `${lead.ownerFirstName} ${lead.ownerLastName}` : (lead.ownerFirstName || lead.ownerLastName || 'N/A')}</div>
                <div className="info-item"><span>🏷️</span> <span className="info-label">Title:</span> {lead.ownerTitle || 'N/A'}</div>
                <div className="info-item"><span>🔗</span> <span className="info-label">LinkedIn:</span> {lead.ownerLinkedIn ? <a href={lead.ownerLinkedIn} target="_blank" rel="noopener noreferrer">Owner LinkedIn</a> : 'N/A'}</div>
                <div className="info-item"><span>📱</span> <span className="info-label">Phone:</span> {lead.ownerPhone || 'N/A'}</div>
                <div className="info-item"><span>✉️</span> <span className="info-label">Email:</span> {lead.ownerEmail ? <a href={`mailto:${lead.ownerEmail}`}>{lead.ownerEmail}</a> : 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="notes-section">
            <h3>📝 Notes</h3>
            <textarea
              className="notes-textarea"
              placeholder="Add your notes about this lead..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Contact Status */}
          <div className="contact-status">
            <label className="status-toggle">
              <input
                type="checkbox"
                checked={contacted}
                onChange={(e) => setContacted(e.target.checked)}
              />
              <span className="toggle-text">
                {contacted ? '✅ Marked as contacted' : '📞 Mark as contacted'}
              </span>
            </label>
          </div>

          {/* Metadata */}
          <div className="lead-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Added:</span>
              <span className="metadata-value">{formatDate(lead.uploadDate)}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Lead ID:</span>
              <span className="metadata-value">{lead.id}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleSave}>
              💾 Save Changes
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
          
          <div className="integration-buttons">
            <button className="btn btn-integration" disabled title="Coming soon">
              📧 Add to HubSpot
            </button>
            <button className="btn btn-integration" disabled title="Coming soon">
              📨 Add to Email Sequence
            </button>
            <button className="btn btn-integration" disabled title="Coming soon">
              📋 Export Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal; 