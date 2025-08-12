import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";

const TaxesSection = React.memo(({ 
  formData, 
  onFormDataChange, 
  isRTL, 
  t, 
  expanded, 
  onAccordionChange, 
  allCollapsed, 
  setAllCollapsed 
}) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed, expanded, onAccordionChange, setAllCollapsed]);

  // Handler for field changes
  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    onFormDataChange(field, value);
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (field) => (event) => {
    const checked = event.target.checked;
    onFormDataChange(field, checked);
  };

  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {t('management.taxesAccordion') || 'Taxes'}
          </Typography>
          
          {/* Show taxable checkbox under header only when collapsed */}
          {!expanded && (
            <Box sx={{ mt: 1, width: { xs: '100%', sm: '80%' } }}>
              <Box 
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              >
                <Checkbox
                  checked={formData?.taxable || false}
                  onChange={handleCheckboxChange('taxable')}
                  label={t('management.taxable') || 'Taxable'}
                  isRTL={isRTL}
                />
              </Box>
              
              {/* Show subjected to tax checkbox if taxable is checked */}
              {formData?.taxable && (
                <Box 
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  onFocus={e => e.stopPropagation()}
                  sx={{ mt: 1 }}
                >
                  <Checkbox
                    checked={formData?.subjected_to_tax || false}
                    onChange={handleCheckboxChange('subjected_to_tax')}
                    label={t('management.subjectedToTax') || 'Subjected to Tax'}
                    isRTL={isRTL}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </AccordionSummary>
      
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Taxable Checkbox */}
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Checkbox
              checked={formData?.taxable || false}
              onChange={handleCheckboxChange('taxable')}
              label={t('management.taxable') || 'Taxable'}
              isRTL={isRTL}
            />
          </Grid>
          
          {/* Taxable Fields - Show when taxable is checked */}
          {formData?.taxable && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.taxedFromDate') || 'Taxed From Date'}
                </Typography>
                <RTLTextField
                  type="date"
                  value={formData?.taxed_from_date || ''}
                  onChange={handleFieldChange('taxed_from_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.taxedTillDate') || 'Taxed Till Date'}
                </Typography>
                <RTLTextField
                  type="date"
                  value={formData?.taxed_till_date || ''}
                  onChange={handleFieldChange('taxed_till_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}

          {/* Subjected to Tax Checkbox */}
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Checkbox
              checked={formData?.subjected_to_tax || false}
              onChange={handleCheckboxChange('subjected_to_tax')}
              label={t('management.subjectedToTax') || 'Subjected to Tax'}
              isRTL={isRTL}
            />
          </Grid>

          {/* Added Tax Field - Show when subjected_to_tax is checked */}
          {formData?.subjected_to_tax && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.addedTax') || 'Added Tax'}
              </Typography>
              <RTLTextField
                type="number"
                value={formData?.added_tax || ''}
                onChange={handleFieldChange('added_tax')}
                placeholder=""
              />
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default TaxesSection;
