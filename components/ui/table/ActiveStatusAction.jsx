"use client";

import React from "react";
import { useTranslations } from "next-intl";

export const ActiveStatusAction = ({
  row,
  onToggleActive,
  editFunction,
  onSuccess,
  onError,
  isRTL = false,
}) => {
  const t = useTranslations("table");

  const handleToggleActive = async () => {
    if (!editFunction) {
      // If no edit function provided, just call the callback
      if (onToggleActive) {
        onToggleActive(row);
      }
      return;
    }

    try {
      // Prepare the data with only the active field changed
      const updatedData = {
        ...row,
        active: !row.active, // Toggle the active status
      };

      // Call the edit function (same as drawer uses)
      const response = await editFunction(row.id, updatedData);

      if (response.status) {
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(row, updatedData);
        }
      } else {
        // Call error callback if provided
        if (onError) {
          onError(row, response.message || "Failed to update active status");
        }
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
      // Call error callback if provided
      if (onError) {
        onError(row, error.message || "Failed to update active status");
      }
    }
  };

  const isActive = row?.active !== false; // Default to true if not explicitly set to false

  return {
    id: "toggleActive",
    label: isActive 
      ? (t("setInactiveLabel") || "Set Inactive") 
      : (t("setActiveLabel") || "Set Active"),
    icon: isActive 
      ? `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
         <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
         <path d="M12 2v4"></path>
         <path d="M6 6l2 2"></path>
         <path d="M18 6l-2 2"></path>`
      : `<path d="M9 12l2 2 4-4"></path>
         <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>`,
    iconClassName: isActive ? "text-orange-600" : "text-green-600",
    primary: true,
    action: handleToggleActive,
  };
};

export default ActiveStatusAction; 