"use client";

import React from "react";
import { Checkbox } from "@/components/ui/table/CustomControls";

const HelpGridBody = ({ 
  columns, 
  data, 
  loading,
  selectedRows,
  onRowSelect,
  showSearchColumn,
  showSearchRow,
  isItemAlreadyAdded,
  // Drag and drop props
  draggedRow,
  dragOverRow,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}) => {
  const formatValue = (value, column) => {
    if (value === null || value === undefined) return '-';
    
    switch (column.type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return String(value);
    }
  };

  if (loading) {
    return (
      <tbody className="bg-background">
        <tr>
          <td colSpan={columns.length + (showSearchColumn ? 2 : 1)} className="px-4 py-8 text-center text-muted-foreground border-r border-border border-b border-border">
            Loading...
          </td>
        </tr>
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody className="bg-background">
        <tr>
          <td colSpan={columns.length + (showSearchColumn ? 2 : 1)} className="px-4 py-8 text-center text-muted-foreground border-r border-border border-b border-border">
            No data available
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-background">
      {data.map((row, rowIndex) => {
        const isDragging = draggedRow && draggedRow.index === rowIndex;
        const isDragOver = dragOverRow && dragOverRow.index === rowIndex;
        
        return (
          <tr 
            key={row.id || rowIndex} 
            className={`hover:bg-muted/50 transition-all duration-200 ${
              isDragging ? 'opacity-50 scale-95 shadow-lg' : ''
            } ${
              isDragOver ? 'bg-blue-100 dark:bg-blue-900/20 border-t-2 border-blue-500' : ''
            }`}
            onDragOver={(e) => onDragOver && onDragOver(e, row, rowIndex)}
            onDragLeave={() => onDragLeave && onDragLeave()}
            onDrop={(e) => onDrop && onDrop(e, row, rowIndex)}
          >
            {/* Row selection checkbox */}
            <td 
              className={`px-4 py-3 text-sm text-foreground border-r border-border ${
                rowIndex < data.length - 1 ? 'border-b border-border' : ''
              }`}
              style={{ width: "36px" }}
            >
              <div className="flex flex-row items-center justify-center w-full gap-1">
                <Checkbox
                  checked={selectedRows.has(row.id || row.itemcode || rowIndex)}
                  onChange={() => {
                    const rowId = row.id || row.itemcode || rowIndex;
                    onRowSelect(rowId);
                  }}
                  disabled={isItemAlreadyAdded(row)}
                  aria-label={`Select row ${rowIndex + 1}`}
                  className={`m-0 ${isItemAlreadyAdded(row) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isItemAlreadyAdded(row) ? 'Item already added to drawer grid' : ''}
                />
                {/* Reserve space for chevron */}
                <span
                  style={{ display: "inline-block", width: 16, height: 16 }}
                />
              </div>
            </td>
            
            {/* Row handle (search column) */}
            {showSearchColumn && (
              <td 
                className={`px-0 py-3 text-sm text-foreground border-r border-border ${
                  rowIndex < data.length - 1 ? 'border-b border-border' : ''
                }`}
                style={{ width: "18px" }}
              >
                              <div
                className="flex items-center justify-center w-full h-full hover:scale-110 transition-transform duration-200"
                style={{ cursor: "grab" }}
                title="Drag to reorder"
                draggable={showSearchColumn}
                onDragStart={(e) => onDragStart && onDragStart(e, row, rowIndex)}
                onDragEnd={() => onDragEnd && onDragEnd()}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-muted-foreground hover:text-foreground">
                  <circle cx="5" cy="6" r="1.5" />
                  <circle cx="5" cy="10" r="1.5" />
                  <circle cx="5" cy="14" r="1.5" />
                  <circle cx="10" cy="6" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="10" cy="14" r="1.5" />
                </svg>
              </div>
              </td>
            )}
            
            {/* Data columns */}
            {columns.map((column, colIndex) => (
              <td 
                key={column.key} 
                className={`px-4 py-3 text-sm text-foreground ${
                  colIndex < columns.length - 1 ? 'border-r border-border' : ''
                } ${
                  rowIndex < data.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                {formatValue(row[column.key], column)}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

export default HelpGridBody;
