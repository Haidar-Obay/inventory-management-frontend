import React from 'react';
import { Button } from '../../button';

const NoEventsFound = ({ onClearFilters }) => {
  return (
    <div className="flex items-center justify-center h-32 text-gray-500">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
        </svg>
        <p className="text-lg font-medium text-gray-900 mb-2">No events found</p>
        <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
        <Button onClick={onClearFilters} variant="outline" size="sm">
          Clear all filters
        </Button>
      </div>
    </div>
  );
};

export default NoEventsFound;
