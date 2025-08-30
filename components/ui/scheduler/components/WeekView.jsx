import React from 'react';
import EventRenderer from './EventRenderer';
import { isSameDay, getNowOffsetPx } from '../utils/dateUtils';

const WeekView = ({ 
  weekDates, 
  timeSlots, 
  filteredEvents, 
  slotHeight, 
  timeSettings,
  now, 
  onSlotClick, 
  onEventClick 
}) => {
  return (
    <div className="flex w-full">
      {/* Time gutter */}
      <div className="w-14 sm:w-16 lg:w-20 shrink-0">
        {/* Sticky Time Header */}
        <div 
          className="sticky top-0 z-20 flex items-center justify-end pr-1 sm:pr-2 text-xs sm:text-sm font-medium text-muted-foreground dark:text-gray-300 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm"
          style={{ height: '60px', top: '-25px' }}
        >
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

      {/* Week days grid */}
      <div className="flex-1 grid grid-cols-7">
        {weekDates.map((date, dayIndex) => {
          const isToday = isSameDay(date, now);
          return (
            <div 
              key={date.toISOString()} 
              className={`border-l border-gray-300 dark:border-gray-600 relative ${
                isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
            {/* Sticky Day Header */}
            <div 
              className={`sticky top-0 z-20 flex items-center justify-center text-xs sm:text-sm font-medium border-b border-gray-300 dark:border-gray-600 px-1 shadow-sm ${
                isToday 
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-500' 
                  : 'bg-white dark:bg-gray-900'
              }`}
              style={{ height: '60px', top: '-25px' }}
            >
              <div className="text-center">
                <div className={`font-semibold ${
                  isToday 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg sm:text-xl font-bold ${
                  isToday 
                    ? 'text-blue-800 dark:text-blue-200' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {date.getDate()}
                </div>
              </div>
            </div>
            {timeSlots.map((time) => (
              <div
                key={`${date.toDateString()}-${time}`}
                className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors relative"
                style={{ height: `${slotHeight}px` }}
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
                  slotHeight={slotHeight}
                  onEventClick={onEventClick}
                />
              </div>
            ))}
            {isSameDay(date, now) && getNowOffsetPx(now, slotHeight, timeSettings.startHour) != null && (
              <div
                className="absolute left-0 right-0 h-px bg-red-500"
                style={{ top: `${getNowOffsetPx(now, slotHeight, timeSettings.startHour)}px` }}
              />
            )}
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default WeekView;
