import React from 'react';
import EventRenderer from './EventRenderer';
import { isSameDay, getNowOffsetPx } from '../utils/dateUtils';

const DayView = ({ 
  selectedDate, 
  timeSlots, 
  filteredEvents, 
  slotHeight, 
  timeSettings,
  now, 
  onSlotClick, 
  onEventClick 
}) => {
  return (
    <div className="flex h-full min-h-0">
      {/* Time gutter */}
      <div className="w-14 sm:w-16 lg:w-20 shrink-0">
        {/* Sticky Time Header */}
        <div className="sticky top-0 z-20 h-12 flex items-center justify-end pr-1 sm:pr-2 text-xs sm:text-sm font-medium text-muted-foreground dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm">
          <span className="hidden sm:inline">Time</span>
          <span className="sm:hidden">T</span>
        </div>
        {timeSlots.map((time) => (
          <div
            key={time}
            className="flex items-center justify-end pr-1 sm:pr-2 text-xs text-muted-foreground dark:text-gray-400 border-r border-gray-200 dark:border-gray-600"
            style={{ height: `${slotHeight}px` }}
          >
            <span className="hidden sm:inline">{time}</span>
            <span className="sm:hidden">{time.split(':')[0]}</span>
          </div>
        ))}
      </div>

      {/* Single day column */}
      <div className="flex-1 relative">
        {/* Sticky Day Header */}
        <div className="sticky top-0 z-20 h-12 flex items-center justify-center text-xs sm:text-sm font-medium border-b border-gray-200 dark:border-gray-600 px-2 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-gray-900 dark:text-gray-100">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</div>
            <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        {timeSlots.map((time) => (
          <div
            key={time}
            className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors relative"
            style={{ height: `${slotHeight}px` }}
            onClick={() => {
              const [hour] = time.split(':');
              const date = new Date(selectedDate);
              date.setHours(parseInt(hour), 0, 0, 0);
              onSlotClick(date);
            }}
          >
            {/* Render events */}
            <EventRenderer
              events={filteredEvents}
              date={selectedDate}
              time={time}
              slotHeight={slotHeight}
              onEventClick={onEventClick}
            />
          </div>
        ))}
        {isSameDay(selectedDate, now) && getNowOffsetPx(now, slotHeight, timeSettings.startHour) != null && (
          <div
            className="absolute left-0 right-0 h-px bg-red-500"
            style={{ top: `${getNowOffsetPx(now, slotHeight, timeSettings.startHour)}px` }}
          />
        )}
      </div>
    </div>
  );
};

export default DayView;
