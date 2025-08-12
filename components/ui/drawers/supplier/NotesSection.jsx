import React from "react";
import { Typography, Box } from "@mui/material";
import RTLTextField from "@/components/ui/RTLTextField";

const NotesSection = React.memo(({ 
  notes, 
  onNotesChange, 
  isRTL, 
  t 
}) => {
  return (
    <Box sx={{ 
      mt: 4,
      backgroundColor: 'rgb(249 250 251)',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 0,
      p: 2
    }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2, textAlign: isRTL ? 'right' : 'left' }}>
        {t('management.notes') || 'Notes'}
      </Typography>
      <RTLTextField
        value={notes || ''}
        onChange={(e) => onNotesChange(e.target.value)}
        multiline
        rows={4}
        placeholder={t('management.enterNotes') || 'Enter notes about this supplier...'}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper'
          }
        }}
      />
    </Box>
  );
});

export default NotesSection;
