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
      use24HourFormat: true
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
  const SLOT_HEIGHT_PX = 64;
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Dynamic time slots based on user settings
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = timeSettings.startHour; hour <= timeSettings.endHour; hour++) {
      if (timeSettings.use24HourFormat) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      } else {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        slots.push(`${displayHour}:00 ${ampm}`);
      }
    }
    return slots;
  }, [timeSettings.startHour, timeSettings.endHour, timeSettings.use24HourFormat]);
  
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
    weekDays,
    timeSlots,
    
    // Computed values
    startOfWeek,
    weekDates,
    headerRangeLabel
  };
};
