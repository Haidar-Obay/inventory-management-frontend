import React from 'react';

const DayEventsModal = ({ 
  isOpen, 
  onClose, 
  selectedDayDate, 
  selectedDayEvents, 
  onEventEdit, 
  onAddEvent 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[99999]" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 w-[95vw] max-w-lg sm:max-w-xl lg:max-w-2xl max-h-[85vh] overflow-hidden z-[999999] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Events for {selectedDayDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Events List */}
        <div className="overflow-y-auto max-h-[calc(85vh-200px)] space-y-3">
          {selectedDayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">No events</p>
              <p className="text-gray-600">This day is free of scheduled events.</p>
            </div>
          ) : (
            selectedDayEvents
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    onEventEdit(event);
                    onClose();
                  }}
                >
                  {/* Event Color Indicator */}
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  
                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                      {event.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {event.start.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })} - {event.end.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                  
                  {/* Edit Icon */}
                  <div className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
              ))
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              onAddEvent(selectedDayDate);
              onClose();
            }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Event
          </button>
          
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default DayEventsModal;
