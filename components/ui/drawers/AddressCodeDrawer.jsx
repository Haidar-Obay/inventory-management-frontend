import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import {
  createCountry, createZone, createCity, createDistrict,
  editCountry, editZone, editCity, editDistrict
} from "@/API/AddressCodes";

const AddressCodeDrawer = ({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData: externalFormData,
  onFormDataChange: externalOnFormDataChange,
  isEdit = false,
}) => {
  const t = useTranslations("addressCodes");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const { addToast } = useSimpleToast();

  // Internal state fallback
  const [internalFormData, setInternalFormData] = useState({ name: "" });
  const formData = externalFormData !== undefined ? externalFormData : internalFormData;
  const onFormDataChange = externalOnFormDataChange !== undefined ? externalOnFormDataChange : setInternalFormData;

  useEffect(() => {
    if (isOpen && isEdit) {
      setOriginalName(formData?.name || "");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    }
    // Reset internal state when opening for new entry
    if (isOpen && !isEdit && !externalFormData) {
      setInternalFormData({ name: "" });
    }
  }, [isOpen, isEdit]);

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  const handleNameChange = (event) => {
    onFormDataChange({
      ...formData,
      name: event.target.value,
    });
  };

  const getContent = () => {
    if (!type) return null;

    return (
      <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
        <Grid container spacing={2}>
          <Grid xs={12}>
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
      </Box>
    );
  };

  if (!type) return null;

  const getDrawerWidth = (type) => {
    if (type === "zone") return 450;
    if (type === "country") return 450;
    if (type === "city") return 450;
    if (type === "district") return 450;
    return 450; // default
  };

  const getTitle = () => {
    if (isEdit) {
      return `${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  };

  // Backend logic for POST/PUT
  const handleSave = async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    try {
      let response;
      if (isEdit) {
        if (type === "country") response = await editCountry(formData.id, formData);
        if (type === "zone") response = await editZone(formData.id, formData);
        if (type === "city") response = await editCity(formData.id, formData);
        if (type === "district") response = await editDistrict(formData.id, formData);
      } else {
        if (type === "country") response = await createCountry(formData);
        if (type === "zone") response = await createZone(formData);
        if (type === "city") response = await createCity(formData);
        if (type === "district") response = await createDistrict(formData);
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        onSave && onSave(response.data);
        onClose && onClose();
      } else {
        addToast({
          type: "error",
          title: tToast("error"),
          description: response?.message || tToast(isEdit ? "updateError" : "createError"),
          duration: 3000,
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: error.message || tToast(isEdit ? "updateError" : "createError"),
        duration: 3000,
      });
    }
  };

  // Check if form has data
  const hasFormData = formData?.name && formData.name.trim() !== "";

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      content={getContent()}
      onSave={handleSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
      anchor={isRTL ? "left" : "right"}
      width={getDrawerWidth(type)}
      hasFormData={hasFormData}
    />
  );
};

export default AddressCodeDrawer;
