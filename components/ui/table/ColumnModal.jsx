"use client";

import React from "react";
import { Modal, Button, Checkbox } from "./CustomControls";

export const ColumnModal = ({
  isOpen,
  columns,
  visibleColumns,
  onSave,
  onCancel,
  onToggleColumn,
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg border border-border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">
            Column Visibility
          </h3>
          <button
            onClick={onCancel}
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
        <div className="max-h-[60vh] overflow-y-auto">
          {columns.map((column) => (
            <div
              key={column.key}
              className="flex items-center space-x-2 py-2 border-b border-border last:border-0"
            >
              <Checkbox
                checked={visibleColumns[column.key]}
                onChange={(e) => onToggleColumn(column.key, e.target.checked)}
                className="mr-2"
              />
              <span className="text-foreground">{column.header}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
