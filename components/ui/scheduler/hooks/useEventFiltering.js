import { useMemo } from 'react';

export const useEventFiltering = (events, searchQuery, filterDate, filterColor) => {
  
  // Filter events based on search and filter criteria
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search query filter
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Date filter
      if (filterDate) {
        const eventDate = new Date(event.start);
        const filterDateObj = new Date(filterDate);
        if (eventDate.toDateString() !== filterDateObj.toDateString()) {
          return false;
        }
      }
      
      // Color filter
      if (filterColor !== 'all' && event.color !== filterColor) {
        return false;
      }
      
      return true;
    });
  }, [events, searchQuery, filterDate, filterColor]);
  
  // Get unique colors from events for filter dropdown
  const uniqueColors = useMemo(() => {
    const colors = [...new Set(events.map(event => event.color))];
    return colors;
  }, [events]);
  
  // Clear all filters
  const clearFilters = (setSearchQuery, setFilterDate, setFilterColor) => {
    setSearchQuery('');
    setFilterDate(null);
    setFilterColor('all');
  };
  
  return {
    filteredEvents,
    uniqueColors,
    clearFilters
  };
};
