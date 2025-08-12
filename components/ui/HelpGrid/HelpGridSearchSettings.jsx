"use client";

import React, { useState, useEffect } from "react";

const HelpGridSearchSettings = ({ 
  isOpen, 
  onClose, 
  columns, 
  searchableColumns, 
  visibleColumns, // Add visibleColumns prop
  onSave 
}) => {
  const [tempSearchableColumns, setTempSearchableColumns] = useState({});

  // Initialize temp state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSearchableColumns({ ...searchableColumns });
    }
  }, [isOpen, searchableColumns]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave(tempSearchableColumns);
    onClose();
  };

  const handleToggleColumn = (columnKey) => {
    setTempSearchableColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleSelectAll = () => {
    const visibleColumnsList = columns.filter(col => visibleColumns[col.key]);
    const allSelected = visibleColumnsList.every(
      col => tempSearchableColumns[col.key]
    );
    const newSelection = { ...tempSearchableColumns };
    
    visibleColumnsList.forEach(col => {
      newSelection[col.key] = !allSelected;
    });
    
    setTempSearchableColumns(newSelection);
  };

  const handleDeselectAll = () => {
    const visibleColumnsList = columns.filter(col => visibleColumns[col.key]);
    const newSelection = { ...tempSearchableColumns };
    
    visibleColumnsList.forEach(col => {
      newSelection[col.key] = false;
    });
    
    setTempSearchableColumns(newSelection);
  };

  // Show all columns (no search filtering needed)
  const allColumns = columns;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2001] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden border border-border flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Search Column Settings
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Choose which columns should be included in the general search. Hidden columns (marked with "(Hidden)") have disabled checkboxes and cannot be configured for search. To enable search for a hidden column, first make it visible in the Column Settings.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-muted text-muted-foreground"
              title="Select all visible columns for search"
            >
              Select All Visible
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-muted text-muted-foreground"
              title="Deselect all visible columns from search"
            >
              Deselect All Visible
            </button>
          </div>

          {/* Columns List */}
          <div className="max-h-96 overflow-y-auto">
            {allColumns.length === 0 ? (
              <div className="text-muted-foreground text-sm py-4 text-center">
                No columns found.
              </div>
            ) : (
              allColumns.map((column) => (
                <div
                  key={column.key}
                  className={`flex items-center py-3 border-b border-border last:border-0 ${
                    !visibleColumns[column.key] ? 'opacity-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={tempSearchableColumns[column.key] || false}
                    onChange={() => handleToggleColumn(column.key)}
                    disabled={!visibleColumns[column.key]}
                    className={`w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 ${
                      !visibleColumns[column.key] ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  />
                  <span className={`ml-3 text-sm ${
                    !visibleColumns[column.key] ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {column.header}
                    {!visibleColumns[column.key] && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Hidden)
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 p-6 border-t border-border bg-background">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-border rounded hover:bg-muted text-muted-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpGridSearchSettings;
