'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Building2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/SkeletonLoaders';
import { PropertyFilters, PropertyType, PropertyStatus } from '@/types';

const propertyTypes: { value: string; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'house', label: '🏡 House' },
  { value: 'apartment', label: '🏢 Apartment' },
  { value: 'villa', label: '🏰 Villa' },
  { value: 'condo', label: '🏙️ Condo' },
  { value: 'land', label: '🌱 Land' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
];

const sortOptions = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'views-desc', label: 'Most Viewed' },
];

const cities = ['Austin', 'Miami', 'New York', 'Los Angeles', 'Chicago', 'Seattle', 'Denver', 'Nashville', 'Phoenix', 'Boston', 'San Francisco'];

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({ page: 1, limit: 12 });
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isFetching } = useProperties(filters);
  const properties = data?.properties || [];
  const pagination = data?.pagination;

  const updateFilter = useCallback(<K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : prev.page }));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('search', searchInput || undefined);
  };

  const handleSortChange = (sortStr: string) => {
    const [sortBy, sortOrder] = sortStr.split('-');
    setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 12 });
    setSearchInput('');
  };

  const hasActiveFilters = filters.search || filters.type || filters.status || filters.city ||
    filters.minPrice || filters.maxPrice || filters.minBeds;

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary-400" />
            <span className="text-dark-400 text-sm">All Properties</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Explore Properties
            {pagination && <span className="text-dark-400 text-lg font-normal ml-3">({pagination.total} listings)</span>}
          </h1>
        </motion.div>

        {/* Search & Filter bar */}
        <motion.div
          className="glass-card p-4 mb-6 space-y-4"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="property-search"
                  type="text"
                  placeholder="Search by title, city, or description..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <button type="submit" id="search-submit-btn" className="btn-primary px-6 py-2.5">Search</button>
            </form>

            {/* Sort */}
            <select
              id="sort-select"
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="input-field w-full md:w-52"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Filter toggle */}
            <button
              id="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 whitespace-nowrap ${showFilters ? 'bg-primary-500/20 border-primary-500/50 text-primary-300' : 'border-dark-600 text-dark-300 hover:border-primary-500/30'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-white/5"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            >
              {/* Type */}
              <select
                id="filter-type"
                value={filters.type || ''}
                onChange={(e) => updateFilter('type', e.target.value as PropertyType | '')}
                className="input-field text-sm"
              >
                {propertyTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Status */}
              <select
                id="filter-status"
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value as PropertyStatus | '')}
                className="input-field text-sm"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* City */}
              <select
                id="filter-city"
                value={filters.city || ''}
                onChange={(e) => updateFilter('city', e.target.value || undefined)}
                className="input-field text-sm"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              {/* Min Price */}
              <input
                id="filter-min-price"
                type="number"
                placeholder="Min Price ($)"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="input-field text-sm"
              />

              {/* Max Price */}
              <input
                id="filter-max-price"
                type="number"
                placeholder="Max Price ($)"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="input-field text-sm"
              />

              {/* Min Beds */}
              <select
                id="filter-beds"
                value={filters.minBeds || ''}
                onChange={(e) => updateFilter('minBeds', e.target.value ? Number(e.target.value) : undefined)}
                className="input-field text-sm"
              >
                <option value="">Min Beds</option>
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}+ Beds</option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Active filters + clear */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-dark-400">Active filters:</span>
              {filters.search && <span className="badge-primary text-xs">{filters.search} <button onClick={() => { updateFilter('search', undefined); setSearchInput(''); }} className="ml-1"><X className="w-2.5 h-2.5" /></button></span>}
              {filters.type && <span className="badge-primary text-xs">{filters.type} <button onClick={() => updateFilter('type', undefined)} className="ml-1"><X className="w-2.5 h-2.5" /></button></span>}
              {filters.city && <span className="badge-primary text-xs">{filters.city} <button onClick={() => updateFilter('city', undefined)} className="ml-1"><X className="w-2.5 h-2.5" /></button></span>}
              <button id="clear-filters-btn" onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 ml-2">Clear all</button>
            </div>
          )}
        </motion.div>

        {/* Properties Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-opacity duration-200 ${isFetching ? 'opacity-70' : ''}`}>
          {isLoading
            ? Array(12).fill(0).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.length > 0
              ? properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))
              : (
                <div className="col-span-full text-center py-20">
                  <Filter className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No properties found</h3>
                  <p className="text-dark-400 mb-6">Try adjusting your search filters</p>
                  <button id="no-results-clear-btn" onClick={clearFilters} className="btn-primary">Clear Filters</button>
                </div>
              )
          }
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              id="pagination-prev"
              onClick={() => updateFilter('page', (filters.page || 1) - 1)}
              disabled={!pagination.hasPrev}
              className="flex items-center gap-1 px-4 py-2 glass-card text-sm text-dark-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  id={`page-${page}`}
                  onClick={() => updateFilter('page', page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === pagination.page
                      ? 'bg-primary-600 text-white'
                      : 'glass-card text-dark-300 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              id="pagination-next"
              onClick={() => updateFilter('page', (filters.page || 1) + 1)}
              disabled={!pagination.hasNext}
              className="flex items-center gap-1 px-4 py-2 glass-card text-sm text-dark-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
