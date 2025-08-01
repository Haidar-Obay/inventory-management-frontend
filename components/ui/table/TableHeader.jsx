"use client";

import React from "react";
import { Button, Checkbox, Input, Badge } from "./CustomControls";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";

export const TableHeader = ({
  columnOrder,
  columns,
  visibleColumns,
  sortConfig,
  activeColumnFilters,
  columnFilterTypes,
  showSearchRow,
  showSearchColumn,
  columnSearch,
  areAllOnPageSelected,
  paginatedData,
  handleSort,
  handleColumnDragStart,
  handleColumnDragOver,
  handleToggleSearchRow,
  handleToggleSearchColumn,
  handleOpenFilterModal,
  handleColumnSearch,
  handleSelectAll,
  columnWidths,
  isOverflowing,
  headerColor,
  headerFontSize,
  headerFontStyle,
  headerFontColor,
  showHeaderSeparator,
  showHeaderColSeparator,
}) => {
  const t = useTranslations("table");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { theme } = useTheme();

  const theadStyle = headerColor ? { 
    background: headerColor,
    fontSize: headerFontSize ? `${headerFontSize}px` : '16px',
    fontStyle: headerFontStyle || 'normal',
    color: headerFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b')
  } : {
    fontSize: headerFontSize ? `${headerFontSize}px` : '16px',
    fontStyle: headerFontStyle || 'normal',
    color: headerFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b')
  };

  return (
    <thead
      className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 sticky top-0 z-20 border-b-2 border-slate-200 dark:border-slate-700"
      style={{ transform: "translateZ(0px)", ...theadStyle }}
    >
      {/* Header Row */}
      <tr
        className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900"
        style={headerColor ? { 
          background: headerColor,
          fontSize: headerFontSize ? `${headerFontSize}px` : '16px',
          fontStyle: headerFontStyle || 'normal',
          color: headerFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b')
        } : {
          fontSize: headerFontSize ? `${headerFontSize}px` : '16px',
          fontStyle: headerFontStyle || 'normal',
          color: headerFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b')
        }}
      >
        <th
          className={`border-b border-slate-200 dark:border-slate-700 ps-3 py-3 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all duration-200 ${showHeaderColSeparator !== false ? 'border-r border-slate-300 dark:border-slate-600' : ''}`}
          data-column="select"
          style={{ width: "36px" }}
        >
          <div className="flex flex-row items-center justify-center w-full gap-1">
            <Checkbox
              checked={areAllOnPageSelected}
              onChange={handleSelectAll}
              disabled={paginatedData.length === 0}
              aria-label="Select all rows on this page"
              className="m-0 hover:scale-105 transition-transform duration-200"
            />
            <button
              onClick={handleToggleSearchColumn}
              className="p-0 m-0 h-5 w-5 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md hover:scale-110 transition-all duration-200 shadow-sm"
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
        {showSearchColumn && (
          <th
            className={`border-b border-slate-200 dark:border-slate-700 px-0 py-3 ${showHeaderColSeparator !== false ? 'border-r border-slate-300 dark:border-slate-600' : ''}`}
            data-column="search"
            style={{ width: "18px" }}
          >
            <div className="flex items-center justify-center w-full">
              <button
                onClick={handleToggleSearchRow}
                className="flex items-center justify-center border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md hover:scale-110 transition-all duration-200"
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
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                )}
              </button>
            </div>
          </th>
        )}

        {/* Column headers */}
        {columnOrder.map((key, index) => {
          const column = columns.find((col) => col.key === key);
          if (!column || !visibleColumns[key]) return null;

          const hasActiveFilter = activeColumnFilters[key];
          const width = columnWidths[key];
          const isFirstColumn = index === 0;
          const isLastColumn = index === columnOrder.filter(k => visibleColumns[k]).length - 1;

          // RTL/LTR border logic
          let leftBorder = false;
          let rightBorder = false;
          if (showHeaderColSeparator !== false) {
            if (isRTL) {
              leftBorder = isLastColumn;
              rightBorder = true; // All columns get right border in RTL
            } else {
              leftBorder = isFirstColumn;
              rightBorder = !isLastColumn;
            }
          }

          return (
            <th
              key={key}
              data-column={key}
              className={`border-b border-slate-200 dark:border-slate-700 px-6 py-4 text-left relative group transition-all duration-200 cursor-pointer
                hover:bg-gray-200 dark:hover:bg-slate-700/50
                ${leftBorder ? 'border-l border-slate-300 dark:border-slate-600' : ''}
                ${rightBorder ? 'border-r border-slate-300 dark:border-slate-600' : ''}
                table-cell
              `}
              style={{ 
                width: width === "auto" ? "auto" : width,
                maxWidth: "none",
                minWidth: "none",
                flexShrink: 0,
                flexGrow: 0
              }}
              draggable
              onDragStart={() => handleColumnDragStart(key)}
              onDragOver={(e) => handleColumnDragOver(e, key)}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                                     <span
                     className="font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200"
                     style={{
                       fontSize: headerFontSize ? `${headerFontSize}px` : undefined,
                       color: headerFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b'),
                       fontWeight: headerFontStyle && headerFontStyle.includes('bold') ? 'bold' : undefined,
                       fontStyle: headerFontStyle && headerFontStyle.includes('italic') ? 'italic' : undefined,
                     }}
                   >
                     {column.header}
                   </span>
                  <div className="flex items-center space-x-2">
                    {column.sortable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort(key)}
                        className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105 transition-all duration-200 rounded-md"
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
                      className={`h-9 w-9 p-0 ml-2 flex items-center justify-center transition-all duration-200 rounded-md
                      ${
                        hasActiveFilter
                          ? "text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700 hover:scale-105"
                      }`}
                      onClick={() => handleOpenFilterModal(key)}
                      title={t("filterOptions")}
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
                  <div className="mt-2">
                    <Badge variant="primary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
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
        <th
          className={`border-b border-slate-200 dark:border-slate-700 px-4 py-4 text-center bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all duration-200
            ${showHeaderColSeparator !== false ? 'border-l border-slate-300 dark:border-slate-600' : ''}
            ${showHeaderColSeparator !== false ? (isRTL ? 'border-r border-l border-slate-300 dark:border-slate-600' : 'border-r border-slate-300 dark:border-slate-600') : ''}
            ${showHeaderColSeparator !== false ? (isRTL ? 'border-l border-slate-300 dark:border-slate-600' : 'border-r border-slate-300 dark:border-slate-600') : ''}
            ${isOverflowing
              ? "sticky end-0 z-20 backdrop-blur-sm border-s border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50/95 to-slate-100/95 dark:from-slate-800/95 dark:to-slate-900/95"
              : ""}
          `}
          style={{ width: "75px", ...(headerColor ? { background: headerColor } : {}) }}
        >
          <span
            className="flex items-center justify-center w-full font-semibold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wide hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
            style={{
              fontSize: headerFontSize ? `${headerFontSize}px` : undefined,
              color: headerFontColor || (theme === 'dark' ? '#e2e8f0' : '#1e293b'),
              fontWeight: headerFontStyle && headerFontStyle.includes('bold') ? 'bold' : undefined,
              fontStyle: headerFontStyle && headerFontStyle.includes('italic') ? 'italic' : undefined,
            }}
          >
            {t("actions")}
          </span>
        </th>
      </tr>

      {/* Separator Row */}
      {showHeaderSeparator !== false && (
        <tr className="bg-slate-100 dark:bg-slate-700/30 border-b border-slate-300 dark:border-slate-600">
          <td 
            colSpan={1 + (showSearchColumn ? 1 : 0) + columnOrder.filter(key => visibleColumns[key]).length + 1}
            className="h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600"
          ></td>
        </tr>
      )}

      {showSearchRow && (
        <tr
          className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700"
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
          <td className={`${showHeaderColSeparator !== false ? 'border-r border-slate-300 dark:border-slate-600' : ''}`}></td>
          {showSearchColumn && <td className={`${showHeaderColSeparator !== false ? 'border-r border-slate-300 dark:border-slate-600' : ''}`}></td>}
          {columnOrder.map((key, idx) => {
            const column = columns.find((col) => col.key === key);
            if (!column || !visibleColumns[key]) return null;
            // Add right border to all except the last data column
            const visibleKeys = columnOrder.filter(key => visibleColumns[key]);
            const isLastDataCol = idx === visibleKeys.length - 1;
            const lastDataColBorder = isRTL && isLastDataCol ? 'border-r border-slate-300 dark:border-slate-600' : '';
            const width = columnWidths[key] || "auto";
            return (
              <td 
                key={`search-${key}`} 
                className={`px-6 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors duration-200 ${showHeaderColSeparator !== false && !isLastDataCol ? 'border-r border-slate-300 dark:border-slate-600' : ''} ${showHeaderColSeparator !== false ? lastDataColBorder : ''}`}
                style={{ 
                  width: width === "auto" ? "auto" : width,
                  maxWidth: "none",
                  minWidth: "none",
                  flexShrink: 0,
                  flexGrow: 0
                }}
              >
                <div className="relative">
                  <div
                    className={`pointer-events-none absolute inset-y-0 ${isRTL ? "left-0" : "right-0"} flex items-center ${isRTL ? "pl-2" : "pr-2"}`}
                  >
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
                    placeholder={t("search.columnNamePlaceholder", {
                      column: column.header,
                    })}
                    value={columnSearch[column.key] || ""}
                    onChange={(e) =>
                      handleColumnSearch(column.key, e.target.value)
                    }
                    className="h-8 w-full border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              </td>
            );
          })}
          <td
            className={`border-b border-slate-200 dark:border-slate-700 px-4 py-2 bg-slate-50 dark:bg-slate-800/50
              ${showHeaderColSeparator !== false ? 'border-l border-slate-300 dark:border-slate-600' : ''}
              ${showHeaderColSeparator !== false && isRTL ? 'border-r border-slate-300 dark:border-slate-600' : ''}
              ${showHeaderColSeparator !== false && !isRTL ? 'border-r border-slate-300 dark:border-slate-600' : ''}
              ${isOverflowing
                ? "sticky end-0 z-10 backdrop-blur-sm border-s border-slate-200 dark:border-slate-700 bg-slate-50/95 dark:bg-slate-800/95"
                : ""}
            `}
            style={{ width: "75px" }}
          ></td>
        </tr>
      )}
    </thead>
  );
};
