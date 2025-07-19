"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Grid,
  Autocomplete,
} from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getCustomerNames } from "@/API/Customers";
import { getCostCenterNames as getCostCenterNamesFromSections } from "@/API/Sections";
import { getDepartmentNames as getDepartmentNamesFromSections } from "@/API/Sections";
import { getProjectNames as getProjectNamesFromSections } from "@/API/Sections";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [customers, setCustomers] = useState([]);
  const [costCenterOptions, setCostCenterOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("sections");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [originalName, setOriginalName] = useState("");
  const [originalData, setOriginalData] = useState({});
  const { addToast } = useSimpleToast();

  useEffect(() => {
    if (type === "project" && isOpen) {
      fetchCustomers();
    }
    if (type === "costCenter" && isOpen) {
      fetchCostCenterNames();
    }
    if (type === "department" && isOpen) {
      fetchDepartmentNames();
    }
    if (type === "job" && isOpen) {
      fetchProjectNames();
    }
    if (isOpen && isEdit) {
      setOriginalName(formData?.name || "");
      setOriginalData(JSON.parse(JSON.stringify(formData)));
    }
  }, [type, isOpen, isEdit]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomerNames();
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCostCenterNames = async () => {
    try {
      setLoading(true);
      const response = await getCostCenterNamesFromSections();
      setCostCenterOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching cost center names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentNames = async () => {
    try {
      setLoading(true);
      const response = await getDepartmentNamesFromSections();
      setDepartmentOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching department names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectNames = async () => {
    try {
      setLoading(true);
      const response = await getProjectNamesFromSections();
      setProjectOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching project names:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field) => (event) => {
    onFormDataChange({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (field) => (date) => {
    onFormDataChange({
      ...formData,
      [field]: date,
    });
  };

  const handleCustomerChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      customer_id: newValue?.id || "",
      customer_name: newValue?.name || "",
    });
  };

  const handleSubCostCenterChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      sub_cost_center_of: newValue?.id || "",
    });
  };

  const handleSubDepartmentChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      sub_department_of: newValue?.id || "",
    });
  };

  const handleProjectChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      project_id: newValue?.id || "",
    });
  };

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  const handleSave = () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: t("noChangesTitle") || "No changes detected",
        description:
          t("noChangesDesc") ||
          "Please modify at least one field before saving.",
      });
      return;
    }
    onSave && onSave();
  };

  const getContent = () => {
    if (!type) return null;

    if (type === "project") {
      return (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.name")} *
            </Typography>
            <RTLTextField
              value={formData?.name || ""}
              onChange={handleFieldChange("name")}
              required
              placeholder=""
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.startDate")}
            </Typography>
            <RTLTextField
              type="date"
              value={formData?.start_date ? new Date(formData.start_date).toISOString().split('T')[0] : ""}
              onChange={handleFieldChange("start_date")}
              placeholder=""
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.endDate")}
            </Typography>
            <RTLTextField
              type="date"
              value={formData?.end_date ? new Date(formData.end_date).toISOString().split('T')[0] : ""}
              onChange={handleFieldChange("end_date")}
              placeholder=""
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.expectedDate")}
            </Typography>
            <RTLTextField
              type="date"
              value={formData?.expected_date ? new Date(formData.expected_date).toISOString().split('T')[0] : ""}
              onChange={handleFieldChange("expected_date")}
              placeholder=""
            />
          </Grid>
          <Grid sx={{ gridColumn: 'span 12' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.customer")}
            </Typography>
            <Autocomplete
              fullWidth
              options={customers}
              getOptionLabel={(option) => option.name || ""}
              value={
                customers.find((c) => c.id === formData?.customer_id) ||
                null
              }
              onChange={handleCustomerChange}
              loading={loading}
              renderInput={(params) => (
                <RTLTextField {...params} placeholder="" />
              )}
            />
          </Grid>
        </Grid>
      );
    }

    if (type === "costCenter") {
      return (
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* Left side - Form fields */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
                />
              </Grid>
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.name")} *
                </Typography>
                <RTLTextField
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                  placeholder=""
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12', width: "53%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.subCostCenterOf")}
                </Typography>
                <Autocomplete
                  fullWidth
                  options={costCenterOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    costCenterOptions.find(
                      (c) => c.id === formData?.sub_cost_center_of
                    ) || null
                  }
                  onChange={handleSubCostCenterChange}
                  loading={loading}
                  renderInput={(params) => (
                    <RTLTextField {...params} placeholder="" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Right side - Checkbox */}
          <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 2, justifyContent: 'flex-end' }}>
            <Checkbox
              checked={formData?.active !== false}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.checked,
                })
              }
              label={t("management.active")}
              isRTL={isRTL}
            />
          </Box>
        </Box>
      );
    }

    if (type === "department") {
      return (
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* Left side - Form fields */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
                />
              </Grid>
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.name")} *
                </Typography>
                <RTLTextField
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                  placeholder=""
                />
              </Grid>
              <Grid sx={{ gridColumn: 'span 12', width: "53%" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.subDepartmentOf")}
                </Typography>
                <Autocomplete
                  fullWidth
                  options={departmentOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    departmentOptions.find(
                      (d) => d.id === formData?.sub_department_of
                    ) || null
                  }
                  onChange={handleSubDepartmentChange}
                  loading={loading}
                  renderInput={(params) => (
                    <RTLTextField {...params} placeholder="" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Right side - Checkbox */}
          <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 2, justifyContent: 'flex-end' }}>
            <Checkbox
              checked={formData?.active !== false}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.checked,
                })
              }
              label={t("management.active")}
              isRTL={isRTL}
            />
          </Box>
        </Box>
      );
    }

    if (type === "trade") {
      return (
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          {/* Left side - Form fields */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={2}>
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
                />
              </Grid>
              <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 1,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {t("management.name")} *
                </Typography>
                <RTLTextField
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                  placeholder=""
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Right side - Checkbox */}
          <Box sx={{ width: 200, display: 'flex', alignItems: 'flex-start', pt: 2, justifyContent: 'flex-end' }}>
            <Checkbox
              checked={formData?.active !== false}
              onChange={(e) =>
                onFormDataChange({
                  ...formData,
                  active: e.target.checked,
                })
              }
              label={t("management.active")}
              isRTL={isRTL}
            />
          </Box>
        </Box>
      );
    }

    if (type === "companyCode") {
      return (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.name")} *
            </Typography>
            <RTLTextField
              value={formData?.name || ""}
              onChange={handleFieldChange("name")}
              required
              placeholder=""
            />
          </Grid>
        </Grid>
      );
    }

    if (type === "job") {
      return (
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' }, width: "100%" }}>
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
              fullWidth
              variant="outlined"
              size="small"
              value={formData?.code || ""}
              onChange={handleFieldChange("code")}
              required
              placeholder=""
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' }, width: "100%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.description")}
            </Typography>
            <RTLTextField
              fullWidth
              value={formData?.description || ""}
              onChange={handleFieldChange("description")}
              multiline
              rows={4}
              placeholder=""
            />
          </Grid>
          <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' }, width: "100%" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t("management.project")} *
            </Typography>
            <Autocomplete
              fullWidth
              options={projectOptions}
              getOptionLabel={(option) => option.name || ""}
              value={
                projectOptions.find((p) => p.id === formData?.project_id) ||
                null
              }
              onChange={handleProjectChange}
              loading={loading}
              renderInput={(params) => (
                <RTLTextField {...params} placeholder="" required />
              )}
            />
          </Grid>
        </Grid>
      );
    }

    // Default fields for other types
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("management." + type + "Name")} *
          </Typography>
          <RTLTextField
            fullWidth
            value={formData?.name || ""}
            onChange={handleFieldChange("name")}
            required
            placeholder=""
          />
        </Grid>
        <Grid sx={{ gridColumn: 'span 12' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("management.description")}
          </Typography>
          <RTLTextField
            fullWidth
            value={formData?.description || ""}
            onChange={handleFieldChange("description")}
            multiline
            rows={4}
            placeholder=""
          />
        </Grid>
      </Grid>
    );
  };

  const getPluralType = (type) => {
    if (!type) return "";

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
        return type + "s";
    }
  };

  const pluralType = getPluralType(type);

  if (!type) return null;

  const getDrawerWidth = (type) => {
    if (type === "project") return 600;
    if (type === "costCenter") return 500;
    if (type === "department") return 500;
    if (type === "trade") return 500;
    if (type === "companyCode") return 450;
    if (type === "job") return 500;
    return 600; // default
  };

  const getTitle = () => {
    if (isEdit) {
      return `${t("management.edit")} ${t(`management.${type}`)}${originalName ? ` / ${originalName}` : ""}`;
    } else {
      return t(`management.add${type.charAt(0).toUpperCase() + type.slice(1)}`);
    }
  };

  // Check if form has data
  const hasFormData = () => {
    // Check if any form field has data, excluding 'active' since it's true by default
    return formData && (
      formData.name ||
      formData.description ||
      formData.customer_id ||
      formData.cost_center_id ||
      formData.department_id ||
      formData.project_id ||
      formData.start_date ||
      formData.end_date ||
      formData.expected_date ||
      formData.code ||
      // Check other fields excluding 'active'
      Object.entries(formData).some(([key, value]) => 
        key !== 'active' && value && value.toString().trim() !== ""
      )
    );
  };

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
      hasFormData={hasFormData()}
    />
  );
};

export default SectionDrawer;
