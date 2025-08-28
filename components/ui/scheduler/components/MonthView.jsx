import React from 'react';

const MonthView = ({ 
  selectedDate, 
  weekDays, 
  filteredEvents, 
  onDayClick, 
  onShowDayEvents 
}) => {
  return (
    <div className="h-full min-h-0">
             {/* Month grid */}
       <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
         {/* Day headers */}
         {weekDays.map((day) => (
           <div
             key={day}
             className="bg-gray-50 dark:bg-gray-800 p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
           >
             {day}
           </div>
         ))}

        {/* Calendar days */}
        {(() => {
          const year = selectedDate.getFullYear();
          const month = selectedDate.getMonth();
          const firstDay = new Date(year, month, 1);
          const startDate = new Date(firstDay);
          startDate.setDate(startDate.getDate() - firstDay.getDay());
          
          const days = [];
          for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            days.push(currentDate);
          }

          return days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
                             <div
                 key={index}
                 className={`min-h-[60px] sm:min-h-[80px] p-1 border-r border-b border-gray-200 dark:border-gray-600 cursor-pointer transition-colors ${
                   isCurrentMonth 
                     ? 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700' 
                     : 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500'
                 } ${
                   isToday 
                     ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600' 
                     : ''
                 } ${
                   isSelected 
                     ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                     : ''
                 }`}
                 onClick={() => onDayClick(date)}
               >
                 <div className={`text-xs sm:text-sm font-medium mb-1 ${
                   isToday 
                     ? 'text-blue-600 dark:text-blue-400' 
                     : isCurrentMonth 
                       ? 'text-gray-900 dark:text-gray-100' 
                       : 'text-gray-400 dark:text-gray-500'
                 }`}>
                   {date.getDate()}
                 </div>
                
                {/* Event indicators */}
                {isCurrentMonth && (() => {
                  const dayEvents = filteredEvents.filter((ev) => 
                    ev.start.toDateString() === date.toDateString()
                  );
                  
                  if (dayEvents.length === 0) return null;
                  
                  // Show up to 3 events, with a count for additional ones
                  const eventsToShow = dayEvents.slice(0, 3);
                  const additionalCount = dayEvents.length - 3;
                  
                  return (
                                         <div className="space-y-1">
                       {eventsToShow.map((ev, index) => (
                         <div
                           key={ev.id}
                           className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                           style={{ 
                             backgroundColor: ev.color,
                             color: 'white'
                           }}
                           onClick={(e) => {
                             e.stopPropagation();
                             // Handle event click - could open edit dialog
                           }}
                         >
                           <div className="truncate font-medium text-[10px] sm:text-xs">
                             {ev.title}
                           </div>
                           <div className="text-[10px] sm:text-xs opacity-90 hidden sm:block">
                             {ev.start.toLocaleTimeString('en-US', { 
                               hour: 'numeric', 
                               minute: '2-digit',
                               hour12: true 
                             })}
                           </div>
                         </div>
                       ))}
                      
                                             {/* Show count for additional events */}
                       {additionalCount > 0 && (
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             onShowDayEvents(date, dayEvents);
                           }}
                           className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-1 py-0.5 rounded text-center transition-colors cursor-pointer w-full"
                         >
                           <span className="hidden sm:inline">+{additionalCount} more</span>
                           <span className="sm:hidden">+{additionalCount}</span>
                         </button>
                       )}
                    </div>
                  );
                })()}
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default MonthView;
