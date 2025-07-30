"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Modal, Button, Checkbox, Input } from "./CustomControls";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { lightTheme } from "../../../lib/themes/light";
import { darkTheme } from "../../../lib/themes/dark";
import ProfessionalHeaderStyler from "./ProfessionalHeaderStyler";

import Portal from "../Portal";
import { 
  getTableTemplates, 
  createTableTemplate, 
  deleteTableTemplate,
  updateTableTemplate
} from "../../../API/TableTemplates";

// Utility to conditionally add a class
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

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
  isSelected,
  onApply, 
  onDelete, 
  t, 
  isDeleting = false,
  deletingId = null
}) => {
  return (
    <div className={classNames(
      'flex items-center justify-between border-b border-border px-4 py-3 last:border-0',
      isSelected && !isActive && 'bg-primary/5 dark:bg-primary/10 rounded-lg',
      isActive && 'bg-primary/20 dark:bg-primary/30 rounded-lg'
    )}>
      <span className="text-foreground font-medium flex items-center gap-2">
        {template.name}
        {isActive && (
          <span title="Active template" className="inline-block align-middle">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </span>
      <div className="flex gap-2">
        {/* Only show select/apply button if it's not the template currently loaded in the modal */}
        {onApply && !isSelected && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onApply(template)}
          >
            {t("columns.modal.select")}
          </Button>
        )}
        {/* Only show delete for non-default templates */}
        {onDelete && !((template.name === "Default") && (template.is_default === true)) && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(template)}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={isDeleting && deletingId === (template.id || template.name)}
          >
            {t("columns.modal.delete")}
            {isDeleting && deletingId === (template.id || template.name) && (
              <span className="ml-2 inline-block align-middle">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
});

const TemplatePrompt = React.memo(({ 
  isOpen, 
  templateName, 
  templateError, 
  onNameChange, 
  onSave, 
  onCancel, 
  t,
  isSaving
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
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
            {t("columns.modal.cancel")}
          </Button>
          <Button variant="primary" size="sm" onClick={onSave} disabled={isSaving}>
            {t("columns.modal.save")}
            {isSaving && (
              <span className="ml-2 inline-block align-middle">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

const DeleteConfirmModal = React.memo(({ 
  isOpen, 
  template, 
  onConfirm, 
  onCancel, 
  t,
  isDeleting
}) => {
  if (!isOpen || !template) return null;

  // Add backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };
  
  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center bg-black/40" onClick={handleBackdropClick}>
      <div className="bg-background p-6 rounded-lg shadow-lg border border-border w-full max-w-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-medium text-destructive">
            {t("columns.modal.deleteConfirmTitle") || "Delete Template"}
          </h4>
          <button
            onClick={onCancel}
            className="rounded-full p-1 hover:bg-muted text-muted-foreground"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20"
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
        <p className="text-muted-foreground mb-4">
          {t("columns.modal.deleteConfirmMessage", { templateName: template.name }) || 
           `Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isDeleting}>
            {t("columns.modal.cancel")}
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {t("columns.modal.delete")}
            {isDeleting && (
              <span className="ml-2 inline-block align-middle">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

// Try to import Toggle from components/ui/toggle if available
import { Toggle } from "../toggle";

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
  selectedTemplateId: externalSelectedTemplateId,
  onSelectedTemplateChange,
  headerColor,
  headerFontSize,
  headerFontStyle,
  headerFontColor,
  showHeaderSeparator,
  showBodySeparator,
  onOtherSettingsChange,
  showHeaderColSeparator,
  showBodyColSeparator,
}) => {
  // Define defaultTemplateKey at the top of the component
  const defaultTemplateKey = tableName ? `table:${tableName}:defaultTemplate` : null;
  const t = useTranslations("table");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { theme } = useTheme();

  // State
  const [activeTab, setActiveTab] = useState("settings");
  const [templates, setTemplates] = useState([]);
  const [showTemplatePrompt, setShowTemplatePrompt] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [columnSearch, setColumnSearch] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(externalSelectedTemplateId || null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [appliedTemplateId, setAppliedTemplateId] = useState(externalSelectedTemplateId || null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Persisted Other Settings
  const otherSettingsKey = tableName ? `table:${tableName}:otherSettings` : null;
  const getPersistedOtherSettings = () => {
    if (!otherSettingsKey) return {};
    try {
      const raw = localStorage.getItem(otherSettingsKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };
  const persisted = getPersistedOtherSettings();
  const [otherHeaderColor, setOtherHeaderColor] = useState(persisted.headerColor ?? headerColor ?? "");
  const [otherHeaderFontSize, setOtherHeaderFontSize] = useState(persisted.headerFontSize ?? headerFontSize ?? 16);
  const [otherHeaderFontStyle, setOtherHeaderFontStyle] = useState(persisted.headerFontStyle ?? headerFontStyle ?? 'normal');
  const [otherHeaderFontColor, setOtherHeaderFontColor] = useState(persisted.headerFontColor ?? headerFontColor ?? "");
  const [otherShowHeaderSeparator, setOtherShowHeaderSeparator] = useState(persisted.showHeaderSeparator ?? (showHeaderSeparator !== undefined ? showHeaderSeparator : true));
  const [otherShowHeaderColSeparator, setOtherShowHeaderColSeparator] = useState(persisted.showHeaderColSeparator ?? (showHeaderColSeparator !== undefined ? showHeaderColSeparator : true));
  const [otherShowBodyColSeparator, setOtherShowBodyColSeparator] = useState(persisted.showBodyColSeparator ?? (showBodyColSeparator !== undefined ? showBodyColSeparator : true));

  // Add a state to track which template to select after saving
  const [pendingTemplateIdOrName, setPendingTemplateIdOrName] = useState(null);
  // Add a flag to track if the current template was just updated
  const [templateJustUpdated, setTemplateJustUpdated] = useState(false);
  // Add a ref to track if the last applied template has been loaded
  const hasLoadedLastAppliedTemplate = useRef(false);
  // Store callback functions in refs to avoid dependency issues
  const callbackRefs = useRef({
    onToggleColumn,
    onColumnWidthChange,
    onColumnOrderChange,
    onSelectedTemplateChange
  });

  // Update callback refs when they change
  useEffect(() => {
    callbackRefs.current = {
      onToggleColumn,
      onColumnWidthChange,
      onColumnOrderChange,
      onSelectedTemplateChange
    };
  }, [onToggleColumn, onColumnWidthChange, onColumnOrderChange, onSelectedTemplateChange]);

  // Helper functions for localStorage persistence
  const getLastAppliedTemplateKey = () => tableName ? `table:${tableName}:lastAppliedTemplate` : null;
  
  const saveLastAppliedTemplate = useCallback((templateId, templateData) => {
    const key = getLastAppliedTemplateKey();
    if (!key) return;
    
    try {
      const templateToSave = {
        id: templateId,
        name: templateData.name || templateId, // Include name for proper restoration
        is_default: templateData.is_default, // Include is_default for proper identification
        appliedAt: new Date().toISOString(),
        ...templateData
      };
      localStorage.setItem(key, JSON.stringify(templateToSave));
    } catch (error) {
      console.error("Error saving last applied template:", error);
    }
  }, [tableName]);

  const loadLastAppliedTemplate = useCallback(() => {
    const key = getLastAppliedTemplateKey();
    if (!key) return null;
    
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error loading last applied template:", error);
      return null;
    }
  }, [tableName]);

  const clearLastAppliedTemplate = useCallback(() => {
    const key = getLastAppliedTemplateKey();
    if (!key) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error clearing last applied template:", error);
    }
  }, [tableName]);

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



  const isTemplateMatch = useCallback((template, vCols, cWidths, cOrder) => {
    if (!template) return false;
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

  const [isSaving, setIsSaving] = useState(false);

  const handleTemplateSave = useCallback(async () => {
    if (!templateName.trim()) {
      setTemplateError("Name required");
      return;
    }
    if (templates.some((t) => t.name === templateName.trim())) {
      setTemplateError("Name already exists");
      return;
    }
    setIsSaving(true);
    const template = {
      name: templateName.trim(),
      visible_columns: { ...visibleColumns },
      column_widths: Object.fromEntries(
        Object.entries(columnWidths).map(([key, value]) => [key, typeof value === 'string' ? value : `${value}px`])
      ),
      column_order: [...columnOrder],
      headerColor: otherHeaderColor || null,
      headerFontSize: `${otherHeaderFontSize}px`,
      headerFontStyle: otherHeaderFontStyle,
      headerFontColor: otherHeaderFontColor || null,
      showHeaderSeparator: otherShowHeaderSeparator,
      showHeaderColSeparator: otherShowHeaderColSeparator,
      showBodyColSeparator: otherShowBodyColSeparator,
    };
    try {
      await createTableTemplate(tableName, template);
      await loadTemplatesFromAPI();
      setShowTemplatePrompt(false);
      setTemplateName("");
      setTemplateError("");
      // Set the newly created template as pending to be selected after reload
      setPendingTemplateIdOrName(templateName.trim());
      setTemplateJustUpdated(true); // Mark that the template was just updated
    } catch (error) {
      console.error("Error saving template:", error);
      setTemplateError("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  }, [templateName, templates, visibleColumns, columnWidths, columnOrder, tableName, loadTemplatesFromAPI, otherHeaderColor, otherHeaderFontSize, otherHeaderFontStyle, otherHeaderFontColor, otherShowHeaderSeparator, otherShowHeaderColSeparator, otherShowBodyColSeparator]);

  const handleTemplateDelete = useCallback((template) => {
    setTemplateToDelete(template);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!templateToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTableTemplate(tableName, templateToDelete.id);
      await loadTemplatesFromAPI();
      
      // If we're deleting the current template, clear it
      if (currentTemplate && currentTemplate.id === templateToDelete.id) {
        setCurrentTemplate(null);
        setSelectedTemplateId(null);
        setHasChanges(true); // Mark as having changes since we're no longer using a template
      }
      
      // If we're deleting the applied template, clear appliedTemplateId and localStorage
      if (appliedTemplateId === templateToDelete.id) {
        setAppliedTemplateId(null);
        if (onSelectedTemplateChange) {
          onSelectedTemplateChange(null);
        }
        // Clear the last applied template from localStorage
        clearLastAppliedTemplate();
      }

    } catch (error) {
      console.error("Error deleting template:", error);

    } finally {
      setShowDeleteConfirm(false);
      setTemplateToDelete(null);
      setIsDeleting(false);
    }
  }, [templateToDelete, tableName, loadTemplatesFromAPI, currentTemplate, appliedTemplateId, onSelectedTemplateChange, clearLastAppliedTemplate]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setTemplateToDelete(null);
  }, []);

  const handleTemplateApply = useCallback((template) => {
    let visibleColumns = template.visible_columns || template.visibleColumns;
    const columnWidths = template.column_widths || template.columnWidths;
    const columnOrder = template.column_order || template.columnOrder;
    const templateId = template.id || template.name;

    onToggleColumn(null, null, visibleColumns);
    Object.entries(columnWidths).forEach(([key, width]) => {
      onColumnWidthChange(key, width);
    });
    onColumnOrderChange([...columnOrder]);
    
    // Set other settings from template if present - only if different
    if (typeof template.headerColor !== 'undefined' && template.headerColor !== otherHeaderColor) setOtherHeaderColor(template.headerColor);
    if (typeof template.headerFontSize !== 'undefined') {
      const fontSize = template.headerFontSize ? parseInt(template.headerFontSize.replace('px', '')) : 16;
      if (fontSize !== otherHeaderFontSize) setOtherHeaderFontSize(fontSize);
    }
    if (typeof template.headerFontStyle !== 'undefined' && template.headerFontStyle !== otherHeaderFontStyle) setOtherHeaderFontStyle(template.headerFontStyle);
    if (typeof template.headerFontColor !== 'undefined' && template.headerFontColor !== otherHeaderFontColor) setOtherHeaderFontColor(template.headerFontColor);
    if (typeof template.showHeaderSeparator !== 'undefined' && template.showHeaderSeparator !== otherShowHeaderSeparator) setOtherShowHeaderSeparator(template.showHeaderSeparator);
    if (typeof template.showHeaderColSeparator !== 'undefined' && template.showHeaderColSeparator !== otherShowHeaderColSeparator) setOtherShowHeaderColSeparator(template.showHeaderColSeparator);
    if (typeof template.showBodyColSeparator !== 'undefined' && template.showBodyColSeparator !== otherShowBodyColSeparator) setOtherShowBodyColSeparator(template.showBodyColSeparator);
    
    setSelectedTemplateId(templateId);
    setCurrentTemplate(template);
    setHasChanges(false);
    // Note: We do NOT update appliedTemplateId here - that only happens when the main "Apply" button is clicked
  }, [onToggleColumn, onColumnWidthChange, onColumnOrderChange]);

  const handleTemplateNameChange = useCallback((value) => {
    setTemplateName(value);
    setTemplateError("");
  }, []);

  // Save functionality
  const handleSave = useCallback(async () => {
    // If no current template (default template selected), use save as instead
    if (!currentTemplate) {
      setTemplateName("");
      setTemplateError("");
      setShowTemplatePrompt(true);
      return;
    }
    
    setIsSaving(true);
    try {
      const updatedTemplate = {
        ...currentTemplate,
        visible_columns: { ...visibleColumns },
        column_widths: Object.fromEntries(
          Object.entries(columnWidths).map(([key, value]) => [key, typeof value === 'string' ? value : `${value}px`])
        ),
        column_order: [...columnOrder],
        headerColor: otherHeaderColor || null,
        headerFontSize: `${otherHeaderFontSize}px`,
        headerFontStyle: otherHeaderFontStyle,
        headerFontColor: otherHeaderFontColor || null,
        showHeaderSeparator: otherShowHeaderSeparator,
        showHeaderColSeparator: otherShowHeaderColSeparator,
        showBodyColSeparator: otherShowBodyColSeparator,
      };
      await updateTableTemplate(tableName, currentTemplate.id, updatedTemplate);
      await loadTemplatesFromAPI();
      setPendingTemplateIdOrName(currentTemplate.id || currentTemplate.name);
      setTemplateJustUpdated(true); // Mark that the template was just updated
    } catch (error) {
      console.error("Error updating template:", error);
    } finally {
      setIsSaving(false);
    }
  }, [currentTemplate, visibleColumns, columnWidths, columnOrder, tableName, loadTemplatesFromAPI, otherHeaderColor, otherHeaderFontSize, otherHeaderFontStyle, otherHeaderFontColor, otherShowHeaderSeparator, otherShowHeaderColSeparator, otherShowBodyColSeparator]);

  const handleSaveAs = useCallback(async () => {
    setTemplateName(currentTemplate ? `${currentTemplate.name} (Copy)` : "");
    setTemplateError("");
    setShowTemplatePrompt(true);
  }, [currentTemplate]);

  // Effects
  // Effect 1: Load templates when modal opens
  useEffect(() => {
    if (isOpen && tableName) {
      loadTemplatesFromAPI();
    }
  }, [isOpen, tableName, loadTemplatesFromAPI]);

  // Effect 2: Restore last selected template when templates are loaded
  useEffect(() => {
    // No localStorage restoration - templates will be selected manually or auto-selected if default is the only one
  }, [isOpen, tableName, templates]);

  // Sync external selected template ID
  useEffect(() => {
    if (externalSelectedTemplateId !== appliedTemplateId) {
      setSelectedTemplateId(externalSelectedTemplateId || null);
      setAppliedTemplateId(externalSelectedTemplateId || null);
      // Also sync currentTemplate if we have templates loaded
      if (templates.length > 0 && externalSelectedTemplateId) {
        const selectedTemplate = templates.find(template => 
          (template.id || template.name) === externalSelectedTemplateId
        );
        setCurrentTemplate(selectedTemplate || null);
      } else if (!externalSelectedTemplateId) {
        setCurrentTemplate(null);
      }
    }
  }, [externalSelectedTemplateId, templates, appliedTemplateId]);

  // Persist selected template when templates are reloaded
  // DISABLED: This useEffect was causing infinite loops
  // Template persistence is now handled manually by user selection

  // Add a useEffect to update currentTemplate after templates are reloaded
  useEffect(() => {
    if (pendingTemplateIdOrName && templates.length > 0) {
      const found = templates.find(t => (t.id || t.name) === pendingTemplateIdOrName);
      setCurrentTemplate(found || null);
      setSelectedTemplateId(found ? (found.id || found.name) : null);
      // Don't update appliedTemplateId here - it should only change when explicitly applied
      setPendingTemplateIdOrName(null);
    }
  }, [pendingTemplateIdOrName, templates]);

  // Unified logic to detect changes when template is applied
  useEffect(() => {
    // Don't run if templates are still loading or if we don't have any templates yet
    if (isLoadingTemplates || templates.length === 0) {
      return;
    }
    
    // Determine the template to compare against
    const template = currentTemplate;
    if (!template) {
      setHasChanges(true);
      return;
    }
    // Compare column settings
    const templateVisibleColumns = template.visible_columns || template.visibleColumns || {};
    const templateColumnWidths = template.column_widths || template.columnWidths || {};
    const templateColumnOrder = template.column_order || template.columnOrder || [];
    const visibleChanged =
      JSON.stringify(visibleColumns) !== JSON.stringify(templateVisibleColumns);
    const widthsChanged =
      JSON.stringify(columnWidths) !== JSON.stringify(templateColumnWidths);
    const orderChanged =
      JSON.stringify(columnOrder) !== JSON.stringify(templateColumnOrder);
    
    // Compare other settings - handle both old and new field names
    const templateHeaderColor = template.headerColor ?? "";
    const templateHeaderFontSize = template.headerFontSize ? parseInt(template.headerFontSize.replace('px', '')) : 16;
    const templateHeaderFontStyle = template.headerFontStyle ?? 'normal';
    const templateHeaderFontColor = template.headerFontColor ?? "";
    const templateShowHeaderSeparator = typeof template.showHeaderSeparator === 'boolean' ? template.showHeaderSeparator : true;
    const templateShowHeaderColSeparator = typeof template.showHeaderColSeparator === 'boolean' ? template.showHeaderColSeparator : true;
    const templateShowBodyColSeparator = typeof template.showBodyColSeparator === 'boolean' ? template.showBodyColSeparator : true;
    
    const otherChanged =
      otherHeaderColor !== templateHeaderColor ||
      otherHeaderFontSize !== templateHeaderFontSize ||
      otherHeaderFontStyle !== templateHeaderFontStyle ||
      otherHeaderFontColor !== templateHeaderFontColor ||
      otherShowHeaderSeparator !== templateShowHeaderSeparator ||
      otherShowHeaderColSeparator !== templateShowHeaderColSeparator ||
      otherShowBodyColSeparator !== templateShowBodyColSeparator;
    setHasChanges(visibleChanged || widthsChanged || orderChanged || otherChanged);
  }, [visibleColumns, columnWidths, columnOrder, otherHeaderColor, otherHeaderFontSize, otherHeaderFontStyle, otherHeaderFontColor, otherShowHeaderSeparator, otherShowHeaderColSeparator, otherShowBodyColSeparator, currentTemplate, isLoadingTemplates]);

  useEffect(() => {
    if (isOpen && !currentTemplate) {
      setOtherHeaderColor(headerColor || "");
      setOtherHeaderFontSize(headerFontSize ?? 16);
      setOtherHeaderFontStyle(headerFontStyle ?? 'normal');
      setOtherHeaderFontColor(headerFontColor ?? "");
      setOtherShowHeaderSeparator(showHeaderSeparator !== undefined ? showHeaderSeparator : true);
      setOtherShowHeaderColSeparator(showHeaderColSeparator !== undefined ? showHeaderColSeparator : true);
      setOtherShowBodyColSeparator(showBodyColSeparator !== undefined ? showBodyColSeparator : true);
    }
  }, [isOpen, currentTemplate, headerColor, headerFontSize, headerFontStyle, headerFontColor, showHeaderSeparator, showHeaderColSeparator, showBodyColSeparator]);

  // Persist Other Settings to localStorage on change
  useEffect(() => {
    if (!otherSettingsKey) return;
    const settings = {
      headerColor: otherHeaderColor,
      headerFontSize: otherHeaderFontSize,
      headerFontStyle: otherHeaderFontStyle,
      headerFontColor: otherHeaderFontColor,
      showHeaderSeparator: otherShowHeaderSeparator,
      showHeaderColSeparator: otherShowHeaderColSeparator,
      showBodyColSeparator: otherShowBodyColSeparator,
    };
    try {
      localStorage.setItem(otherSettingsKey, JSON.stringify(settings));
    } catch {}
  }, [otherHeaderColor, otherHeaderFontSize, otherHeaderFontStyle, otherHeaderFontColor, otherShowHeaderSeparator, otherShowHeaderColSeparator, otherShowBodyColSeparator, otherSettingsKey]);

  // Add a reset handler for the "other" tab
  const handleResetOtherSettings = useCallback(() => {
    setOtherHeaderColor(""); // Use empty string to indicate "theme default"
    setOtherHeaderFontSize(16);
    setOtherHeaderFontStyle('normal');
    setOtherHeaderFontColor(""); // Use empty string to indicate "theme default"
    setOtherShowHeaderSeparator(showHeaderSeparator !== undefined ? showHeaderSeparator : true);
    setOtherShowHeaderColSeparator(showHeaderColSeparator !== undefined ? showHeaderColSeparator : true);
    setOtherShowBodyColSeparator(showBodyColSeparator !== undefined ? showBodyColSeparator : true);
    // Optionally, clear persisted settings in localStorage
    if (otherSettingsKey) {
      localStorage.removeItem(otherSettingsKey);
    }
  }, [showHeaderSeparator, showHeaderColSeparator, showBodyColSeparator, otherSettingsKey]);

  // Add an effect to update the preview color when theme changes and color is empty:
  useEffect(() => {
    if (!otherHeaderColor) {
      // This will trigger a re-render with the correct color for the theme
      setOtherHeaderColor(""); // Keep as empty, input will show correct color
    }
  }, [theme]);

  const renderOtherSettingsTab = useCallback(() => (
    <div className="space-y-6 px-2 py-4">
      <ProfessionalHeaderStyler
        backgroundColor={otherHeaderColor || (theme === 'dark' ? '#1e293b' : '#f1f5f9')}
        onBackgroundColorChange={setOtherHeaderColor}
        fontSize={otherHeaderFontSize}
        onFontSizeChange={setOtherHeaderFontSize}
        fontStyle={otherHeaderFontStyle}
        onFontStyleChange={setOtherHeaderFontStyle}
        fontColor={otherHeaderFontColor}
        onFontColorChange={setOtherHeaderFontColor}
        label={t("columns.modal.headerStyling") || "Header Styling"}
      />
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <Toggle
            pressed={otherShowHeaderSeparator}
            onPressedChange={setOtherShowHeaderSeparator}
            className="accent-primary"
          />
          <span className="text-sm">{t("columns.modal.showHeaderSeparator")}</span>
        </label>
        <label className="flex items-center gap-2">
          <Toggle
            pressed={otherShowHeaderColSeparator}
            onPressedChange={setOtherShowHeaderColSeparator}
            className="accent-primary"
          />
          <span className="text-sm">{t("columns.modal.showHeaderColSeparator")}</span>
        </label>
        <label className="flex items-center gap-2">
          <Toggle
            pressed={otherShowBodyColSeparator}
            onPressedChange={setOtherShowBodyColSeparator}
            className="accent-primary"
          />
          <span className="text-sm">{t("columns.modal.showBodyColSeparator")}</span>
        </label>
      </div>
    </div>
  ), [otherHeaderColor, otherHeaderFontSize, otherHeaderFontStyle, otherHeaderFontColor, otherShowHeaderSeparator, otherShowHeaderColSeparator, otherShowBodyColSeparator, t, theme]);

  // Tab content renderers
  const renderColumnSettingsTab = useCallback(() => (
    <div>
      <div className="flex items-center justify-between mb-4 px-2 py-2">
        <SearchInput
          value={columnSearch}
          onChange={(e) => setColumnSearch(e.target.value)}
          placeholder={t("columns.modal.searchColumn") || "Search column..."}
          className="w-64 pt-4 pl-6 pr-4 pb-4"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs">
            {t("columns.modal.selectAll")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeselectAll} className="text-xs">
            {t("columns.modal.deselectAll")}
          </Button>
        </div>
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
              className="flex items-center py-3 border-b border-border last:border-0"
              style={{ gap: "1rem" }}
            >
              {/* Order Number */}
              <div className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground bg-muted rounded">
                {index + 1}
              </div>
              
              {/* Visibility Checkbox */}
              <div className="flex items-center" style={{ gap: "0.5rem" }}>
                <Checkbox
                  checked={visibleColumns[column.key]}
                  onChange={(e) => onToggleColumn(column.key, e.target.checked)}
                />
              </div>
              
              {/* Column Name */}
              <span className="text-foreground flex-1">{column.header}</span>
              
              {/* Size Input */}
              <div className="flex items-center" style={{ gap: "0.5rem" }}>
                <span className="text-xs text-muted-foreground w-12">Width:</span>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={
                    (() => {
                      if (typeof columnWidths[column.key] === 'string') {
                        const parsed = parseInt(columnWidths[column.key].replace("px", ""));
                        return isNaN(parsed) ? 100 : parsed;
                      }
                      if (typeof columnWidths[column.key] === 'number') {
                        return isNaN(columnWidths[column.key]) ? 100 : columnWidths[column.key];
                      }
                      return 100;
                    })()
                  }
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) {
                      onColumnWidthChange(column.key, `${value}px`);
                    }
                  }}
                  className="w-20 text-center"
                />
                <span className="text-xs text-muted-foreground">{t("columns.modal.px")}</span>
                <span className="text-xs text-orange-500 ml-1 whitespace-nowrap">(min: 110px)</span>
              </div>
              
              {/* Order Controls */}
              <div className="flex" style={{ gap: "0.25rem" }}>
                <button
                  onClick={() => onMoveColumnUp(column.key)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18,15 12,9 6,15"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => onMoveColumnDown(column.key)}
                  disabled={index === orderedColumns.length - 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
              </div>
              {/* Drag Handle */}
              <div
                className="cursor-grab p-2 ml-2 flex items-center"
                draggable
                onDragStart={(e) => handleDragStart(e, column.key)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.key)}
                title="Drag to reorder"
                style={{ userSelect: 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="text-muted-foreground">
                  <circle cx="5" cy="6" r="1.5" />
                  <circle cx="5" cy="10" r="1.5" />
                  <circle cx="5" cy="14" r="1.5" />
                  <circle cx="10" cy="6" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="10" cy="14" r="1.5" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  ), [columnSearch, filteredColumns, visibleColumns, onToggleColumn, handleSelectAll, handleDeselectAll, columnWidths, onColumnWidthChange, handleDragStart, handleDragOver, handleDrop, onMoveColumnUp, onMoveColumnDown, orderedColumns, t]);

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
          const templateId = template.id || template.name;
          const isApplied = appliedTemplateId === templateId;
          const isSelectedInModal = selectedTemplateId === templateId;
          return (
            <TemplateItem
              key={templateId}
              template={template}
              isActive={isApplied}
              isSelected={isSelectedInModal} // Highlight if selected in modal (not necessarily applied)
              onApply={handleTemplateApply}
              onDelete={handleTemplateDelete}
              t={t}
              isDeleting={isDeleting}
              deletingId={templateToDelete ? (templateToDelete.id || templateToDelete.name) : null}
            />
          );
        })
      )}
    </div>
  ), [templates, isLoadingTemplates, handleTemplateApply, handleTemplateDelete, t, selectedTemplateId, appliedTemplateId, isDeleting, templateToDelete]);

  // Add a global reset handler
  const handleGlobalReset = useCallback(() => {
    // Reset column settings (visibility, order, widths)
    const defaultVisible = {};
    columns.forEach((col) => {
      defaultVisible[col.key] = col.key !== "created_at" && col.key !== "updated_at";
    });
    onToggleColumn(null, null, defaultVisible);
    onColumnOrderChange(columns.map((col) => col.key));
    const defaultWidths = {
      select: "28px",
      search: "28px",
    };
    columns.forEach((col) => {
      defaultWidths[col.key] = "110px";
    });
    Object.entries(defaultWidths).forEach(([key, width]) => {
      onColumnWidthChange(key, width);
    });
    // Reset other settings
    setOtherHeaderColor("");
    setOtherHeaderFontSize(16);
    setOtherHeaderFontStyle('normal');
    setOtherHeaderFontColor(""); // Use empty string to indicate "theme default"
    setOtherShowHeaderSeparator(true);
    setOtherShowHeaderColSeparator(true);
    setOtherShowBodyColSeparator(true);
    if (otherSettingsKey) {
      localStorage.removeItem(otherSettingsKey);
    }
  }, [columns, onToggleColumn, onColumnOrderChange, onColumnWidthChange, otherSettingsKey]);

  // Custom cancel handler
  const handleCustomCancel = useCallback(() => {
    // If the applied template is the same as the selected template and it was just updated, apply the new settings
    if (
      appliedTemplateId &&
      selectedTemplateId &&
      appliedTemplateId === selectedTemplateId &&
      templateJustUpdated
    ) {
      if (onSave) onSave();
      if (onOtherSettingsChange) {
        onOtherSettingsChange({
          headerColor: otherHeaderColor,
          headerFontSize: otherHeaderFontSize,
          headerFontStyle: otherHeaderFontStyle,
          headerFontColor: otherHeaderFontColor,
          showHeaderSeparator: otherShowHeaderSeparator,
          showHeaderColSeparator: otherShowHeaderColSeparator,
          showBodyColSeparator: otherShowBodyColSeparator,
        });
      }
      setTemplateJustUpdated(false); // Reset the flag
    }
    onCancel();
  }, [appliedTemplateId, selectedTemplateId, templateJustUpdated, onSave, onOtherSettingsChange, otherHeaderColor, otherHeaderFontSize, otherHeaderFontStyle, otherHeaderFontColor, otherShowHeaderSeparator, otherShowHeaderColSeparator, otherShowBodyColSeparator, onCancel]);

  // Effect to load last applied template when modal opens
  useEffect(() => {
    if (isOpen && tableName && !hasLoadedLastAppliedTemplate.current) {
      const lastAppliedTemplate = loadLastAppliedTemplate();
      if (lastAppliedTemplate && lastAppliedTemplate.id) {
        // Set the last applied template as the current template
        setAppliedTemplateId(lastAppliedTemplate.id);
        setSelectedTemplateId(lastAppliedTemplate.id);
        
        // Apply the template settings using refs to avoid dependency issues
        if (lastAppliedTemplate.visible_columns) {
          callbackRefs.current.onToggleColumn(null, null, lastAppliedTemplate.visible_columns);
        }
        if (lastAppliedTemplate.column_widths) {
          Object.entries(lastAppliedTemplate.column_widths).forEach(([key, width]) => {
            callbackRefs.current.onColumnWidthChange(key, width);
          });
        }
        if (lastAppliedTemplate.column_order) {
          callbackRefs.current.onColumnOrderChange([...lastAppliedTemplate.column_order]);
        }
        
        // Apply other settings
        if (lastAppliedTemplate.headerColor !== undefined) setOtherHeaderColor(lastAppliedTemplate.headerColor);
        if (lastAppliedTemplate.headerFontSize !== undefined) {
          const fontSize = lastAppliedTemplate.headerFontSize ? parseInt(lastAppliedTemplate.headerFontSize.replace('px', '')) : 16;
          setOtherHeaderFontSize(fontSize);
        }
        if (lastAppliedTemplate.headerFontStyle !== undefined) setOtherHeaderFontStyle(lastAppliedTemplate.headerFontStyle);
        if (lastAppliedTemplate.headerFontColor !== undefined) setOtherHeaderFontColor(lastAppliedTemplate.headerFontColor);
        if (lastAppliedTemplate.showHeaderSeparator !== undefined) setOtherShowHeaderSeparator(lastAppliedTemplate.showHeaderSeparator);
        if (lastAppliedTemplate.showHeaderColSeparator !== undefined) setOtherShowHeaderColSeparator(lastAppliedTemplate.showHeaderColSeparator);
        if (lastAppliedTemplate.showBodyColSeparator !== undefined) setOtherShowBodyColSeparator(lastAppliedTemplate.showBodyColSeparator);
        
        // Update the external selected template
        if (callbackRefs.current.onSelectedTemplateChange) {
          callbackRefs.current.onSelectedTemplateChange(lastAppliedTemplate.id);
        }
        
        // Set currentTemplate to enable save button
        // Create a template object from the localStorage data
        const templateFromStorage = {
          id: lastAppliedTemplate.id,
          name: lastAppliedTemplate.name || lastAppliedTemplate.id, // Include name property for validation
          is_default: lastAppliedTemplate.is_default, // Include is_default property
          visible_columns: lastAppliedTemplate.visible_columns,
          column_widths: lastAppliedTemplate.column_widths,
          column_order: lastAppliedTemplate.column_order,
          headerColor: lastAppliedTemplate.headerColor,
          headerFontSize: lastAppliedTemplate.headerFontSize,
          headerFontStyle: lastAppliedTemplate.headerFontStyle,
          headerFontColor: lastAppliedTemplate.headerFontColor,
          showHeaderSeparator: lastAppliedTemplate.showHeaderSeparator,
          showHeaderColSeparator: lastAppliedTemplate.showHeaderColSeparator,
          showBodyColSeparator: lastAppliedTemplate.showBodyColSeparator,
        };
        
        setCurrentTemplate(templateFromStorage);
      }
      hasLoadedLastAppliedTemplate.current = true;
    }
  }, [isOpen, tableName, loadLastAppliedTemplate]); // Only depend on stable values

  // Effect to set currentTemplate when templates are loaded and we have a selected template
  useEffect(() => {
    if (templates.length > 0 && selectedTemplateId && !currentTemplate) {
      const foundTemplate = templates.find(template => 
        (template.id || template.name) === selectedTemplateId
      );
      if (foundTemplate) {
        setCurrentTemplate(foundTemplate);
      }
    }
  }, [templates, selectedTemplateId, currentTemplate]);

  // Reset the flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasLoadedLastAppliedTemplate.current = false;
    }
  }, [isOpen]);

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
            <button onClick={handleCustomCancel} className="rounded-full p-1 hover:bg-muted text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-4 border-b border-border">
            <div className="flex" style={{ gap: "2rem" }}>
              <TabButton isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")}> 
                {t("columns.modal.settings") || "Column Settings"}
              </TabButton>
              <TabButton isActive={activeTab === "other"} onClick={() => setActiveTab("other")}>{t("columns.modal.otherSettings")}</TabButton>
              <TabButton isActive={activeTab === "templates"} onClick={() => setActiveTab("templates")}> 
                {t("columns.modal.templates")}
              </TabButton>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeTab === "settings" && renderColumnSettingsTab()}
            {activeTab === "other" && renderOtherSettingsTab()}
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
            isSaving={isSaving}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={showDeleteConfirm}
            template={templateToDelete}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            t={t}
            isDeleting={isDeleting}
          />

          {/* Footer */}
          <div className="mt-6 flex justify-end items-center">
            {(activeTab === "settings" || activeTab === "other") && (
              <Button
                variant="outline"
                onClick={handleGlobalReset}
                className="border-border mr-2"
              >
                {t("columns.modal.reset")}
              </Button>
            )}
            <div className="flex" style={{ gap: "0.5rem" }}>
              <Button variant="outline" onClick={handleCustomCancel} className="border-border">
                {t("columns.modal.cancel")}
              </Button>
              {(activeTab === "settings" || activeTab === "other") && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleSave}
                    disabled={!currentTemplate || isSaving}
                    className="ml-2"
                  >
                    {isSaving ? t("columns.modal.saving") : t("columns.modal.save")}
                    {isSaving && (
                      <span className="ml-2 inline-block align-middle">
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M22 12a10 10 0 0 1-10 10"/></svg>
                      </span>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSaveAs}
                    disabled={isSaving}
                    className="ml-2"
                  >
                    {t("columns.modal.saveAs")}
                  </Button>
                </>
              )}
              <Button variant="primary" onClick={() => {
                onSave();
                // Update appliedTemplateId when the main "Apply" button is clicked
                if (selectedTemplateId) {
                  setAppliedTemplateId(selectedTemplateId);
                  if (onSelectedTemplateChange) {
                    onSelectedTemplateChange(selectedTemplateId);
                  }
                  
                  // Save the applied template to localStorage
                  const templateData = {
                    name: currentTemplate ? currentTemplate.name : selectedTemplateId, // Include template name
                    is_default: currentTemplate ? currentTemplate.is_default : false, // Include is_default property
                    visible_columns: { ...visibleColumns },
                    column_widths: Object.fromEntries(
                      Object.entries(columnWidths).map(([key, value]) => [key, typeof value === 'string' ? value : `${value}px`])
                    ),
                    column_order: [...columnOrder],
                    headerColor: otherHeaderColor || null,
                    headerFontSize: `${otherHeaderFontSize}px`,
                    headerFontStyle: otherHeaderFontStyle,
                    headerFontColor: otherHeaderFontColor || null,
                    showHeaderSeparator: otherShowHeaderSeparator,
                    showHeaderColSeparator: otherShowHeaderColSeparator,
                    showBodyColSeparator: otherShowBodyColSeparator,
                  };
                  saveLastAppliedTemplate(selectedTemplateId, templateData);
                } else {
                  // If no template is selected, clear the last applied template
                  clearLastAppliedTemplate();
                }
                setTimeout(() => {
                  if (onOtherSettingsChange) {
                    onOtherSettingsChange({
                      headerColor: otherHeaderColor,
                      headerFontSize: otherHeaderFontSize,
                      headerFontStyle: otherHeaderFontStyle,
                      headerFontColor: otherHeaderFontColor,
                      showHeaderSeparator: otherShowHeaderSeparator,
                      showHeaderColSeparator: otherShowHeaderColSeparator,
                      showBodyColSeparator: otherShowBodyColSeparator,
                    });
                  }
                }, 0);
              }} className="bg-primary text-primary-foreground hover:bg-primary/90">
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
