"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../card';
import EventDialog from './EventDialog';
import DayEventsModal from './DayEventsModal';

// Import custom hooks
import { 
  useSchedulerState, 
  useEventHandlers, 
  useDateNavigation, 
  useEventFiltering 
} from './hooks';

// Import components
import { 
  SchedulerHeader, 
  WeekView, 
  DayView, 
  MonthView, 
  NoEventsFound 
} from './components';

// Import utilities
import { autoScrollToNow } from './utils';

const Scheduler = () => {
  // Use custom hooks for state and logic
  const {
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
    SLOT_HEIGHT_PX,
    weekDays,
    timeSlots,
    startOfWeek,
    weekDates,
    headerRangeLabel
  } = useSchedulerState();

  // Use custom hooks for event handling and navigation
  const {
    handleAddEvent,
    handleSlotClick,
    handleEventSave,
    handleEventDelete,
    addSampleEvents,
    handleShowDayEvents
  } = useEventHandlers(setEvents, setDraftEvent, setDialogOpen, selectedDate);

  const { goPrev, goNext, goToday } = useDateNavigation(selectedDate, setSelectedDate, viewMode);

  const { filteredEvents, uniqueColors, clearFilters } = useEventFiltering(
    events, 
    searchQuery, 
    filterDate, 
    filterColor
  );

  // Auto-scroll to current time
  useEffect(() => {
    autoScrollToNow(scrollRef, now, SLOT_HEIGHT_PX);
  }, [now, SLOT_HEIGHT_PX]);

  // Event click handler
  const handleEventClick = (event) => {
    setDraftEvent(event);
    setDialogOpen(true);
  };

  // Day events modal handler
  const handleShowDayEventsModal = (date, events) => {
    setSelectedDayDate(date);
    setSelectedDayEvents(events);
    setShowDayEvents(true);
  };

  return (
    <div className="w-full h-full p-4 max-h-screen">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-4 flex-shrink-0">
          <SchedulerHeader
            viewMode={viewMode}
            setViewMode={setViewMode}
            headerRangeLabel={headerRangeLabel}
            goPrev={goPrev}
            goNext={goNext}
            goToday={goToday}
            handleAddEvent={handleAddEvent}
            addSampleEvents={addSampleEvents}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterColor={filterColor}
            setFilterColor={setFilterColor}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            uniqueColors={uniqueColors}
            clearFilters={clearFilters}
            filteredEvents={filteredEvents}
            events={events}
          />
        </CardHeader>
        
        <CardContent ref={scrollRef} className="flex-1 overflow-auto min-h-0 max-h-[calc(100vh-200px)]">
          {/* No events found message */}
          {filteredEvents.length === 0 && events.length > 0 && (
            <NoEventsFound onClearFilters={() => clearFilters(setSearchQuery, setFilterDate, setFilterColor)} />
          )}
          
          {/* Week View */}
          {viewMode === 'week' && (
            <WeekView
              weekDates={weekDates}
              timeSlots={timeSlots}
              filteredEvents={filteredEvents}
              SLOT_HEIGHT_PX={SLOT_HEIGHT_PX}
              now={now}
              onSlotClick={handleSlotClick}
              onEventClick={handleEventClick}
            />
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <DayView
              selectedDate={selectedDate}
              timeSlots={timeSlots}
              filteredEvents={filteredEvents}
              SLOT_HEIGHT_PX={SLOT_HEIGHT_PX}
              now={now}
              onSlotClick={handleSlotClick}
              onEventClick={handleEventClick}
            />
          )}

          {/* Month View */}
          {viewMode === 'month' && (
            <MonthView
              selectedDate={selectedDate}
              weekDays={weekDays}
              filteredEvents={filteredEvents}
              onDayClick={setSelectedDate}
              onShowDayEvents={handleShowDayEventsModal}
            />
          )}
        </CardContent>
      </Card>

      {/* Event Dialog */}
      {dialogOpen && (
        <EventDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialEvent={draftEvent}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
        />
      )}
      
      {/* Day Events Modal */}
      <DayEventsModal
        isOpen={showDayEvents}
        onClose={() => setShowDayEvents(false)}
        selectedDayDate={selectedDayDate}
        selectedDayEvents={selectedDayEvents}
        onEventEdit={handleEventClick}
        onAddEvent={(date) => {
          const newDate = new Date(date);
          newDate.setHours(9, 0, 0, 0);
          handleSlotClick(newDate);
        }}
      />
    </div>
  );
};

export default Scheduler;
