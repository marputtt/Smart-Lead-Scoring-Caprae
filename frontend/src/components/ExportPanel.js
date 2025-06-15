import React, { useState } from 'react';
import './ExportPanel.css';

const ExportPanel = ({ onExport, stats }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="export-panel">
      <div className="export-header">
        <button 
          className="export-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>📤 Export Options</span>
          <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </button>
      </div>

      {isExpanded && (
        <div className="export-content">
          <div className="export-options">
            <div className="export-option">
              <h4>📊 Quick Exports</h4>
              <div className="export-buttons">
                <button 
                  className="export-btn primary"
                  onClick={() => onExport('top10')}
                  disabled={stats.total === 0}
                >
                  <span className="btn-icon">⭐</span>
                  <div className="btn-content">
                    <div className="btn-title">Top 10 Leads</div>
                    <div className="btn-subtitle">Highest scoring leads</div>
                  </div>
                </button>

                <button 
                  className="export-btn hot"
                  onClick={() => onExport('priority', 'Hot')}
                  disabled={stats.hot === 0}
                >
                  <span className="btn-icon">🔥</span>
                  <div className="btn-content">
                    <div className="btn-title">Hot Leads ({stats.hot})</div>
                    <div className="btn-subtitle">Score 80-100</div>
                  </div>
                </button>

                <button 
                  className="export-btn warm"
                  onClick={() => onExport('priority', 'Warm')}
                  disabled={stats.warm === 0}
                >
                  <span className="btn-icon">🔶</span>
                  <div className="btn-content">
                    <div className="btn-title">Warm Leads ({stats.warm})</div>
                    <div className="btn-subtitle">Score 50-79</div>
                  </div>
                </button>

                <button 
                  className="export-btn cold"
                  onClick={() => onExport('priority', 'Cold')}
                  disabled={stats.cold === 0}
                >
                  <span className="btn-icon">❄️</span>
                  <div className="btn-content">
                    <div className="btn-title">Cold Leads ({stats.cold})</div>
                    <div className="btn-subtitle">Score 0-49</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="export-option">
              <h4>📋 Complete Exports</h4>
              <div className="export-buttons">
                <button 
                  className="export-btn secondary"
                  onClick={() => onExport('all')}
                  disabled={stats.total === 0}
                >
                  <span className="btn-icon">📄</span>
                  <div className="btn-content">
                    <div className="btn-title">All Filtered Leads</div>
                    <div className="btn-subtitle">Current view with scores</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="export-option">
              <h4>🔗 Integration Options</h4>
              <div className="export-buttons">
                <button 
                  className="export-btn integration"
                  disabled
                  title="Coming soon"
                >
                  <span className="btn-icon">📧</span>
                  <div className="btn-content">
                    <div className="btn-title">Export to HubSpot</div>
                    <div className="btn-subtitle">Direct CRM integration</div>
                  </div>
                </button>

                <button 
                  className="export-btn integration"
                  disabled
                  title="Coming soon"
                >
                  <span className="btn-icon">⚡</span>
                  <div className="btn-content">
                    <div className="btn-title">Sync with Salesforce</div>
                    <div className="btn-subtitle">Automatic sync</div>
                  </div>
                </button>

                <button 
                  className="export-btn integration"
                  disabled
                  title="Coming soon"
                >
                  <span className="btn-icon">📨</span>
                  <div className="btn-content">
                    <div className="btn-title">Add to Email Sequence</div>
                    <div className="btn-subtitle">Automated outreach</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="export-info">
            <div className="info-card">
              <h5>📊 Export Format</h5>
              <p>All exports include:</p>
              <ul>
                <li>Complete lead information</li>
                <li>Calculated scores and priority levels</li>
                <li>Score component breakdown</li>
                <li>Contact status and notes</li>
              </ul>
            </div>

            <div className="info-card">
              <h5>💡 Pro Tips</h5>
              <ul>
                <li>Export hot leads first for immediate action</li>
                <li>Use filters before exporting for targeted lists</li>
                <li>Score breakdown helps prioritize outreach</li>
                <li>Mark leads as contacted to track progress</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel; 