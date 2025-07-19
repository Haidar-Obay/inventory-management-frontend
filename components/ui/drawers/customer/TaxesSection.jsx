import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";
import { Checkbox } from "@/components/ui/checkbox";

const TaxesSection = React.memo(({ formData, onFormDataChange, isRTL, t, handleFieldChange, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);
  
  return (
    <Accordion expanded={expanded} onChange={onAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="taxes-content"
        id="taxes-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.taxesAccordion') || 'Taxes'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Taxable Checkbox */}
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Checkbox
              checked={formData?.taxable || false}
              onChange={e => onFormDataChange({ ...formData, taxable: e.target.checked })}
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
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.addedTax') || 'Added Tax'}
                </Typography>
                <RTLTextField
                  value={formData?.added_tax || ''}
                  onChange={handleFieldChange('added_tax')}
                  placeholder=""
                />
              </Grid>
            </>
          )}
          
          {/* Exempted Checkbox */}
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <Checkbox
              checked={formData?.exempted || false}
              onChange={e => onFormDataChange({ ...formData, exempted: e.target.checked })}
              label={t('management.exempted') || 'Exempted'}
              isRTL={isRTL}
            />
          </Grid>
          
          {/* Exempted Fields - Show when exempted is checked */}
          {formData?.exempted && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.exemptedFrom') || 'Exempted From'}
                </Typography>
                <RTLTextField
                  value={formData?.exempted_from || ''}
                  onChange={handleFieldChange('exempted_from')}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.exemptionReference') || 'Exemption Reference'}
                </Typography>
                <RTLTextField
                  value={formData?.exemption_reference || ''}
                  onChange={handleFieldChange('exemption_reference')}
                  placeholder=""
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.exemptedFromDate') || 'Exempted From Date'}
                </Typography>
                <RTLTextField
                  type="date"
                  value={formData?.exempted_from_date || ''}
                  onChange={handleFieldChange('exempted_from_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.exemptedTillDate') || 'Exempted Till Date'}
                </Typography>
                <RTLTextField
                  type="date"
                  value={formData?.exempted_till_date || ''}
                  onChange={handleFieldChange('exempted_till_date')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default TaxesSection; 