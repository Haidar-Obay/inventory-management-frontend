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

      // Check if the response is successful (either response.status or response.data exists)
      if (response && (response.status || response.data)) {
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(row, response.data || updatedData);
        }
      } else {
        // Call error callback if provided
        if (onError) {
          onError(row, response?.message || "Failed to update active status");
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
      ? `<path d="M18 6L6 18"/><path d="M6 6l12 12"/>`
      : `<path d="M9 12l2 2 4-4"></path>
         <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 9 4.03 9 9z"></path>`,
    iconClassName: isActive ? "text-orange-600" : "text-green-600",
    primary: true,
    action: handleToggleActive,
  };
};

export default ActiveStatusAction; 