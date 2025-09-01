"use client";

import React, { useState, useEffect } from "react";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { Grid, Typography, Box, useTheme } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";

const RoleDrawer = ({
  isOpen,
  onClose,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  editData,
  saveLoading: externalSaveLoading = false,
}) => {
  const t = useTranslations("settings");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();
  
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    active: true,
    permissions: []
  });
  const [originalData, setOriginalData] = useState({});
  const [originalName, setOriginalName] = useState("");
  const [internalSaveLoading, setInternalSaveLoading] = useState(false);

  const isEdit = !!editData;

  // Check if we're in dark mode
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };

  // Use external saveLoading if provided, otherwise use internal
  const saveLoading = externalSaveLoading || internalSaveLoading;

  useEffect(() => {
    if (isOpen) {
      if (isEdit && editData) {
        setFormData(editData);
        setOriginalData(JSON.parse(JSON.stringify(editData)));
        setOriginalName(editData?.name || "");
      } else {
        setFormData({ 
          name: "", 
          description: "", 
          active: true,
          permissions: []
        });
        setOriginalData({});
        setOriginalName("");
      }
    }
  }, [isOpen, isEdit, editData]);

  function isDataChanged() {
    if (!isEdit) {
      return formData.name || formData.description;
    }
    
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      addToast({
        title: tToast("error"),
        description: t("roleNameRequired"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Check if any changes have been made (only for edit mode)
    if (isEdit && !isDataChanged()) {
      addToast({
        title: tToast("error"),
        description: t("noChangesMade"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    setInternalSaveLoading(true);
    try {
      // Pass the form data to the parent component to handle the API call
      if (onSave) {
        await onSave(formData);
      }
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const handleSaveAndNew = async () => {
    if (!formData.name) {
      addToast({
        title: tToast("error"),
        description: t("roleNameRequired"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Check if any changes have been made (only for edit mode)
    if (isEdit && !isDataChanged()) {
      addToast({
        title: tToast("error"),
        description: t("noChangesMade"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    setInternalSaveLoading(true);
    try {
      // Pass the form data to the parent component to handle the API call
      if (onSaveAndNew) {
        await onSaveAndNew(formData);
      }
      
      // Clear the form fields for a new entry
      setFormData({ 
        name: "", 
        description: "", 
        active: true,
        permissions: []
      });
      setOriginalData({});
      setOriginalName("");
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const handleSaveAndClose = async () => {
    if (!formData.name) {
      addToast({
        title: tToast("error"),
        description: t("roleNameRequired"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Check if any changes have been made (only for edit mode)
    if (isEdit && !isDataChanged()) {
      addToast({
        title: tToast("error"),
        description: t("noChangesMade"),
        type: "error",
        duration: 3000,
      });
      return;
    }

    setInternalSaveLoading(true);
    try {
      // Pass the form data to the parent component to handle the API call
      if (onSaveAndClose) {
        await onSaveAndClose(formData);
      }
      
      // Close the drawer after successful save
      if (onClose) {
        onClose();
      }
    } finally {
      setInternalSaveLoading(false);
    }
  };

  const getContent = () => (
    <Box
  sx={{
    p: 5,
    backgroundColor: getBackgroundColor(),
    borderRadius: 1,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: 1,
  }}
>
  <Box sx={{ display: "flex", gap: 2 }}>
    {/* Left side - Form fields */}
    <Box sx={{ flex: 1 }}>
      <Grid container spacing={2}>
        {/* Role Name */}
        <Grid
          sx={{ minWidth: 230, gridColumn: { xs: "span 12", md: "span 6" } }}
          md={6}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
          >
            {t("roleName")} *
          </Typography>
          <RTLTextField
            fullWidth
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder={t("enterRoleName")}
            variant="outlined"
            size="small"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </Grid>

        {/* Description */}
        <Grid
          sx={{ minWidth: 230, gridColumn: { xs: "span 12", md: "span 6" } }}
          md={6}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}
          >
            {t("description")}
          </Typography>
          <RTLTextField
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder={t("enterRoleDescription")}
            variant="outlined"
            size="small"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </Grid>
      </Grid>
    </Box>

    {/* Right side - Active Status */}
    <Box
      sx={{
        width: 200,
        display: "flex",
        alignItems: "flex-start",
        pt: 4.5,
        justifyContent: "flex-end",
      }}
    >
      <Checkbox
        id="active"
        checked={formData.active}
        onChange={(e) => handleInputChange("active", e.target.checked)}
      />
      <label htmlFor="active" className="text-sm font-medium" style={{ marginLeft: '8px' }}>
        {t("active")}
      </label>
    </Box>
  </Box>
</Box>

  );

  const getTitle = () => {
    if (isEdit) {
      return `${t("editRole")}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t("addRole");
    }
  };

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      content={getContent()}
      onSave={handleSave}
      onSaveAndNew={handleSaveAndNew}
      onSaveAndClose={handleSaveAndClose}
      anchor={isRTL ? "left" : "right"}
      width={500}
      hasDataChanged={isDataChanged()}
      saveLoading={saveLoading}
      isEdit={isEdit}
    />
  );
};

export default RoleDrawer;
