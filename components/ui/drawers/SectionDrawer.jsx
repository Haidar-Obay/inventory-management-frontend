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
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createProject, editProject,
  createCostCenter, editCostCenter,
  createDepartment, editDepartment,
  createTrade, editTrade,
  createCompanyCode, editCompanyCode,
  createJob, editJob,
  getCostCenterNames, getDepartmentNames, getProjectNames
} from "@/API/Sections";
import { getCustomerNames } from "@/API/Customers";

const SectionDrawer = ({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  editData, // pass this for edit mode, otherwise undefined
}) => {
  const t = useTranslations("sections");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();

  // Internal state
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [originalName, setOriginalName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [costCenterOptions, setCostCenterOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editData;

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      if (isEdit && editData) {
        setFormData(editData);
        setOriginalData(JSON.parse(JSON.stringify(editData)));
        setOriginalName(editData?.name || "");
      } else {
        setFormData({ active: true });
        setOriginalData({});
        setOriginalName("");
      }
      if (type === "project") fetchCustomers();
      if (type === "costCenter") fetchCostCenterNames();
      if (type === "department") fetchDepartmentNames();
      if (type === "job") fetchProjectNames();
    }
    // eslint-disable-next-line
  }, [isOpen, type, isEdit, editData]);

  const fetchCustomers = async () => {
      setLoading(true);
    try {
      const response = await getCustomerNames();
      setCustomers(response.data || []);
    } catch {}
      setLoading(false);
  };
  const fetchCostCenterNames = async () => {
      setLoading(true);
    try {
      const response = await getCostCenterNames();
      setCostCenterOptions(response.data || []);
    } catch {}
      setLoading(false);
  };
  const fetchDepartmentNames = async () => {
      setLoading(true);
    try {
      const response = await getDepartmentNames();
      setDepartmentOptions(response.data || []);
    } catch {}
      setLoading(false);
  };
  const fetchProjectNames = async () => {
      setLoading(true);
    try {
      const response = await getProjectNames();
      setProjectOptions(response.data || []);
    } catch {}
      setLoading(false);
  };

  function isDataChanged() {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }

  // Handlers
  const handleFieldChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };
  const handleDateChange = (field) => (date) => {
    setFormData({ ...formData, [field]: date });
  };
  const handleCustomerChange = (event, newValue) => {
    setFormData({
      ...formData,
      customer_id: newValue?.id || "",
      customer_name: newValue?.name || "",
    });
  };
  const handleSubCostCenterChange = (event, newValue) => {
    setFormData({ ...formData, sub_cost_center_of: newValue?.id || "" });
  };
  const handleSubDepartmentChange = (event, newValue) => {
    setFormData({ ...formData, sub_department_of: newValue?.id || "" });
  };
  const handleProjectChange = (event, newValue) => {
    setFormData({ ...formData, project_id: newValue?.id || "" });
  };

  // Save logic
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
        if (type === "project") response = await editProject(formData.id, formData);
        if (type === "costCenter") response = await editCostCenter(formData.id, formData);
        if (type === "department") response = await editDepartment(formData.id, formData);
        if (type === "trade") response = await editTrade(formData.id, formData);
        if (type === "companyCode") response = await editCompanyCode(formData.id, formData);
        if (type === "job") response = await editJob(formData.id, formData);
      } else {
        if (type === "project") response = await createProject(formData);
        if (type === "costCenter") response = await createCostCenter(formData);
        if (type === "department") response = await createDepartment(formData);
        if (type === "trade") response = await createTrade(formData);
        if (type === "companyCode") response = await createCompanyCode(formData);
        if (type === "job") response = await createJob(formData);
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

  // Save and New
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
        if (type === "project") response = await editProject(formData.id, formData);
        if (type === "costCenter") response = await editCostCenter(formData.id, formData);
        if (type === "department") response = await editDepartment(formData.id, formData);
        if (type === "trade") response = await editTrade(formData.id, formData);
        if (type === "companyCode") response = await editCompanyCode(formData.id, formData);
        if (type === "job") response = await editJob(formData.id, formData);
      } else {
        if (type === "project") response = await createProject(formData);
        if (type === "costCenter") response = await createCostCenter(formData);
        if (type === "department") response = await createDepartment(formData);
        if (type === "trade") response = await createTrade(formData);
        if (type === "companyCode") response = await createCompanyCode(formData);
        if (type === "job") response = await createJob(formData);
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        if (onSaveAndNew) onSaveAndNew(response.data);
        setFormData({ active: true });
        setOriginalData({});
        setOriginalName("");
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

  // Save and Close
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
        if (type === "project") response = await editProject(formData.id, formData);
        if (type === "costCenter") response = await editCostCenter(formData.id, formData);
        if (type === "department") response = await editDepartment(formData.id, formData);
        if (type === "trade") response = await editTrade(formData.id, formData);
        if (type === "companyCode") response = await editCompanyCode(formData.id, formData);
        if (type === "job") response = await editJob(formData.id, formData);
      } else {
        if (type === "project") response = await createProject(formData);
        if (type === "costCenter") response = await createCostCenter(formData);
        if (type === "department") response = await createDepartment(formData);
        if (type === "trade") response = await createTrade(formData);
        if (type === "companyCode") response = await createCompanyCode(formData);
        if (type === "job") response = await createJob(formData);
      }
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        if (onSaveAndClose) onSaveAndClose(response.data);
        if (onClose) onClose();
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
  const hasFormData = () => {
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
      Object.entries(formData).some(([key, value]) =>
        key !== 'active' && value && value.toString().trim() !== ""
      )
    );
  };

  const getContent = () => {
    if (!type) return null;

    if (type === "project") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Grid container spacing={2}>
            <Grid sx={{ minWidth: 250, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            <Grid sx={{ minWidth: 250, gridColumn: 'span 12' }}>
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
            
          </Grid>
        </Box>
      );
    }

    if (type === "costCenter") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Box sx={{ display: 'flex', gap: 2 }}>
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
                <Grid sx={{ minWidth: 250, gridColumn: 'span 12', width: "53%" }}>
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
                  setFormData({
                    ...formData,
                    active: e.target.checked,
                  })
                }
                label={t("management.active")}
                isRTL={isRTL}
              />
            </Box>
          </Box>
        </Box>
      );
    }

    if (type === "department") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Box sx={{ display: 'flex', gap: 2 }}>
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
                <Grid sx={{ minWidth: 250, gridColumn: 'span 12', width: "53%" }}>
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
                  setFormData({
                    ...formData,
                    active: e.target.checked,
                  })
                }
                label={t("management.active")}
                isRTL={isRTL}
              />
            </Box>
          </Box>
        </Box>
      );
    }

    if (type === "trade") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Box sx={{ display: 'flex', gap: 2 }}>
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
                  setFormData({
                    ...formData,
                    active: e.target.checked,
                  })
                }
                label={t("management.active")}
                isRTL={isRTL}
              />
            </Box>
          </Box>
        </Box>
      );
    }

    if (type === "companyCode") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
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
      );
    }

    if (type === "job") {
      return (
        <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
          <Grid container spacing={2}>
            <Grid sx={{ minWidth: 200, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            <Grid sx={{ minWidth: 300, gridColumn: { xs: 'span 12', md: 'span 6' } }}>
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
            <Grid sx={{ minWidth: 400, gridColumn: 'span 12' }}>
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
        </Box>
      );
    }

    // Default fields for other types
    return (
      <Box className="p-4 bg-gray-50 dark:bg-muted/50 rounded border border-border shadow-sm">
        <Grid container spacing={2}>
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
      </Box>
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

export default SectionDrawer;
