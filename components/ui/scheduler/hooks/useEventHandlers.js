export const useEventHandlers = (setEvents, setDraftEvent, setDialogOpen, selectedDate) => {
  
  const handleAddEvent = () => {
    const now = new Date();
    // Ensure the time is within our visible range (7 AM - 9 PM)
    let hours = now.getHours();
    if (hours < 7) hours = 9; // Default to 9 AM if before 7 AM
    if (hours > 21) hours = 9; // Default to 9 AM if after 9 PM
    
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setDraftEvent({ id: undefined, title: '', start, end, color: '#3b82f6' });
    setDialogOpen(true);
  };

  const handleSlotClick = (date) => {
    const start = new Date(date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setDraftEvent({ id: undefined, title: '', start, end, color: '#3b82f6' });
    setDialogOpen(true);
  };

  const handleEventSave = (ev) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === ev.id);
      return exists ? prev.map((e) => (e.id === ev.id ? ev : e)) : [...prev, ev];
    });
  };

  const handleEventDelete = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const addSampleEvents = () => {
    const today = new Date();
    const sampleEvents = [
      {
        id: 'sample1',
        title: 'Team Meeting',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30, 0),
        color: '#3b82f6'
      },
      {
        id: 'sample2',
        title: 'Lunch Break',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0, 0),
        color: '#10b981'
      },
      {
        id: 'sample3',
        title: 'Project Review',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 15, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0),
        color: '#f59e0b'
      },
      // Add overlapping events to test the new functionality
      {
        id: 'sample4',
        title: 'Overlapping Event 1',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0),
        color: '#ef4444'
      },
      {
        id: 'sample5',
        title: 'Overlapping Event 2',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 15, 0),
        color: '#8b5cf6'
      },
      {
        id: 'sample6',
        title: 'Triple Overlap',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0, 0),
        color: '#06b6d4'
      },
      {
        id: 'sample7',
        title: 'Triple Overlap 2',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 15, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 45, 0),
        color: '#f97316'
      },
      {
        id: 'sample8',
        title: 'Triple Overlap 3',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30, 0),
        color: '#84cc16'
      }
    ];
    setEvents(sampleEvents);
  };

  const handleShowDayEvents = (date, events, setSelectedDayDate, setSelectedDayEvents, setShowDayEvents) => {
    setSelectedDayDate(date);
    setSelectedDayEvents(events);
    setShowDayEvents(true);
  };

  return {
    handleAddEvent,
    handleSlotClick,
    handleEventSave,
    handleEventDelete,
    addSampleEvents,
    handleShowDayEvents
  };
};
