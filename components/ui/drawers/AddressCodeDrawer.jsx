import React from "react";
import { Grid, Typography } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";

const AddressCodeDrawer = ({
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
  const t = useTranslations("addressCodes");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleNameChange = (event) => {
    onFormDataChange({
      ...formData,
      name: event.target.value,
    });
  };

  const getContent = () => {
    if (!type) return null;

    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t(`management.${type}Name`)} *
          </Typography>
          <RTLTextField
            value={formData?.name || ""}
            onChange={handleNameChange}
            required
            placeholder=""
          />
        </Grid>
      </Grid>
    );
  };

  if (!type) return null;

  const getTitle = () => {
    if (isEdit) {
      const itemName = formData?.name || "";
      return `${t("management.edit")} ${t(`management.${type}`)}${itemName ? ` / ${itemName}` : ""}`;
    } else {
      return t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  };

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      content={getContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default AddressCodeDrawer;
