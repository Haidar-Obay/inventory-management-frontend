import React from 'react';
import EventRenderer from './EventRenderer';
import { isSameDay, getNowOffsetPx } from '../utils/dateUtils';

const WeekView = ({ 
  weekDates, 
  timeSlots, 
  filteredEvents, 
  SLOT_HEIGHT_PX, 
  now, 
  onSlotClick, 
  onEventClick 
}) => {
  return (
    <div className="flex h-full min-h-0">
      {/* Time gutter */}
      <div className="w-14 sm:w-16 lg:w-20 shrink-0">
        <div className="h-12 flex items-center justify-end pr-1 sm:pr-2 text-xs sm:text-sm font-medium text-muted-foreground dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
          <span className="hidden sm:inline">Time</span>
          <span className="sm:hidden">T</span>
        </div>
        {timeSlots.map((time) => (
          <div
            key={time}
            className="h-16 flex items-center justify-end pr-1 sm:pr-2 text-xs text-muted-foreground dark:text-gray-400 border-r border-gray-200 dark:border-gray-600"
          >
            <span className="hidden sm:inline">{time}</span>
            <span className="sm:hidden">{time.split(':')[0]}</span>
          </div>
        ))}
      </div>

      {/* Week days grid */}
      <div className="flex-1 grid grid-cols-7">
        {weekDates.map((date, dayIndex) => (
          <div key={date.toISOString()} className="border-l border-gray-200 dark:border-gray-600 relative">
                         <div className="h-12 flex items-center justify-center text-xs sm:text-sm font-medium border-b border-gray-200 dark:border-gray-600 px-1">
               <div className="text-center">
                 <div className="font-semibold text-gray-900 dark:text-gray-100">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                 <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{date.getDate()}</div>
               </div>
             </div>
            {timeSlots.map((time) => (
              <div
                key={`${date.toDateString()}-${time}`}
                className="h-16 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors relative"
                onClick={() => {
                  const slotDate = new Date(date);
                  const [hour] = time.split(':');
                  slotDate.setHours(parseInt(hour), 0, 0, 0);
                  onSlotClick(slotDate);
                }}
              >
                {/* Render events */}
                <EventRenderer
                  events={filteredEvents}
                  date={date}
                  time={time}
                  SLOT_HEIGHT_PX={SLOT_HEIGHT_PX}
                  onEventClick={onEventClick}
                />
              </div>
            ))}
            {isSameDay(date, now) && getNowOffsetPx(now, SLOT_HEIGHT_PX) != null && (
              <div
                className="absolute left-0 right-0 h-px bg-red-500"
                style={{ top: `${getNowOffsetPx(now, SLOT_HEIGHT_PX)}px` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
