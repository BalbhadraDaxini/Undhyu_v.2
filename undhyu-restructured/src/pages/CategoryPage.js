import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCollectionByHandle } from '../utils/api';
import { CATEGORIES, FILTER_OPTIONS, SORT_OPTIONS, LOADING_STATES } from '../utils/constants';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage = ({ category, title }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.LOADING);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: null, max: null },
    colors: [],
    fabrics: [],
    sizes: [],
    occasions: [],
    regions: [],
    sortBy: 'CREATED_AT',
    sortReverse: true
  });

  const categoryInfo = CATEGORIES[category] || { name: title, description: '' };

  // Load products when component mounts or filters change
  useEffect(() => {
    loadProducts();
  }, [category, filters, currentPage]);

  // Update filters from URL params
  useEffect(() => {
    updateFiltersFromURL();
  }, [searchParams]);

  const updateFiltersFromURL = () => {
    const newFilters = { ...filters };
    
    // Parse URL parameters
    const sortBy = searchParams.get('sort') || 'CREATED_AT';
    const sortReverse = searchParams.get('reverse') === 'true';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    const fabrics = searchParams.get('fabrics')?.split(',').filter(Boolean) || [];
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
    const occasions = searchParams.get('occasions')?.split(',').filter(Boolean) || [];
    const regions = searchParams.get('regions')?.split(',').filter(Boolean) || [];

    newFilters.sortBy = sortBy;
    newFilters.sortReverse = sortReverse;
    newFilters.priceRange = {
      min: minPrice ? parseFloat(minPrice) : null,
      max: maxPrice ? parseFloat(maxPrice) : null
    };
    newFilters.colors = colors;
    newFilters.fabrics = fabrics;
    newFilters.sizes = sizes;
    newFilters.occasions = occasions;
    newFilters.regions = regions;

    setFilters(newFilters);
  };

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.sortBy !== 'CREATED_AT') params.set('sort', newFilters.sortBy);
    if (newFilters.sortReverse !== true) params.set('reverse', newFilters.sortReverse.toString());
    if (newFilters.priceRange.min !== null) params.set('minPrice', newFilters.priceRange.min.toString());
    if (newFilters.priceRange.max !== null) params.set('maxPrice', newFilters.priceRange.max.toString());
    if (newFilters.colors.length > 0) params.set('colors', newFilters.colors.join(','));
    if (newFilters.fabrics.length > 0) params.set('fabrics', newFilters.fabrics.join(','));
    if (newFilters.sizes.length > 0) params.set('sizes', newFilters.sizes.join(','));
    if (newFilters.occasions.length > 0) params.set('occasions', newFilters.occasions.join(','));
    if (newFilters.regions.length > 0) params.set('regions', newFilters.regions.join(','));

    setSearchParams(params);
  };

  const loadProducts = async () => {
    setLoading(LOADING_STATES.LOADING);
    setError(null);

    try {
      const params = {
        first: 20,
        sort_key: filters.sortBy,
        reverse: filters.sortReverse,
        collection_handle: categoryInfo.collectionHandle,
        min_price: filters.priceRange.min,
        max_price: filters.priceRange.max
      };

      // Add search query for filters
      const searchQueries = [];
      if (filters.colors.length > 0) {
        searchQueries.push(`tag:${filters.colors.join(' OR tag:')}`);
      }
      if (filters.fabrics.length > 0) {
        searchQueries.push(`tag:${filters.fabrics.join(' OR tag:')}`);
      }
      if (filters.occasions.length > 0) {
        searchQueries.push(`tag:${filters.occasions.join(' OR tag:')}`);
      }
      if (filters.regions.length > 0) {
        searchQueries.push(`tag:${filters.regions.join(' OR tag:')}`);
      }

      if (searchQueries.length > 0) {
        params.search_query = searchQueries.join(' AND ');
      }

      const response = await getProducts(params);
      
      setProducts(response.products || []);
      setTotalCount(response.totalCount || 0);
      setHasNextPage(response.pageInfo?.hasNextPage || false);
      setLoading(LOADING_STATES.SUCCESS);

    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
      setLoading(LOADING_STATES.ERROR);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };

    switch (filterType) {
      case 'priceRange':
        newFilters.priceRange = value;
        break;
      case 'sort':
        newFilters.sortBy = value.sortBy;
        newFilters.sortReverse = value.reverse;
        break;
      default:
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
        break;
    }

    setFilters(newFilters);
    updateURL(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const newFilters = {
      priceRange: { min: null, max: null },
      colors: [],
      fabrics: [],
      sizes: [],
      occasions: [],
      regions: [],
      sortBy: 'CREATED_AT',
      sortReverse: true
    };
    setFilters(newFilters);
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) count++;
    count += filters.colors.length;
    count += filters.fabrics.length;
    count += filters.sizes.length;
    count += filters.occasions.length;
    count += filters.regions.length;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-elegant">
              {categoryInfo.name}
            </h1>
            {categoryInfo.description && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {categoryInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              activeFilterCount={getActiveFilterCount()}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn-outline flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                  <span>Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-black text-white text-xs rounded-full px-2 py-1">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>

                {/* Results Count */}
                <span className="text-sm text-gray-600">
                  {loading === LOADING_STATES.SUCCESS && (
                    `${totalCount} ${totalCount === 1 ? 'product' : 'products'} found`
                  )}
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={`${filters.sortBy}-${filters.sortReverse}`}
                  onChange={(e) => {
                    const [sortBy, reverse] = e.target.value.split('-');
                    handleFilterChange('sort', { sortBy, reverse: reverse === 'true' });
                  }}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value + option.reverse} value={`${option.value}-${option.reverse}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {getActiveFilterCount() > 0 && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Active Filters:</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.colors.map(color => (
                    <span key={color} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {color}
                      <button
                        onClick={() => handleFilterChange('colors', color)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {filters.fabrics.map(fabric => (
                    <span key={fabric} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {fabric}
                      <button
                        onClick={() => handleFilterChange('fabrics', fabric)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {/* Add similar blocks for other filter types */}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading === LOADING_STATES.LOADING && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                  </div>
                ))}
              </div>
            )}

            {loading === LOADING_STATES.ERROR && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😞</div>
                <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={loadProducts}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}

            {loading === LOADING_STATES.SUCCESS && products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or browse our other categories
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {loading === LOADING_STATES.SUCCESS && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && loading === LOADING_STATES.SUCCESS && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="btn-primary"
                  disabled={loading === LOADING_STATES.LOADING}
                >
                  {loading === LOADING_STATES.LOADING ? (
                    <LoadingSpinner size="small" color="white" />
                  ) : (
                    'Load More Products'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                activeFilterCount={getActiveFilterCount()}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;