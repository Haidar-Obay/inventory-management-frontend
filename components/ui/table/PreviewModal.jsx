"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "../button";
import { Badge } from "./CustomControls";
import Portal from "../Portal";

const PreviewModal = ({ isOpen, onClose, row, columns, columnOrder, visibleColumns }) => {
  const t = useTranslations("table");



  if (!row) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatValue = (value, column) => {
    if (value === null || value === undefined) return "-";
    
    if (column.type === "boolean") {
      return value ? (
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
      );
    }
    
    if (column.type === "date") {
      return value ? new Date(value).toLocaleDateString() : "-";
    }
    
    if (column.options) {
      const option = column.options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    
    return String(value);
  };

  return (
    <>
      
      {isOpen && (
        <Portal>
          <div 
            className="fixed inset-0 z-[2147483647] pointer-events-auto flex items-center justify-center bg-black/50"
            onClick={handleBackdropClick}
          >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
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
                  className="text-blue-600"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {t("previewLabel") || "Preview Details"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
        
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{t("basicInformation") || "Basic Information"}</h3>
              <Badge variant="secondary" className="text-xs">
                {columnOrder.length} {t("fields") || "fields"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {columnOrder.map((key) => {
                const column = columns.find((col) => col.key === key);
                if (!column) return null;
                
                const value = row[key];
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">
                        {column.header}
                      </label>
                      {column.type && (
                        <Badge variant="outline" className="text-xs">
                          {t(column.type) || column.type}
                        </Badge>
                      )}
                    </div>
                    <div className="p-3 bg-muted/50 rounded-md border">
                      <div className="text-sm">
                        {formatValue(value, column)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Future sections can be added here */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="p-4 bg-muted/30 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                Future sections will be added here...
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {t("closeLabel") || "Close"}
          </Button>
        </div>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
};

export default PreviewModal; 