"use client";

import React, { createContext, useContext, useState, useRef } from 'react';

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Toast context
const ToastContext = createContext(null);

// Toast provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  // Generate a unique ID
  const generateId = () => {
    idCounter.current += 1;
    return `toast-${idCounter.current}`;
  };

  // Add a new toast
  const addToast = (type, title, message, duration = 5000) => {
    const id = generateId();
    
    const newToast = {
      id,
      type,
      title,
      message,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  // Remove a toast by id
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // Shorthand methods for different toast types
  const success = (title, message, duration) => addToast(TOAST_TYPES.SUCCESS, title, message, duration);
  const error = (title, message, duration) => addToast(TOAST_TYPES.ERROR, title, message, duration);
  const warning = (title, message, duration) => addToast(TOAST_TYPES.WARNING, title, message, duration);
  const info = (title, message, duration) => addToast(TOAST_TYPES.INFO, title, message, duration);
  
  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
