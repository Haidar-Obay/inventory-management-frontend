export const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

export const getNowOffsetPx = (now, slotHeight, startHour = 7) => {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Adjust for start hour (startHour * 60 minutes)
  const adjustedMinutes = (hours * 60 + minutes) - (startHour * 60);
  
  // Only show indicator if within the visible time range
  if (adjustedMinutes < 0) {
    return null;
  }
  
  return adjustedMinutes * (slotHeight / 60);
};

export const autoScrollToNow = (scrollRef, now, slotHeight, startHour = 7) => {
  if (scrollRef.current) {
    const offset = getNowOffsetPx(now, slotHeight, startHour);
    const scrollTop = offset - 200; // Scroll to 200px above current time
    scrollRef.current.scrollTop = Math.max(0, scrollTop);
  }
};
