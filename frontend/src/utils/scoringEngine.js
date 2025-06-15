// Smart Lead Scoring Engine
// Implements the scoring algorithm as defined in the 5-hour plan

export const calculateLeadScore = (lead) => {
  const components = {};
  
  // Company Size Score (0-25 points)
  components.companySize = calculateCompanySizeScore(lead.employeeCount);
  
  // Industry Attractiveness Score (0-25 points)
  components.industry = calculateIndustryScore(lead.industry);
  
  // Location Score (0-20 points)
  components.location = calculateLocationScore(lead.location);
  
  // Data Completeness Score (0-30 points)
  components.dataCompleteness = calculateDataCompletenessScore(lead);
  
  // Calculate total score
  const totalScore = Math.round(
    components.companySize + 
    components.industry + 
    components.location + 
    components.dataCompleteness
  );
  
  return {
    totalScore: Math.min(100, Math.max(0, totalScore)), // Ensure 0-100 range
    components
  };
};

const calculateCompanySizeScore = (employeeCount) => {
  if (!employeeCount || employeeCount === 0) return 8; // Unknown: average
  
  if (employeeCount >= 1 && employeeCount <= 10) return 5;
  if (employeeCount >= 11 && employeeCount <= 50) return 10;
  if (employeeCount >= 51 && employeeCount <= 200) return 20;
  if (employeeCount > 200) return 25;
  
  return 8; // Default for edge cases
};

const calculateIndustryScore = (industry) => {
  const industryLower = industry.toLowerCase();
  
  // High-growth industries
  const highGrowthIndustries = [
    'technology', 'tech', 'software', 'saas', 'healthcare', 'health',
    'finance', 'fintech', 'financial', 'biotech', 'ai', 'artificial intelligence',
    'machine learning', 'cybersecurity', 'cloud', 'digital', 'e-commerce'
  ];
  
  // Stable industries
  const stableIndustries = [
    'manufacturing', 'education', 'consulting', 'professional services',
    'automotive', 'aerospace', 'energy', 'utilities', 'telecommunications',
    'insurance', 'real estate', 'construction'
  ];
  
  // Traditional industries
  const traditionalIndustries = [
    'retail', 'hospitality', 'restaurant', 'food', 'agriculture',
    'transportation', 'logistics', 'media', 'entertainment', 'travel'
  ];
  
  // Check for high-growth industries
  if (highGrowthIndustries.some(keyword => industryLower.includes(keyword))) {
    return 25;
  }
  
  // Check for stable industries
  if (stableIndustries.some(keyword => industryLower.includes(keyword))) {
    return 15;
  }
  
  // Check for traditional industries
  if (traditionalIndustries.some(keyword => industryLower.includes(keyword))) {
    return 10;
  }
  
  // Unknown industry
  return 12;
};

const calculateLocationScore = (location) => {
  const locationLower = location.toLowerCase();
  
  // Major metro areas
  const majorMetros = [
    'new york', 'nyc', 'manhattan', 'brooklyn', 'san francisco', 'sf',
    'los angeles', 'la', 'chicago', 'boston', 'seattle', 'washington dc',
    'atlanta', 'dallas', 'houston', 'miami', 'denver', 'austin',
    'philadelphia', 'phoenix', 'san diego', 'portland', 'minneapolis'
  ];
  
  // Secondary cities
  const secondaryCities = [
    'nashville', 'charlotte', 'raleigh', 'tampa', 'orlando', 'kansas city',
    'columbus', 'indianapolis', 'milwaukee', 'baltimore', 'detroit',
    'cleveland', 'pittsburgh', 'cincinnati', 'st. louis', 'sacramento',
    'salt lake city', 'richmond', 'buffalo', 'memphis', 'louisville'
  ];
  
  // Check for major metros
  if (majorMetros.some(metro => locationLower.includes(metro))) {
    return 20;
  }
  
  // Check for secondary cities
  if (secondaryCities.some(city => locationLower.includes(city))) {
    return 15;
  }
  
  // Check if it's a recognizable city (has comma, suggesting city, state format)
  if (location.includes(',') && location.trim() !== '' && location !== 'Unknown') {
    return 10; // Smaller cities
  }
  
  // Rural/Unknown
  return 5;
};

const calculateDataCompletenessScore = (lead) => {
  let score = 0;
  let contactMethods = 0;
  
  // Check for contact methods
  if (lead.companyPhone && lead.companyPhone.trim() !== '') contactMethods++;
  if (lead.website && lead.website.trim() !== '') contactMethods++;
  if (lead.street && lead.street.trim() !== '') contactMethods++;
  
  // Score based on contact methods available
  if (contactMethods === 3) score = 30; // Has phone + website + address
  else if (contactMethods === 2) score = 20; // Has 2 of 3
  else if (contactMethods === 1) score = 10; // Has 1 contact method
  else score = 0; // Missing all contact info
  
  return score;
};

export const categorizeLead = (score) => {
  if (score >= 80) return 'Hot';
  if (score >= 50) return 'Warm';
  return 'Cold';
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#EF4444'; // Red for Hot
  if (score >= 50) return '#F59E0B'; // Amber for Warm
  return '#6B7280'; // Gray for Cold
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Hot': return '#EF4444';
    case 'Warm': return '#F59E0B';
    case 'Cold': return '#6B7280';
    default: return '#6B7280';
  }
};

// Smart insights functions
export const getSmartInsights = (leads) => {
  const insights = [];
  
  // Leads likely to respond today (high score + complete data)
  const highPotentialLeads = leads.filter(lead => 
    lead.rawScore >= 75 && 
    lead.scoreComponents.dataCompleteness >= 20 &&
    !lead.contacted
  ).slice(0, 5);
  
  if (highPotentialLeads.length > 0) {
    insights.push({
      type: 'high-potential',
      title: 'Leads likely to respond today',
      count: highPotentialLeads.length,
      leads: highPotentialLeads
    });
  }
  
  // Undervalued opportunities (good companies with incomplete data)
  const undervaluedLeads = leads.filter(lead => 
    (lead.scoreComponents.companySize >= 15 || lead.scoreComponents.industry >= 20) &&
    lead.scoreComponents.dataCompleteness < 15 &&
    !lead.contacted
  ).slice(0, 5);
  
  if (undervaluedLeads.length > 0) {
    insights.push({
      type: 'undervalued',
      title: 'Undervalued opportunities',
      subtitle: 'Good companies with incomplete data',
      count: undervaluedLeads.length,
      leads: undervaluedLeads
    });
  }
  
  // Geographic clusters
  const locationGroups = leads.reduce((acc, lead) => {
    const location = lead.location.split(',')[0].trim(); // Get city part
    if (!acc[location]) acc[location] = [];
    acc[location].push(lead);
    return acc;
  }, {});
  
  const clusters = Object.entries(locationGroups)
    .filter(([location, leads]) => leads.length >= 3 && location !== 'Unknown')
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);
  
  if (clusters.length > 0) {
    insights.push({
      type: 'geographic',
      title: 'Geographic clusters',
      clusters: clusters.map(([location, leads]) => ({
        location,
        count: leads.length,
        avgScore: Math.round(leads.reduce((sum, lead) => sum + lead.rawScore, 0) / leads.length)
      }))
    });
  }
  
  return insights;
};

// Actionable recommendations
export const getActionableRecommendations = (leads) => {
  const recommendations = [];
  
  // Top 5 leads to call first
  const topLeads = leads
    .filter(lead => !lead.contacted && lead.companyPhone)
    .sort((a, b) => b.rawScore - a.rawScore)
    .slice(0, 5);
  
  if (topLeads.length > 0) {
    recommendations.push({
      type: 'call-first',
      title: `Call these ${topLeads.length} leads first`,
      leads: topLeads,
      action: 'call'
    });
  }
  
  // Leads that need more research
  const researchLeads = leads
    .filter(lead => 
      !lead.contacted && 
      lead.scoreComponents.dataCompleteness < 15 &&
      (lead.scoreComponents.companySize >= 15 || lead.scoreComponents.industry >= 20)
    )
    .slice(0, 5);
  
  if (researchLeads.length > 0) {
    recommendations.push({
      type: 'research',
      title: 'Research these companies more',
      leads: researchLeads,
      action: 'research'
    });
  }
  
  // Industry/location focus recommendations
  const industryStats = leads.reduce((acc, lead) => {
    if (!acc[lead.industry]) acc[lead.industry] = { count: 0, avgScore: 0, totalScore: 0 };
    acc[lead.industry].count++;
    acc[lead.industry].totalScore += lead.rawScore;
    acc[lead.industry].avgScore = acc[lead.industry].totalScore / acc[lead.industry].count;
    return acc;
  }, {});
  
  const topIndustry = Object.entries(industryStats)
    .filter(([industry]) => industry !== 'Unknown')
    .sort((a, b) => b[1].avgScore - a[1].avgScore)[0];
  
  if (topIndustry && topIndustry[1].count >= 3) {
    const [industry, stats] = topIndustry;
    const topLocation = leads
      .filter(lead => lead.industry === industry)
      .reduce((acc, lead) => {
        const location = lead.location.split(',')[0].trim();
        if (!acc[location]) acc[location] = 0;
        acc[location]++;
        return acc;
      }, {});
    
    const primaryLocation = Object.entries(topLocation)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (primaryLocation) {
      recommendations.push({
        type: 'focus',
        title: `Focus on ${industry} in ${primaryLocation[0]}`,
        subtitle: `${Math.round(stats.avgScore)} avg score, ${stats.count} leads`,
        action: 'focus'
      });
    }
  }
  
  return recommendations;
}; 