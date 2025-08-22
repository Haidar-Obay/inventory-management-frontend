import React from 'react';
import { Button } from '../../button';
import { CardTitle } from '../../card';

const SchedulerHeader = ({
  viewMode,
  setViewMode,
  headerRangeLabel,
  goPrev,
  goNext,
  goToday,
  handleAddEvent,
  addSampleEvents,
  searchQuery,
  setSearchQuery,
  filterDate,
  setFilterDate,
  filterColor,
  setFilterColor,
  showFilters,
  setShowFilters,
  uniqueColors,
  clearFilters,
  filteredEvents,
  events
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Navigation and Title */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={goPrev} className="px-2 sm:px-3">
              <span className="hidden sm:inline">←</span>
              <span className="sm:hidden">‹</span>
            </Button>
            <Button variant="outline" size="sm" onClick={goToday} className="px-2 sm:px-3 text-xs sm:text-sm">
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goNext} className="px-2 sm:px-3">
              <span className="hidden sm:inline">→</span>
              <span className="sm:hidden">›</span>
            </Button>
          </div>
          <CardTitle className="ml-2 text-sm sm:text-base lg:text-lg font-semibold truncate max-w-[200px] sm:max-w-none">
            {headerRangeLabel}
          </CardTitle>
        </div>
        
        {/* View Toggles and Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
              className="px-2 sm:px-3 text-xs sm:text-sm"
            >
              Day
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="px-2 sm:px-3 text-xs sm:text-sm"
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="px-2 sm:px-3 text-xs sm:text-sm"
            >
              Month
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={handleAddEvent} size="sm" className="px-2 sm:px-3 text-xs sm:text-sm">
              <span className="hidden sm:inline">+ Add Event</span>
              <span className="sm:hidden">+ Event</span>
            </Button>
            <Button onClick={addSampleEvents} size="sm" variant="outline" className="px-2 sm:px-3 text-xs sm:text-sm">
              <span className="hidden sm:inline">Add Sample Events</span>
              <span className="sm:hidden">Sample</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4">
        {/* Search and Filter Row */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative w-64 sm:w-80">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Filter Toggle */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 sm:px-4"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filter</span>
          </Button>
        </div>
        
        {/* Clear Filters */}
        {(searchQuery || filterDate || filterColor !== 'all') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearFilters(setSearchQuery, setFilterDate, setFilterColor)}
            className="text-gray-600 hover:text-gray-800 px-3 sm:px-4"
          >
            Clear
          </Button>
        )}
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Date:</label>
            <input
              type="date"
              value={filterDate || ''}
              onChange={(e) => setFilterDate(e.target.value || null)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          {/* Color Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Color:</label>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Colors</option>
              {uniqueColors.map((color) => (
                <option key={color} value={color}>
                  {color === '#3b82f6' ? 'Blue' : 
                   color === '#10b981' ? 'Green' : 
                   color === '#f59e0b' ? 'Orange' : 
                   color === '#ef4444' ? 'Red' : 
                   color === '#8b5cf6' ? 'Purple' : 
                   color === '#06b6d4' ? 'Cyan' : 
                   color === '#f97316' ? 'Orange' : 
                   color === '#84cc16' ? 'Lime' : 'Custom'}
                </option>
              ))}
            </select>
          </div>
          
          {/* Results Count */}
          <div className="text-sm text-gray-600 dark:text-gray-400 sm:ml-auto w-full sm:w-auto text-center sm:text-left">
            {filteredEvents.length} of {events.length} events
          </div>
        </div>
      )}
      
      {/* Active Filters Indicator */}
      {(searchQuery || filterDate || filterColor !== 'all') && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium whitespace-nowrap">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                <span className="hidden sm:inline">Search: </span>
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-blue-600">×</button>
              </span>
            )}
            {filterDate && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                <span className="hidden sm:inline">Date: </span>
                {new Date(filterDate).toLocaleDateString()}
                <button onClick={() => setFilterDate(null)} className="ml-1 hover:text-green-600">×</button>
              </span>
            )}
            {filterColor !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                <span className="hidden sm:inline">Color: </span>
                {filterColor === '#3b82f6' ? 'Blue' : 
                 filterColor === '#10b981' ? 'Green' : 
                 filterColor === '#f59e0b' ? 'Orange' : 
                 filterColor === '#ef4444' ? 'Red' : 
                 filterColor === '#8b5cf6' ? 'Purple' : 
                 filterColor === '#06b6d4' ? 'Cyan' : 
                 filterColor === '#f97316' ? 'Orange' : 
                 filterColor === '#84cc16' ? 'Lime' : 'Custom'}
                <button onClick={() => setFilterColor('all')} className="ml-1 hover:text-purple-600">×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SchedulerHeader;
