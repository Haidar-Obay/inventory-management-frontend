import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert, 
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  useTheme,
  Tooltip
} from '@mui/material';
import { Search, Refresh, FilterList } from '@mui/icons-material';
import UserCard from './UserCard';
import { getUsers } from '../../../API/Users';

const UserManagement = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get background color based on theme
  const getBackgroundColor = () => {
    return isDarkMode ? 'rgb(16 20 29)' : 'rgb(249 250 251)';
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUsers();
      
      if (response && response.users) {
        setUsers(response.users);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchUsers}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Search and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Tooltip title="Filter">
            <IconButton 
              size="small" 
              sx={{ 
                backgroundColor: 'transparent',
                color: 'inherit'
              }}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={`Total: ${users.length}`} 
              variant="outlined"
              size="small"
              sx={{
                borderColor: isDarkMode ? 'hsl(226 71% 40%)' : 'hsl(246 84% 59%)',
                color: isDarkMode ? 'hsl(226 71% 40%)' : 'hsl(246 84% 59%)',
                backgroundColor: isDarkMode ? 'hsl(226 71% 40% / 0.1)' : 'hsl(246 84% 59% / 0.1)'
              }}
            />
            <Chip 
              label={`Active: ${users.filter(u => u.active).length}`} 
              variant="outlined"
              size="small"
              sx={{
                borderColor: isDarkMode ? 'hsl(120 60% 50%)' : 'hsl(120 60% 50%)',
                color: isDarkMode ? 'hsl(120 60% 50%)' : 'hsl(120 60% 50%)',
                backgroundColor: isDarkMode ? 'hsl(120 60% 50% / 0.1)' : 'hsl(120 60% 50% / 0.1)'
              }}
            />
            <Chip 
              label={`Inactive: ${users.filter(u => !u.active).length}`} 
              variant="outlined"
              size="small"
              sx={{
                borderColor: isDarkMode ? 'hsl(350 89% 60%)' : 'hsl(350 89% 60%)',
                color: isDarkMode ? 'hsl(350 89% 60%)' : 'hsl(350 89% 60%)',
                backgroundColor: isDarkMode ? 'hsl(350 89% 60% / 0.1)' : 'hsl(350 89% 60% / 0.1)'
              }}
            />
          </Box>
          
          {/* Refresh Button */}
          <Tooltip title="Refresh">
            <IconButton onClick={fetchUsers}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ mb: 1, color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)' }}>
            {searchTerm ? 'No users match your search' : 'No users found'}
          </Typography>
          <Typography variant="body2" sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)' }}>
            {searchTerm ? 'Try adjusting your search criteria' : 'Users will appear here once they are added to the system'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
              <UserCard user={user} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Results Summary */}
      {filteredUsers.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: isDarkMode ? 'hsl(215 20% 70%)' : 'hsl(220 9% 46%)' }}>
            Showing {filteredUsers.length} of {users.length} users
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserManagement;
