import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card total">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Leads</div>
        </div>
      </div>

      <div className="stat-card average">
        <div className="stat-icon">📈</div>
        <div className="stat-content">
          <div className="stat-value">{stats.avgScore}</div>
          <div className="stat-label">Average Score</div>
        </div>
      </div>

      <div className="stat-card industry">
        <div className="stat-icon">🏢</div>
        <div className="stat-content">
          <div className="stat-value">{stats.topIndustry}</div>
          <div className="stat-label">Top Industry</div>
        </div>
      </div>

      <div className="stat-card hot">
        <div className="stat-icon">🔥</div>
        <div className="stat-content">
          <div className="stat-value">{stats.hot}</div>
          <div className="stat-label">Hot Leads</div>
        </div>
      </div>

      <div className="stat-card warm">
        <div className="stat-icon">🔶</div>
        <div className="stat-content">
          <div className="stat-value">{stats.warm}</div>
          <div className="stat-label">Warm Leads</div>
        </div>
      </div>

      <div className="stat-card cold">
        <div className="stat-icon">❄️</div>
        <div className="stat-content">
          <div className="stat-value">{stats.cold}</div>
          <div className="stat-label">Cold Leads</div>
        </div>
      </div>

      <div className="stat-card contacted">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-value">{stats.contacted}</div>
          <div className="stat-label">Contacted</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards; 