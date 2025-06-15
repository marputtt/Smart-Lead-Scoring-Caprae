import React, { useMemo } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, allLeads }) => {
  // Get unique industries and locations for filter options
  const filterOptions = useMemo(() => {
    const industries = [...new Set(allLeads.map(lead => lead.industry))]
      .filter(industry => industry && industry !== 'Unknown')
      .sort();
    
    const locations = [...new Set(allLeads.map(lead => {
      const city = lead.location.split(',')[0].trim();
      return city;
    }))]
      .filter(location => location && location !== 'Unknown')
      .sort();

    const categories = [...new Set(allLeads.map(lead => lead.productCategory))]
      .filter(cat => cat && cat !== 'Unknown')
      .sort();

    const businessTypes = [...new Set(allLeads.map(lead => lead.businessType))]
      .filter(bt => bt && bt !== 'Unknown')
      .sort();

    return { industries, locations, categories, businessTypes };
  }, [allLeads]);

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleIndustryChange = (e) => {
    onFilterChange({ industry: e.target.value });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ location: e.target.value });
  };

  const handleScoreRangeChange = (e) => {
    const value = parseInt(e.target.value);
    const isMin = e.target.name === 'minScore';
    
    onFilterChange({
      scoreRange: isMin 
        ? [value, filters.scoreRange[1]]
        : [filters.scoreRange[0], value]
    });
  };

  const handleUncontactedToggle = (e) => {
    onFilterChange({ showUncontactedOnly: e.target.checked });
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ productCategory: e.target.value });
  };

  const handleBusinessTypeChange = (e) => {
    onFilterChange({ businessType: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      industry: '',
      location: '',
      scoreRange: [0, 100],
      showUncontactedOnly: false,
      productCategory: '',
      businessType: ''
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.industry || 
    filters.location || 
    filters.scoreRange[0] > 0 || 
    filters.scoreRange[1] < 100 || 
    filters.showUncontactedOnly ||
    filters.productCategory ||
    filters.businessType;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>🔍 Filters</h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>

      <div className="filter-grid">
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search">Search Companies</label>
          <input
            id="search"
            type="text"
            placeholder="Search by company name..."
            value={filters.search}
            onChange={handleSearchChange}
            className="filter-input"
          />
        </div>

        {/* Industry Filter */}
        <div className="filter-group">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            value={filters.industry}
            onChange={handleIndustryChange}
            className="filter-select"
          >
            <option value="">All Industries</option>
            {filterOptions.industries.map(industry => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={filters.location}
            onChange={handleLocationChange}
            className="filter-select"
          >
            <option value="">All Locations</option>
            {filterOptions.locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Product/Service Category Filter */}
        <div className="filter-group">
          <label htmlFor="productCategory">Product/Service Category</label>
          <select
            id="productCategory"
            value={filters.productCategory || ''}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {filterOptions.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Business Type Filter */}
        <div className="filter-group">
          <label htmlFor="businessType">Business Type</label>
          <select
            id="businessType"
            value={filters.businessType || ''}
            onChange={handleBusinessTypeChange}
            className="filter-select"
          >
            <option value="">All Types</option>
            {filterOptions.businessTypes.map(bt => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>
        </div>

        {/* Score Range */}
        <div className="filter-group score-range">
          <label>Score Range</label>
          <div className="range-inputs">
            <div className="range-input-group">
              <label htmlFor="minScore">Min</label>
              <input
                id="minScore"
                name="minScore"
                type="number"
                min="0"
                max="100"
                value={filters.scoreRange[0]}
                onChange={handleScoreRangeChange}
                className="range-input"
              />
            </div>
            <span className="range-separator">-</span>
            <div className="range-input-group">
              <label htmlFor="maxScore">Max</label>
              <input
                id="maxScore"
                name="maxScore"
                type="number"
                min="0"
                max="100"
                value={filters.scoreRange[1]}
                onChange={handleScoreRangeChange}
                className="range-input"
              />
            </div>
          </div>
          <div className="range-slider">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.scoreRange[0]}
              onChange={(e) => handleScoreRangeChange({
                target: { name: 'minScore', value: e.target.value }
              })}
              className="slider slider-min"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.scoreRange[1]}
              onChange={(e) => handleScoreRangeChange({
                target: { name: 'maxScore', value: e.target.value }
              })}
              className="slider slider-max"
            />
          </div>
        </div>

        {/* Uncontacted Only */}
        <div className="filter-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showUncontactedOnly}
              onChange={handleUncontactedToggle}
              className="filter-checkbox"
            />
            <span className="checkbox-text">Show only uncontacted leads</span>
          </label>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="quick-filters">
        <button 
          className="quick-filter-btn"
          onClick={() => onFilterChange({ scoreRange: [80, 100] })}
        >
          🔥 Hot Leads Only
        </button>
        <button 
          className="quick-filter-btn"
          onClick={() => onFilterChange({ scoreRange: [50, 79] })}
        >
          🔶 Warm Leads Only
        </button>
        <button 
          className="quick-filter-btn"
          onClick={() => onFilterChange({ showUncontactedOnly: true })}
        >
          📞 Uncontacted Only
        </button>
      </div>
    </div>
  );
};

export default FilterPanel; 