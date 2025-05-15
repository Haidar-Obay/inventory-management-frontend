"use client";

import { useSimpleToast, toast as toastExport } from "./simple-toast";
import { useEffect } from "react";

export function ToastSetup() {
  const { addToast } = useSimpleToast();
  
  // Replace the placeholder implementation with actual toast functions
  useEffect(() => {
    // Override success toast
    toastExport.success = (options) => {
      addToast({
        title: options.title,
        description: options.description,
        type: "success",
        duration: options.duration || 5000,
      });
    };
    
    // Override error toast
    toastExport.error = (options) => {
      addToast({
        title: options.title,
        description: options.description,
        type: "error",
        duration: options.duration || 5000,
      });
    };
    
    // Override warning toast
    toastExport.warning = (options) => {
      addToast({
        title: options.title,
        description: options.description,
        type: "warning",
        duration: options.duration || 5000,
      });
    };
    
    // Override info toast
    toastExport.info = (options) => {
      addToast({
        title: options.title,
        description: options.description,
        type: "info",
        duration: options.duration || 5000,
      });
    };
  }, [addToast]);
  
  return null;
} 