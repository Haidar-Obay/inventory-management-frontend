"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button, Dropdown, DropdownItem } from "./CustomControls";

export const CustomActions = ({
  row,
  actions = [],
  onActionClick,
  openDropdownRowId,
  setOpenDropdownRowId,
  isRTL = false,
  onDeleteConfirm,
  onPreviewConfirm,
}) => {
  const t = useTranslations("table");

  const handleActionClick = (action) => {
    setOpenDropdownRowId(null);
    
    // If it's a delete action and we have a delete confirmation handler, use it
    if (action.id === "delete" && onDeleteConfirm) {
      onDeleteConfirm(row);
      return;
    }
    
    // If it's a preview action and we have a preview confirmation handler, use it
    if (action.id === "preview" && onPreviewConfirm) {
      onPreviewConfirm(row);
      return;
    }
    
    // Otherwise, use the regular action handler
    if (onActionClick) {
      onActionClick(action, row);
    }
  };

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div
      className="flex justify-center"
      style={{
        flexDirection: isRTL ? "row-reverse" : "row",
      }}
    >
      <Dropdown
        isOpen={openDropdownRowId === row.id}
        setIsOpen={(open) =>
          setOpenDropdownRowId(open ? row.id : null)
        }
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
            aria-label="Actions"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownRowId(
                openDropdownRowId === row.id ? null : row.id
              );
            }}
          >
            <span className="text-lg font-bold">...</span>
          </Button>
        }
        align="right"
      >
        {actions.map((action, index) => (
          <DropdownItem
            key={index}
            onClick={() => handleActionClick(action)}
            className={`flex items-center gap-2 ${
              action.dangerous
                ? "text-red-600 hover:text-red-700"
                : action.primary
                ? "text-blue-600 hover:text-blue-700"
                : ""
            }`}
          >
            {action.icon && (
              <div className="flex-shrink-0">
                {typeof action.icon === "string" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={action.iconClassName || ""}
                    dangerouslySetInnerHTML={{ __html: action.icon }}
                  />
                ) : (
                  <action.icon
                    size={13}
                    className={action.iconClassName || ""}
                  />
                )}
              </div>
            )}
            <span>{action.label}</span>
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}; 