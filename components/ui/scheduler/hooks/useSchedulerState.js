import { useState, useMemo, useRef, useEffect } from 'react';

export const useSchedulerState = () => {
  // View and date state
  const [viewMode, setViewMode] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Event state
  const [events, setEvents] = useState([]);
  
  // Search and filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState(null);
  const [filterColor, setFilterColor] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Event dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftEvent, setDraftEvent] = useState(null);
  
  // Day events modal state
  const [showDayEvents, setShowDayEvents] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  
  // Now indicator state
  const [now, setNow] = useState(new Date());
  const scrollRef = useRef(null);
  
  // Time settings state with localStorage persistence
  const [timeSettings, setTimeSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scheduler-time-settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved time settings, using defaults');
        }
      }
    }
    return {
      startHour: 7,  // 7 AM
      endHour: 21,   // 9 PM
      use24HourFormat: true,
      timeInterval: 60 // 60 minutes = 1 hour
    };
  });
  const [showTimeSettings, setShowTimeSettings] = useState(false);
  
  // Validated time settings setter with localStorage persistence
  const setTimeSettingsValidated = (newSettings) => {
    const { startHour, endHour } = newSettings;
    if (startHour >= endHour) {
      // If start hour is greater than or equal to end hour, adjust end hour
      newSettings.endHour = startHour + 1;
    }
    setTimeSettings(newSettings);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('scheduler-time-settings', JSON.stringify(newSettings));
    }
  };
  
  // Constants
  const SLOT_HEIGHT_PX = 64; // Base height for 1-hour slots
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Dynamic slot height based on time interval
  const slotHeight = useMemo(() => {
    const baseHeight = SLOT_HEIGHT_PX;
    const intervalRatio = timeSettings.timeInterval / 60; // Convert to hours
    return Math.max(baseHeight * intervalRatio, 32); // Minimum height of 32px
  }, [timeSettings.timeInterval]);
  
  // Dynamic time slots based on user settings and interval
  const timeSlots = useMemo(() => {
    const slots = [];
    const totalMinutes = (timeSettings.endHour - timeSettings.startHour + 1) * 60;
    const intervalMinutes = timeSettings.timeInterval;
    
    for (let minute = 0; minute <= totalMinutes; minute += intervalMinutes) {
      const currentHour = timeSettings.startHour + Math.floor(minute / 60);
      const currentMinute = minute % 60;
      
      if (timeSettings.use24HourFormat) {
        slots.push(`${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`);
      } else {
        const displayHour = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
        const ampm = currentHour >= 12 ? 'PM' : 'AM';
        const minuteDisplay = currentMinute === 0 ? '' : `:${currentMinute.toString().padStart(2, '0')}`;
        slots.push(`${displayHour}${minuteDisplay} ${ampm}`);
      }
    }
    return slots;
  }, [timeSettings.startHour, timeSettings.endHour, timeSettings.use24HourFormat, timeSettings.timeInterval]);
  
  // Computed values
  const startOfWeek = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }, [selectedDate]);
  
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [startOfWeek]);
  
  const headerRangeLabel = useMemo(() => {
    if (viewMode === 'day') {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (viewMode === 'week') {
      const start = weekDates[0];
      const end = weekDates[6];
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  }, [viewMode, selectedDate, weekDates]);
  
  // Update now every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  
  return {
    // State
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    events,
    setEvents,
    searchQuery,
    setSearchQuery,
    filterDate,
    setFilterDate,
    filterColor,
    setFilterColor,
    showFilters,
    setShowFilters,
    dialogOpen,
    setDialogOpen,
    draftEvent,
    setDraftEvent,
    showDayEvents,
    setShowDayEvents,
    // Time settings
    timeSettings,
    setTimeSettings: setTimeSettingsValidated,
    showTimeSettings,
    setShowTimeSettings,
    selectedDayEvents,
    setSelectedDayEvents,
    selectedDayDate,
    setSelectedDayDate,
    now,
    scrollRef,
    
    // Constants
    SLOT_HEIGHT_PX,
    slotHeight,
    weekDays,
    timeSlots,
    
    // Computed values
    startOfWeek,
    weekDates,
    headerRangeLabel
  };
};
