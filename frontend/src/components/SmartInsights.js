import React from 'react';
import './SmartInsights.css';
import { getSmartInsights, getActionableRecommendations } from '../utils/scoringEngine';

const SmartInsights = ({ leads }) => {
  const insights = getSmartInsights(leads);
  const recommendations = getActionableRecommendations(leads);

  if (insights.length === 0 && recommendations.length === 0) {
    return (
      <div className="smart-insights">
        <div className="insights-header">
          <h3>💡 Smart Insights</h3>
        </div>
        <div className="no-insights">
          <p>Upload more leads to see smart insights and recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-insights">
      <div className="insights-header">
        <h3>💡 Smart Insights</h3>
        <p>AI-powered recommendations to maximize your lead conversion</p>
      </div>

      <div className="insights-grid">
        {/* Actionable Recommendations */}
        {recommendations.length > 0 && (
          <div className="insights-section recommendations">
            <h4>🎯 Actionable Recommendations</h4>
            <div className="recommendation-cards">
              {recommendations.map((rec, index) => (
                <div key={index} className={`recommendation-card ${rec.type}`}>
                  <div className="recommendation-header">
                    <span className="recommendation-icon">
                      {rec.action === 'call' && '📞'}
                      {rec.action === 'research' && '🔍'}
                      {rec.action === 'focus' && '🎯'}
                    </span>
                    <h5>{rec.title}</h5>
                  </div>
                  {rec.subtitle && (
                    <p className="recommendation-subtitle">{rec.subtitle}</p>
                  )}
                  {rec.leads && (
                    <div className="recommendation-leads">
                      {rec.leads.slice(0, 3).map(lead => (
                        <span key={lead.id} className="lead-chip">
                          {lead.company} ({lead.rawScore})
                        </span>
                      ))}
                      {rec.leads.length > 3 && (
                        <span className="more-leads">+{rec.leads.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Smart Insights */}
        {insights.length > 0 && (
          <div className="insights-section insights">
            <h4>🧠 Smart Insights</h4>
            <div className="insight-cards">
              {insights.map((insight, index) => (
                <div key={index} className={`insight-card ${insight.type}`}>
                  <div className="insight-header">
                    <span className="insight-icon">
                      {insight.type === 'high-potential' && '⚡'}
                      {insight.type === 'undervalued' && '💎'}
                      {insight.type === 'geographic' && '🗺️'}
                    </span>
                    <h5>{insight.title}</h5>
                  </div>
                  
                  {insight.subtitle && (
                    <p className="insight-subtitle">{insight.subtitle}</p>
                  )}
                  
                  {insight.count && (
                    <div className="insight-count">
                      <span className="count-badge">{insight.count}</span>
                      <span>leads identified</span>
                    </div>
                  )}
                  
                  {insight.leads && (
                    <div className="insight-leads">
                      {insight.leads.slice(0, 3).map(lead => (
                        <div key={lead.id} className="insight-lead">
                          <span className="lead-name">{lead.company}</span>
                          <span className="lead-score">{lead.rawScore}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {insight.clusters && (
                    <div className="geographic-clusters">
                      {insight.clusters.map((cluster, clusterIndex) => (
                        <div key={clusterIndex} className="cluster-item">
                          <span className="cluster-location">{cluster.location}</span>
                          <span className="cluster-stats">
                            {cluster.count} leads (avg: {cluster.avgScore})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="insights-actions">
        <button className="insight-action-btn primary">
          📊 Export High-Priority Leads
        </button>
        <button className="insight-action-btn secondary">
          📧 Create Email Sequence
        </button>
        <button className="insight-action-btn secondary">
          🔗 Sync with CRM
        </button>
      </div>
    </div>
  );
};

export default SmartInsights; 