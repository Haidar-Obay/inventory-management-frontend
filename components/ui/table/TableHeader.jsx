"use client";

import React from "react";
import { Button, Checkbox, Input, Badge } from "./CustomControls";

export const TableHeader = ({
  columnOrder,
  columns,
  visibleColumns,
  sortConfig,
  activeColumnFilters,
  columnFilterTypes,
  showSearchRow,
  columnSearch,
  areAllOnPageSelected,
  paginatedData,
  handleSort,
  handleColumnDragStart,
  handleColumnDragOver,
  handleToggleSearchRow,
  handleOpenFilterModal,
  handleColumnSearch,
  handleSelectAll,
}) => {
  return (
    <thead
      className="bg-gray-50 dark:bg-muted/50 sticky top-0 z-20"
      style={{ transform: "translateZ(0px)" }}
    >
      {/* Header Row */}
      <tr className="bg-gray-50 dark:bg-muted/50">
        <th className="w-10 border-b border-border px-4 py-2 text-center">
          <Checkbox
            checked={areAllOnPageSelected}
            onChange={handleSelectAll}
            disabled={paginatedData.length === 0}
            aria-label="Select all rows on this page"
          />
        </th>
        <th className="w-10 border-b border-border px-4 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSearchRow}
            className="flex items-center gap-1 border-border bg-background shadow-sm hover:bg-muted"
          >
            {showSearchRow ? (
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
                <path d="M3 3l18 18"></path>
                <circle cx="12" cy="12" r="7"></circle>
              </svg>
            ) : (
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </Button>
        </th>

        {/* Column headers */}
        {columnOrder.map((key) => {
          const column = columns.find((col) => col.key === key);
          if (!column || !visibleColumns[key]) return null;

          const hasActiveFilter = activeColumnFilters[key];

          return (
            <th
              key={key}
              className="border-b border-border px-4 py-2 text-left"
              draggable
              onDragStart={() => handleColumnDragStart(key)}
              onDragOver={(e) => handleColumnDragOver(e, key)}
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <span>{column.header}</span>
                    {sortConfig.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                  <Button
                    variant={hasActiveFilter ? "primary" : "ghost"}
                    size="sm"
                    className={`h-10 w-10 p-0 ml-2 flex items-center justify-center transition-all duration-200 
                    ${
                      hasActiveFilter
                        ? "text-primary-foreground bg-primary hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => handleOpenFilterModal(key)}
                    title="Filter Options"
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
                  </Button>
                </div>
                {hasActiveFilter && (
                  <div className="mt-1">
                    <Badge variant="primary" className="text-xs">
                      {activeColumnFilters[key].type}:{" "}
                      {activeColumnFilters[key].value}
                    </Badge>
                  </div>
                )}
              </div>
            </th>
          );
        })}

        {/* Actions column */}
        <th className="w-20 border-b border-border px-4 py-2 text-left">
          Actions
        </th>
      </tr>

      {showSearchRow && (
        <tr
          className="bg-gray-50 dark:bg-muted/50"
          style={{
            visibility: showSearchRow ? "visible" : "hidden",
            position: showSearchRow ? "static" : "absolute",
            height: showSearchRow ? "38px" : "0px",
            overflow: "hidden",
            transition:
              "visibility 0.3s, opacity 0.3s linear, height 0.2s ease",
            opacity: showSearchRow ? 1 : 0,
          }}
        >
          <td></td>
          <td></td>
          {columnOrder.map((key) => {
            const column = columns.find((col) => col.key === key);
            if (!column || !visibleColumns[key]) return null;

            return (
              <td key={`search-${key}`} className="px-4 py-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <Input
                    type={column.type === "number" ? "number" : "text"}
                    placeholder={`Search ${column.header}...`}
                    value={columnSearch[key] || ""}
                    onChange={(e) => handleColumnSearch(key, e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </td>
            );
          })}
          <td className="w-20 border-b border-border px-4 py-2"></td>
        </tr>
      )}
    </thead>
  );
};
