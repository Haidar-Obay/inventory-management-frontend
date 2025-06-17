"use client";

import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography, TextField, Button, Stack, Grid, Autocomplete } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getCustomerNames, getCostCenterNames } from '@/API/Customers';
import { getCostCenterNames as getCostCenterNamesFromSections } from '@/API/Sections';
import { getDepartmentNames as getDepartmentNamesFromSections } from '@/API/Sections';
import { getProjectNames as getProjectNamesFromSections } from '@/API/Sections';

const SectionDrawer = ({
  isOpen,
  onClose,
  type,
  onSave,
  onSaveAndNew,
  onSaveAndClose,
  formData,
  onFormDataChange,
  isEdit = false
}) => {
  const [expandedAccordion, setExpandedAccordion] = useState('panel1');
  const [customers, setCustomers] = useState([]);
  const [costCenterOptions, setCostCenterOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === 'project' && isOpen) {
      fetchCustomers();
    }
    if (type === 'costCenter' && isOpen) {
      fetchCostCenterNames();
    }
    if (type === 'department' && isOpen) {
      fetchDepartmentNames();
    }
    if (type === 'job' && isOpen) {
      fetchProjectNames();
    }
  }, [type, isOpen]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomerNames();
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
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
      console.error('Error fetching cost center names:', error);
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
      console.error('Error fetching department names:', error);
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
      console.error('Error fetching project names:', error);
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
      [field]: event.target.value
    });
  };

  const handleDateChange = (field) => (date) => {
    onFormDataChange({
      ...formData,
      [field]: date
    });
  };

  const handleCustomerChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      customer_id: newValue?.id || '',
      customer_name: newValue?.name || ''
    });
  };

  const handleSubCostCenterChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      sub_cost_center_of: newValue?.id || ''
    });
  };

  const handleSubDepartmentChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      sub_department_of: newValue?.id || ''
    });
  };

  const handleProjectChange = (event, newValue) => {
    onFormDataChange({
      ...formData,
      project_id: newValue?.id || ''
    });
  };

  const getAccordionContent = () => {
    if (type === 'project') {
      return [{
        title: isEdit ? 'Edit Project' : 'Add Project',
        expanded: expandedAccordion === 'panel1',
        onChange: handleAccordionChange('panel1'),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                variant="outlined"
                size="small"
                value={formData?.name || ''}
                onChange={handleFieldChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ width: '100%' }}>
              <Autocomplete
                fullWidth
                options={customers}
                getOptionLabel={(option) => option.name || ''}
                value={customers.find(c => c.id === formData?.customer_id) || null}
                onChange={handleCustomerChange}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer"
                    variant="outlined"
                    size="small"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ width: '100%' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData?.start_date || null}
                  onChange={handleDateChange('start_date')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4} sx={{ width: '100%' }}  >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expected Date"
                  value={formData?.expected_date || null}
                  onChange={handleDateChange('expected_date')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4} sx={{ width: '100%' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData?.end_date || null}
                  onChange={handleDateChange('end_date')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )
      }];
    }

    if (type === 'costCenter') {
      return [{
        title: isEdit ? 'Edit Cost Center' : 'Add Cost Center',
        expanded: expandedAccordion === 'panel1',
        onChange: handleAccordionChange('panel1'),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} >
              <TextField
                fullWidth
                label="Code"
                variant="outlined"
                size="small"
                value={formData?.code || ''}
                onChange={handleFieldChange('code')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                value={formData?.name || ''}
                onChange={handleFieldChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '53%' }}>
              <Autocomplete
                fullWidth
                options={costCenterOptions}
                getOptionLabel={(option) => option.name || ''}
                value={costCenterOptions.find(c => c.id === formData?.sub_cost_center_of) || null}
                onChange={handleSubCostCenterChange}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Cost Center Of"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Active"
                variant="outlined"
                size="small"
                value={formData?.active === false ? 'false' : 'true'}
                onChange={(e) => onFormDataChange({
                  ...formData,
                  active: e.target.value === 'true'
                })}
                SelectProps={{
                  native: true
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </TextField>
            </Grid>
          </Grid>
        )
      }];
    }

    if (type === 'department') {
      return [{
        title: isEdit ? 'Edit Department' : 'Add Department',
        expanded: expandedAccordion === 'panel1',
        onChange: handleAccordionChange('panel1'),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code"
                variant="outlined"
                size="small"
                value={formData?.code || ''}
                onChange={handleFieldChange('code')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                value={formData?.name || ''}
                onChange={handleFieldChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ width: '53%' }}>
              <Autocomplete
                fullWidth
                options={departmentOptions}
                getOptionLabel={(option) => option.name || ''}
                value={departmentOptions.find(d => d.id === formData?.sub_department_of) || null}
                onChange={handleSubDepartmentChange}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Department Of"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Active"
                variant="outlined"
                size="small"
                value={formData?.active === false ? 'false' : 'true'}
                onChange={(e) => onFormDataChange({
                  ...formData,
                  active: e.target.value === 'true'
                })}
                SelectProps={{
                  native: true
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </TextField>
            </Grid>
          </Grid>
        )
      }];
    }

    if (type === 'trade') {
      return [{
        title: isEdit ? 'Edit Trade' : 'Add Trade',
        expanded: expandedAccordion === 'panel1',
        onChange: handleAccordionChange('panel1'),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code"
                variant="outlined"
                size="small"
                value={formData?.code || ''}
                onChange={handleFieldChange('code')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                value={formData?.name || ''}
                onChange={handleFieldChange('name')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Active"
                variant="outlined"
                size="small"
                value={formData?.active === false ? 'false' : 'true'}
                onChange={(e) => onFormDataChange({
                  ...formData,
                  active: e.target.value === 'true'
                })}
                SelectProps={{
                  native: true
                }}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </TextField>
            </Grid>
          </Grid>
        )
      }];
    }

    if (type === 'companyCode') {
      return [{
        title: isEdit ? 'Edit Company Code' : 'Add Company Code',
        expanded: expandedAccordion === 'panel1',
        onChange: handleAccordionChange('panel1'),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code"
                variant="outlined"
                size="small"
                value={formData?.code || ''}
                onChange={handleFieldChange('code')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                size="small"
                value={formData?.name || ''}
                onChange={handleFieldChange('name')}
                required
              />
            </Grid>
          </Grid>
        )
      }];
    }

    if (type === 'job') {
      return [{
        title: isEdit ? 'Edit Job' : 'Add Job',
        expanded: expandedAccordion === 'panel1',
        onChange: handleAccordionChange('panel1'),
        content: (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                size="small"
                value={formData?.description || ''}
                onChange={handleFieldChange('description')}
                required
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ width: '100%' }}>
              <Autocomplete
                fullWidth
                options={projectOptions}
                getOptionLabel={(option) => option.name || ''}
                value={projectOptions.find(p => p.id === formData?.project_id) || null}
                onChange={handleProjectChange}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project"
                    variant="outlined"
                    size="small"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData?.start_date || null}
                  onChange={handleDateChange('start_date')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4} >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expected Date"
                  value={formData?.expected_date || null}
                  onChange={handleDateChange('expected_date')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData?.end_date || null}
                  onChange={handleDateChange('end_date')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      variant: "outlined"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )
      }];
    }

    // Default fields for other types
    return [{
      title: isEdit ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      expanded: expandedAccordion === 'panel1',
      onChange: handleAccordionChange('panel1'),
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={`${type.charAt(0).toUpperCase() + type.slice(1)} Name`}
              variant="outlined"
              size="small"
              value={formData?.name || ''}
              onChange={handleFieldChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              size="small"
              multiline
              rows={4}
              value={formData?.description || ''}
              onChange={handleFieldChange('description')}
            />
          </Grid>
        </Grid>
      )
    }];
  };

  return (
    <DynamicDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `${type.charAt(0).toUpperCase() + type.slice(1)}` : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      accordions={getAccordionContent()}
      onSave={onSave}
      onSaveAndNew={onSaveAndNew}
      onSaveAndClose={onSaveAndClose}
    />
  );
};

export default SectionDrawer; 