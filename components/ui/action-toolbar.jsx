'use client'
import React, { useState, useEffect } from 'react';
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
  expandDirection = 'left', // 'left' or 'right'
  className = "",
  storageKey = 'action-toolbar-last-action' // Add a unique key for localStorage
}) {
  const [lastUsedAction, setLastUsedAction] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load the last used action from localStorage on component mount
  useEffect(() => {
    const savedAction = localStorage.getItem(storageKey);
    if (savedAction) {
      setLastUsedAction(savedAction);
    }
  }, [storageKey]);

  const handleAction = (action, callback) => {
    setLastUsedAction(action);
    // Save the action to localStorage
    localStorage.setItem(storageKey, action);
    callback();
    setShowDropdown(false);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'add': return <PlusIcon size={16} />;
      case 'excel': return <FileSpreadsheetIcon size={16} />;
      case 'pdf': return <FileTextIcon size={16} />;
      case 'print': return <PrinterIcon size={16} />;
      case 'refresh': return <RefreshCwIcon size={16} />;
      case 'save': return <SaveIcon size={16} />;
      case 'saveAndNew': return <SaveAndNewIcon size={16} />;
      case 'saveAndExit': return <LogOutIcon size={16} />;
      case 'cancel': return <XIcon size={16} />;
      case 'importExcel': return <UploadIcon size={16} />;
      default: return null;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case 'add': return 'Add New';
      case 'excel': return 'Export Excel';
      case 'pdf': return 'Export PDF';
      case 'print': return 'Print';
      case 'refresh': return 'Refresh';
      case 'save': return 'Save';
      case 'saveAndNew': return 'Save & New';
      case 'saveAndExit': return 'Save & Exit';
      case 'cancel': return 'Cancel';
      case 'importExcel': return 'Import Excel';
      default: return '';
    }
  };

  const getActionStyle = (action) => {
    switch (action) {
      case 'add': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'excel': return 'bg-green-700 hover:bg-green-800 text-white border border-gray-300';
      case 'pdf': return 'bg-red-700 hover:bg-red-800 text-white border border-gray-300';
      case 'print':
      case 'refresh': return 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300';
      case 'save': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'saveAndNew': return 'bg-green-600 hover:bg-green-700 text-white';
      case 'saveAndExit': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'cancel': return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'importExcel': return 'bg-green-700 hover:bg-green-800 text-white border border-gray-300';
      default: return '';
    }
  };

  const getActionCallback = (action) => {
    switch (action) {
      case 'add': return onAdd;
      case 'excel': return onExportExcel;
      case 'pdf': return onExportPdf;
      case 'print': return onPrint;
      case 'refresh': return onRefresh;
      case 'save': return onSave;
      case 'saveAndNew': return onSaveAndNew;
      case 'saveAndExit': return onSaveAndExit;
      case 'cancel': return onCancel;
      case 'importExcel': return onImportExcel;
      default: return null;
    }
  };

  const availableActions = [
    { id: 'add', show: !!onAdd },
    { id: 'excel', show: !!onExportExcel },
    { id: 'pdf', show: !!onExportPdf },
    { id: 'print', show: !!onPrint },
    { id: 'refresh', show: !!onRefresh },
    { id: 'save', show: !!onSave },
    { id: 'saveAndNew', show: !!onSaveAndNew },
    { id: 'saveAndExit', show: !!onSaveAndExit },
    { id: 'cancel', show: !!onCancel },
    { id: 'importExcel', show: !!onImportExcel }
  ].filter(action => action.show);

  // Set initial last used action if none is set
  useEffect(() => {
    if (!lastUsedAction && availableActions.length > 0) {
      const savedAction = localStorage.getItem(storageKey);
      if (savedAction && availableActions.some(action => action.id === savedAction)) {
        setLastUsedAction(savedAction);
      } else {
        setLastUsedAction(availableActions[0].id);
      }
    }
  }, [lastUsedAction, availableActions, storageKey]);

  const isLeftExpansion = expandDirection === 'left';

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isLeftExpansion && (
        <div className="flex items-center gap-1 mr-1">
          {availableActions
            .filter(action => action.id !== lastUsedAction)
            .map(action => (
              <div
                key={action.id}
                className={`transition-all duration-200 ease-in-out ${
                  showDropdown 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-4 pointer-events-none'
                }`}
              >
                <Button
                  onClick={() => handleAction(action.id, getActionCallback(action.id))}
                  className={`flex items-center gap-1 ${getActionStyle(action.id)} px-3 py-2 text-sm h-8 whitespace-nowrap`}
                >
                  {getActionIcon(action.id)}
                  <span>{getActionLabel(action.id)}</span>
                </Button>
              </div>
            ))}
        </div>
      )}

      <div className="flex items-center">
        <Button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 ${isLeftExpansion ? 'border-r-0' : 'border-l-0'} px-2 py-2 text-sm h-8 transition-transform duration-200 ${showDropdown ? (isLeftExpansion ? '-rotate-180' : 'rotate-180') : ''}`}
        >
          {isLeftExpansion ? <ChevronLeftIcon size={16} /> : <ChevronRightIcon size={16} />}
        </Button>
        {lastUsedAction && (
          <Button 
            onClick={() => handleAction(lastUsedAction, getActionCallback(lastUsedAction))}
            className={`flex items-center gap-1 ${getActionStyle(lastUsedAction)} px-3 py-2 text-sm h-8`}
          >
            {getActionIcon(lastUsedAction)}
            <span>{getActionLabel(lastUsedAction)}</span>
          </Button>
        )}
      </div>

      {!isLeftExpansion && (
        <div className="flex items-center gap-1 ml-1">
          {availableActions
            .filter(action => action.id !== lastUsedAction)
            .map(action => (
              <div
                key={action.id}
                className={`transition-all duration-200 ease-in-out ${
                  showDropdown 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-4 pointer-events-none'
                }`}
              >
                <Button
                  onClick={() => handleAction(action.id, getActionCallback(action.id))}
                  className={`flex items-center gap-1 ${getActionStyle(action.id)} px-3 py-2 text-sm h-8 whitespace-nowrap`}
                >
                  {getActionIcon(action.id)}
                  <span>{getActionLabel(action.id)}</span>
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
} 