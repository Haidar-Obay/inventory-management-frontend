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
  
  // Constants
  const SLOT_HEIGHT_PX = 64;
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // Reduced time slots to a more reasonable range (7 AM to 9 PM)
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];
  
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
