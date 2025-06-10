"use client";

import React, { useState } from 'react';
import { Drawer, Box, Typography, TextField, Button, Stack, Grid } from "@mui/material";
import DynamicDrawer from "@/components/ui/DynamicDrawer";

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

  const handleNameChange = (event) => {
    onFormDataChange({
      ...formData,
      name: event.target.value
    });
  };

  const handleDescriptionChange = (event) => {
    onFormDataChange({
      ...formData,
      description: event.target.value
    });
  };

  const getAccordionContent = () => {
    const nameField = (
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={`${type.charAt(0).toUpperCase() + type.slice(1)} Name`}
          variant="outlined"
          size="small"
          value={formData?.name || ''}
          onChange={handleNameChange}
          required
        />
      </Grid>
    );

    const descriptionField = (
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          size="small"
          multiline
          rows={4}
          value={formData?.description || ''}
          onChange={handleDescriptionChange}
        />
      </Grid>
    );

    return [{
      title: isEdit ? `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      expanded: expandedAccordion === 'panel1',
      onChange: handleAccordionChange('panel1'),
      content: (
        <>
          {nameField}
          {descriptionField}
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