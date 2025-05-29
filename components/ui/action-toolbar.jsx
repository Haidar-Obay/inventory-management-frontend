'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './button.tsx';
import { 
  PlusIcon, 
  FileSpreadsheetIcon, 
  FileTextIcon, 
  PrinterIcon, 
  RefreshCwIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SaveIcon,
  SaveIcon as SaveAndNewIcon,
  LogOutIcon,
  XIcon,
  UploadIcon
} from 'lucide-react';

// Memoized action configurations
const ACTION_CONFIG = {
  add: {
    icon: PlusIcon,
    label: 'Add New',
    style: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  excel: {
    icon: FileSpreadsheetIcon,
    label: 'Export Excel',
    style: 'bg-green-700 hover:bg-green-800 text-white border border-gray-300'
  },
  pdf: {
    icon: FileTextIcon,
    label: 'Export PDF',
    style: 'bg-red-700 hover:bg-red-800 text-white border border-gray-300'
  },
  print: {
    icon: PrinterIcon,
    label: 'Print',
    style: 'bg-background hover:bg-muted text-foreground border border-border'
  },
  refresh: {
    icon: RefreshCwIcon,
    label: 'Refresh',
    style: 'bg-background hover:bg-muted text-foreground border border-border'
  },
  save: {
    icon: SaveIcon,
    label: 'Save',
    style: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  saveAndNew: {
    icon: SaveAndNewIcon,
    label: 'Save & New',
    style: 'bg-green-600 hover:bg-green-700 text-white'
  },
  saveAndExit: {
    icon: LogOutIcon,
    label: 'Save & Exit',
    style: 'bg-red-600 hover:bg-red-700 text-white'
  },
  cancel: {
    icon: XIcon,
    label: 'Cancel',
    style: 'bg-gray-600 hover:bg-gray-700 text-white'
  },
  importExcel: {
    icon: UploadIcon,
    label: 'Import Excel',
    style: 'bg-green-700 hover:bg-green-800 text-white border border-gray-300'
  }
};

export function ActionToolbar({ 
  onAdd, 
  onExportExcel, 
  onExportPdf, 
  onPrint, 
  onRefresh,
  onSave,
  onSaveAndNew,
  onSaveAndExit,
  onCancel,
  onImportExcel,
  expandDirection = 'left',
  className = "",
  storageKey = 'action-toolbar-last-action'
}) {
  const [lastUsedAction, setLastUsedAction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  // Memoize available actions
  const availableActions = useMemo(() => {
    const actions = [
      { id: 'add', callback: onAdd },
      { id: 'excel', callback: onExportExcel },
      { id: 'pdf', callback: onExportPdf },
      { id: 'print', callback: onPrint },
      { id: 'refresh', callback: onRefresh },
      { id: 'save', callback: onSave },
      { id: 'saveAndNew', callback: onSaveAndNew },
      { id: 'saveAndExit', callback: onSaveAndExit },
      { id: 'cancel', callback: onCancel },
      { id: 'importExcel', callback: onImportExcel }
    ];
    return actions.filter(action => action.callback);
  }, [onAdd, onExportExcel, onExportPdf, onPrint, onRefresh, onSave, onSaveAndNew, onSaveAndExit, onCancel, onImportExcel]);

  // Load the last used action from localStorage on component mount
  useEffect(() => {
    const savedAction = localStorage.getItem(storageKey);
    if (savedAction && availableActions.some(action => action.id === savedAction)) {
      setLastUsedAction(savedAction);
    } else if (availableActions.length > 0) {
      setLastUsedAction(availableActions[0].id);
    }
  }, [availableActions, storageKey]);

  // Memoize action handlers
  const handleAction = useCallback(async (actionId, callback) => {
    try {
      setLoadingAction(actionId);
      setLastUsedAction(actionId);
      localStorage.setItem(storageKey, actionId);
      await callback();
    } catch (error) {
      console.error(`Error executing action ${actionId}:`, error);
    } finally {
      setLoadingAction(null);
      setShowDropdown(false);
    }
  }, [storageKey]);

  const toggleDropdown = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  // Memoize action button renderer
  const renderActionButton = useCallback((action) => {
    const config = ACTION_CONFIG[action.id];
    const isLoading = loadingAction === action.id;
    
    return (
      <Button
        onClick={() => handleAction(action.id, action.callback)}
        className={`flex items-center gap-1 ${config.style} px-3 py-2 text-sm h-8 whitespace-nowrap ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <RefreshCwIcon size={16} className="animate-spin" />
        ) : (
          <config.icon size={16} />
        )}
        <span>{config.label}</span>
      </Button>
    );
  }, [handleAction, loadingAction]);

  const isLeftExpansion = expandDirection === 'left';
  const filteredActions = useMemo(() => 
    availableActions.filter(action => action.id !== lastUsedAction),
    [availableActions, lastUsedAction]
  );

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isLeftExpansion && (
        <div className="flex items-center gap-1 mr-1">
          {filteredActions.map(action => (
            <div
              key={action.id}
              className={`transition-all duration-200 ease-in-out ${
                showDropdown 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
            >
              {renderActionButton(action)}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center">
        <Button
          onClick={toggleDropdown}
          className={`flex items-center bg-background hover:bg-muted text-foreground border border-border ${
            isLeftExpansion ? 'border-r-0' : 'border-l-0'
          } px-2 py-2 text-sm h-8 transition-transform duration-200 ${
            showDropdown ? (isLeftExpansion ? 'rotate-180' : '') : ''
          }`}
        >
          {isLeftExpansion ? <ChevronLeftIcon size={16} /> : <ChevronRightIcon size={16} />}
        </Button>
        {lastUsedAction && (
          renderActionButton(availableActions.find(action => action.id === lastUsedAction))
        )}
      </div>

      {!isLeftExpansion && (
        <div className="flex items-center gap-1 ml-1">
          {filteredActions.map(action => (
            <div
              key={action.id}
              className={`transition-all duration-200 ease-in-out ${
                showDropdown 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
            >
              {renderActionButton(action)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 