export const useDateNavigation = (selectedDate, setSelectedDate, viewMode) => {
  
  const goPrev = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(selectedDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(selectedDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(selectedDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const goNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(selectedDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(selectedDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(selectedDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const goToday = () => {
    setSelectedDate(new Date());
  };

  return {
    goPrev,
    goNext,
    goToday
  };
};
