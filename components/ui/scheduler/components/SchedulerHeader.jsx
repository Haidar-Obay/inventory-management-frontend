import React, { useEffect, useRef } from 'react';
import { Button } from '../../button';
import { CardTitle } from '../../card';

const SchedulerHeader = ({
  viewMode,
  setViewMode,
  headerRangeLabel,
  selectedDate,
  goPrev,
  goNext,
  goToday,
  handleAddEvent,
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
  events,
  timeSettings,
  setTimeSettings,
  showTimeSettings,
  setShowTimeSettings,
  showViewDropdown,
  setShowViewDropdown
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowViewDropdown(false);
      }
    };

    if (showViewDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showViewDropdown, setShowViewDropdown]);
  return (
    <>
      <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
        {/* Left Side: Search, Filter, Time */}
        <div className="flex items-center gap-2 flex-wrap">
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
            className="px-3 sm:px-4"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
          </Button>
          
          {/* Time Settings Toggle */}
          <Button
            variant={showTimeSettings ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowTimeSettings(!showTimeSettings)}
            className="px-3 sm:px-4"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
        </div>
        
        {/* Middle: Today Button + Navigation Arrows + Current Date */}
        <div className="flex items-center gap-2">
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
          
          {/* Current Date Display */}
          <div className="hidden sm:flex items-center ml-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
        
        {/* Right Side: View Dropdown + Add Event Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="px-2 sm:px-3 text-xs sm:text-sm flex items-center gap-1 min-w-[6rem] justify-between"
            >
              <span>{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
              <svg 
                className={`h-3 w-3 transition-transform duration-200 ${showViewDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
            
            {/* Dropdown Menu */}
            {showViewDropdown && (
              <div className="absolute top-full left-0 mt-1 w-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-30">
                <button
                  onClick={() => {
                    setViewMode('day');
                    setShowViewDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg ${
                    viewMode === 'day' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => {
                    setViewMode('week');
                    setShowViewDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    viewMode === 'week' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => {
                    setViewMode('month');
                    setShowViewDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg ${
                    viewMode === 'month' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Month
                </button>
              </div>
            )}
          </div>
          
          {/* Add Event Button */}
          <Button onClick={handleAddEvent} size="sm" className="px-2 sm:px-3 text-xs sm:text-sm">
            <span>+</span>
          </Button>
        </div>
      </div>
      
      {/* Clear Filters - Only show when needed */}
      {(searchQuery || filterDate || filterColor !== 'all') && (
        <div className="flex justify-end mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearFilters(setSearchQuery, setFilterDate, setFilterColor)}
            className="text-gray-600 hover:text-gray-800 px-3 sm:px-4"
          >
            Clear
          </Button>
        </div>
      )}
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
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
      
      {/* Time Settings Panel */}
      {showTimeSettings && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-0 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          {/* Start Hour */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Start Time:</label>
            <div className="flex items-center gap-2">
              <select
                value={timeSettings.startHour === 0 ? 12 : timeSettings.startHour > 12 ? timeSettings.startHour - 12 : timeSettings.startHour}
                onChange={(e) => {
                  const hour = parseInt(e.target.value);
                  const isPM = timeSettings.startHour >= 12;
                  const newHour = hour === 12 ? (isPM ? 12 : 0) : (isPM ? hour + 12 : hour);
                  setTimeSettings(prev => ({ ...prev, startHour: newHour }));
                }}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={timeSettings.startHour >= 12 ? 'PM' : 'AM'}
                onChange={(e) => {
                  const isPM = e.target.value === 'PM';
                  const currentHour = timeSettings.startHour === 0 ? 12 : timeSettings.startHour > 12 ? timeSettings.startHour - 12 : timeSettings.startHour;
                  const newHour = currentHour === 12 ? (isPM ? 12 : 0) : (isPM ? currentHour + 12 : currentHour);
                  setTimeSettings(prev => ({ ...prev, startHour: newHour }));
                }}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          
          {/* End Hour */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">End Time:</label>
            <div className="flex items-center gap-2">
              <select
                value={timeSettings.endHour === 0 ? 12 : timeSettings.endHour > 12 ? timeSettings.endHour - 12 : timeSettings.endHour}
                onChange={(e) => {
                  const hour = parseInt(e.target.value);
                  const isPM = timeSettings.endHour >= 12;
                  const newHour = hour === 12 ? (isPM ? 12 : 0) : (isPM ? hour + 12 : hour);
                  setTimeSettings(prev => ({ ...prev, endHour: newHour }));
                }}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                value={timeSettings.endHour >= 12 ? 'PM' : 'AM'}
                onChange={(e) => {
                  const isPM = e.target.value === 'PM';
                  const currentHour = timeSettings.endHour === 0 ? 12 : timeSettings.endHour > 12 ? timeSettings.endHour - 12 : timeSettings.endHour;
                  const newHour = currentHour === 12 ? (isPM ? 12 : 0) : (isPM ? currentHour + 12 : currentHour);
                  setTimeSettings(prev => ({ ...prev, endHour: newHour }));
                }}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:border-transparent min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          
          {/* Time Format Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Format:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeSettings(prev => ({ ...prev, use24HourFormat: true }))}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  timeSettings.use24HourFormat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                24h
              </button>
              <button
                onClick={() => setTimeSettings(prev => ({ ...prev, use24HourFormat: false }))}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  !timeSettings.use24HourFormat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                12h
              </button>
            </div>
          </div>
          
          {/* Time Interval Control */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-0">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Interval:</label>
            <select
              value={timeSettings.timeInterval}
              onChange={(e) => setTimeSettings(prev => ({ ...prev, timeInterval: parseInt(e.target.value) }))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
            </select>
          </div>
          
          {/* Time Range Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400 sm:ml-auto w-full sm:w-auto text-center sm:text-left">
            {timeSettings.endHour - timeSettings.startHour + 1} hours ({timeSettings.startHour === 0 ? '12 AM' : timeSettings.startHour < 12 ? `${timeSettings.startHour} AM` : timeSettings.startHour === 12 ? '12 PM' : `${timeSettings.startHour - 12} PM`} - {timeSettings.endHour === 0 ? '12 AM' : timeSettings.endHour < 12 ? `${timeSettings.endHour} AM` : timeSettings.endHour === 12 ? '12 PM' : `${timeSettings.endHour - 12} PM`})
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
