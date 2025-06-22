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
  const [customers, setCustomers] = useState([]);
  const [costCenterOptions, setCostCenterOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("sections");
  const locale = useLocale();
  const isRTL = locale === "ar";

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
  }, [type, isOpen]);

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

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
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

  const getAccordionContent = () => {
    if (!type) return [];

    if (type === "project") {
      return [
        {
          title: isEdit
            ? t("management.editProject")
            : t("management.addProject"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.projectName")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
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
                    <RTLTextField
                      {...params}
                      label={t("management.customer")}
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ width: "100%" }}>
                <DatePicker
                  label={t("management.startDate")}
                  value={formData?.start_date || null}
                  onChange={handleDateChange("start_date")}
                  slots={{ textField: RTLTextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        ...(isRTL && {
                          "& .MuiInputLabel-root": {
                            right: "28px",
                            left: "auto",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            textAlign: "right",
                          },
                          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                            transform: "translate(28px, -9px) scale(0.75)",
                          },
                        }),
                      },
                    },
                  }}
                  enableAccessibleFieldDOMStructure={false}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ width: "100%" }}>
                <DatePicker
                  label={t("management.expectedDate")}
                  value={formData?.expected_date || null}
                  onChange={handleDateChange("expected_date")}
                  slots={{ textField: RTLTextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        ...(isRTL && {
                          "& .MuiInputLabel-root": {
                            right: "28px",
                            left: "auto",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            textAlign: "right",
                          },
                          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                            transform: "translate(28px, -9px) scale(0.75)",
                          },
                        }),
                      },
                    },
                  }}
                  enableAccessibleFieldDOMStructure={false}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ width: "100%" }}>
                <DatePicker
                  label={t("management.endDate")}
                  value={formData?.end_date || null}
                  onChange={handleDateChange("end_date")}
                  slots={{ textField: RTLTextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        ...(isRTL && {
                          "& .MuiInputLabel-root": {
                            right: "28px",
                            left: "auto",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            textAlign: "right",
                          },
                          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                            transform: "translate(28px, -9px) scale(0.75)",
                          },
                        }),
                      },
                    },
                  }}
                  enableAccessibleFieldDOMStructure={false}
                />
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "costCenter") {
      return [
        {
          title: isEdit
            ? t("management.editCostCenter")
            : t("management.addCostCenter"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.code")}
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.name")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ width: "53%" }}>
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
                    <RTLTextField
                      {...params}
                      label={t("management.subCostCenterOf")}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label={t("management.active")}
                  value={formData?.active === false ? "false" : "true"}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      active: e.target.value === "true",
                    })
                  }
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="true">{t("management.yes")}</option>
                  <option value="false">{t("management.no")}</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "department") {
      return [
        {
          title: isEdit
            ? t("management.editDepartment")
            : t("management.addDepartment"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.code")}
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.name")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ width: "53%" }}>
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
                    <RTLTextField
                      {...params}
                      label={t("management.subDepartmentOf")}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label={t("management.active")}
                  value={formData?.active === false ? "false" : "true"}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      active: e.target.value === "true",
                    })
                  }
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="true">{t("management.yes")}</option>
                  <option value="false">{t("management.no")}</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "trade") {
      return [
        {
          title: isEdit ? t("management.editTrade") : t("management.addTrade"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.code")}
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.name")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label={t("management.active")}
                  value={formData?.active === false ? "false" : "true"}
                  onChange={(e) =>
                    onFormDataChange({
                      ...formData,
                      active: e.target.value === "true",
                    })
                  }
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="true">{t("management.yes")}</option>
                  <option value="false">{t("management.no")}</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "companyCode") {
      return [
        {
          title: isEdit
            ? t("management.editCompanyCode")
            : t("management.addCompanyCode"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.code")}
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label={t("management.name")}
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "job") {
      return [
        {
          title: isEdit ? t("management.editJob") : t("management.addJob"),
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <RTLTextField
                  fullWidth
                  label={t("management.code")}
                  variant="outlined"
                  size="small"
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t("management.description")}
                  value={formData?.description || ""}
                  onChange={handleFieldChange("description")}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ width: "100%" }}>
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
                    <RTLTextField
                      {...params}
                      label={t("management.project")}
                      variant="outlined"
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label={t("management.startDate")}
                  value={formData?.start_date || null}
                  onChange={handleDateChange("start_date")}
                  slots={{ textField: RTLTextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        ...(isRTL && {
                          "& .MuiInputLabel-root": {
                            right: "28px",
                            left: "auto",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            textAlign: "right",
                          },
                          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                            transform: "translate(28px, -9px) scale(0.75)",
                          },
                        }),
                      },
                    },
                  }}
                  enableAccessibleFieldDOMStructure={false}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label={t("management.expectedDate")}
                  value={formData?.expected_date || null}
                  onChange={handleDateChange("expected_date")}
                  slots={{ textField: RTLTextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        ...(isRTL && {
                          "& .MuiInputLabel-root": {
                            right: "28px",
                            left: "auto",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            textAlign: "right",
                          },
                          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                            transform: "translate(28px, -9px) scale(0.75)",
                          },
                        }),
                      },
                    },
                  }}
                  enableAccessibleFieldDOMStructure={false}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label={t("management.endDate")}
                  value={formData?.end_date || null}
                  onChange={handleDateChange("end_date")}
                  slots={{ textField: RTLTextField }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined",
                      sx: {
                        ...(isRTL && {
                          "& .MuiInputLabel-root": {
                            right: "28px",
                            left: "auto",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            textAlign: "right",
                          },
                          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                            transform: "translate(28px, -9px) scale(0.75)",
                          },
                        }),
                      },
                    },
                  }}
                  enableAccessibleFieldDOMStructure={false}
                />
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    // Default fields for other types
    return [
      {
        title: isEdit
          ? t("management.edit" + type.charAt(0).toUpperCase() + type.slice(1))
          : t("management.add" + type.charAt(0).toUpperCase() + type.slice(1)),
        expanded: expandedAccordion === "panel1",
        onChange: handleAccordionChange("panel1"),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RTLTextField
                fullWidth
                label={t("management." + type + "Name")}
                value={formData?.name || ""}
                onChange={handleFieldChange("name")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <RTLTextField
                fullWidth
                label={t("management.description")}
                value={formData?.description || ""}
                onChange={handleFieldChange("description")}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        ),
      },
    ];
  };

  const pluralType = getPluralType(type);
  const title = isEdit
    ? t(
        "management.edit" +
          pluralType.charAt(0).toUpperCase() +
          pluralType.slice(1)
      )
    : t(
        "management.add" +
          pluralType.charAt(0).toUpperCase() +
          pluralType.slice(1)
      );

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
