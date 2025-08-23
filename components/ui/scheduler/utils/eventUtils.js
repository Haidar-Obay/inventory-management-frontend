export const groupOverlappingEvents = (slotEvents) => {
  if (slotEvents.length === 0) return [];
  
  // Group overlapping events
  const overlappingGroups = [];
  const processedEvents = new Set();
  
  slotEvents.forEach((ev) => {
    if (processedEvents.has(ev.id)) return;
    
    const group = [ev];
    processedEvents.add(ev.id);
    
    // Find all events that overlap with this event
    slotEvents.forEach((otherEv) => {
      if (otherEv.id === ev.id || processedEvents.has(otherEv.id)) return;
      
      // Check if events overlap
      const evStart = ev.start.getTime();
      const evEnd = ev.end.getTime();
      const otherStart = otherEv.start.getTime();
      const otherEnd = otherEv.end.getTime();
      
      if (evStart < otherEnd && evEnd > otherStart) {
        group.push(otherEv);
        processedEvents.add(otherEv.id);
      }
    });
    
    overlappingGroups.push(group);
  });
  
  return overlappingGroups;
};

export const calculateEventPosition = (ev, SLOT_HEIGHT_PX) => {
  const eventStartHour = ev.start.getHours();
  const eventStartMinutes = ev.start.getMinutes();
  const eventEndHour = ev.end.getHours();
  const eventEndMinutes = ev.end.getMinutes();
  
  // Calculate total duration in minutes
  const totalDurationMinutes = (eventEndHour - eventStartHour) * 60 + (eventEndMinutes - eventStartMinutes);
  
  // Calculate position and height for the entire event
  const topOffset = (eventStartMinutes / 60) * SLOT_HEIGHT_PX;
  const totalHeight = (totalDurationMinutes / 60) * SLOT_HEIGHT_PX;
  
  return { topOffset, totalHeight };
};
