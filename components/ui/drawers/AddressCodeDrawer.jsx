import React from "react";
import { TextField, Grid } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
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
          <TextField
            fullWidth
            label={t(`management.${type}Name`)}
            variant="outlined"
            size="small"
            value={formData?.name || ""}
            onChange={handleNameChange}
            required
            inputProps={{
              style: { textAlign: isRTL ? "right" : "left" },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                right: isRTL ? 12 : "unset",
                left: isRTL ? "unset" : 12,
                transformOrigin: isRTL ? "right" : "left",
              },
            }}
          />
        </Grid>
      </Grid>
    );
  };

  if (!type) return null;

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? t(`management.${type}`)
          : t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`)
      }
      content={getContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
    />
  );
};

export default AddressCodeDrawer;
