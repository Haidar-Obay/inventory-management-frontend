"use client";

import React from "react";
import { Button, Checkbox, Input, Badge } from "./CustomControls";
import { useTranslations } from "next-intl";

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
  columnWidths,
  handleResizeStart,
  resizingColumn,
}) => {
  const t = useTranslations("table");
  console.log("t is a function:", typeof t === "function");

  return (
    <thead
      className="bg-gray-50 dark:bg-muted/50 sticky top-0 z-20"
      style={{ transform: "translateZ(0px)" }}
    >
      {/* Header Row */}
      <tr className="bg-gray-50 dark:bg-muted/50">
        <th
          className="border-b border-border px-4 py-2 relative group"
          data-column="select"
          style={{ width: columnWidths["select"] || "40px" }}
        >
          <div className="flex items-center justify-center w-full">
            <Checkbox
              checked={areAllOnPageSelected}
              onChange={handleSelectAll}
              disabled={paginatedData.length === 0}
              aria-label="Select all rows on this page"
            />
          </div>
          {/* Resize handle for select column */}
          <div
            className={`absolute right-0 top-0 h-full w-1 cursor-col-resize transition-all duration-200 ${
              resizingColumn === "select"
                ? "bg-blue-500/20"
                : "hover:bg-blue-500/10"
            }`}
            style={{ transform: "translateX(0)" }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleResizeStart(e, "select");
            }}
          >
            <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 group-hover:from-blue-500/40 group-hover:via-blue-500/60 group-hover:to-blue-500/40 transition-all duration-200" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-blue-500/0 via-blue-500/60 to-blue-500/0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
        </th>
        <th
          className="border-b border-border px-4 py-2 relative group"
          data-column="search"
          style={{ width: columnWidths["search"] || "40px" }}
        >
          <div className="flex items-center justify-center w-full">
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
          </div>
          {/* Resize handle for search column */}
          <div
            className={`absolute right-0 top-0 h-full w-1 cursor-col-resize transition-all duration-200 ${
              resizingColumn === "search"
                ? "bg-blue-500/20"
                : "hover:bg-blue-500/10"
            }`}
            style={{ transform: "translateX(0)" }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleResizeStart(e, "search");
            }}
          >
            <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 group-hover:from-blue-500/40 group-hover:via-blue-500/60 group-hover:to-blue-500/40 transition-all duration-200" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-blue-500/0 via-blue-500/60 to-blue-500/0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </div>
        </th>

        {/* Column headers */}
        {columnOrder.map((key) => {
          const column = columns.find((col) => col.key === key);
          if (!column || !visibleColumns[key]) return null;

          const hasActiveFilter = activeColumnFilters[key];
          const width = columnWidths[key];

          return (
            <th
              key={key}
              data-column={key}
              className="border-b border-border px-4 py-2 text-left relative group"
              style={{ width: width === "auto" ? "auto" : width }}
              draggable
              onDragStart={() => handleColumnDragStart(key)}
              onDragOver={(e) => handleColumnDragOver(e, key)}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{column.header}</span>
                  <div className="flex items-center space-x-2">
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(key)}
                        className="h-8 w-8 p-0"
                      >
                        {sortConfig.key === key ? (
                          sortConfig.direction === "asc" ? (
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
                              <path d="M6 9l6 6 6-6" />
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
                              <path d="M18 15l-6-6-6 6" />
                            </svg>
                          )
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
                            <path d="M7 10l5 5 5-5" />
                            <path d="M7 14l5-5 5 5" />
                          </svg>
                        )}
                      </Button>
                    )}
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
              {/* Resize handle */}
              <div
                className={`absolute right-0 top-0 h-full w-1 cursor-col-resize transition-all duration-200 ${
                  resizingColumn === key
                    ? "bg-blue-500/20"
                    : "hover:bg-blue-500/10"
                }`}
                style={{ transform: "translateX(0)" }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResizeStart(e, key);
                }}
              >
                <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 group-hover:from-blue-500/40 group-hover:via-blue-500/60 group-hover:to-blue-500/40 transition-all duration-200" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-blue-500/0 via-blue-500/60 to-blue-500/0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200" />
              </div>
            </th>
          );
        })}

        {/* Actions column */}
        <th className="w-20 border-b border-border px-4 py-2 text-left">
          {t("actions")}
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
                    type="text"
                    placeholder={t(
                      "table.search.columnPlaceholder",
                      { column: column.header }
                    )}
                    value={columnSearch[column.id] || ""}
                    onChange={(e) =>
                      handleColumnSearch(column.id, e.target.value)
                    }
                    className="h-8 w-full"
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
