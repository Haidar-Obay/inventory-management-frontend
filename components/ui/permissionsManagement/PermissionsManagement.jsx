"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useTranslations, useLocale } from "next-intl";
import { useSimpleToast } from "../simple-toast";
import { getRoles, getRolePermissions, updateRolePermissions } from "@/API/Roles";

const PermissionsManagement = () => {
  const t = useTranslations("settings");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { addToast } = useSimpleToast();

  // State management
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState({});
  const [originalPermissions, setOriginalPermissions] = useState({});
  const [permissionActions, setPermissionActions] = useState([]);
  const [permissionMapping, setPermissionMapping] = useState({});
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Permission structure - will be populated from API

  const permissionTypes = [
    { key: "allowView", label: t("allowView") || "Allow View" },
    { key: "allowAdd", label: t("allowAdd") || "Allow Add" },
    { key: "allowEdit", label: t("allowEdit") || "Allow Edit" },
    { key: "allowDelete", label: t("allowDelete") || "Allow Delete" },
  ];

  // Initialize permissions structure with dynamic actions
  const initializePermissionsWithActions = (actions) => {
    const initialPermissions = {};
    actions.forEach((action) => {
      initialPermissions[action.key] = {};
      permissionTypes.forEach((type) => {
        initialPermissions[action.key][type.key] = false;
      });
    });
    return initialPermissions;
  };

  // Initialize permissions structure (legacy - for backward compatibility)
  const initializePermissions = () => {
    const defaultActions = getPermissionActions(null);
    return initializePermissionsWithActions(defaultActions);
  };

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      if (response.status === "success") {
        setRoles(response.data || []);
        // Initialize permissions for all roles
        const rolePermissions = {};
        response.data.forEach((role) => {
          rolePermissions[role.id] = initializePermissions();
        });
        setPermissions(rolePermissions);
        setOriginalPermissions(JSON.parse(JSON.stringify(rolePermissions)));
      } else {
        addToast({
          title: t("error") || "Error",
          description: t("fetchRolesError") || "Failed to fetch roles",
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      addToast({
        title: t("error") || "Error",
        description: error.message || t("fetchRolesError") || "Failed to fetch roles",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Transform API permissions data to expected format
  const transformPermissionsData = (apiData) => {
    const transformedPermissions = {};
    
    if (apiData && apiData.permissions) {
      apiData.permissions.forEach(permission => {
        const actionKey = permission.resource_key;
        transformedPermissions[actionKey] = {
          allowView: permission.can_view || false,
          allowAdd: permission.can_add || false,
          allowEdit: permission.can_edit || false,
          allowDelete: permission.can_delete || false,
        };
      });
    }
    
    return transformedPermissions;
  };

  // Get permission actions from API data or use defaults
  const getPermissionActions = (apiData) => {
    if (apiData && apiData.permissions) {
      return apiData.permissions.map(permission => ({
        key: permission.resource_key,
        label: permission.resource_label
      }));
    }
    // Fallback to default actions if no API data
    return [
      { key: "users", label: "User Management" },
      { key: "roles", label: "Role Management" },
      { key: "permissions", label: "Permission Management" },
    ];
  };

  // Create permission mapping for API calls
  const createPermissionMapping = (apiData) => {
    const mapping = {};
    if (apiData && apiData.permissions) {
      apiData.permissions.forEach(permission => {
        mapping[permission.resource_key] = {
          id: permission.id,
          can_view: permission.can_view,
          can_add: permission.can_add,
          can_edit: permission.can_edit,
          can_delete: permission.can_delete
        };
      });
    }
    return mapping;
  };

  // Load permissions for selected role
  const loadRolePermissions = async (roleId) => {
    if (!roleId) return;
    
    try {
      setRoleLoading(true);
      setSelectedRole(roleId);
      
      // Try to fetch existing permissions from API
      try {
        const response = await getRolePermissions(roleId);
        if (response.status === "success" && response.data) {
          const transformedPermissions = transformPermissionsData(response.data);
          const actions = getPermissionActions(response.data);
          const mapping = createPermissionMapping(response.data);
          setPermissionActions(actions);
          setPermissionMapping(prev => ({
            ...prev,
            [roleId]: mapping
          }));
          setPermissions(prev => ({
            ...prev,
            [roleId]: transformedPermissions
          }));
          setOriginalPermissions(prev => ({
            ...prev,
            [roleId]: JSON.parse(JSON.stringify(transformedPermissions))
          }));
        } else {
          // If no permissions found, use default structure
          const defaultActions = getPermissionActions(null);
          const defaultPermissions = initializePermissionsWithActions(defaultActions);
          setPermissionActions(defaultActions);
          setPermissions(prev => ({
            ...prev,
            [roleId]: defaultPermissions
          }));
          setOriginalPermissions(prev => ({
            ...prev,
            [roleId]: JSON.parse(JSON.stringify(defaultPermissions))
          }));
        }
      } catch (error) {
        // If API call fails, use default structure
        console.warn("Could not fetch role permissions, using defaults:", error);
        const defaultActions = getPermissionActions(null);
        const defaultPermissions = initializePermissionsWithActions(defaultActions);
        setPermissionActions(defaultActions);
        setPermissions(prev => ({
          ...prev,
          [roleId]: defaultPermissions
        }));
        setOriginalPermissions(prev => ({
          ...prev,
          [roleId]: JSON.parse(JSON.stringify(defaultPermissions))
        }));
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error("Error loading role permissions:", error);
      addToast({
        title: t("error") || "Error",
        description: error.message || t("loadPermissionsError") || "Failed to load permissions",
        type: "error",
        duration: 3000,
      });
    } finally {
      setRoleLoading(false);
    }
  };

  // Handle permission change
  const handlePermissionChange = (action, type, checked) => {
    if (!selectedRole) return;

    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [action]: {
          ...(prev[selectedRole]?.[action] || {}),
          [type]: checked,
        },
      },
    }));

    // Check if there are changes
    const newPermissions = {
      ...permissions,
      [selectedRole]: {
        ...permissions[selectedRole],
        [action]: {
          ...permissions[selectedRole][action],
          [type]: checked,
        },
      },
    };

    setHasChanges(
      JSON.stringify(newPermissions[selectedRole]) !==
        JSON.stringify(originalPermissions[selectedRole])
    );
  };

  // Handle select all permissions for an action
  const handleSelectAllForAction = (action, checked) => {
    if (!selectedRole) return;

    const newPermissions = { ...permissions };
    permissionTypes.forEach((type) => {
      newPermissions[selectedRole][action][type.key] = checked;
    });

    setPermissions(newPermissions);

    // Check if there are changes
    setHasChanges(
      JSON.stringify(newPermissions[selectedRole]) !==
        JSON.stringify(originalPermissions[selectedRole])
    );
  };

  // Handle select all permissions for a type
  const handleSelectAllForType = (type, checked) => {
    if (!selectedRole) return;

    const newPermissions = { ...permissions };
    permissionActions.forEach((action) => {
      newPermissions[selectedRole][action.key][type] = checked;
    });

    setPermissions(newPermissions);

    // Check if there are changes
    setHasChanges(
      JSON.stringify(newPermissions[selectedRole]) !==
        JSON.stringify(originalPermissions[selectedRole])
    );
  };

  // Save permissions
  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      setSaving(true);
      
      // Call API to save permissions
      const response = await updateRolePermissions(
        selectedRole, 
        permissions[selectedRole], 
        permissionMapping[selectedRole]
      );
      
      if (response.status === "success") {
        // Update the original permissions to mark as saved
        setOriginalPermissions((prev) => ({
          ...prev,
          [selectedRole]: JSON.parse(JSON.stringify(permissions[selectedRole])),
        }));
        
        setHasChanges(false);
        
        addToast({
          title: t("success") || "Success",
          description: t("permissionsSavedSuccessfully") || "Permissions saved successfully",
          type: "success",
          duration: 3000,
        });
      } else {
        throw new Error(response.message || t("permissionsSaveError") || "Failed to save permissions");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      addToast({
        title: t("error") || "Error",
        description: error.message || t("permissionsSaveError") || "Failed to save permissions",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset permissions to original state
  const handleResetPermissions = () => {
    if (!selectedRole) return;
    
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: JSON.parse(JSON.stringify(originalPermissions[selectedRole])),
    }));
    setHasChanges(false);
  };

  // Check if all permissions are selected for an action
  const isAllSelectedForAction = (action) => {
    if (!selectedRole || !permissions[selectedRole]) return false;
    const actionPermissions = permissions[selectedRole][action];
    if (!actionPermissions) return false;
    return permissionTypes.every((type) => actionPermissions[type.key] === true);
  };

  // Check if all permissions are selected for a type
  const isAllSelectedForType = (type) => {
    if (!selectedRole || !permissions[selectedRole]) return false;
    return permissionActions.every((action) => {
      const actionPermissions = permissions[selectedRole][action.key];
      return actionPermissions && actionPermissions[type] === true;
    });
  };

  // Get selected role data
  const selectedRoleData = roles.find((role) => role.id === selectedRole);

  // Initialize component
  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <Box className="p-0">
      {/* Header with Role select (left) and refresh (right) */}
      <Box className="flex justify-between items-center mb-6">
        {/* Compact Role selector */}
        <Box className="flex items-center space-x-3">
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel>{t("selectRole") || "Select Role"}</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => loadRolePermissions(e.target.value)}
              label={t("selectRole") || "Select Role"}
              disabled={loading || roleLoading}
              MenuProps={{
                PaperProps: {
                  className: 'role-permissions-surface',
                },
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box className="flex items-center space-x-2">
          <Tooltip title={t("refresh") || "Refresh"}>
            <IconButton 
              size="small" 
              onClick={fetchRoles}
              disabled={loading || roleLoading}
            >
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Permissions Grid */}
      {selectedRole && selectedRoleData && permissionActions.length > 0 && (
        <Card className="role-permissions-surface">
          <CardContent>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">
                {t("permissions") || "Permissions"} - {selectedRoleData.name}
              </Typography>
              <Box className="flex items-center space-x-2">
                {hasChanges && (
                  <Chip
                    label={t("unsavedChanges") || "Unsaved Changes"}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                )}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={handleResetPermissions}
                  disabled={!hasChanges || saving}
                >
                  {t("reset") || "Reset"}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSavePermissions}
                  disabled={!hasChanges || saving}
                >
                  {saving ? t("saving") || "Saving..." : t("save") || "Save"}
                </Button>
              </Box>
            </Box>

            <Divider className="mb-4" />

            {/* Loader while role permissions are loading */}
            {(roleLoading || loading) ? (
              <Box className="flex items-center justify-center py-12">
                <CircularProgress />
              </Box>
            ) : (
            /* Permissions Table */
            <Box className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-700 p-3 text-center min-w-[120px] diagonal-header">
                      <Box className="relative h-10">
                        <Typography variant="subtitle2" className="absolute top-0 right-0">
                        {t("action") || "Action"}
                        </Typography>
                        <Typography variant="subtitle2" className="font-semibold absolute bottom-0 left-3">
                          {t("permission") || "Permission"}
                        </Typography>
                      </Box>
                    </th>
                    {permissionTypes.map((type) => (
                      <th key={type.key} className="border border-gray-300 dark:border-gray-700 p-3 text-center min-w-[120px]">
                        <Box className="flex flex-col items-center space-y-1">
                          <Typography variant="subtitle2" className="font-semibold">
                            {type.label}
                          </Typography>
                          <Checkbox
                            checked={isAllSelectedForType(type.key)}
                            indeterminate={
                              !isAllSelectedForType(type.key) &&
                              permissionActions.some((action) => {
                                const actionPermissions = permissions[selectedRole][action.key];
                                return actionPermissions && actionPermissions[type.key] === true;
                              })
                            }
                            onChange={(e) => handleSelectAllForType(type.key, e.target.checked)}
                            size="small"
                          />
                        </Box>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionActions.map((action) => (
                    <tr key={action.key}>
                      <td className="border border-gray-300 dark:border-gray-700 p-3">
                        <Box className="flex items-center space-x-2">
                          <Checkbox
                            checked={isAllSelectedForAction(action.key)}
                            indeterminate={
                              !isAllSelectedForAction(action.key) &&
                              permissionTypes.some((type) => {
                                const actionPermissions = permissions[selectedRole][action.key];
                                return actionPermissions && actionPermissions[type.key] === true;
                              })
                            }
                            onChange={(e) => handleSelectAllForAction(action.key, e.target.checked)}
                            size="small"
                          />
                          <Typography variant="body2" className="font-medium">
                            {action.label}
                          </Typography>
                        </Box>
                      </td>
                      {permissionTypes.map((type) => (
                        <td key={type.key} className="border border-gray-300 dark:border-gray-700 p-3 text-center">
                          <Checkbox
                            checked={permissions[selectedRole]?.[action.key]?.[type.key] || false}
                            onChange={(e) => handlePermissionChange(action.key, type.key, e.target.checked)}
                            size="small"
                            color="primary"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            )}

            {/* Legend */}
            <Box className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Typography variant="caption" color="text.secondary">
                <strong>{t("legend") || "Legend"}:</strong> {t("permissionsLegend") || "Check the boxes to grant permissions. Use the checkboxes in headers to select all permissions for that action or type."}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && roles.length === 0 && (
        <Card className="role-permissions-surface">
          <CardContent className="text-center py-12">
            <SecurityIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" className="mb-2">
              {t("noRolesAvailable") || "No Roles Available"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("createRolesFirst") || "Please create roles first before managing permissions."}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && !selectedRole && (
        <Card className="role-permissions-surface">
          <CardContent className="text-center py-12">
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" className="mt-2">
              {t("loading") || "Loading..."}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PermissionsManagement;
