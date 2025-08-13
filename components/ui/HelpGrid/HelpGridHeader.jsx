"use client";

import React from "react";
import { Checkbox } from "@/components/ui/table/CustomControls";

const HelpGridHeader = ({ 
  columns, 
  sortConfig, 
  onSort,
  selectedRows,
  onRowSelect,
  areAllOnPageSelected,
  onSelectAll,
  showSearchColumn,
  showSearchRow,
  onToggleSearchColumn,
  onToggleSearchRow,
  paginatedData,
  isItemAlreadyAdded,
  onSearchValueChange, // New prop for handling search value changes
  searchValues, // New prop for current search values
  // Filter props
  activeColumnFilters,
  onOpenFilterModal,
  onClearColumnFilter
}) => {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <thead className="bg-muted sticky top-0 z-10">
      <tr className="border-b-2 border-border">
        {/* Select column header */}
        <th
          className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border"
          style={{ width: "36px" }}
        >
          <div className="flex flex-row items-center justify-center w-full gap-1">
            <Checkbox
              checked={areAllOnPageSelected}
              onChange={onSelectAll}
              disabled={paginatedData.length === 0}
              aria-label="Select all selectable rows on this page"
              className="m-0 hover:scale-105 transition-transform duration-200"
            />
            <button
              onClick={onToggleSearchColumn}
              className="p-0 m-0 h-5 w-5 flex items-center justify-center hover:bg-muted/80 rounded-md hover:scale-110 transition-all duration-200 shadow-sm"
              title={showSearchColumn ? "Hide search row" : "Show search row"}
              tabIndex={0}
              type="button"
            >
              {showSearchColumn ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </button>
          </div>
        </th>
        
        {/* Search column header */}
        {showSearchColumn && (
          <th
            className="px-0 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-r border-border"
            style={{ width: "18px" }}
          >
            <div className="flex items-center justify-center w-full">
              <button
                onClick={onToggleSearchRow}
                className="flex items-center justify-center border border-border bg-background shadow-sm hover:bg-muted rounded-md hover:scale-110 transition-all duration-200"
                style={{ width: 22, height: 22, padding: 0 }}
                tabIndex={0}
                type="button"
              >
                {showSearchRow ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <circle cx="12" cy="12" r="7"></circle>
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                )}
              </button>
            </div>
          </th>
        )}
        
        {/* Data columns */}
        {columns.map((column, index) => {
          const hasActiveFilter = activeColumnFilters && activeColumnFilters[column.key];
          
          return (
            <th
              key={column.key}
              className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/80 ${
                index < columns.length - 1 ? 'border-r border-border' : ''
              }`}
              onClick={() => onSort(column.key)}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                    {column.header}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{getSortIcon(column.key)}</span>
                    <button
                      variant={hasActiveFilter ? "primary" : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 flex items-center justify-center transition-all duration-200 rounded-md
                      ${
                        hasActiveFilter
                          ? "text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFilterModal(column.key);
                      }}
                      title="Filter options"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
                {hasActiveFilter && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700 rounded px-2 py-1">
                        {activeColumnFilters[column.key].type}: {(() => {
                          const filterValue = activeColumnFilters[column.key].value;
                          if (filterValue && filterValue.includes(',')) {
                            // Handle range values (between filters)
                            const [min, max] = filterValue.split(',');
                            return `${min} - ${max}`;
                          }
                          return filterValue;
                        })()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearColumnFilter(column.key);
                        }}
                        className="text-xs bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700 rounded px-1 py-1 hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                        title="Clear filter"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
      
      {/* Search row */}
      {showSearchRow && (
        <tr className="border-b border-border bg-muted/30">
          {/* Select column search cell */}
          <td className="px-4 py-2 border-r border-border" style={{ width: "36px" }}>
            <div className="flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Search</span>
            </div>
          </td>
          
          {/* Search column search cell */}
          {showSearchColumn && (
            <td className="px-0 py-2 border-r border-border" style={{ width: "18px" }}>
              <div className="flex items-center justify-center">
                <span className="text-xs text-muted-foreground">-</span>
              </div>
            </td>
          )}
          
          {/* Data columns search cells */}
          {columns.map((column, index) => (
            <td
              key={column.key}
              className={`px-4 py-2 ${
                index < columns.length - 1 ? 'border-r border-border' : ''
              }`}
            >
              <input
                type="text"
                placeholder={`Search ${column.header.toLowerCase()}...`}
                value={searchValues[column.key] || ''}
                onChange={(e) => onSearchValueChange(column.key, e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </td>
          ))}
        </tr>
      )}
    </thead>
  );
};

export default HelpGridHeader;
