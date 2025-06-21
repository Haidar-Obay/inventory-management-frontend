"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "./button.tsx";
import { useTranslations, useLocale } from "next-intl";
import {
  PlusIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PrinterIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SaveIcon,
  SaveIcon as SaveAndNewIcon,
  LogOutIcon,
  XIcon,
  UploadIcon,
} from "lucide-react";

// Memoized action configurations
const ACTION_CONFIG = {
  add: {
    icon: PlusIcon,
    style: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  },
  excel: {
    icon: FileSpreadsheetIcon,
    style:
      "bg-green-700 hover:bg-green-800 text-white border border-gray-300 shadow-sm",
  },
  pdf: {
    icon: FileTextIcon,
    style:
      "bg-red-700 hover:bg-red-800 text-white border border-gray-300 shadow-sm",
  },
  print: {
    icon: PrinterIcon,
    style:
      "bg-background hover:bg-muted text-foreground border border-border shadow-sm",
  },
  refresh: {
    icon: RefreshCwIcon,
    style:
      "bg-background hover:bg-muted text-foreground border border-border shadow-sm",
  },
  save: {
    icon: SaveIcon,
    style: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
  },
  saveAndNew: {
    icon: SaveAndNewIcon,
    style: "bg-green-600 hover:bg-green-700 text-white shadow-sm",
  },
  saveAndExit: {
    icon: LogOutIcon,
    style: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
  },
  cancel: {
    icon: XIcon,
    style: "bg-gray-600 hover:bg-gray-700 text-white shadow-sm",
  },
  importExcel: {
    icon: UploadIcon,
    style:
      "bg-green-700 hover:bg-green-800 text-white border border-gray-300 shadow-sm",
  },
};

// Action groups configuration
const ACTION_GROUPS = {
  add: {
    id: "add",
    actions: ["add"],
    storageKey: "action-toolbar-add-group",
    isSingleAction: true,
  },
  save: {
    id: "save",
    actions: ["save", "saveAndNew", "saveAndExit"],
    storageKey: "action-toolbar-save-group",
    isSingleAction: false,
  },
  cancel: {
    id: "cancel",
    actions: ["cancel"],
    storageKey: "action-toolbar-cancel-group",
    isSingleAction: true,
  },
  export: {
    id: "export",
    actions: ["pdf", "excel", "importExcel", "print"],
    storageKey: "action-toolbar-export-group",
    isSingleAction: false,
  },
  refresh: {
    id: "refresh",
    actions: ["refresh"],
    storageKey: "action-toolbar-refresh-group",
    isSingleAction: true,
  },
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
  dropdownDirection = "down",
  className = "",
}) {
  const t = useTranslations("table.toolbar");
  const [groupStates, setGroupStates] = useState({});
  const [loadingActions, setLoadingActions] = useState({});
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Memoize available actions
  const availableActions = useMemo(() => {
    const actions = {
      add: onAdd,
      excel: onExportExcel,
      pdf: onExportPdf,
      print: onPrint,
      refresh: onRefresh,
      save: onSave,
      saveAndNew: onSaveAndNew,
      saveAndExit: onSaveAndExit,
      cancel: onCancel,
      importExcel: onImportExcel,
    };
    return Object.entries(actions)
      .filter(([_, callback]) => callback)
      .reduce((acc, [id, callback]) => ({ ...acc, [id]: callback }), {});
  }, [
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
  ]);

  // Load the last used actions from localStorage on component mount
  useEffect(() => {
    const states = {};
    Object.values(ACTION_GROUPS).forEach((group) => {
      const savedAction = localStorage.getItem(group.storageKey);
      if (
        savedAction &&
        group.actions.includes(savedAction) &&
        availableActions[savedAction]
      ) {
        states[group.id] = savedAction;
      } else {
        const firstAvailableAction = group.actions.find(
          (action) => availableActions[action]
        );
        if (firstAvailableAction) {
          states[group.id] = firstAvailableAction;
        }
      }
    });
    setGroupStates(states);
  }, [availableActions]);

  // Memoize action handlers
  const handleAction = useCallback(async (actionId, callback, groupId) => {
    try {
      setLoadingActions((prev) => ({ ...prev, [actionId]: true }));
      setGroupStates((prev) => ({ ...prev, [groupId]: actionId }));
      localStorage.setItem(ACTION_GROUPS[groupId].storageKey, actionId);
      await callback();
    } catch (error) {
      console.error(`Error executing action ${actionId}:`, error);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [actionId]: false }));
    }
  }, []);

  const toggleGroup = useCallback((groupId) => {
    setGroupStates((prev) => ({
      ...prev,
      [`${groupId}Open`]: !prev[`${groupId}Open`],
    }));
  }, []);

  // Memoize action button renderer
  const renderActionButton = useCallback(
    (actionId, groupId) => {
      const config = ACTION_CONFIG[actionId];
      const isLoading = loadingActions[actionId];

      const getLabel = () => {
        switch (actionId) {
          case "add":
            return t("add");
          case "excel":
            return t("exportExcel");
          case "pdf":
            return t("exportPdf");
          case "print":
            return t("print");
          case "refresh":
            return t("refresh");
          case "save":
            return t("save");
          case "saveAndNew":
            return t("saveAndNew");
          case "saveAndExit":
            return t("saveAndExit");
          case "cancel":
            return t("cancel");
          case "importExcel":
            return t("importExcel");
          default:
            return actionId;
        }
      };

      return (
        <Button
          onClick={() =>
            handleAction(actionId, availableActions[actionId], groupId)
          }
          className={`flex items-center gap-2 ${config.style} px-4 py-2 text-sm h-9 whitespace-nowrap w-full transition-all duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCwIcon size={16} className="animate-spin" />
          ) : (
            <config.icon size={16} className="flex-shrink-0" />
          )}
          <span className="font-medium">{getLabel()}</span>
        </Button>
      );
    },
    [handleAction, loadingActions, availableActions, t]
  );

  const renderGroup = useCallback(
    (group) => {
      const isOpen = groupStates[`${group.id}Open`];
      const lastUsedAction = groupStates[group.id];
      const availableGroupActions = group.actions.filter(
        (action) => availableActions[action]
      );

      if (availableGroupActions.length === 0) return null;

      // For single action groups, just render the button without dropdown
      if (group.isSingleAction) {
        return (
          <div className="relative inline-block" key={group.id}>
            {renderActionButton(availableGroupActions[0], group.id)}
          </div>
        );
      }

      return (
        <div className="relative inline-block" key={group.id}>
          <div className="flex flex-col">
            {isOpen && dropdownDirection === "up" && (
              <div className="absolute bottom-full mb-2 flex flex-col gap-1 min-w-[180px] bg-background border border-border rounded-md shadow-lg p-1 z-50 backdrop-blur-sm bg-opacity-95">
                {availableGroupActions.map((action) => (
                  <div key={action} className="w-full">
                    {renderActionButton(action, group.id)}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center">
              <Button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-center bg-background hover:bg-muted text-foreground border border-border px-2 py-2 text-sm h-9 w-8 rounded-r-none transition-all duration-200 shadow-sm"
              >
                <div
                  className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                >
                  {dropdownDirection === "down" ? (
                    <ChevronDownIcon size={16} />
                  ) : (
                    <ChevronUpIcon size={16} />
                  )}
                </div>
              </Button>
              {lastUsedAction && (
                <div className="rounded-l-none">
                  {renderActionButton(lastUsedAction, group.id)}
                </div>
              )}
            </div>

            {isOpen && dropdownDirection === "down" && (
              <div className="absolute top-full mt-2 flex flex-col gap-1 min-w-[180px] bg-background border border-border rounded-md shadow-lg p-1 z-50 backdrop-blur-sm bg-opacity-95">
                {availableGroupActions.map((action) => (
                  <div key={action} className="w-full">
                    {renderActionButton(action, group.id)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    },
    [renderActionButton, toggleGroup, groupStates, dropdownDirection]
  );

  return (
    <div
      className={`flex items-center justify-end ${className}`}
      style={{
        gap: "0.5rem",
      }}
    >
      {Object.values(ACTION_GROUPS)
        .filter((group) =>
          group.actions.some((action) => availableActions[action])
        )
        .map((group) => renderGroup(group))}
    </div>
  );
}
