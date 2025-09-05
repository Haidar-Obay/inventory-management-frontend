import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Avatar, Divider, useTheme } from '@mui/material';
import { Person, Email, CalendarToday, Security, CheckCircle, Cancel } from '@mui/icons-material';

const UserCard = ({ user }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card 
      sx={{ 
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        backgroundColor: getBackgroundColor(),
        border: isDarkMode ? '1px solid hsl(220 14% 23%)' : '1px solid hsl(220 13% 91%)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDarkMode ? '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)' : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* User Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: user.active ? (isDarkMode ? 'hsl(226 71% 40%)' : 'hsl(246 84% 59%)') : (isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)'),
              color: user.active ? 'white' : (isDarkMode ? 'hsl(0 0% 100%)' : 'hsl(0 0% 9%)'),
              width: 48,
              height: 48,
              mr: 2,
              fontSize: '1.2rem'
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              {user.active ? (
                <CheckCircle sx={{ color: isDarkMode ? 'hsl(120 60% 50%)' : 'hsl(120 60% 50%)', fontSize: 16, mr: 0.5 }} />
              ) : (
                <Cancel sx={{ color: isDarkMode ? 'hsl(350 89% 60%)' : 'hsl(350 89% 60%)', fontSize: 16, mr: 0.5 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: user.active ? (isDarkMode ? 'hsl(120 60% 50%)' : 'hsl(120 60% 50%)') : (isDarkMode ? 'hsl(350 89% 60%)' : 'hsl(350 89% 60%)')
                }}
              >
                {user.active ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2, borderColor: isDarkMode ? 'hsl(220 14% 23%)' : 'hsl(220 13% 91%)' }} />

        {/* User Details */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Email sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)', fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)', wordBreak: 'break-all' }}>
              {user.email}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarToday sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)', fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)' }}>
              Created: {formatDate(user.created_at)}
            </Typography>
          </Box>
        </Box>

        {/* Roles Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Security sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)', fontSize: 18, mr: 1 }} />
            <Typography variant="body2" sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)', fontWeight: 500 }}>
              Roles ({user.roles?.length || 0})
            </Typography>
          </Box>
          
          {user.roles && user.roles.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.roles.map((role) => (
                <Chip
                  key={role.id}
                  label={role.name}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: 24,
                    borderColor: isDarkMode ? 'hsl(226 71% 40%)' : 'hsl(246 84% 59%)',
                    color: isDarkMode ? 'hsl(226 71% 40%)' : 'hsl(246 84% 59%)',
                    backgroundColor: isDarkMode ? 'hsl(226 71% 40% / 0.1)' : 'hsl(246 84% 59% / 0.1)',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: isDarkMode ? 'hsl(215 20% 50%)' : 'hsl(220 9% 30%)', fontStyle: 'italic' }}>
              No roles assigned
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
