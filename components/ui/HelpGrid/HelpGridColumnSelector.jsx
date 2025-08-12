"use client";

import React, { useState, useEffect } from "react";

const HelpGridColumnSelector = ({ 
  isOpen, 
  onClose, 
  columns, 
  visibleColumns, 
  onSave 
}) => {
  const [tempVisibleColumns, setTempVisibleColumns] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize temp state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempVisibleColumns({ ...visibleColumns });
    }
  }, [isOpen, visibleColumns]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    onSave(tempVisibleColumns);
    onClose();
  };

  const handleToggleColumn = (columnKey) => {
    setTempVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.keys(tempVisibleColumns).every(
      key => tempVisibleColumns[key]
    );
    const newSelection = {};
    columns.forEach(col => {
      newSelection[col.key] = !allSelected;
    });
    setTempVisibleColumns(newSelection);
  };

  const handleDeselectAll = () => {
    const newSelection = {};
    columns.forEach(col => {
      newSelection[col.key] = false;
    });
    setTempVisibleColumns(newSelection);
  };

  const filteredColumns = columns.filter(col =>
    col.header.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2001] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Column Settings
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
        <div className="p-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-muted text-muted-foreground"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-3 py-1 text-sm border border-border rounded hover:bg-muted text-muted-foreground"
            >
              Deselect All
            </button>
          </div>

          {/* Columns List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredColumns.length === 0 ? (
              <div className="text-muted-foreground text-sm py-4 text-center">
                No columns found.
              </div>
            ) : (
              filteredColumns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-center py-3 border-b border-border last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={tempVisibleColumns[column.key] || false}
                    onChange={() => handleToggleColumn(column.key)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-foreground">
                    {column.header}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
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

export default HelpGridColumnSelector;
