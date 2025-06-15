import React from 'react';
import './LeadCard.css';
import { getScoreColor, getPriorityColor } from '../utils/scoringEngine';

const LeadCard = ({ lead, onSelect, onUpdate }) => {
  const handleContactedToggle = (e) => {
    e.stopPropagation();
    onUpdate({
      ...lead,
      contacted: !lead.contacted
    });
  };

  const handleCardClick = () => {
    onSelect(lead);
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'Technology': '#3B82F6',
      'Healthcare': '#10B981',
      'Finance': '#F59E0B',
      'Manufacturing': '#6B7280',
      'Education': '#8B5CF6',
      'Retail': '#EF4444',
      'Unknown': '#9CA3AF'
    };
    
    // Find matching industry or use default
    const matchedColor = Object.keys(colors).find(key => 
      industry.toLowerCase().includes(key.toLowerCase())
    );
    
    return colors[matchedColor] || colors['Unknown'];
  };

  return (
    <div 
      className={`lead-card ${lead.contacted ? 'contacted' : ''}`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="lead-card-header">
        <h4 className="company-name">{lead.company}</h4>
        <div 
          className="score-badge"
          style={{ backgroundColor: getScoreColor(lead.rawScore) }}
        >
          {lead.rawScore}
        </div>
      </div>

      {/* Industry Tag */}
      <div className="lead-card-meta">
        <span 
          className="industry-tag"
          style={{ 
            backgroundColor: getIndustryColor(lead.industry),
            color: 'white'
          }}
        >
          {lead.industry}
        </span>
        <span 
          className="priority-badge"
          style={{ color: getPriorityColor(lead.priorityLevel) }}
        >
          {lead.priorityLevel}
        </span>
      </div>

      {/* Location */}
      <div className="lead-card-location">
        <span className="location-icon">📍</span>
        <span className="location-text">{lead.location}</span>
      </div>

      {/* Employee Count */}
      {lead.employeeCount > 0 && (
        <div className="lead-card-size">
          <span className="size-icon">👥</span>
          <span className="size-text">{lead.employeeCount} employees</span>
        </div>
      )}

      {/* Contact Methods */}
      <div className="contact-methods">
        {lead.companyPhone && (
          <span className="contact-icon phone" title="Has company phone">📞</span>
        )}
        {lead.website && (
          <span className="contact-icon website" title="Has website">🌐</span>
        )}
        {lead.street && (
          <span className="contact-icon address" title="Has address">🏢</span>
        )}
      </div>

      {/* Optionally show owner's name and product category */}
      {lead.ownerFirstName && lead.ownerLastName && (
        <div className="lead-card-owner">
          <span className="owner-icon">👤</span>
          <span className="owner-text">{lead.ownerFirstName} {lead.ownerLastName}</span>
        </div>
      )}
      {lead.productCategory && (
        <div className="lead-card-category">
          <span className="category-icon">🏷️</span>
          <span className="category-text">{lead.productCategory}</span>
        </div>
      )}

      {/* Score Breakdown Preview */}
      <div className="score-preview">
        <div className="score-bar">
          <div 
            className="score-fill"
            style={{ 
              width: `${lead.rawScore}%`,
              backgroundColor: getScoreColor(lead.rawScore)
            }}
          ></div>
        </div>
        <div className="score-components">
          <small>
            Size: {lead.scoreComponents.companySize} | 
            Industry: {lead.scoreComponents.industry} | 
            Location: {lead.scoreComponents.location} | 
            Data: {lead.scoreComponents.dataCompleteness}
          </small>
        </div>
      </div>

      {/* Actions */}
      <div className="lead-card-actions">
        <button 
          className="btn btn-sm btn-primary"
          onClick={handleCardClick}
        >
          View Details
        </button>
        <button 
          className={`btn btn-sm ${lead.contacted ? 'btn-success' : 'btn-outline'}`}
          onClick={handleContactedToggle}
          title={lead.contacted ? 'Mark as not contacted' : 'Mark as contacted'}
        >
          {lead.contacted ? '✓ Contacted' : 'Mark Contacted'}
        </button>
      </div>

      {/* Contacted Overlay */}
      {lead.contacted && (
        <div className="contacted-overlay">
          <span className="contacted-badge">✓ Contacted</span>
        </div>
      )}
    </div>
  );
};

export default LeadCard; 