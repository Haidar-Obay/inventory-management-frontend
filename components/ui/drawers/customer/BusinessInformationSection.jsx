import React from "react";
import { Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RTLTextField from "@/components/ui/RTLTextField";

const BusinessInformationSection = React.memo(({ formData, onFormDataChange, isRTL, t, searchTerms, newSearchTerm, setNewSearchTerm, handleAddSearchTerm, handleRemoveSearchTerm, handleSearchTermKeyPress, expanded, onAccordionChange, allCollapsed, setAllCollapsed }) => {
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
        aria-controls="business-info-content"
        id="business-info-header"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {t("management.businessInformation") || "Business Information"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.fileNumber") || "File Number"}
            </Typography>
            <RTLTextField
              value={formData?.file_number || ""}
              onChange={e => onFormDataChange({ ...formData, file_number: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.barcode") || "Barcode"}
            </Typography>
            <RTLTextField
              value={formData?.barcode || ""}
              onChange={e => onFormDataChange({ ...formData, barcode: e.target.value })}
              placeholder=""
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? "right" : "left" }}>
              {t("management.searchTerms") || "Search Terms"}
            </Typography>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <RTLTextField
                  value={newSearchTerm}
                  onChange={e => setNewSearchTerm(e.target.value)}
                  onKeyPress={handleSearchTermKeyPress}
                  placeholder={t("management.addSearchTerm") || "Add search term..."}
                  sx={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  onClick={handleAddSearchTerm}
                  disabled={!newSearchTerm.trim()}
                  style={{ padding: '4px 12px', fontSize: '0.75rem', textTransform: 'none', border: '1px solid #ccc', borderRadius: 4, background: '#fff', cursor: 'pointer' }}
                >
                  {t("management.add") || "Add"}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {searchTerms && searchTerms.map((term, index) => (
                  <span key={index} style={{ border: '1px solid #1976d2', borderRadius: 16, padding: '2px 12px', color: '#1976d2', display: 'flex', alignItems: 'center', marginRight: 8 }}>
                    {term}
                    <button
                      type="button"
                      onClick={() => handleRemoveSearchTerm(term)}
                      style={{ marginLeft: 8, color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
});

export default BusinessInformationSection; 