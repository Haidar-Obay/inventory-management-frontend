import React, { useState } from 'react';
import { groupOverlappingEvents, calculateEventPosition } from '../utils/eventUtils';

const EventRenderer = ({
  events,
  date,
  time,
  SLOT_HEIGHT_PX,
  onEventClick
}) => {
  const [tooltipEvent, setTooltipEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const slotEvents = events
    .filter((ev) => ev.start.toDateString() === date.toDateString())
    .filter((ev) => ev.start.getHours() === parseInt(time.split(':')[0]));

  if (slotEvents.length === 0) return null;

  const overlappingGroups = groupOverlappingEvents(slotEvents);

  return (
    <>
      {overlappingGroups.map((group, groupIndex) => {
        // Always use horizontal stacking for overlapping events, regardless of view
        const groupWidth = 100 / group.length;

        return group.map((ev, eventIndex) => {
          const { topOffset, totalHeight } = calculateEventPosition(ev, SLOT_HEIGHT_PX);
          
          // Calculate horizontal position for overlapping events
          const leftOffset = (eventIndex * groupWidth) + '%';
          const width = `${groupWidth - 2}%`;

          return (
            <div
              key={ev.id}
              className="absolute rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg group"
              style={{ 
                backgroundColor: ev.color,
                top: `${topOffset}px`,
                height: `${totalHeight}px`,
                minHeight: '20px',
                left: leftOffset,
                width: width,
                zIndex: 10 + groupIndex
              }}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(ev);
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ 
                  x: rect.left + rect.width / 2, 
                  y: rect.top - 10 
                });
                setTooltipEvent(ev);
              }}
              onMouseLeave={() => setTooltipEvent(null)}
            >
              {/* Event border and shadow */}
              <div className="absolute inset-0 rounded-lg border border-white/20 shadow-md group-hover:shadow-xl group-hover:border-white/40 transition-all duration-200"></div>
              
              {/* Event content with better spacing */}
              <div className="relative h-full p-1.5 flex flex-col justify-center overflow-hidden">
                {/* Event title with better typography */}
                <div className="text-white font-semibold text-xs leading-tight drop-shadow-sm truncate text-center">
                  {ev.title || 'Event'}
                </div>
                
                {/* Time display - only show for events with enough height */}
                {totalHeight >= 80 && (
                  <div className="text-white/90 text-[10px] font-medium leading-tight drop-shadow-sm mt-1">
                    <div className="flex items-center gap-1 justify-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0"></span>
                      <span className="truncate">
                        {ev.start.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                    {totalHeight >= 100 && (
                      <div className="flex items-center gap-1 justify-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0"></span>
                        <span className="truncate">
                          {ev.end.toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200"></div>
            </div>
          );
        });
      })}

      {/* Event Tooltip */}
      {tooltipEvent && (
        <div
          className="fixed z-[999999] bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl border border-gray-700 text-sm max-w-xs pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          
          {/* Event title */}
          <div className="font-semibold text-white mb-1 truncate">
            {tooltipEvent.title}
          </div>
          
          {/* Event time */}
          <div className="text-gray-300 text-xs mb-1">
            {tooltipEvent.start.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          
          {/* Event duration */}
          <div className="text-gray-300 text-xs">
            {tooltipEvent.start.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })} - {tooltipEvent.end.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
          
          {/* Event color indicator */}
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tooltipEvent.color }}
            ></div>
            <span className="text-xs text-gray-400">Event</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EventRenderer;
