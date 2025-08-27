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
    handleShowDayEvents
  };
};
