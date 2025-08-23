"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../dialog';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

const toLocalDateInputValue = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toLocalTimeInputValue = (date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const mergeDateAndTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date(year, month - 1, day, hours, minutes || 0, 0, 0);
  return d;
};

const DEFAULT_COLOR = '#3b82f6';

const EventDialog = ({ open, onOpenChange, initialEvent, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(toLocalDateInputValue(new Date()));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (!open) return;
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setDate(toLocalDateInputValue(initialEvent.start || new Date()));
      setStartTime(toLocalTimeInputValue(initialEvent.start || new Date()));
      setEndTime(toLocalTimeInputValue(initialEvent.end || new Date()));
      setColor(initialEvent.color || DEFAULT_COLOR);
    }
  }, [open, initialEvent]);

  const handleSave = () => {
    const start = mergeDateAndTime(date, startTime);
    const end = mergeDateAndTime(date, endTime);
    const payload = {
      id: initialEvent?.id || `ev_${Date.now()}`,
      title: title?.trim() || 'Untitled',
      start,
      end,
      color: color || DEFAULT_COLOR,
    };
    onSave?.(payload);
    onOpenChange?.(false);
  };

  const handleDelete = () => {
    if (initialEvent?.id) {
      onDelete?.(initialEvent.id);
      onOpenChange?.(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[99999]" 
        onClick={() => onOpenChange?.(false)}
      />
      
      {/* Modal */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg p-6 w-full max-w-lg z-[999999] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{initialEvent ? 'Edit event' : 'Create event'}</h2>
          <button onClick={() => onOpenChange?.(false)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded">✕</button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Start</Label>
              <Input id="date" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End</Label>
              <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-3">
              <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 p-1" />
              <div className="text-sm text-muted-foreground">Choose a label color</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {initialEvent?.id && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">Delete</Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </>
  );
};

export default EventDialog;


