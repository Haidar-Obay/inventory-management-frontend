"use client";

import React, { useState, useEffect } from "react";
import { Grid, TextField, Autocomplete } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { getProductLineNames } from "@/API/Items";
import { getCategoryNames } from "@/API/Items";
import { getBrandNames } from "@/API/Items";

const ItemDrawer = ({
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
  const [productLineOptions, setProductLineOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (type === "productLine") {
        fetchProductLineNames();
      } else if (type === "category") {
        fetchCategoryNames();
      } else if (type === "brand") {
        fetchBrandNames();
      } else if (type === "item") {
        fetchAllOptions();
      }
    }
  }, [type, isOpen]);

  const fetchProductLineNames = async () => {
    try {
      setLoading(true);
      const response = await getProductLineNames();
      setProductLineOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching product line names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryNames = async () => {
    try {
      setLoading(true);
      const response = await getCategoryNames();
      setCategoryOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching category names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandNames = async () => {
    try {
      setLoading(true);
      const response = await getBrandNames();
      setBrandOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching brand names:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOptions = async () => {
    await Promise.all([
      fetchProductLineNames(),
      fetchCategoryNames(),
      fetchBrandNames(),
    ]);
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

  const handleProductLineChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      product_line_id: newValue?.id || "",
      product_line_name: newValue?.name || "",
    });
  };

  const handleCategoryChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      category_id: newValue?.id || "",
      category_name: newValue?.name || "",
    });
  };

  const handleBrandChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      brand_id: newValue?.id || "",
      brand_name: newValue?.name || "",
    });
  };

  const getAccordionContent = () => {
    if (type === "productLine") {
      return [
        {
          title: isEdit ? "Edit Product Line" : "Add Product Line",
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Code"
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Name"
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label="Active"
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
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "category") {
      return [
        {
          title: isEdit ? "Edit Category" : "Add Category",
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Code"
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Name"
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ width: "53%" }}>
                <Autocomplete
                  fullWidth
                  options={categoryOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    categoryOptions.find(
                      (c) => c.id === formData?.sub_category_of
                    ) || null
                  }
                  onChange={(e, newValue) =>
                    onFormDataChange({
                      ...formData,
                      sub_category_of: newValue?.id || "",
                    })
                  }
                  loading={loading}
                  renderInput={(params) => (
                    <RTLTextField {...params} label="Sub Category Of" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label="Active"
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
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "brand") {
      return [
        {
          title: isEdit ? "Edit Brand" : "Add Brand",
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Code"
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Name"
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ width: "53%" }}>
                <Autocomplete
                  fullWidth
                  options={brandOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    brandOptions.find((b) => b.id === formData?.sub_brand_of) ||
                    null
                  }
                  onChange={(e, newValue) =>
                    onFormDataChange({
                      ...formData,
                      sub_brand_of: newValue?.id || "",
                    })
                  }
                  loading={loading}
                  renderInput={(params) => (
                    <RTLTextField {...params} label="Sub Brand Of" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label="Active"
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
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    if (type === "item") {
      return [
        {
          title: isEdit ? "Edit Item" : "Add Item",
          expanded: expandedAccordion === "panel1",
          onChange: handleAccordionChange("panel1"),
          content: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Code"
                  value={formData?.code || ""}
                  onChange={handleFieldChange("code")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  label="Name"
                  value={formData?.name || ""}
                  onChange={handleFieldChange("name")}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={productLineOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    productLineOptions.find(
                      (p) => p.id === formData?.product_line_id
                    ) || null
                  }
                  onChange={handleProductLineChange}
                  loading={loading}
                  renderInput={(params) => (
                    <RTLTextField {...params} label="Product Line" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={categoryOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    categoryOptions.find(
                      (c) => c.id === formData?.category_id
                    ) || null
                  }
                  onChange={handleCategoryChange}
                  loading={loading}
                  renderInput={(params) => (
                    <RTLTextField {...params} label="Category" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={brandOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    brandOptions.find((b) => b.id === formData?.brand_id) ||
                    null
                  }
                  onChange={handleBrandChange}
                  loading={loading}
                  renderInput={(params) => (
                    <RTLTextField {...params} label="Brand" required />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RTLTextField
                  select
                  label="Active"
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
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </RTLTextField>
              </Grid>
            </Grid>
          ),
        },
      ];
    }

    return [];
  };

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEdit
          ? `${type.charAt(0).toUpperCase() + type.slice(1)}`
          : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`
      }
      accordions={getAccordionContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
    />
  );
};

export default ItemDrawer;
