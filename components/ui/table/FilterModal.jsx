"use client";

import React from "react";
import { Button, Select, Input, DatePicker } from "./CustomControls";

export const FilterModal = ({
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
        { value: "greaterThan", label: "Greater than" },
        { value: "lessThan", label: "Less than" },
        { value: "between", label: "Between" },
      ];
    } else {
      options = [
        { value: "equals", label: "Equals" },
        { value: "contains", label: "Contains" },
        { value: "startsWith", label: "Starts with" },
        { value: "endsWith", label: "Ends with" },
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
          <option value="">Select filter type</option>
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
    if (!column || !filterType) return null;

    // Use uniqueValues prop instead of column.uniqueValues
    const availableValues = uniqueValues;

    switch (column.type) {
      case "date":
        if (filterType === "between") {
          let [startDate, endDate] = filterValue
            ? filterValue.split(",")
            : ["", ""];
          // Ensure both are yyyy-mm-dd
          startDate = startDate
            ? new Date(startDate).toISOString().split("T")[0]
            : "";
          endDate = endDate
            ? new Date(endDate).toISOString().split("T")[0]
            : "";
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs w-10">From:</span>
                <DatePicker
                  value={startDate}
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
                  value={endDate}
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
        let singleDate = filterValue
          ? new Date(filterValue).toISOString().split("T")[0]
          : "";
        return (
          <DatePicker
            value={singleDate}
            onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
            className="w-full"
          />
        );

      case "number":
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
          <>
            <Input
              type="number"
              value={filterValue}
              onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
              className="w-full"
            />
            {availableValues.length > 0 && (
              <Select
                value={filterValue}
                onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
                className="w-full mt-2"
              >
                <option value="">Select from available values</option>
                {availableValues.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </Select>
            )}
          </>
        );

      default:
        return (
          <>
            <Input
              value={filterValue}
              onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
              className="w-full"
            />
            {availableValues.length > 0 && (
              <Select
                value={filterValue}
                onChange={(e) => onFilterValueChange(columnKey, e.target.value)}
                className="w-full mt-2"
              >
                <option value="">Select from available values</option>
                {availableValues.map((val, idx) => (
                  <option key={idx} value={val}>{val}</option>
                ))}
              </Select>
            )}
          </>
        );
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
            Filter {column?.header || selectedColumn}
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
        <div className="space-y-4">
          {renderFilterTypeSelector(column, selectedColumn)}
          {renderFilterInput(column, selectedColumn)}
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
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};
