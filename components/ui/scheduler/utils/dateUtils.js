export const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

export const getNowOffsetPx = (now, SLOT_HEIGHT_PX) => {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Adjust for 7 AM start time (7 * 60 = 420 minutes)
  const adjustedMinutes = (hours * 60 + minutes) - 420;
  
  // Only show indicator if within the visible time range (7 AM - 9 PM)
  if (adjustedMinutes < 0 || adjustedMinutes > 900) { // 900 minutes = 15 hours (7 AM to 9 PM)
    return null;
  }
  
  return adjustedMinutes * (SLOT_HEIGHT_PX / 60);
};

export const autoScrollToNow = (scrollRef, now, SLOT_HEIGHT_PX) => {
  if (scrollRef.current) {
    const offset = getNowOffsetPx(now, SLOT_HEIGHT_PX);
    const scrollTop = offset - 200; // Scroll to 200px above current time
    scrollRef.current.scrollTop = Math.max(0, scrollTop);
  }
};
