"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal, Button, Checkbox, Input } from "./CustomControls";
import { useTranslations, useLocale } from "next-intl";
import Portal from "../Portal";
import { 
  getTableTemplates, 
  createTableTemplate, 
  deleteTableTemplate 
} from "../../../API/TableTemplates";

// Extracted Components
const TabButton = React.memo(({ 
  isActive, 
  onClick, 
  children 
}) => (
  <button
    onClick={onClick}
    className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
));

const SearchInput = React.memo(({ 
  value, 
  onChange, 
  placeholder 
}) => (
  <Input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-40 text-sm !w-40"
  />
));

const TemplateItem = React.memo(({ 
  template, 
  isActive, 
  onApply, 
  onDelete, 
  t 
}) => (
  <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
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
        onClick={() => onApply(template)}
      >
        {t("columns.modal.select")}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(template.id)}
      >
        {t("columns.modal.delete")}
      </Button>
    </div>
  </div>
));

const TemplatePrompt = React.memo(({ 
  isOpen, 
  templateName, 
  templateError, 
  onNameChange, 
  onSave, 
  onCancel, 
  t 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center bg-black/40">
      <div className="bg-background p-6 rounded-lg shadow-lg border border-border w-full max-w-sm">
        <h4 className="text-lg font-medium mb-2">{t("columns.modal.saveAsTemplate")}</h4>
        <input
          className="w-full border border-border rounded px-2 py-1 mb-2"
          placeholder={t("columns.modal.templateName")}
          value={templateName}
          onChange={(e) => onNameChange(e.target.value)}
          autoFocus
        />
        {templateError && (
          <div className="text-destructive text-sm mb-2">
            {templateError === "Name required"
              ? t("columns.modal.nameRequired")
              : templateError === "Name already exists"
              ? t("columns.modal.nameExists")
              : templateError}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {t("columns.modal.cancel")}
          </Button>
          <Button variant="primary" size="sm" onClick={onSave}>
            {t("columns.modal.save")}
          </Button>
        </div>
      </div>
    </div>
  );
});

export const ColumnModal = React.memo(({
  isOpen,
  tableName,
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
  const locale = useLocale();
  const isRTL = locale === "ar";

  // State
  const [activeTab, setActiveTab] = useState("visibility");
  const [templates, setTemplates] = useState([]);
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");

  // Memoized values
  const orderedColumns = useMemo(() => 
    columnOrder
      .map((key) => columns.find((col) => col.key === key))
      .filter(Boolean), 
    [columnOrder, columns]
  );

  const filteredColumns = useMemo(() => 
    orderedColumns.filter((column) =>
      column.header.toLowerCase().includes(columnSearch.toLowerCase())
    ), 
    [orderedColumns, columnSearch]
  );

  // Callbacks
  const loadTemplatesFromAPI = useCallback(async () => {
    if (!tableName) return;
    
    setIsLoadingTemplates(true);
    try {
      const response = await getTableTemplates(tableName);
      setTemplates(response || []);
    } catch (error) {
      console.error("Error loading templates:", error);
      setTemplates([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [tableName]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  const handleSelectAll = useCallback(() => {
    const newVisibleColumns = {};
    columns.forEach((column) => {
      newVisibleColumns[column.key] = true;
    });
    onToggleColumn(null, null, newVisibleColumns);
  }, [columns, onToggleColumn]);

  const handleDeselectAll = useCallback(() => {
    const newVisibleColumns = {};
    columns.forEach((column) => {
      newVisibleColumns[column.key] = false;
    });
    onToggleColumn(null, null, newVisibleColumns);
  }, [columns, onToggleColumn]);

  const handleDragStart = useCallback((e, columnKey) => {
    e.dataTransfer.setData("text/plain", columnKey);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e, targetColumnKey) => {
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
  }, [columnOrder, onColumnOrderChange]);

  const handleSaveAsTemplate = useCallback(() => {
    setTemplateName("");
    setTemplateError("");
    setShowTemplatePrompt(true);
  }, []);

  const handleTemplateSave = useCallback(async () => {
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
      visible_columns: { ...visibleColumns },
      column_widths: { ...columnWidths },
      column_order: [...columnOrder],
    };
    
    try {
      await createTableTemplate(tableName, template);
      await loadTemplatesFromAPI();
      setShowTemplatePrompt(false);
    } catch (error) {
      console.error("Error saving template:", error);
      setTemplateError("Failed to save template");
    }
  }, [templateName, templates, visibleColumns, columnWidths, columnOrder, tableName, loadTemplatesFromAPI]);

  const handleTemplateDelete = useCallback(async (templateId) => {
    try {
      await deleteTableTemplate(tableName, templateId);
      await loadTemplatesFromAPI();
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  }, [tableName, loadTemplatesFromAPI]);

  const handleTemplateApply = useCallback((template) => {
    const visibleColumns = template.visible_columns || template.visibleColumns;
    const columnWidths = template.column_widths || template.columnWidths;
    const columnOrder = template.column_order || template.columnOrder;
    
    onToggleColumn(null, null, visibleColumns);
    Object.entries(columnWidths).forEach(([key, width]) => {
      onColumnWidthChange(key, width);
    });
    onColumnOrderChange([...columnOrder]);
  }, [onToggleColumn, onColumnWidthChange, onColumnOrderChange]);

  const isTemplateMatch = useCallback((template, vCols, cWidths, cOrder) => {
    const visibleColumns = template.visible_columns || template.visibleColumns;
    const columnWidths = template.column_widths || template.columnWidths;
    const columnOrder = template.column_order || template.columnOrder;
    
    const keys = Object.keys(visibleColumns);
    if (
      keys.length !== Object.keys(vCols).length ||
      !keys.every((k) => vCols[k] === visibleColumns[k])
    ) return false;
    const widthKeys = Object.keys(columnWidths);
    if (
      widthKeys.length !== Object.keys(cWidths).length ||
      !widthKeys.every((k) => cWidths[k] === columnWidths[k])
    ) return false;
    if (columnOrder.length !== cOrder.length) return false;
    for (let i = 0; i < cOrder.length; i++) {
      if (columnOrder[i] !== cOrder[i]) return false;
    }
    return true;
  }, []);

  const handleTemplateNameChange = useCallback((value) => {
    setTemplateName(value);
    setTemplateError("");
  }, []);

  // Effects
  useEffect(() => {
    if (isOpen && tableName) {
      loadTemplatesFromAPI();
    }
  }, [isOpen, tableName, loadTemplatesFromAPI]);

  // Tab content renderers
  const renderVisibilityTab = useCallback(() => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs">
            {t("columns.modal.selectAll")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeselectAll} className="text-xs">
            {t("columns.modal.deselectAll")}
          </Button>
        </div>
        <SearchInput
          value={columnSearch}
          onChange={(e) => setColumnSearch(e.target.value)}
          placeholder={t("columns.modal.searchColumn") || "Search column..."}
        />
      </div>
      <div>
        {filteredColumns.length === 0 ? (
          <div className="text-muted-foreground text-sm py-4 text-center">
            {t("columns.modal.noColumnsFound") || "No columns found."}
          </div>
        ) : (
          filteredColumns.map((column) => (
            <div
              key={column.key}
              className="flex items-center py-2 border-b border-border last:border-0"
              style={{ gap: "0.5rem" }}
            >
              <Checkbox
                checked={visibleColumns[column.key]}
                onChange={(e) => onToggleColumn(column.key, e.target.checked)}
              />
              <span className="text-foreground flex-1">{column.header}</span>
            </div>
          ))
        )}
      </div>
    </>
  ), [columnSearch, filteredColumns, visibleColumns, onToggleColumn, handleSelectAll, handleDeselectAll, t]);

  const renderSizeTab = useCallback(() => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-0">
            {t("columns.modal.columnWidth")}
          </p>
        </div>
        <SearchInput
          value={columnSearch}
          onChange={(e) => setColumnSearch(e.target.value)}
          placeholder={t("columns.modal.searchColumn") || "Search column..."}
        />
      </div>
      <div>
        {filteredColumns.length === 0 ? (
          <div className="text-muted-foreground text-sm py-4 text-center">
            {t("columns.modal.noColumnsFound") || "No columns found."}
          </div>
        ) : (
          filteredColumns.map((column) => (
            <div
              key={column.key}
              className="flex items-center py-3 border-b border-border last:border-0"
              style={{ gap: "1rem" }}
            >
              <span className="text-foreground flex-1 flex items-center gap-2">
                {column.header}
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  20–500 px
                </span>
              </span>
              <div className="flex items-center" style={{ gap: "0.5rem" }}>
                <Input
                  type="number"
                  min="20"
                  max="500"
                  value={parseInt(columnWidths[column.key]?.replace("px", "") || "100")}
                  onChange={(e) => onColumnWidthChange(column.key, `${e.target.value}px`)}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">{t("columns.modal.px")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  ), [columnSearch, filteredColumns, columnWidths, onColumnWidthChange, t]);

  const renderOrderTab = useCallback(() => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-0">
            {t("columns.modal.dragToReorder")}
          </p>
        </div>
        <SearchInput
          value={columnSearch}
          onChange={(e) => setColumnSearch(e.target.value)}
          placeholder={t("columns.modal.searchColumn") || "Search column..."}
        />
      </div>
      <div>
        {filteredColumns.length === 0 ? (
          <div className="text-muted-foreground text-sm py-4 text-center">
            {t("columns.modal.noColumnsFound") || "No columns found."}
          </div>
        ) : (
          filteredColumns.map((column, index) => (
            <div
              key={column.key}
              className="flex items-center py-2 border-b border-border last:border-0"
              draggable
              onDragStart={(e) => handleDragStart(e, column.key)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.key)}
              style={{ gap: "0.5rem" }}
            >
              <div className="flex items-center flex-1" style={{ gap: "0.5rem" }}>
                <div className="w-6 h-6 flex items-center justify-center text-xs text-muted-foreground bg-muted rounded">
                  {index + 1}
                </div>
                <span className="text-foreground">{column.header}</span>
              </div>
              <div className="flex" style={{ gap: "0.25rem" }}>
                <button
                  onClick={() => onMoveColumnUp(column.key)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18,15 12,9 6,15"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => onMoveColumnDown(column.key)}
                  disabled={index === orderedColumns.length - 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  ), [columnSearch, filteredColumns, handleDragStart, handleDragOver, handleDrop, onMoveColumnUp, onMoveColumnDown, orderedColumns, t]);

  const renderTemplatesTab = useCallback(() => (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <span className="text-lg font-medium">{t("columns.modal.templates")}</span>
      </div>
      {isLoadingTemplates ? (
        <div className="text-muted-foreground text-sm py-4 text-center">
          {t("columns.modal.loadingTemplates") || "Loading templates..."}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-muted-foreground text-sm">{t("columns.modal.noTemplates")}</div>
      ) : (
        templates.map((template) => {
          const isActive = isTemplateMatch(template, realVisibleColumns, realColumnWidths, realColumnOrder);
          return (
            <TemplateItem
              key={template.id || template.name}
              template={template}
              isActive={isActive}
              onApply={handleTemplateApply}
              onDelete={handleTemplateDelete}
              t={t}
            />
          );
        })
      )}
    </div>
  ), [templates, isLoadingTemplates, realVisibleColumns, realColumnWidths, realColumnOrder, isTemplateMatch, handleTemplateApply, handleTemplateDelete, t]);

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[2147483647] pointer-events-auto flex items-center justify-center bg-black/50"
        onClick={handleBackdropClick}
      >
        <div className="w-full max-w-4xl h-[500px] flex flex-col rounded-lg bg-background p-6 shadow-lg border border-border">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              {t("columns.modal.title")}
            </h3>
            <button onClick={onCancel} className="rounded-full p-1 hover:bg-muted text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-4 border-b border-border">
            <div className="flex" style={{ gap: "2rem" }}>
              <TabButton isActive={activeTab === "visibility"} onClick={() => setActiveTab("visibility")}>
                {t("columns.modal.visibility")}
              </TabButton>
              <TabButton isActive={activeTab === "size"} onClick={() => setActiveTab("size")}>
                {t("columns.modal.size")}
              </TabButton>
              <TabButton isActive={activeTab === "order"} onClick={() => setActiveTab("order")}>
                {t("columns.modal.order")}
              </TabButton>
              <TabButton isActive={activeTab === "templates"} onClick={() => setActiveTab("templates")}>
                {t("columns.modal.templates")}
              </TabButton>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeTab === "visibility" && renderVisibilityTab()}
            {activeTab === "size" && renderSizeTab()}
            {activeTab === "order" && renderOrderTab()}
            {activeTab === "templates" && renderTemplatesTab()}
          </div>

          {/* Template Prompt */}
          <TemplatePrompt
            isOpen={showTemplatePrompt}
            templateName={templateName}
            templateError={templateError}
            onNameChange={handleTemplateNameChange}
            onSave={handleTemplateSave}
            onCancel={() => setShowTemplatePrompt(false)}
            t={t}
          />

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            <Button variant="outline" onClick={() => onResetSettings(activeTab)} className="border-border">
              {t("columns.modal.reset")}
            </Button>
            <div className="flex" style={{ gap: "0.5rem" }}>
              <Button variant="outline" onClick={onCancel} className="border-border">
                {t("columns.modal.cancel")}
              </Button>
              <Button variant="outline" onClick={handleSaveAsTemplate} className="ml-2">
                {t("columns.modal.saveAsTemplate")}
              </Button>
              <Button variant="primary" onClick={onSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("columns.modal.apply")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
});

ColumnModal.displayName = "ColumnModal";
