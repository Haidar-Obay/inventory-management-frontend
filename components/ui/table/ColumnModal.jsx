"use client";

import React, { useState } from "react";
import { Modal, Button, Checkbox, Input } from "./CustomControls";
import { useTranslations, useLocale } from "next-intl";
import Portal from "../Portal";

export const ColumnModal = ({
  isOpen,
  columns,
  visibleColumns,
  columnWidths,
  columnOrder,
  onSave,
  onCancel,
  onToggleColumn,
  onColumnWidthChange,
  onColumnOrderChange,
  onMoveColumnUp,
  onMoveColumnDown,
  onResetSettings,
}) => {
  const t = useTranslations("table");
  const [activeTab, setActiveTab] = useState("visibility");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleSelectAll = () => {
    const newVisibleColumns = {};
    columns.forEach((column) => {
      newVisibleColumns[column.key] = true;
    });
    onToggleColumn(null, null, newVisibleColumns);
  };

  const handleDeselectAll = () => {
    const newVisibleColumns = {};
    columns.forEach((column) => {
      newVisibleColumns[column.key] = false;
    });
    onToggleColumn(null, null, newVisibleColumns);
  };

  const handleDragStart = (e, columnKey) => {
    e.dataTransfer.setData("text/plain", columnKey);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnKey) => {
    e.preventDefault();
    const draggedColumnKey = e.dataTransfer.getData("text/plain");
    if (draggedColumnKey !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumnKey);
      const targetIndex = newOrder.indexOf(targetColumnKey);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumnKey);

      onColumnOrderChange(newOrder);
    }
  };

  const getOrderedColumns = () => {
    return columnOrder
      .map((key) => columns.find((col) => col.key === key))
      .filter(Boolean);
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[2147483647] pointer-events-auto flex items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-4xl rounded-lg bg-background p-6 shadow-lg border border-border">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              {t("columns.modal.title")}
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

          {/* Tabs */}
          <div className="mb-4 border-b border-border">
            <div
              className="flex"
              style={{
                gap: "2rem",
              }}
            >
              <button
                onClick={() => setActiveTab("visibility")}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "visibility"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("columns.modal.visibility")}
              </button>
              <button
                onClick={() => setActiveTab("size")}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "size"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("columns.modal.size")}
              </button>
              <button
                onClick={() => setActiveTab("order")}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "order"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("columns.modal.order")}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {activeTab === "visibility" && (
              <div>
                <div
                  className="mb-4 flex"
                  style={{
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-xs"
                  >
                    {t("columns.modal.selectAll")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                    className="text-xs"
                  >
                    {t("columns.modal.deselectAll")}
                  </Button>
                </div>
                {getOrderedColumns().map((column) => (
                  <div
                    key={column.key}
                    className="flex items-center py-2 border-b border-border last:border-0"
                    style={{
                      gap: "0.5rem",
                    }}
                  >
                    <Checkbox
                      checked={visibleColumns[column.key]}
                      onChange={(e) =>
                        onToggleColumn(column.key, e.target.checked)
                      }
                    />
                    <span className="text-foreground flex-1">
                      {column.header}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "size" && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("columns.modal.columnWidth")}
                  </p>
                </div>
                {getOrderedColumns().map((column) => (
                  <div
                    key={column.key}
                    className="flex items-center py-3 border-b border-border last:border-0"
                    style={{
                      gap: "1rem",
                    }}
                  >
                    <span className="text-foreground flex-1 flex items-center gap-2">
                      {column.header}
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        20–500 px
                      </span>
                    </span>
                    <div
                      className="flex items-center"
                      style={{
                        gap: "0.5rem",
                      }}
                    >
                      <Input
                        type="number"
                        min="20"
                        max="500"
                        value={parseInt(
                          columnWidths[column.key]?.replace("px", "") || "100"
                        )}
                        onChange={(e) =>
                          onColumnWidthChange(column.key, `${e.target.value}px`)
                        }
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">
                        {t("columns.modal.px")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "order" && (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("columns.modal.dragToReorder")}
                  </p>
                </div>
                {getOrderedColumns().map((column, index) => (
                  <div
                    key={column.key}
                    className="flex items-center py-2 border-b border-border last:border-0"
                    draggable
                    onDragStart={(e) => handleDragStart(e, column.key)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.key)}
                    style={{
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      className="flex items-center flex-1"
                      style={{
                        gap: "0.5rem",
                      }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center text-xs text-muted-foreground bg-muted rounded">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{column.header}</span>
                    </div>
                    <div
                      className="flex"
                      style={{
                        gap: "0.25rem",
                      }}
                    >
                      <button
                        onClick={() => onMoveColumnUp(column.key)}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <polyline points="18,15 12,9 6,15"></polyline>
                        </svg>
                      </button>
                      <button
                        onClick={() => onMoveColumnDown(column.key)}
                        disabled={index === getOrderedColumns().length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <polyline points="6,9 12,15 18,9"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => onResetSettings(activeTab)}
              className="border-border"
            >
              {t("columns.modal.reset")}
            </Button>
            <div
              className="flex"
              style={{
                gap: "0.5rem",
              }}
            >
              <Button
                variant="outline"
                onClick={onCancel}
                className="border-border"
              >
                {t("columns.modal.cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={onSave}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t("columns.modal.save")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
