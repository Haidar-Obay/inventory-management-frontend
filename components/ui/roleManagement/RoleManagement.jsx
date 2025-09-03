"use client";

import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Card, 
  CardContent, 
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon
} from "@mui/icons-material";
import { useTranslations, useLocale } from "next-intl";
import { useDrawerStack } from "../DrawerStackContext";
import { useSimpleToast } from "../simple-toast";
import { 
  getRoles, 
  createRole, 
  updateRole, 
  deleteRole, 
  importRolesFromExcel,
  bulkDeleteRoles
} from "@/API/Roles";

const RoleManagement = () => {
  const t = useTranslations("settings");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { openDrawer, closeTopDrawer } = useDrawerStack();
  const { addToast } = useSimpleToast();

  // State for roles data
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  
  // Filter states
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [bulkActionAnchorEl, setBulkActionAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'name'
  });

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      if (response.status === "success") {
        setRoles(response.data);
      } else {
        addToast({
          title: t("error"),
          description: t("fetchRolesError"),
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      addToast({
        title: t("error"),
        description: error.message || t("fetchRolesError"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles based on search term and filters
  useEffect(() => {
    let filtered = [...roles];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(role => 
        filters.status === 'active' ? role.active : !role.active
      );
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(role => {
        const createdDate = new Date(role.created_at);
        switch (filters.dateRange) {
          case 'last7days':
            return createdDate >= sevenDaysAgo;
          case 'last30days':
            return createdDate >= thirtyDaysAgo;
          case 'thisYear':
            return createdDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'updatedAt':
          return new Date(b.updated_at) - new Date(a.updated_at);
        default:
          return 0;
      }
    });
    
    setFilteredRoles(filtered);
  }, [searchTerm, roles, filters]);

  // Handle add new role
  const handleAddRole = () => {
    openDrawer({
      type: "role",
      props: {
        onSave: handleSaveRole,
        onSaveAndNew: handleSaveAndNewRole,
        onSaveAndClose: handleSaveAndCloseRole,
      },
    });
  };

  // Handle edit role
  const handleEditRole = (role) => {
    openDrawer({
      type: "role",
      props: {
        editData: role,
        onSave: handleSaveRole,
        onSaveAndNew: handleSaveAndNewRole,
        onSaveAndClose: handleSaveAndCloseRole,
      },
    });
  };

  // Handle delete role
  const handleDeleteRole = async (role) => {
    try {
      setLoading(true);
      await deleteRole(role.id);
      // Refresh the roles list after successful deletion
      await fetchRoles();
      addToast({
        title: t("success"),
        description: t("roleDeletedSuccessfully"),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      addToast({
        title: t("error"),
        description: error.message || t("roleDeleteError"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle save role
  const handleSaveRole = async (roleData) => {
    try {
      setLoading(true);
      if (roleData.id) {
        // Edit existing role
        await updateRole(roleData.id, roleData);
        addToast({
          title: t("success"),
          description: t("roleUpdatedSuccessfully"),
          type: "success",
          duration: 3000,
        });
      } else {
        // Add new role
        await createRole(roleData);
        addToast({
          title: t("success"),
          description: t("roleCreatedSuccessfully"),
          type: "success",
          duration: 3000,
        });
      }
      // Refresh the roles list after successful save
      await fetchRoles();
    } catch (error) {
      console.error("Error saving role:", error);
      addToast({
        title: t("error"),
        description: error.message || t("roleSaveError"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle save and new
  const handleSaveAndNewRole = async (roleData) => {
    try {
      setLoading(true);
      if (roleData.id) {
        // Edit existing role
        await updateRole(roleData.id, roleData);
        addToast({
          title: t("success"),
          description: t("roleUpdatedSuccessfully"),
          type: "success",
          duration: 3000,
        });
      } else {
        // Add new role
        await createRole(roleData);
        addToast({
          title: t("success"),
          description: t("roleCreatedSuccessfully"),
          type: "success",
          duration: 3000,
        });
      }
      // Refresh the roles list after successful save
      await fetchRoles();
    } catch (error) {
      console.error("Error saving role:", error);
      addToast({
        title: t("error"),
        description: error.message || t("roleSaveError"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle save and close
  const handleSaveAndCloseRole = async (roleData) => {
    try {
      setLoading(true);
      if (roleData.id) {
        // Edit existing role
        await updateRole(roleData.id, roleData);
        addToast({
          title: t("success"),
          description: t("roleUpdatedSuccessfully"),
          type: "success",
          duration: 3000,
        });
      } else {
        // Add new role
        await createRole(roleData);
        addToast({
          title: t("success"),
          description: t("roleCreatedSuccessfully"),
          type: "success",
          duration: 3000,
        });
      }
      // Refresh the roles list after successful save
      await fetchRoles();
    } catch (error) {
      console.error("Error saving role:", error);
      addToast({
        title: t("error"),
        description: error.message || t("roleSaveError"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await fetchRoles();
      setSearchTerm("");
      setFilters({
        status: 'all',
        dateRange: 'all',
        sortBy: 'name'
      });
      setExpandedDescriptions({});
    } catch (error) {
      addToast({
        title: t("error"),
        description: error.message || t("refreshError"),
        type: "error",
        duration: 3000,
      });
    }
  };



  // Handle menu open
  const handleMenuOpen = (event, role) => {
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  // Handle menu action
  const handleMenuAction = (action) => {
    if (selectedRole) {
      if (action === 'edit') {
        handleEditRole(selectedRole);
      } else if (action === 'delete') {
        handleDeleteRole(selectedRole);
      }
    }
    handleMenuClose();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US");
  };

  // Handle description expansion
  const handleDescriptionToggle = (roleId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  // Truncate text to specific character limit
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Handle filter menu open/close
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };



  // Handle role selection for bulk operations
  const handleRoleSelection = (roleId, isSelected) => {
    if (isSelected) {
      setSelectedRoles(prev => [...prev, roleId]);
    } else {
      setSelectedRoles(prev => prev.filter(id => id !== roleId));
    }
  };

  // Handle select all roles
  const handleSelectAll = () => {
    if (selectedRoles.length === filteredRoles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(filteredRoles.map(role => role.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRoles.length === 0) return;
    
    try {
      setLoading(true);
      await bulkDeleteRoles(selectedRoles);
      await fetchRoles();
      setSelectedRoles([]);
      addToast({
        title: t("success"),
        description: t("bulkDeleteSuccess"),
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error bulk deleting roles:", error);
      addToast({
        title: t("error"),
        description: error.message || t("bulkDeleteError"),
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk action menu open/close
  const handleBulkActionMenuOpen = (event) => {
    setBulkActionAnchorEl(event.currentTarget);
  };

  const handleBulkActionMenuClose = () => {
    setBulkActionAnchorEl(null);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      sortBy: 'name'
    });
  };

  return (
    <Box className="p-0">
      {/* Header Section with Search and Add Role */}
      <Box className="flex justify-between items-center mb-6">
        <Box className="flex items-center space-x-2">
          <TextField
            size="small"
            placeholder={t("searchRoles")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Tooltip title={t("filter")}>
            <IconButton 
              size="small" 
              onClick={handleFilterMenuOpen}
              sx={{ 
                backgroundColor: Object.values(filters).some(f => f !== 'all') ? 'primary.main' : 'transparent',
                color: Object.values(filters).some(f => f !== 'all') ? 'white' : 'inherit'
              }}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box className="flex items-center space-x-2">
          <Tooltip title={t("refresh")}>
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRole}
            className="ml-4"
          >
            {t("addRole")}
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box className="text-center py-12">
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" className="mt-2">
            {t("loading")}
          </Typography>
        </Box>
      )}

                   {/* Roles Grid */}
      <Grid container spacing={3}>
                         {filteredRoles.map((role) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={role.id}>
            <Card 
              className="role-permissions-surface"
              className="hover:shadow-lg transition-shadow duration-200"
              sx={{ 
                border: role.active ? '2px solid #1976d2' : '2px solid #e0e0e0',
                opacity: role.active ? 1 : 0.7,
                height: '320px',
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
                                           <CardContent className="pb-2" sx={{ overflow: 'hidden', height: '100%', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                {/* Role Header */}
                <Box className="flex justify-between items-start mb-3" sx={{ flexShrink: 0 }}>
                  <Box className="flex-1">
                    <Typography variant="h6" className="font-semibold mb-1">
                      {role.name}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, role)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                 {/* Description */}
                 <Box className="mb-3" sx={{ height: '80px', overflow: 'hidden', flexShrink: 0 }}>
                   <Typography 
                     variant="body2" 
                     color="text.secondary" 
                     sx={{
                       lineHeight: '1.4rem',
                       height: '80px',
                       overflow: 'hidden',
                       wordWrap: 'break-word',
                       cursor: 'pointer'
                     }}
                     onClick={() => handleDescriptionToggle(role.id)}
                   >
                     {expandedDescriptions[role.id] 
                       ? role.description 
                       : truncateText(role.description, 100)
                     }
                   </Typography>
                   {role.description && role.description.length > 100 && (
                     <Typography 
                       variant="caption" 
                       color="primary" 
                       sx={{ 
                         cursor: 'pointer',
                         '&:hover': { textDecoration: 'underline' },
                         display: 'block',
                         marginTop: '4px'
                       }}
                       onClick={() => handleDescriptionToggle(role.id)}
                     >
                       {expandedDescriptions[role.id] ? t("showLess") : t("showMore")}
                     </Typography>
                   )}
                 </Box>

                {/* Status and Dates */}
                <Box className="space-y-2" sx={{ height: '80px', marginTop: 'auto', flexShrink: 0 }}>
                  <Box className="flex justify-between items-center">
                    <Typography variant="caption" color="text.secondary">
                      {t("status")}:
                    </Typography>
                    <Chip
                      label={role.active ? t("active") : t("inactive")}
                      color={role.active ? "success" : "default"}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box className="flex justify-between items-center">
                    <Typography variant="caption" color="text.secondary">
                      {t("createdAt")}:
                    </Typography>
                    <Typography variant="caption">
                      {formatDate(role.created_at)}
                    </Typography>
                  </Box>
                  
                  <Box className="flex justify-between items-center">
                    <Typography variant="caption" color="text.secondary">
                      {t("updatedAt")}:
                    </Typography>
                    <Typography variant="caption">
                      {formatDate(role.updated_at)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* Card Actions - Removed, actions only available via three dots menu */}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredRoles.length === 0 && !loading && (
        <Box className="text-center py-12">
          <Typography variant="h6" color="text.secondary" className="mb-2">
            {searchTerm ? t("noRolesFound") : t("noRolesYet")}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            {searchTerm ? t("tryDifferentSearch") : t("createFirstRole")}
          </Typography>
          {/* {!searchTerm && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddRole}
            >
              {t("addRole")}
            </Button>
          )} */}
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("edit")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("delete")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ minWidth: '250px' }}
      >
        {/* Status Filter */}
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {t("status")}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { value: 'all', label: t("all") },
                { value: 'active', label: t("active") },
                { value: 'inactive', label: t("inactive") }
              ].map((option) => (
                <Box key={option.value} sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id={`status-${option.value}`}
                    name="status"
                    value={option.value}
                    checked={filters.status === option.value}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  />
                  <label htmlFor={`status-${option.value}`} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                    {option.label}
                  </label>
                </Box>
              ))}
            </Box>
          </Box>
        </MenuItem>

        {/* Date Range Filter */}
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {t("dateRange")}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { value: 'all', label: t("all") },
                { value: 'last7days', label: t("last7Days") },
                { value: 'last30days', label: t("last30Days") },
                { value: 'thisYear', label: t("thisYear") }
              ].map((option) => (
                <Box key={option.value} sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id={`date-${option.value}`}
                    name="dateRange"
                    value={option.value}
                    checked={filters.dateRange === option.value}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  />
                  <label htmlFor={`date-${option.value}`} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                    {option.label}
                  </label>
                </Box>
              ))}
            </Box>
          </Box>
        </MenuItem>

        {/* Sort By Filter */}
        <MenuItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {t("sortBy")}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { value: 'name', label: t("name") },
                { value: 'createdAt', label: t("createdAt") },
                { value: 'updatedAt', label: t("updatedAt") }
              ].map((option) => (
                <Box key={option.value} sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id={`sort-${option.value}`}
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  />
                  <label htmlFor={`sort-${option.value}`} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                    {option.label}
                  </label>
                </Box>
              ))}
            </Box>
          </Box>
        </MenuItem>

        {/* Clear Filters */}
        <MenuItem onClick={clearFilters}>
          <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
            {t("clearFilters")}
          </Typography>
        </MenuItem>
      </Menu>


    </Box>
  );
};

export default RoleManagement;
