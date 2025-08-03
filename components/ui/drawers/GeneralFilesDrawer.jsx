import React, { useState, useEffect } from "react";
import { Grid, Typography, Autocomplete, Box } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import {
  createBusinessType, createSalesChannel, createDistributionChannel, createMediaChannel,
  editBusinessType, editSalesChannel, editDistributionChannel, editMediaChannel,
  getSalesChannels, getDistributionChannels, getMediaChannels
} from "@/API/GeneralFiles";

const GeneralFilesDrawer = ({
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
  const t = useTranslations("generalFiles");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [subOptions, setSubOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useSimpleToast();

  // Get the correct sub field name based on type
  const getSubFieldName = () => {
    switch (type) {
      case "salesChannel":
        return "sub_sales_of";
      case "distributionChannel":
        return "sub_distribution_of";
      case "mediaChannel":
        return "sub_media_of";
      default:
        return "sub_of";
    }
  };

  const subFieldName = getSubFieldName();

  // Always use internal state for form data
  const [formData, setFormData] = useState({ code: "", name: "", [subFieldName]: "" });

  // Fetch sub options when drawer opens for types that need it
  useEffect(() => {
    if (isOpen && type !== "businessType") {
      fetchSubOptions();
    }
  }, [isOpen, type]);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && externalFormData) {
        // For edit mode, use external data
        setFormData(externalFormData);
        setOriginalName(externalFormData?.name || "");
        setOriginalData(JSON.parse(JSON.stringify(externalFormData)));
      } else if (!isEdit) {
        // For new entry, reset to empty state
        setFormData({ code: "", name: "", [subFieldName]: "" });
        setOriginalName("");
        setOriginalData({});
      }
    }
  }, [isOpen, isEdit, externalFormData, subFieldName]);

  const fetchSubOptions = async () => {
    try {
      setLoading(true);
      let response;
      
      // Fetch all items of the same type to populate the combobox
      switch (type) {
        case "salesChannel":
          response = await getSalesChannels();
          break;
        case "distributionChannel":
          response = await getDistributionChannels();
          break;
        case "mediaChannel":
          response = await getMediaChannels();
          break;
        default:
          return;
      }
      
      // Filter out items that are already a sub of another item
      const options = (response.data || []).filter(item => !item[subFieldName]);
      setSubOptions(options);
    } catch (error) {
      console.error("Error fetching sub options:", error);
    } finally {
      setLoading(false);
    }
  };

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  const handleFieldChange = (field) => (event) => {
    const newValue = event.target.value;
    const updatedFormData = {
      ...formData,
      [field]: newValue,
    };
    setFormData(updatedFormData);
  };

  const handleSubOfChange = (event, newValue) => {
    const updatedFormData = {
      ...formData,
      [subFieldName]: newValue?.id || "",
    };
    setFormData(updatedFormData);
  };

  const getContent = () => {
    if (!type) return null;

    return (
      <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
        <Grid container spacing={2}>
          <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.code")} *
            </Typography>
            <RTLTextField
              value={formData?.code || ""}
              onChange={handleFieldChange("code")}
              required
              placeholder=""
              fullWidth
              size="small"
              autoFocus
            />
          </Grid>
          <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
              onChange={handleFieldChange("name")}
              required
              placeholder=""
              fullWidth
              size="small"
            />
          </Grid>
          {/* Only show sub_of field for sales channels, distribution channels, and media channels */}
          {type !== "businessType" && (
            <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("management.subOf")}
              </Typography>
              <Autocomplete
                fullWidth
                options={subOptions}
                getOptionLabel={(option) => `${option.code} (${option.name})`}
                value={
                  subOptions.find(
                    (item) => item.id === formData?.[subFieldName]
                  ) || null
                }
                onChange={handleSubOfChange}
                loading={loading}
                renderInput={(params) => (
                  <RTLTextField {...params} placeholder="" />
                )}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  if (!type) return null;

  const getDrawerWidth = (type) => {
    return 450; // Consistent width for all general file types
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
        if (type === "businessType") response = await editBusinessType(formData.id, formData);
        if (type === "salesChannel") response = await editSalesChannel(formData.id, formData);
        if (type === "distributionChannel") response = await editDistributionChannel(formData.id, formData);
        if (type === "mediaChannel") response = await editMediaChannel(formData.id, formData);
      } else {
        if (type === "businessType") response = await createBusinessType(formData);
        if (type === "salesChannel") response = await createSalesChannel(formData);
        if (type === "distributionChannel") response = await createDistributionChannel(formData);
        if (type === "mediaChannel") response = await createMediaChannel(formData);
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

  // Save and New - Save current data and reset form for new entry
  const handleSaveAndNew = async () => {
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
        if (type === "businessType") response = await editBusinessType(formData.id, formData);
        if (type === "salesChannel") response = await editSalesChannel(formData.id, formData);
        if (type === "distributionChannel") response = await editDistributionChannel(formData.id, formData);
        if (type === "mediaChannel") response = await editMediaChannel(formData.id, formData);
      } else {
        if (type === "businessType") response = await createBusinessType(formData);
        if (type === "salesChannel") response = await createSalesChannel(formData);
        if (type === "distributionChannel") response = await createDistributionChannel(formData);
        if (type === "mediaChannel") response = await createMediaChannel(formData);
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        onSave && onSave(response.data);
        
        // Reset form for new entry
        setFormData({ code: "", name: "", [subFieldName]: "" });
        setOriginalName("");
        setOriginalData({});
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

  // Save and Close - Save current data and close drawer
  const handleSaveAndClose = async () => {
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
        if (type === "businessType") response = await editBusinessType(formData.id, formData);
        if (type === "salesChannel") response = await editSalesChannel(formData.id, formData);
        if (type === "distributionChannel") response = await editDistributionChannel(formData.id, formData);
        if (type === "mediaChannel") response = await editMediaChannel(formData.id, formData);
      } else {
        if (type === "businessType") response = await createBusinessType(formData);
        if (type === "salesChannel") response = await createSalesChannel(formData);
        if (type === "distributionChannel") response = await createDistributionChannel(formData);
        if (type === "mediaChannel") response = await createMediaChannel(formData);
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

  // Check if form has data - different validation based on type
  const hasFormData = () => {
    const hasCode = formData?.code && formData.code.trim() !== "";
    const hasName = formData?.name && formData.name.trim() !== "";
    const hasSubOf = formData?.[subFieldName] && formData[subFieldName] !== "";
    
    // For businessType, only code and name are required
    if (type === "businessType") {
      return hasCode || hasName;
    } else {
      // For other types, check if any field has data
      return hasCode || hasName || hasSubOf;
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
      width={getDrawerWidth(type)}
      hasFormData={hasFormData()}
    />
  );
};

export default GeneralFilesDrawer; 