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
} from "./CustomControls";

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
}) => {
  const t = useTranslations("table.noData");
  const locale = useLocale();
  const isRTL = locale === "ar";

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
            }`}
          >
            <td
              className="border-b border-border px-4 py-2"
              style={{ width: columnWidths["select"] || "40px" }}
            >
              <div className="flex items-center justify-center w-full">
                <div className="h-4 w-4 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
              </div>
            </td>
            <td
              className="border-b border-border px-4 py-2"
              style={{ width: columnWidths["search"] || "40px" }}
            >
              <div className="h-4 w-4 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
            </td>
            {columnOrder.map((key) => {
              const column = columns.find((col) => col.key === key);
              if (!column || !visibleColumns[key]) return null;
              return (
                <td key={key} className="border-b border-border px-4 py-2">
                  <div className="h-4 bg-gray-200 dark:bg-muted rounded animate-pulse"></div>
                </td>
              );
            })}
            <td className="w-20 border-b border-border px-4 py-2">
              <div className="flex space-x-2">
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-muted animate-pulse"></div>
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
              }`}
              draggable
              onDragStart={() => handleRowDragStart(actualRowIndex)}
              onDragOver={(e) => handleRowDragOver(e, actualRowIndex)}
            >
              {/* Row selection checkbox */}
              <td
                className="border-b border-border px-4 py-2"
                style={{ width: columnWidths["select"] || "40px" }}
              >
                <div className="flex items-center justify-center w-full">
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                    aria-label={`Select row ${actualRowIndex + 1}`}
                  />
                </div>
              </td>
              {/* Row handle */}
              <td
                className="border-b border-border px-4 py-2"
                style={{ width: columnWidths["search"] || "40px" }}
              >
                <div className="flex h-full cursor-move items-center justify-center">
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

              {/* Row cells */}
              {columnOrder.map((key) => {
                const column = columns.find((col) => col.key === key);
                if (!column || !visibleColumns[key]) return null;

                const isEditing =
                  enableCellEditing &&
                  editingCell &&
                  editingCell.rowIndex === actualRowIndex &&
                  editingCell.columnKey === key;

                const width = columnWidths[key];

                return (
                  <td
                    key={`${rowIndex}-${key}`}
                    className="border-b border-border px-4 py-2"
                    style={{ width: width === "auto" ? "auto" : width }}
                    onDoubleClick={() =>
                      enableCellEditing &&
                      handleCellDoubleClick(actualRowIndex, key)
                    }
                  >
                    {isEditing ? (
                      column.type === "boolean" ? (
                        <Select
                          value={String(row[key])}
                          onChange={(e) =>
                            handleCellEdit(e, actualRowIndex, key)
                          }
                          onBlur={handleCellEditFinish}
                          autoFocus
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </Select>
                      ) : column.type === "date" ? (
                        <DatePicker
                          value={row[key]}
                          onChange={(e) =>
                            handleCellEdit(e, actualRowIndex, key)
                          }
                          onBlur={handleCellEditFinish}
                          autoFocus
                        />
                      ) : column.options ? (
                        <Select
                          value={row[key]}
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
                          value={row[key]}
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
                          row[key] ? (
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
                              True
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
                              False
                            </span>
                          )
                        ) : column.type === "date" ? (
                          new Date(row[key]).toLocaleDateString()
                        ) : column.options ? (
                          column.options.find(
                            (option) => option.value === row[key]
                          )?.label || row[key]
                        ) : (
                          row[key]
                        )}
                      </div>
                    )}
                  </td>
                );
              })}

              {/* Actions */}
              <td
                className={`w-20 border-b border-border px-4 py-2 transition-colors duration-200 ${
                  isOverflowing
                    ? "sticky right-0 z-10 filter drop-shadow-[-6px_0_5px_rgba(0,0,0,0.1)] border-l border-gray-200 dark:border-gray-700"
                    : ""
                } ${
                  selectedRows.has(row.id)
                    ? "bg-primary/10 hover:bg-primary/20"
                    : rowIndex % 2 === 0
                    ? "bg-white dark:bg-background hover:bg-gray-100 dark:hover:bg-muted"
                    : "bg-gray-50 dark:bg-muted/50 hover:bg-gray-100 dark:hover:bg-muted"
                }`}
              >
                <div
                  className="flex"
                  style={{
                    gap: "0.5rem",
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                >
                  {/* Enhanced Edit Button */}
                  <Tooltip content="Edit">
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-9 w-9 p-0 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out rounded-md shadow-sm hover:shadow-md"
                      onClick={() => onEdit && onEdit(row)}
                      aria-label={`Edit ${row.name || row.code || 'item'}`}
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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Button>
                  </Tooltip>

                  {/* Enhanced Delete Button */}
                  <Tooltip content="Delete">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-9 w-9 p-0 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 transition-all duration-200 ease-in-out rounded-md shadow-sm hover:shadow-md"
                      onClick={() => handleDeleteClick(row)}
                      aria-label={`Delete ${row.name || row.code || 'item'}`}
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
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td
            colSpan={
              columnOrder.filter((key) => visibleColumns[key]).length + 3
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
                {t("title")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("description")}
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};
