"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Button,
  Checkbox,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Dropdown,
  DropdownItem,
} from "./CustomControls";
import { CustomActions } from "./CustomActions";

export const TableBody = ({
  paginatedData,
  columns,
  columnOrder,
  visibleColumns,
  currentPage,
  rowsPerPage,
  selectedRows,
  editingCell,
  enableCellEditing,
  loading,
  handleRowDragStart,
  handleRowDragOver,
  handleCellDoubleClick,
  handleCellEdit,
  handleCellEditFinish,
  handleRowSelect,
  handleDeleteClick,
  onEdit,
  columnWidths,
  isOverflowing,
  openDropdownRowId,
  setOpenDropdownRowId,
  showSearchColumn,
  customActions = [],
  onCustomAction,
  onDeleteConfirm,
  onPreviewConfirm,
  showBodyColSeparator,
}) => {
  const t = useTranslations("table");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const colBorderClass = showBodyColSeparator === false ? "" : "border-r border-slate-300 dark:border-slate-600";

  return (
    <tbody>
      {loading ? (
        // Loading skeleton rows
        Array.from({ length: rowsPerPage }).map((_, index) => (
          <tr
            key={`skeleton-${index}`}
            className={`${
              index % 2 === 0
                ? "bg-white dark:bg-background"
                : "bg-gray-50 dark:bg-muted/50"
            } border-b border-border`}
          >
            {/* Row selection checkbox skeleton */}
            <td
              className="border-b border-border ps-2 py-2"
              style={{ width: "36px" }}
            >
              <div className="flex flex-row items-center justify-center w-full gap-1">
                <div className="h-4 w-4 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
                <div className="w-4 h-4"></div>
              </div>
            </td>
            {/* Row handle (search column) skeleton */}
            {showSearchColumn && (
              <td
                className="border-b border-border px-0 py-2"
                style={{ width: "18px" }}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <div className="h-3 w-3 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
                </div>
              </td>
            )}
            {/* Column cells skeleton */}
            {columnOrder.map((key, columnIndex) => {
              const column = columns.find((col) => col.key === key);
              if (!column || !visibleColumns[key]) return null;
              
              const width = columnWidths[key];
              const isLastColumn = columnIndex === columnOrder.filter(k => visibleColumns[k]).length - 1;
              
              return (
                <td
                  key={key}
                  className={`border-b border-border px-4 py-2 ${!isLastColumn && colBorderClass}`}
                  style={{ 
                    width: width === "auto" ? "auto" : width,
                    maxWidth: "none",
                    minWidth: "none",
                    flexShrink: 0,
                    flexGrow: 0
                  }}
                >
                  <div className="min-h-[24px] flex items-center">
                    {column.type === "boolean" ? (
                      // Boolean skeleton - badge style
                      <div className="inline-flex items-center rounded-full bg-gray-200 dark:bg-muted px-2 py-0.5 text-xs font-medium animate-pulse">
                        <div className="h-3 w-3 rounded mr-1 bg-gray-300 dark:bg-muted-foreground"></div>
                        <div className="h-3 w-8 rounded bg-gray-300 dark:bg-muted-foreground"></div>
                      </div>
                    ) : column.type === "date" ? (
                      // Date skeleton - shorter width
                      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
                    ) : column.options ? (
                      // Select options skeleton
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
                    ) : (
                      // Text/number skeleton - variable width based on content
                      <div className="h-4 rounded bg-gray-200 dark:bg-muted animate-pulse" style={{
                        width: column.key === "id" ? "40px" : 
                               column.key === "code" ? "60px" : 
                               column.key === "name" ? "120px" : 
                               column.key === "description" ? "150px" : 
                               column.key === "phone" || column.key.includes("phone") ? "100px" :
                               column.key === "email" ? "140px" :
                               column.key === "address" ? "180px" :
                               column.key === "notes" ? "200px" :
                               "80px"
                      }}></div>
                    )}
                  </div>
                </td>
              );
            })}
            {/* Actions skeleton */}
            <td
              className="border-b border-border px-1 py-2 border-l border-slate-300 dark:border-slate-600"
              style={{ width: "75px" }}
            >
              <div className="flex justify-center">
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-muted animate-pulse flex items-center justify-center">
                  <div className="flex items-center gap-0.5">
                    <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-muted-foreground animate-pulse"></div>
                    <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-muted-foreground animate-pulse"></div>
                    <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-muted-foreground animate-pulse"></div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        ))
      ) : paginatedData.length > 0 ? (
        paginatedData.map((row, rowIndex) => {
          const actualRowIndex = (currentPage - 1) * rowsPerPage + rowIndex;

          return (
            <tr
              key={`${rowIndex}-${row.id}`}
              className={`${
                selectedRows.has(row.id)
                  ? "bg-primary/10 hover:bg-primary/20"
                  : rowIndex % 2 === 0
                    ? "bg-white dark:bg-background"
                    : "bg-gray-50 dark:bg-muted/50 hover:bg-gray-100 dark:hover:bg-muted"
              } border-b border-border`}
            >
              {/* Row selection checkbox */}
              <td
                className={`border-b border-border ps-2 py-2 ${(showBodyColSeparator !== false) ? 'border-r border-slate-300 dark:border-slate-600' : ''}`}
                style={{ width: "36px" }}
              >
                <div className="flex flex-row items-center justify-center w-full gap-1">
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                    aria-label={`Select row ${actualRowIndex + 1}`}
                    className="m-0"
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
                  className={`border-b border-border px-0 py-2 ${(showBodyColSeparator !== false) ? 'border-l border-r border-slate-300 dark:border-slate-600' : ''}`}
                  style={{ width: "18px" }}
                >
                  <div
                    className="flex items-center justify-center w-full h-full"
                    style={{ cursor: "grab" }}
                    draggable
                    onDragStart={() => handleRowDragStart(actualRowIndex)}
                    onDragOver={(e) => handleRowDragOver(e, actualRowIndex)}
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
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </div>
                </td>
              )}
              {/* Row cells */}
              {columnOrder.map((key, columnIndex) => {
                const column = columns.find((col) => col.key === key);
                if (!column || !visibleColumns[key]) return null;

                const isEditing =
                  enableCellEditing &&
                  editingCell &&
                  editingCell.rowIndex === actualRowIndex &&
                  editingCell.columnKey === key;

                const width = columnWidths[key];
                const cellValue = row[key];
                const isFirstColumn = columnIndex === 0;
                const isLastColumn = columnIndex === columnOrder.filter(k => visibleColumns[k]).length - 1;

                // RTL/LTR border logic
                let leftBorder = false;
                let rightBorder = false;
                if (showBodyColSeparator !== false) {
                  if (isRTL) {
                    leftBorder = isLastColumn;
                    rightBorder = true; // All columns get right border in RTL
                  } else {
                    leftBorder = isFirstColumn;
                    rightBorder = true; // Always add right border in LTR
                  }
                }

                return (
                  <td
                    key={`${rowIndex}-${key}`}
                    className={`border-b border-border px-4 py-2 table-cell
                      ${leftBorder ? 'border-l border-slate-300 dark:border-slate-600' : ''}
                      ${rightBorder ? 'border-r border-slate-300 dark:border-slate-600' : ''}
                    `}
                    style={{ 
                      width: width === "auto" ? "auto" : width,
                      maxWidth: "none",
                      minWidth: "none",
                      flexShrink: 0,
                      flexGrow: 0
                    }}
                    onDoubleClick={() =>
                      enableCellEditing &&
                      handleCellDoubleClick(actualRowIndex, key)
                    }
                  >
                    {isEditing ? (
                      column.type === "boolean" ? (
                        <Select
                          value={String(cellValue)}
                          onChange={(e) =>
                            handleCellEdit(e, actualRowIndex, key)
                          }
                          onBlur={handleCellEditFinish}
                          autoFocus
                        >
                          <option value="true">{t("true")}</option>
                          <option value="false">{t("false")}</option>
                        </Select>
                      ) : column.type === "date" ? (
                        <DatePicker
                          value={cellValue}
                          onChange={(e) =>
                            handleCellEdit(e, actualRowIndex, key)
                          }
                          onBlur={handleCellEditFinish}
                          autoFocus
                        />
                      ) : column.options ? (
                        <Select
                          value={cellValue}
                          onChange={(e) =>
                            handleCellEdit(e, actualRowIndex, key)
                          }
                          onBlur={handleCellEditFinish}
                          autoFocus
                        >
                          {column.options.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Input
                          type={column.type === "number" ? "number" : "text"}
                          value={cellValue}
                          onChange={(e) =>
                            handleCellEdit(e, actualRowIndex, key)
                          }
                          onBlur={handleCellEditFinish}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCellEditFinish();
                            }
                          }}
                          autoFocus
                          className="w-full"
                        />
                      )
                    ) : (
                      <div className="min-h-[24px]">
                        {column.type === "boolean" ? (
                          cellValue ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              {t("true")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                              {t("false")}
                            </span>
                          )
                        ) : column.type === "date" ? (
                          cellValue ? new Date(cellValue).toLocaleDateString() : ""
                        ) : column.options ? (
                          column.options.find(
                            (option) => option.value === cellValue
                          )?.label || cellValue
                        ) : (
                          cellValue || ""
                        )}
                      </div>
                    )}
                  </td>
                );
              })}

              {/* Actions */}
              <td
                className={`border-b border-border px-1 py-2 transition-colors duration-200
                  ${showBodyColSeparator !== false
                    ? (isRTL
                        ? 'border-r border-slate-300 dark:border-slate-600' 
                        : 'border-l border-slate-300 dark:border-slate-600')
                    : ''}
                  ${showBodyColSeparator !== false ? (isRTL ? 'border-l border-slate-300 dark:border-slate-600' : 'border-r border-slate-300 dark:border-slate-600') : ''}
                  ${isOverflowing
                    ? "sticky end-0 z-10 backdrop-blur-sm border-s border-gray-200 dark:border-gray-700"
                    : ""}
                  ${selectedRows.has(row.id)
                    ? "bg-primary/10 hover:bg-primary/20"
                    : rowIndex % 2 === 0
                      ? "bg-white dark:bg-background hover:bg-gray-100 dark:hover:bg-muted"
                      : "bg-gray-50 dark:bg-muted/50 hover:bg-gray-100 dark:hover:bg-muted"}
                `}
                style={{ width: "75px" }}
              >
                <CustomActions
                  row={row}
                  actions={customActions}
                  onActionClick={onCustomAction}
                  openDropdownRowId={openDropdownRowId}
                  setOpenDropdownRowId={setOpenDropdownRowId}
                  isRTL={isRTL}
                  onDeleteConfirm={onDeleteConfirm}
                  onPreviewConfirm={onPreviewConfirm}
                />
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td
            colSpan={
              columnOrder.filter((key) => visibleColumns[key]).length +
              (showSearchColumn ? 3 : 2)
            }
            className="px-4 py-8 text-center"
          >
            <div className="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p className="text-lg font-medium text-foreground">
                {t("noData.title")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("noData.description")}
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};
