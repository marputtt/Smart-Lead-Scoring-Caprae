import React, { useMemo } from 'react';
import './ScoreDistribution.css';
import { getScoreColor } from '../utils/scoringEngine';

const ScoreDistribution = ({ leads }) => {
  const distribution = useMemo(() => {
    if (leads.length === 0) return [];

    // Create score ranges
    const ranges = [
      { min: 0, max: 19, label: '0-19', color: '#DC2626' },
      { min: 20, max: 39, label: '20-39', color: '#EA580C' },
      { min: 40, max: 59, label: '40-59', color: '#F59E0B' },
      { min: 60, max: 79, label: '60-79', color: '#10B981' },
      { min: 80, max: 100, label: '80-100', color: '#059669' }
    ];

    const distribution = ranges.map(range => {
      const count = leads.filter(lead => 
        lead.rawScore >= range.min && lead.rawScore <= range.max
      ).length;
      
      return {
        ...range,
        count,
        percentage: leads.length > 0 ? (count / leads.length) * 100 : 0
      };
    });

    return distribution;
  }, [leads]);

  const maxCount = Math.max(...distribution.map(d => d.count));

  if (leads.length === 0) {
    return (
      <div className="score-distribution">
        <h3>📊 Score Distribution</h3>
        <div className="no-data">
          <p>No data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="score-distribution">
      <div className="distribution-header">
        <h3>📊 Score Distribution</h3>
        <p>Distribution of lead scores across all uploaded leads</p>
      </div>

      <div className="distribution-chart">
        {distribution.map((range, index) => (
          <div key={index} className="distribution-bar">
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{
                  height: `${maxCount > 0 ? (range.count / maxCount) * 100 : 0}%`,
                  backgroundColor: range.color
                }}
              >
                <div className="bar-value">
                  {range.count}
                </div>
              </div>
            </div>
            <div className="bar-label">
              <div className="range-label">{range.label}</div>
              <div className="percentage">{range.percentage.toFixed(1)}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="distribution-summary">
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Total Leads:</span>
            <span className="stat-value">{leads.length}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Highest Score:</span>
            <span className="stat-value">
              {Math.max(...leads.map(l => l.rawScore))}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Lowest Score:</span>
            <span className="stat-value">
              {Math.min(...leads.map(l => l.rawScore))}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Average Score:</span>
            <span className="stat-value">
              {Math.round(leads.reduce((sum, lead) => sum + lead.rawScore, 0) / leads.length)}
            </span>
          </div>
        </div>
      </div>

      {/* Score Quality Indicators */}
      <div className="quality-indicators">
        <div className="quality-indicator hot">
          <div className="indicator-color" style={{ backgroundColor: '#EF4444' }}></div>
          <span>Hot Leads (80-100): {distribution[4].count}</span>
        </div>
        <div className="quality-indicator warm">
          <div className="indicator-color" style={{ backgroundColor: '#F59E0B' }}></div>
          <span>Warm Leads (50-79): {distribution[2].count + distribution[3].count}</span>
        </div>
        <div className="quality-indicator cold">
          <div className="indicator-color" style={{ backgroundColor: '#6B7280' }}></div>
          <span>Cold Leads (0-49): {distribution[0].count + distribution[1].count}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreDistribution; 