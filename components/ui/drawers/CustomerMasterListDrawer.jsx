"use client";

import React, { useState, useEffect, useCallback, Suspense, useMemo, useRef } from "react";
import {
  Grid,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import RTLTextField from "@/components/ui/RTLTextField";
import { useTranslations, useLocale } from "next-intl";
import { 
  createCustomerMasterList, 
  editCustomerMasterList 
} from "@/API/Customers";
import { getItems } from "@/API/Items";
import { useSimpleToast } from "@/components/ui/simple-toast";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import DrawerGrid from "@/components/ui/DrawerGrid";

const LoadingSkeleton = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#888',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      zIndex: 10,
      width: '100%',
      pointerEvents: 'none',
      background: 'transparent'
    }}
  >
    <span
      style={{
        display: 'inline-block',
        width: 48,
        height: 48,
        border: '5px solid #eee',
        borderTop: '5px solid #1976d2',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    Loading customer master list details...
  </div>
);

const CustomerMasterListDrawer = React.memo(({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData,
  onFormDataChange,
  isEdit = false,
  saveLoading: externalSaveLoading = false,
}) => {
  const t = useTranslations("customers.management");
  const tToast = useTranslations("toast");
  const locale = useLocale();
  const theme = useTheme();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();
  const { getTabIndex } = useTabNavigation();
  
  // Check if we're in dark mode
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    // Use the same approach as the drawer header/footer
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };

  
  // Internal loading state
  const [internalSaveLoading, setInternalSaveLoading] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Use external saveLoading if provided, otherwise use internal
  const saveLoading = externalSaveLoading || internalSaveLoading;

  // State for grid data
  const [gridData, setGridData] = useState([
    {
      id: 1,
      line: "",
      item_id: null,
      itemcode: "",
      itemname: "",
      price: 0,
      discount: 0,
      isEnabled: true,
    },
  ]);

  // State for items data (for help modal and autocomplete)
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Ref to track if grid has been initialized
  const gridInitializedRef = useRef(false);

  // Fetch items data when drawer opens
  useEffect(() => {
    if (isOpen) {
      const fetchItems = async () => {
        try {
          setItemsLoading(true);
          const response = await getItems();
          setItems(response.data || []);
        } catch (error) {
          console.error("Error fetching items:", error);
        } finally {
          setItemsLoading(false);
        }
      };

      fetchItems();
    }
  }, [isOpen]);

  // Initialize original data for change detection and grid data
  useEffect(() => {
    if (isOpen && isEdit) {
      // Initialize grid data from formData if it exists
      if (!gridInitializedRef.current) {
        const sourceItems = Array.isArray(formData.items) && formData.items.length > 0
          ? formData.items
          : (Array.isArray(formData.gridData) ? formData.gridData : []);
        
        if (sourceItems.length > 0) {
          const gridDataWithEnabled = sourceItems.map((row, idx) => ({
            id: row.id ?? idx + 1,
            line: row.line ?? "",
            item_id: row.item_id ?? null,
            itemcode: row.itemcode ?? row.code ?? "",
            itemname: row.itemname ?? "",
            price: typeof row.price === 'number' ? row.price : (row.price ? parseFloat(row.price) || 0 : 0),
            discount: typeof row.discount === 'number' ? row.discount : (row.discount ? parseFloat(row.discount) || 0 : 0),
            isEnabled: row.isEnabled !== undefined ? row.isEnabled : true
          }));
          
          setGridData(gridDataWithEnabled);
          
          // Set original data AFTER grid data is initialized, using the same structure
          const originalDataWithGrid = {
            ...formData,
            items: gridDataWithEnabled.map(row => ({
              item_id: row.item_id,
              itemname: row.itemname || '',
              price: typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0,
              discount: typeof row.discount === 'number' ? row.discount : parseFloat(row.discount) || 0,
              line: row.line || ''
            }))
          };
          setOriginalData(originalDataWithGrid);
          
          gridInitializedRef.current = true;
        } else {
          // No items, set original data without grid
          setOriginalData(formData);
        }
      }
    } else if (isOpen && !isEdit) {
      // Reset grid data for new entry
      if (!gridInitializedRef.current) {
        setGridData([
          {
            id: 1,
            line: "",
            item_id: null,
            itemcode: "",
            itemname: "",
            price: 0,
            discount: 0,
            isEnabled: true,
          },
        ]);
        gridInitializedRef.current = true;
      }
    } else if (!isOpen) {
      // Reset the ref when drawer closes
      gridInitializedRef.current = false;
    }
  }, [isOpen, isEdit, formData]);

  // Check if data has changed
  function isDataChanged() {
    // In add mode, we want to show confirmation if formData has meaningful data beyond defaults
    if (!isEdit) {
      // Helper function to clean data for comparison
      const cleanData = (data) => {
        if (!data || typeof data !== 'object') return {};
        
        const cleaned = {};
        Object.keys(data).forEach(key => {
          const value = data[key];
          
          // Skip null, undefined, empty strings, empty arrays, and empty objects
          if (value === null || value === undefined || value === '') return;
          if (Array.isArray(value) && value.length === 0) return;
          if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return;
          
          // Skip default values that are always present
          if (key === 'active' && value === true) return;
          
          cleaned[key] = value;
        });
        
        return cleaned;
      };
      
      const cleanedFormData = cleanData(formData);
      
      // Also check if gridData has meaningful content
      const hasGridData = gridData.some(row => 
        row.line || 
        row.itemcode || 
        row.item_id ||
        row.itemname ||
        (row.price && row.price !== 0) || 
        (row.discount && row.discount !== 0)
      );
      
      // In add mode, return true if either formData or gridData has meaningful content
      return Object.keys(cleanedFormData).length > 0 || hasGridData;
    }
    
    // In edit mode, compare with original data
    const cleanData = (data) => {
      if (!data || typeof data !== 'object') return {};
      
      const cleaned = {};
      Object.keys(data).forEach(key => {
        const value = data[key];
        
        // Skip null, undefined, empty strings, empty arrays, and empty objects
        if (value === null || value === undefined || value === '') return;
        if (Array.isArray(value) && value.length === 0) return;
        if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return;
        
        // Skip the items array - we'll handle it separately
        if (key === 'items') return;
        
        cleaned[key] = value;
      });
      
      return cleaned;
    };
    
    const cleanedFormData = cleanData(formData);
    const cleanedOriginalData = cleanData(originalData);
    
    // Check if main form fields have changed
    const mainFieldsChanged = JSON.stringify(cleanedFormData) !== JSON.stringify(cleanedOriginalData);
    
    // Check if grid data has changed
    const normalizeGridData = (data) => {
      if (!Array.isArray(data)) return [];
      
      return data
        .filter(item => {
          // Include ALL items - don't filter out new rows even if they're empty
          // This ensures that adding/removing rows is detected as a change
          return item;
        })
        .map(item => ({
          item_id: item.item_id,
          itemname: item.itemname || '',
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
          discount: typeof item.discount === 'number' ? item.discount : parseFloat(item.discount) || 0,
          line: item.line || ''
        }))
        .sort((a, b) => {
          // Sort by item_id if available, otherwise put new rows at the end
          if (a.item_id && b.item_id) return a.item_id - b.item_id;
          if (a.item_id) return -1;
          if (b.item_id) return 1;
          return 0;
        });
    };
    
    const currentGridData = normalizeGridData(gridData);
    const originalGridData = normalizeGridData(originalData.items || []);
    
    const gridDataChanged = JSON.stringify(currentGridData) !== JSON.stringify(originalGridData);
    
    // Return true if either main fields or grid data has changed
    return mainFieldsChanged || gridDataChanged;
  }

  // Handle save
  const handleSave = useCallback(async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("customers.management.noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      
      // Get the first row from gridData for the main fields
    const dataToSave = {
      date: formData.date,
      name: formData.name,
      valid_from: formData.valid_from,
      valid_till: formData.valid_till,
      items: (Array.isArray(gridData) ? gridData : [])
        .map((r) => ({
          item_id: r.item_id ?? (typeof r.itemcode === 'number' ? r.itemcode : (typeof r.itemcode === 'string' && r.itemcode !== '' && !isNaN(Number(r.itemcode)) ? Number(r.itemcode) : null)),
          price: typeof r.price === 'number' ? r.price : (r.price !== '' ? parseFloat(r.price) || 0 : 0),
          discount: typeof r.discount === 'number' ? r.discount : (r.discount !== '' ? parseFloat(r.discount) || 0 : 0),
          line: r.line ?? null,
        }))
        .filter((i) => i.item_id !== null && i.item_id !== undefined)
    };

      let response;
      if (isEdit) {
        response = await editCustomerMasterList(formData.id, dataToSave);
      } else {
        response = await createCustomerMasterList(dataToSave);
      }
      
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        // Update originalData with the current formData and gridData to ensure proper change detection
        if (isEdit) {
          const updatedOriginalData = {
            ...formData,
            items: gridData.map(row => ({
              item_id: row.item_id,
              price: typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0,
              discount: typeof row.discount === 'number' ? row.discount : parseFloat(row.discount) || 0,
              line: row.line || ''
            })).filter(item => item.item_id !== null && item.item_id !== undefined)
          };
          setOriginalData(updatedOriginalData);
        }
        onSave && onSave(response.data);
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
    } finally {
      setInternalSaveLoading(false);
    }
  }, [isEdit, isDataChanged, formData, gridData, onSave, addToast, tToast, saveLoading]);

  // Handle save and new
  const handleSaveAndNew = useCallback(async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("customers.management.noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      
      // Get the first row from gridData for the main fields
    const dataToSave = {
      date: formData.date,
      name: formData.name,
      valid_from: formData.valid_from,
      valid_till: formData.valid_till,
      items: (Array.isArray(gridData) ? gridData : [])
        .map((r) => ({
          item_id: r.item_id ?? (typeof r.itemcode === 'number' ? r.itemcode : (typeof r.itemcode === 'string' && r.itemcode !== '' && !isNaN(Number(r.itemcode)) ? Number(r.itemcode) : null)),
          itemname: r.itemname ?? "",
          price: typeof r.price === 'number' ? r.price : (r.price !== '' ? parseFloat(r.price) || 0 : 0),
          discount: typeof r.discount === 'number' ? r.discount : (r.discount !== '' ? parseFloat(r.discount) || 0 : 0),
          line: r.line ?? null,
        }))
        .filter((i) => i.item_id !== null && i.item_id !== undefined)
    };

      let response;
      if (isEdit) {
        response = await editCustomerMasterList(formData.id, dataToSave);
      } else {
        response = await createCustomerMasterList(dataToSave);
      }
      
      if (response && response.status) {
        addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        // Update originalData with the current formData and gridData to ensure proper change detection
        if (isEdit) {
          const updatedOriginalData = {
            ...formData,
            items: gridData.map(row => ({
              item_id: row.item_id,
              price: typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0,
              discount: typeof row.discount === 'number' ? row.discount : parseFloat(row.discount) || 0,
              line: row.line || ''
            })).filter(item => item.item_id !== null && item.item_id !== undefined)
          };
          setOriginalData(updatedOriginalData);
        }
        onSaveAndNew && onSaveAndNew(response.data);
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
    } finally {
      setInternalSaveLoading(false);
    }
  }, [isEdit, isDataChanged, formData, gridData, onSaveAndNew, addToast, tToast, t, saveLoading]);

  // Handle save and close
  const handleSaveAndClose = useCallback(async () => {
    if (isEdit && !isDataChanged()) {
      addToast({
        type: "error",
        title: tToast("error"),
        description: t("customers.management.noChangesDesc") || "Please modify at least one field before saving.",
        duration: 3000,
      });
      return;
    }
    
    if (saveLoading) return; // Prevent multiple saves
    
    try {
      setInternalSaveLoading(true);
      
      // Get the first row from gridData for the main fields
    const dataToSave = {
      date: formData.date,
      name: formData.name,
      valid_from: formData.valid_from,
      valid_till: formData.valid_till,
      items: (Array.isArray(gridData) ? gridData : [])
        .map((r) => ({
          item_id: r.item_id ?? (typeof r.itemcode === 'number' ? r.itemcode : (typeof r.itemcode === 'string' && r.itemcode !== '' && !isNaN(Number(r.itemcode)) ? Number(r.itemcode) : null)),
          itemname: r.itemname ?? "",
          price: typeof r.price === 'number' ? r.price : (r.price !== '' ? parseFloat(r.price) || 0 : 0),
          discount: typeof r.discount === 'number' ? r.discount : (r.discount !== '' ? parseFloat(r.discount) || 0 : 0),
          line: r.line ?? null,
        }))
        .filter((i) => i.item_id !== null && i.item_id !== undefined)
    };

      let response;
      if (isEdit) {
        response = await editCustomerMasterList(formData.id, dataToSave);
      } else {
        response = await createCustomerMasterList(dataToSave);
      }
      
      if (response && response.status) {
                addToast({
          type: "success",
          title: tToast("success"),
          description: tToast(isEdit ? "updateSuccess" : "createSuccess"),
          duration: 3000,
        });
        // Update originalData with the current formData and gridData to ensure proper change detection
        if (isEdit) {
          const updatedOriginalData = {
            ...formData,
            items: gridData.map(row => ({
              item_id: row.item_id,
              price: typeof row.price === 'number' ? row.price : parseFloat(row.price) || 0,
              discount: typeof row.discount === 'number' ? row.discount : parseFloat(row.discount) || 0,
              line: row.line || ''
            })).filter(item => item.item_id !== null && item.item_id !== undefined)
          };
          setOriginalData(updatedOriginalData);
        }
        onSaveAndClose && onSaveAndClose(response.data);
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
    } finally {
      setInternalSaveLoading(false);
    }
  }, [isEdit, isDataChanged, formData, gridData, onSaveAndClose, onClose, addToast, tToast, saveLoading]);

  // Handle form data changes
  const handleFormDataChange = useCallback((field, value) => {
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        [field]: value,
      });
    }
  }, [formData, onFormDataChange]);

  // Handle grid data changes
  const handleGridDataChange = useCallback((updatedGridData) => {
    setGridData(updatedGridData);
  }, []);

  // Add new row to grid
  const handleAddRow = useCallback(() => {
    // Generate a unique ID for the new row
    const existingIds = gridData.map(row => {
      // Handle both numeric IDs and string IDs like "row_2"
      if (typeof row.id === 'number') return row.id;
      if (typeof row.id === 'string' && row.id.startsWith('row_')) {
        const numPart = parseInt(row.id.replace('row_', ''));
        return isNaN(numPart) ? 0 : numPart;
      }
      return 0;
    });
    
    const maxId = Math.max(...existingIds, 0);
    const newRowId = `row_${maxId + 1}`;
    
    const newRow = {
      id: newRowId,
      line: "",
      itemcode: "",
      itemname: "",
      price: 0,
      discount: 0,
      isEnabled: true,
    };
    setGridData([...gridData, newRow]);
  }, [gridData]);

  // Remove row from grid
  const handleRemoveRow = useCallback((rowId) => {
    if (gridData.length > 1) {
      const updatedGridData = gridData.filter(row => row.id !== rowId);
      setGridData(updatedGridData);
    }
  }, [gridData]);

  // Generate help columns from items data
  const generateHelpColumns = useCallback((data) => {
    if (!data || data.length === 0) return [];
    
    // Get the first item to determine the structure
    const firstItem = data[0];
    const columns = [];
    
    // Add columns for each property that actually exists in the data
    Object.keys(firstItem).forEach(key => {
      let type = 'text';
      let header = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      
      // Determine column type based on actual data value
      const value = firstItem[key];
      if (typeof value === 'number') {
        type = 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (value instanceof Date || (typeof value === 'string' && (value.includes('-') || value.includes('/')))) {
        type = 'date';
      }
      
      // Special header formatting for common fields
      if (key === 'id') {
        header = 'ID';
      } else if (key === 'code' || key === 'itemcode') {
        header = 'Code';
      } else if (key === 'name') {
        header = 'Name';
      } else if (key === 'price') {
        header = 'Price';
      }
      
      columns.push({
        key: key,
        header: header,
        type: type
      });
    });
    
    return columns;
  }, []);

  // Get drawer title
  const getTitle = useCallback(() => {
    if (isEdit) {
      return t("editCustomerMasterList");
    }
    return t("addCustomerMasterList");
  }, [isEdit, t]);

  // Check if form has data
  const hasFormData = () => {
    const basicFields = formData && (
      formData.date ||
      formData.name ||
      formData.valid_from ||
      formData.valid_till
    );
    
    const gridDataCheck = gridData.some(row => {
      const hasData = row.line || row.itemcode || row.item_id || row.itemname || row.price || row.discount;
      return hasData;
    });
    
    const itemsCheck = formData?.items && formData.items.some(item => {
      const hasPivotData = item.pivot && (
        item.pivot.line ||
        item.pivot.itemcode ||
        item.pivot.itemname ||
        item.pivot.price ||
        item.pivot.discount
      );
      return hasPivotData;
    });
    
    const result = formData && (basicFields || gridDataCheck || itemsCheck);
    return result;
  };

  // Check if data has changed from original state
  const hasDataChanged = isOpen ? isDataChanged() : false;

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      width={1100}
      onSave={handleSave}
      onSaveAndNew={handleSaveAndNew}
      onSaveAndClose={handleSaveAndClose}
      saveLoading={saveLoading}
      hasDataChanged={hasDataChanged}
      isEdit={isEdit}
      anchor={isRTL ? "left" : "right"}
    >
        <Suspense fallback={<LoadingSkeleton />}>
        <Box sx={{ p: 3 }}>
          {/* Basic Information Section */}
          <Accordion 
            expanded={true}
            sx={{
              backgroundColor: getBackgroundColor(),
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            <AccordionSummary
              aria-controls="basic-info-content"
              id="basic-info-header"
              tabIndex={-1}
              sx={{
                backgroundColor: getBackgroundColor(),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("basicInformation")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: getBackgroundColor()
              }}
            >
                             <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                    {t("date")} *
                  </Typography>
                                     <RTLTextField
                     fullWidth
                     type="date"
                     value={formData?.date || ""}
                     onChange={(e) => handleFormDataChange("date", e.target.value)}
                     InputLabelProps={{ shrink: true }}
                   />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                    {t("name")} *
                  </Typography>
                                     <RTLTextField
                     fullWidth
                     value={formData?.name || ""}
                     onChange={(e) => handleFormDataChange("name", e.target.value)}
                   />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                    {t("validFrom")} *
                  </Typography>
                                     <RTLTextField
                     fullWidth
                     type="date"
                     value={formData?.valid_from || ""}
                     onChange={(e) => handleFormDataChange("valid_from", e.target.value)}
                     InputLabelProps={{ shrink: true }}
                   />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
                    {t("validTill")} *
                  </Typography>
                                     <RTLTextField
                     fullWidth
                     type="date"
                     value={formData?.valid_till || ""}
                     onChange={(e) => handleFormDataChange("valid_till", e.target.value)}
                     InputLabelProps={{ shrink: true }}
                   />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          

          {/* Item Details Section */}
          <Accordion 
            expanded={true} 
            sx={{ 
              mt: 2,
              backgroundColor: getBackgroundColor(),
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          >
            <AccordionSummary
              aria-controls="item-details-content"
              id="item-details-header"
              tabIndex={-1}
              sx={{
                backgroundColor: getBackgroundColor(),
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {t("itemDetails")}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: getBackgroundColor()
              }}
            >
              <DrawerGrid
                gridData={gridData}
                onGridDataChange={handleGridDataChange}
                onAddRow={handleAddRow}
                onRemoveRow={handleRemoveRow}
                disabled={saveLoading}
                columns={[
                  { field: "line", label: t("line"), type: "text" },
                  { field: "itemcode", label: t("itemCode"), type: "text" },
                  { field: "itemname", label: t("itemName"), type: "text" },
                  { field: "price", label: t("price"), type: "number" },
                  { field: "discount", label: t("discount"), type: "number" },
                ]}
                // title={t("itemDetails")}
                translationNamespace="customers.management"
                columnActions={{
                  line: { showAddButton: false, showHelpButton: false },
                  itemcode: { showAddButton: true, showHelpButton: true },
                  itemname: { showAddButton: false, showHelpButton: false },
                  price: { showAddButton: false, showHelpButton: false },
                  discount: { showAddButton: false, showHelpButton: false },
                }}
                helpData={items}
                helpColumns={generateHelpColumns(items)}
                helpLoading={itemsLoading}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Suspense>
    </DynamicDrawer>
  );
});

CustomerMasterListDrawer.displayName = "CustomerMasterListDrawer";

export default CustomerMasterListDrawer;
