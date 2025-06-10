"use client";

import React, { useState, useEffect } from "react";
import { Button, Checkbox } from "./CustomControls";

export const SearchColumnsModal = ({
  isOpen,
  onClose,
  columns,
  selectedSearchColumns,
  handleSearchColumnToggle,
  handleSelectAllSearchColumns,
  visibleColumns,
}) => {
  const [tempSelectedColumns, setTempSelectedColumns] = useState({});

  // Initialize temp state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedColumns({ ...selectedSearchColumns });
    }
  }, [isOpen, selectedSearchColumns]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    // Update the parent component's state
    Object.keys(tempSelectedColumns).forEach(key => {
      if (tempSelectedColumns[key] !== selectedSearchColumns[key]) {
        handleSearchColumnToggle(key);
      }
    });
    onClose();
  };

  const handleTempToggle = (columnKey) => {
    if (visibleColumns[columnKey]) {
      setTempSelectedColumns(prev => ({
        ...prev,
        [columnKey]: !prev[columnKey]
      }));
    }
  };

  const handleTempSelectAll = () => {
    const allSelected = Object.keys(tempSelectedColumns).every(key => 
      tempSelectedColumns[key] && visibleColumns[key]
    );
    const newSelection = {};
    columns.forEach(col => {
      if (visibleColumns[col.key]) {
        newSelection[col.key] = !allSelected;
      }
    });
    setTempSelectedColumns(newSelection);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg border border-border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">
            Select Search Columns
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted text-muted-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Select columns to include in search</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTempSelectAll}
            className="text-xs"
          >
            {Object.keys(tempSelectedColumns).every(key => 
              tempSelectedColumns[key] && visibleColumns[key]
            ) ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {columns.map((column) => {
            const isVisible = visibleColumns[column.key];
            return (
              <div
                key={column.key}
                className={`flex items-center space-x-2 py-2 border-b border-border last:border-0 ${
                  !isVisible ? 'opacity-50' : ''
                }`}
              >
                <Checkbox
                  checked={tempSelectedColumns[column.key] || false}
                  onChange={() => handleTempToggle(column.key)}
                  disabled={!isVisible}
                  className="mr-2"
                />
                <span className="text-foreground">{column.header}</span>
                {!isVisible && (
                  <span className="text-xs text-muted-foreground ml-1">(hidden)</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}; 