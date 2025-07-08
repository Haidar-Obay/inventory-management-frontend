"use client";

import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox, Input } from "./CustomControls";
import { useTranslations, useLocale } from "next-intl";
import Portal from "../Portal";

// LocalStorage helpers
const TEMPLATES_KEY = "columnTemplates";
function loadTemplates() {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_KEY)) || [];
  } catch {
    return [];
  }
}
function saveTemplates(templates) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}
function addTemplate(template) {
  const templates = loadTemplates();
  templates.push(template);
  saveTemplates(templates);
}
function deleteTemplate(name) {
  let templates = loadTemplates();
  templates = templates.filter((t) => t.name !== name);
  saveTemplates(templates);
}
function getTemplate(name) {
  return loadTemplates().find((t) => t.name === name);
}

export const ColumnModal = ({
  isOpen,
  columns,
  visibleColumns,
  columnWidths,
  columnOrder,
  realVisibleColumns,
  realColumnWidths,
  realColumnOrder,
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

  // Template state
  const [templates, setTemplates] = useState([]);
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateError, setTemplateError] = useState("");

  useEffect(() => {
    setTemplates(loadTemplates());
  }, [isOpen]);

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

  // Template logic
  const handleSaveAsTemplate = () => {
    setTemplateName("");
    setTemplateError("");
    setShowTemplatePrompt(true);
  };
  const handleTemplateSave = () => {
    if (!templateName.trim()) {
      setTemplateError("Name required");
      return;
    }
    if (templates.some((t) => t.name === templateName.trim())) {
      setTemplateError("Name already exists");
      return;
    }
    const template = {
      name: templateName.trim(),
      visibleColumns: { ...visibleColumns },
      columnWidths: { ...columnWidths },
      columnOrder: [...columnOrder],
    };
    addTemplate(template);
    setTemplates(loadTemplates());
    setShowTemplatePrompt(false);
  };
  const handleTemplateDelete = (name) => {
    deleteTemplate(name);
    setTemplates(loadTemplates());
  };
  const handleTemplateApply = (template) => {
    // Apply template settings to temp state only
    onToggleColumn(null, null, template.visibleColumns);
    Object.entries(template.columnWidths).forEach(([key, width]) => {
      onColumnWidthChange(key, width);
    });
    onColumnOrderChange([...template.columnOrder]);
    // No onSave or onCancel here
  };

  // Helper to check if a template matches a given state
  const isTemplateMatch = (template, vCols, cWidths, cOrder) => {
    const keys = Object.keys(template.visibleColumns);
    if (
      keys.length !== Object.keys(vCols).length ||
      !keys.every((k) => vCols[k] === template.visibleColumns[k])
    ) return false;
    const widthKeys = Object.keys(template.columnWidths);
    if (
      widthKeys.length !== Object.keys(cWidths).length ||
      !widthKeys.every((k) => cWidths[k] === template.columnWidths[k])
    ) return false;
    if (template.columnOrder.length !== cOrder.length) return false;
    for (let i = 0; i < cOrder.length; i++) {
      if (template.columnOrder[i] !== cOrder[i]) return false;
    }
    return true;
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
              <button
                onClick={() => setActiveTab("templates")}
                className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "templates"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("columns.modal.templates")}
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

            {activeTab === "templates" && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-lg font-medium">{t("columns.modal.templates")}</span>
                </div>
                {templates.length === 0 && (
                  <div className="text-muted-foreground text-sm">{t("columns.modal.noTemplates")}</div>
                )}
                {templates.map((template) => {
                  // Determine if this template is active (matches real state)
                  const isActive = isTemplateMatch(
                    template,
                    realVisibleColumns,
                    realColumnWidths,
                    realColumnOrder
                  );
                  const borderClass = isActive ? 'border-green-500 border-2 pr-1 pl-1' : '';
                  return (
                    <div
                      key={template.name}
                      className={`flex items-center justify-between border-b border-border py-2 last:border-0 rounded transition-all ${borderClass}`}
                    >
                      <span className="text-foreground font-medium flex items-center gap-2">
                        {template.name}
                        {isActive && (
                          <span title="Active template" className="inline-block align-middle">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTemplateApply(template)}
                        >
                          {t("columns.modal.select")}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleTemplateDelete(template.name)}
                        >
                          {t("columns.modal.delete")}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Save as Template Prompt */}
          {showTemplatePrompt && (
            <div className="fixed inset-0 z-[2147483648] flex items-center justify-center bg-black/40">
              <div className="bg-background p-6 rounded-lg shadow-lg border border-border w-full max-w-sm">
                <h4 className="text-lg font-medium mb-2">{t("columns.modal.saveAsTemplate")}</h4>
                <input
                  className="w-full border border-border rounded px-2 py-1 mb-2"
                  placeholder={t("columns.modal.templateName")}
                  value={templateName}
                  onChange={(e) => {
                    setTemplateName(e.target.value);
                    setTemplateError("");
                  }}
                  autoFocus
                />
                {templateError && (
                  <div className="text-destructive text-sm mb-2">{
                    templateError === "Name required"
                      ? t("columns.modal.nameRequired")
                      : templateError === "Name already exists"
                      ? t("columns.modal.nameExists")
                      : templateError
                  }</div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowTemplatePrompt(false)}>
                    {t("columns.modal.cancel")}
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleTemplateSave}>
                    {t("columns.modal.save")}
                  </Button>
                </div>
              </div>
            </div>
          )}

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
                variant="outline"
                onClick={handleSaveAsTemplate}
                className="ml-2"
              >
                {t("columns.modal.saveAsTemplate")}
              </Button>
              <Button
                variant="primary"
                onClick={onSave}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t("columns.modal.apply")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};
