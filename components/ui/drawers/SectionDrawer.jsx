"use client";

import React, { useState } from 'react';
import { Drawer, Box, Typography, TextField, Button, Stack, Grid } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

  const getAccordionContent = () => {
    if (type === 'project') {
      return [{
        title: isEdit ? 'Edit Project' : 'Add Project',
        expanded: expandedAccordion === 'panel1',
        onChange: handleAccordionChange('panel1'),
        content: (
          <>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer ID"
                variant="outlined"
                size="small"
                value={formData?.customer_id || ''}
                onChange={handleFieldChange('customer_id')}
                required
              />
            </Grid>
          </>
        )
      }];
    }

    // Default fields for other types
    return [{
      title: isEdit ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      expanded: expandedAccordion === 'panel1',
      onChange: handleAccordionChange('panel1'),
      content: (
        <>
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
        </>
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