import React from 'react';
import EventRenderer from './EventRenderer';

const ListView = ({ 
  filteredEvents, 
  selectedDate, 
  onEventClick 
}) => {
  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => a.start - b.start);

  // Group events by date
  const eventsByDate = sortedEvents.reduce((groups, event) => {
    const dateKey = event.start.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {});

  // Get all unique dates and sort them
  const sortedDates = Object.keys(eventsByDate).sort((a, b) => new Date(a) - new Date(b));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getEventDuration = (start, end) => {
    const durationMs = end - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 py-12">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">No events scheduled</p>
        <p className="text-sm">Events you add will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-6">
        {sortedDates.map((dateKey) => {
          const events = eventsByDate[dateKey];
          const date = new Date(dateKey);
          
          return (
            <div key={dateKey} className="space-y-3">
              {/* Date header */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {date.getDate()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatDate(dateKey)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {events.length} event{events.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Events for this date */}
              <div className="space-y-2 ml-[72px]">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="group cursor-pointer"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all duration-200 bg-white dark:bg-gray-800">
                      {/* Time column */}
                      <div className="min-w-[80px] text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatTime(event.start)}
                      </div>
                      
                      {/* Duration */}
                      <div className="min-w-[60px] text-xs text-gray-500 dark:text-gray-400">
                        {getEventDuration(event.start, event.end)}
                      </div>

                      {/* Event details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: event.color }}
                          />
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {event.title}
                          </h4>
                        </div>
                        
                        {/* Time range */}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;
