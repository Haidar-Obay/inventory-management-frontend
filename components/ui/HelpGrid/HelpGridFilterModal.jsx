"use client";

import React from "react";
import { Button, Select, Input, DatePicker } from "@/components/ui/table/CustomControls";

const HelpGridFilterModal = ({
  isOpen,
  selectedColumn,
  columns,
  filterType,
  filterValue,
  onSave,
  onCancel,
  onFilterTypeChange,
  onFilterValueChange,
  uniqueValues = [],
}) => {
  // Remove translation dependency since the keys may not exist
  // const t = useTranslations("table.filter");

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const column = columns.find((col) => col.key === selectedColumn);

  const formatDate = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const renderFilterTypeSelector = (column, columnKey) => {
    if (!column) return null;

    let options = [];

    if (column.type === "date") {
      options = [
        { value: "equals", label: "Equals" },
        { value: "before", label: "Before" },
        { value: "after", label: "After" },
        { value: "between", label: "Between" },
      ];
    } else if (column.type === "number") {
      options = [
        { value: "equals", label: "Equals" },
        { value: "greaterThan", label: "Greater Than" },
        { value: "lessThan", label: "Less Than" },
        { value: "between", label: "Between" },
      ];
    } else {
      options = [
        { value: "equals", label: "Equals" },
        { value: "contains", label: "Contains" },
        { value: "startsWith", label: "Starts With" },
        { value: "endsWith", label: "Ends With" },
      ];
    }

    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Filter Type
        </label>
        <Select
          value={filterType}
          onChange={(e) => {
            const newType = e.target.value;
            onFilterTypeChange(columnKey, newType);
            // Reset filter value when type changes or when default is selected
            onFilterValueChange(columnKey, "");
          }}
          className="w-full"
        >
          <option value="">Select Filter Type</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    );
  };

  const renderFilterInput = (column, columnKey) => {
    if (!column || !filterType || filterType === "") return null;

    if (column.type === "date") {
      if (filterType === "between") {
        // Parse comma-separated string for date range
        const [startDate, endDate] = filterValue ? filterValue.split(",") : ["", ""];
        // Ensure both are yyyy-mm-dd
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split("T")[0] : "";
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split("T")[0] : "";
        
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs w-10">From:</span>
              <DatePicker
                value={formattedStartDate}
                onChange={(e) => {
                  const newStart = e.target.value;
                  onFilterValueChange(columnKey, `${newStart},${endDate}`);
                }}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs w-10">To:</span>
              <DatePicker
                value={formattedEndDate}
                onChange={(e) => {
                  const newEnd = e.target.value;
                  onFilterValueChange(columnKey, `${startDate},${newEnd}`);
                }}
                className="w-full"
              />
            </div>
          </div>
        );
      }
      // Single date
      const singleDate = filterValue ? new Date(filterValue).toISOString().split("T")[0] : "";
      return (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Value
          </label>
          <DatePicker
            value={singleDate}
            onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
            className="w-full"
          />
        </div>
      );
    }

    if (column.type === "number") {
      if (filterType === "between") {
        const [min, max] = filterValue ? filterValue.split(",") : ["", ""];
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={min}
              onChange={(e) => {
                const newValue = `${e.target.value},${max}`;
                onFilterValueChange(columnKey, newValue);
              }}
              className="w-full"
              placeholder="Min value"
            />
            <Input
              type="number"
              value={max}
              onChange={(e) => {
                const newValue = `${min},${e.target.value}`;
                onFilterValueChange(columnKey, newValue);
              }}
              className="w-full"
              placeholder="Max value"
            />
          </div>
        );
      }
      return (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Value
          </label>
          <Input
            type="number"
            value={filterValue}
            onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
            className="w-full"
            placeholder="0"
          />
        </div>
      );
    }

    if (column.type === "boolean") {
      return (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Value
          </label>
          <Select
            value={filterValue}
            onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
            className="w-full"
          >
            <option value="">Select Value</option>
                          <option value="true">True</option>
              <option value="false">False</option>
          </Select>
        </div>
      );
    }

    // Default text input
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Value
        </label>
        <Input
          type="text"
          value={filterValue}
          onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
          className="w-full"
          placeholder="Enter value..."
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[2002] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl max-w-md w-full mx-4 border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Filter {column?.header}
          </h3>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {renderFilterTypeSelector(column, selectedColumn)}
          {renderFilterInput(column, selectedColumn)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                      <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border border-border rounded hover:bg-muted text-muted-foreground"
            >
              Cancel
            </button>
                      <button
              onClick={onSave}
              disabled={!filterType || !filterValue || (Array.isArray(filterValue) && filterValue.some(v => !v))}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Filter
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpGridFilterModal;
