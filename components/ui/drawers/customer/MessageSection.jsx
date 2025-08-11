import React from "react";
import { Typography, Button, Box, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RTLTextField from "@/components/ui/RTLTextField";

const MessageSection = React.memo(({ showMessageField, setShowMessageField, message, setMessage, isRTL, t }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'var(--muted)' : 'rgb(249 250 251)';
  };

  return (
    <Box sx={{ 
      mt: 4,
      backgroundColor: getBackgroundColor(),
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 0,
      p: 2
    }}>
      {!showMessageField && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setShowMessageField(true)}
          sx={{ mb: 2 }}
          fullWidth
        >
          {t('management.addMessage') || 'Add a message'}
        </Button>
      )}
      {showMessageField && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: isRTL ? 'right' : 'left' }}>
            {t('management.message') || 'Message'}
          </Typography>
          <RTLTextField
            value={message}
            onChange={e => setMessage(e.target.value)}
            multiline
            rows={3}
            placeholder={t('management.enterMessage') || 'Enter your message...'}
            fullWidth
          />
        </Box>
      )}
    </Box>
  );
});

export default MessageSection; 