import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const RoutingSection = React.memo(({ formData, onFormDataChange, isRTL, t, salesmen, handleFieldChange, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'var(--muted)' : 'rgb(249 250 251)';
  };

  React.useEffect(() => {
    if (allCollapsed && expanded) {
      onAccordionChange(null, false);
      setAllCollapsed(false);
    }
  }, [allCollapsed]);
  return (
    <Accordion 
      expanded={expanded} 
      onChange={onAccordionChange}
      sx={{
        backgroundColor: getBackgroundColor(),
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        boxShadow: 'none'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="routing-content"
        id="routing-header"
        sx={{
          backgroundColor: getBackgroundColor(),
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t('management.routingAccordion') || 'Routing'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: getBackgroundColor()
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.routingSalesmen') || 'Salesmen'}
            </Typography>
            <RTLTextField
              value={(() => {
                if (formData?.salesman_id && Array.isArray(salesmen)) {
                  const selected = salesmen.find(s => s.id === formData.salesman_id);
                  return selected ? selected.name : '';
                }
                return '';
              })()}
              InputProps={{ readOnly: true }}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
              {t('management.routingType') || 'Routing Type'}
            </Typography>
            <RTLTextField
              select
              value={formData?.routing_type || ''}
              onChange={handleFieldChange('routing_type')}
              SelectProps={{ native: true }}
            >
              <option value="">{t('management.routingType') || 'Routing Type'}</option>
              <option value="byWeek">{t('management.byWeek') || 'By Week'}</option>
              <option value="byWeekly">{t('management.byWeekly') || 'By Bi-Weekly'}</option>
              <option value="byMonth">{t('management.byMonth') || 'By Month'}</option>
            </RTLTextField>
          </Grid>
          {formData?.routing_type === 'byWeek' && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.selectDayOfWeek') || 'Select Day of the Week'}
              </Typography>
              <RTLTextField
                select
                value={formData?.routing_day_of_week || ''}
                onChange={handleFieldChange('routing_day_of_week')}
                SelectProps={{ native: true }}
              >
                <option value="">{t('management.selectDayOfWeek') || 'Select Day of the Week'}</option>
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </RTLTextField>
            </Grid>
          )}
          {formData?.routing_type === 'byWeekly' && (
            <>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.selectTwoDays') || 'Select Two Days'}
                </Typography>
                <RTLTextField
                  select
                  value={formData?.routing_first_day || ''}
                  onChange={handleFieldChange('routing_first_day')}
                  SelectProps={{ native: true }}
                >
                  <option value="">{t('management.selectTwoDays') || 'Select Two Days'}</option>
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </RTLTextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  {t('management.selectTwoDays') || 'Select Two Days'}
                </Typography>
                <RTLTextField
                  select
                  value={formData?.routing_second_day || ''}
                  onChange={handleFieldChange('routing_second_day')}
                  SelectProps={{ native: true }}
                >
                  <option value="">{t('management.selectTwoDays') || 'Select Two Days'}</option>
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </RTLTextField>
              </Grid>
            </>
          )}
          {formData?.routing_type === 'byMonth' && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
                {t('management.selectDayOfMonth') || 'Select Day of the Month'}
              </Typography>
              <RTLTextField
                type="number"
                value={formData?.routing_day_of_month || ''}
                onChange={handleFieldChange('routing_day_of_month')}
                placeholder=""
                inputProps={{ min: 1, max: 31 }}
              />
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default RoutingSection; 