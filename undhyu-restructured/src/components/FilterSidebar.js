import React, { useState } from 'react';
import { FILTER_OPTIONS } from '../utils/constants';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, activeFilterCount, isMobile = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    colors: true,
    fabrics: false,
    sizes: false,
    occasions: false,
    regions: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    const newRange = { ...filters.priceRange };
    newRange[type] = value === '' ? null : parseFloat(value);
    onFilterChange('priceRange', newRange);
  };

  const FilterSection = ({ title, children, isExpanded, onToggle }) => (
    <div className="filter-section">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-left font-medium text-gray-900 hover:text-black"
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxOption = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-2"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className={`bg-white ${isMobile ? 'p-4' : 'p-6 rounded-lg shadow-sm'} custom-scrollbar`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Price Range Filter */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-4">
          {/* Quick Price Ranges */}
          <div className="space-y-2">
            {FILTER_OPTIONS.priceRanges.map((range, index) => (
              <CheckboxOption
                key={index}
                label={range.label}
                checked={
                  filters.priceRange.min === range.min && 
                  filters.priceRange.max === range.max
                }
                onChange={() => onFilterChange('priceRange', { min: range.min, max: range.max })}
              />
            ))}
          </div>

          {/* Custom Price Range */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min || ''}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max || ''}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Colors Filter */}
      <FilterSection
        title="Colors"
        isExpanded={expandedSections.colors}
        onToggle={() => toggleSection('colors')}
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.colors.map((color) => (
            <CheckboxOption
              key={color}
              label={color}
              checked={filters.colors.includes(color)}
              onChange={() => onFilterChange('colors', color)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Fabrics Filter */}
      <FilterSection
        title="Fabric/Material"
        isExpanded={expandedSections.fabrics}
        onToggle={() => toggleSection('fabrics')}
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.fabrics.map((fabric) => (
            <CheckboxOption
              key={fabric}
              label={fabric}
              checked={filters.fabrics.includes(fabric)}
              onChange={() => onFilterChange('fabrics', fabric)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Sizes Filter */}
      <FilterSection
        title="Size"
        isExpanded={expandedSections.sizes}
        onToggle={() => toggleSection('sizes')}
      >
        <div className="grid grid-cols-3 gap-2">
          {FILTER_OPTIONS.sizes.map((size) => (
            <label
              key={size}
              className={`border border-gray-300 rounded-md px-3 py-2 text-center text-sm cursor-pointer transition-all duration-200 ${
                filters.sizes.includes(size)
                  ? 'bg-black text-white border-black'
                  : 'hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => onFilterChange('sizes', size)}
                className="sr-only"
              />
              {size}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Occasions Filter */}
      <FilterSection
        title="Occasion"
        isExpanded={expandedSections.occasions}
        onToggle={() => toggleSection('occasions')}
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.occasions.map((occasion) => (
            <CheckboxOption
              key={occasion}
              label={occasion}
              checked={filters.occasions.includes(occasion)}
              onChange={() => onFilterChange('occasions', occasion)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Regions Filter */}
      <FilterSection
        title="Region"
        isExpanded={expandedSections.regions}
        onToggle={() => toggleSection('regions')}
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.regions.map((region) => (
            <CheckboxOption
              key={region}
              label={region}
              checked={filters.regions.includes(region)}
              onChange={() => onFilterChange('regions', region)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Apply Filters Button (Mobile) */}
      {isMobile && (
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => {
              // Close mobile filter modal
              const event = new CustomEvent('closeMobileFilters');
              window.dispatchEvent(event);
            }}
            className="w-full btn-primary"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;