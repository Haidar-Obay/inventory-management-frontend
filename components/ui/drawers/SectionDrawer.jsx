"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { useTranslations, useLocale } from "next-intl";

const SectionDrawer = ({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData,
  onFormDataChange,
  isEdit = false,
}) => {
  const [expandedAccordion, setExpandedAccordion] = useState("panel1");
  const t = useTranslations("sections");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
  };

  const handleNameChange = (event) => {
    onFormDataChange({
      ...formData,
      name: event.target.value,
    });
  };

  const handleDescriptionChange = (event) => {
    onFormDataChange({
      ...formData,
      description: event.target.value,
    });
  };

  const getPluralType = (type) => {
    switch (type) {
      case "project":
        return "projects";
      case "costCenter":
        return "costCenters";
      case "department":
        return "departments";
      case "trade":
        return "trades";
      case "companyCode":
        return "companyCodes";
      case "job":
        return "jobs";
      default:
        return type;
    }
  };

  const getAccordionContent = () => {
    const pluralType = getPluralType(type);
    const nameField = (
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t(`management.${pluralType}`)}
          variant="outlined"
          size="small"
          value={formData?.name || ""}
          onChange={handleNameChange}
          required
        />
      </Grid>
    );

    const descriptionField = (
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t("management.description")}
          variant="outlined"
          size="small"
          multiline
          rows={4}
          value={formData?.description || ""}
          onChange={handleDescriptionChange}
        />
      </Grid>
    );

    const title = isEdit
      ? `${t("management.edit")} ${t(`management.${pluralType}`)}`
      : `${t("management.add")} ${t(`management.${pluralType}`)}`;

    return [
      {
        title,
        expanded: expandedAccordion === "panel1",
        onChange: handleAccordionChange("panel1"),
        content: (
          <>
            {nameField}
            {descriptionField}
          </>
        ),
      },
    ];
  };

  const pluralType = getPluralType(type);
  const title = isEdit
    ? `${t("management.edit")} ${t(`management.${pluralType}`)}`
    : `${t("management.add")} ${t(`management.${pluralType}`)}`;

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      accordions={getAccordionContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default SectionDrawer;
