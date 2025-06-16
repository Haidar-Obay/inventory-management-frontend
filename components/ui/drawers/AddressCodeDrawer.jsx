import React, { useState } from "react";
import { TextField, Grid } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { useTranslations, useLocale } from "next-intl";

const AddressCodeDrawer = ({
  isOpen,
  onClose,
  type, // 'country', 'province', 'city', 'district'
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData,
  onFormDataChange,
  isEdit = false,
}) => {
  const [expandedAccordion, setExpandedAccordion] = useState("panel1");
  const t = useTranslations("addressCodes");
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

  const getPluralType = (type) => {
    switch (type) {
      case "country":
        return "countries";
      case "province":
        return "provinces";
      case "city":
        return "cities";
      case "district":
        return "districts";
      default:
        return type;
    }
  };

  const getAccordionContent = () => {
    if (!type) return [];

    const nameField = (
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t(`management.${getPluralType(type)}`)}
          variant="outlined"
          size="small"
          value={formData?.name || ""}
          onChange={handleNameChange}
          required
        />
      </Grid>
    );

    return [
      {
        title: isEdit
          ? t(`management.${getPluralType(type)}`)
          : t(`management.${getPluralType(type)}`),
        expanded: expandedAccordion === "panel1",
        onChange: handleAccordionChange("panel1"),
        content: nameField,
      },
    ];
  };

  if (!type) return null;

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? t(`management.${getPluralType(type)}`)
          : t(`management.${getPluralType(type)}`)
      }
      accordions={getAccordionContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default AddressCodeDrawer;
