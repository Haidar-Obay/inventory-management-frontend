'use client';

import React, { createContext, useContext, useState, useCallback } from "react";

const DrawerStackContext = createContext();

export function useDrawerStack() {
  return useContext(DrawerStackContext);
}

export function DrawerStackProvider({ children }) {
  const [drawerStack, setDrawerStack] = useState([]);

  // Open a new drawer (push to stack)
  const openDrawer = useCallback((drawerConfig) => {
    setDrawerStack((prev) => [...prev, drawerConfig]);
  }, []);

  // Close the top drawer (pop from stack)
  const closeTopDrawer = useCallback(() => {
    setDrawerStack((prev) => prev.slice(0, -1));
  }, []);

  // Close a specific drawer by index (optional)
  const closeDrawerAt = useCallback((index) => {
    setDrawerStack((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <DrawerStackContext.Provider value={{ drawerStack, openDrawer, closeTopDrawer, closeDrawerAt }}>
      {children}
    </DrawerStackContext.Provider>
  );
} 