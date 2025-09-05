import TenantApiService from './TenantApiService';

// Get all roles
export const getRoles = async () => {
  try {
    const response = await TenantApiService('GET', 'roles');
    return response;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Create a new role
export const createRole = async (roleData) => {
  try {
    const response = await TenantApiService('POST', 'roles', roleData);
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Get a specific role
export const getRole = async (roleId) => {
  try {
    const response = await TenantApiService('GET', `roles/${roleId}`);
    return response;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};

// Update a specific role
export const updateRole = async (roleId, roleData) => {
  try {
    const response = await TenantApiService('PUT', `roles/${roleId}`, roleData);
    return response;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Delete a specific role
export const deleteRole = async (roleId) => {
  try {
    const response = await TenantApiService('DELETE', `roles/${roleId}`);
    return response;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};



// Import roles from Excel
export const importRolesFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await TenantApiService('POST', 'roles/import/excel', formData);
    return response;
  } catch (error) {
    console.error('Error importing roles from Excel:', error);
    throw error;
  }
};

// Bulk delete roles
export const bulkDeleteRoles = async (roleIds) => {
  try {
    const response = await TenantApiService('DELETE', 'roles/bulk-delete', { role_ids: roleIds });
    return response;
  } catch (error) {
    console.error('Error bulk deleting roles:', error);
    throw error;
  }
};

// Get role permissions
export const getRolePermissions = async (roleId) => {
  try {
    const response = await TenantApiService('GET', `role-permissions/role/${roleId}/permissions`);
    return response;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
};

// Update role permissions - updates each permission individually
export const updateRolePermissions = async (roleId, permissions, permissionMapping = null) => {
  try {
    console.log('Updating permissions for role:', roleId);
    console.log('Permissions object:', permissions);
    console.log('Permission mapping:', permissionMapping);
    
    const updatePromises = [];
    
    if (permissionMapping) {
      // Use the provided permission mapping (from API response)
      Object.keys(permissions).forEach(actionKey => {
        const actionPermissions = permissions[actionKey];
        const resourcePermissions = permissionMapping[actionKey];
        
        if (resourcePermissions) {
          console.log(`Processing ${actionKey} with base ID:`, resourcePermissions.id);
          
          Object.keys(actionPermissions).forEach(permissionType => {
            const granted = actionPermissions[permissionType];
            console.log(`  ${permissionType}: ${granted}`);
            
            // For now, let's use the base permission ID and see what happens
            // You may need to adjust this based on your actual backend structure
            const permissionId = resourcePermissions.id;
            
            if (permissionId) {
              console.log(`    Updating permission ${permissionId} with granted: ${granted}`);
              updatePromises.push(
                TenantApiService('PUT', `role-permissions/role/${roleId}/permission/${permissionId}`, {
                  granted: granted
                })
              );
            }
          });
        }
      });
    } else {
      // Fallback: use default permission ID mapping
      Object.keys(permissions).forEach(actionKey => {
        const actionPermissions = permissions[actionKey];
        Object.keys(actionPermissions).forEach(permissionType => {
          const permissionId = getDefaultPermissionId(actionKey, permissionType);
          if (permissionId) {
            updatePromises.push(
              TenantApiService('PUT', `role-permissions/role/${roleId}/permission/${permissionId}`, {
                granted: actionPermissions[permissionType]
              })
            );
          }
        });
      });
    }
    
    if (updatePromises.length === 0) {
      throw new Error('No permissions to update');
    }
    
    console.log(`Sending ${updatePromises.length} permission updates`);
    
    const responses = await Promise.all(updatePromises);
    
    console.log('All permission update responses:', responses);
    
    // Check if all updates were successful
    const allSuccessful = responses.every(response => 
      response && (response.status === 'success' || response.success)
    );
    
    if (allSuccessful) {
      return { status: 'success', message: 'Permissions updated successfully' };
    } else {
      throw new Error('Some permission updates failed');
    }
  } catch (error) {
    console.error('Error updating role permissions:', error);
    throw error;
  }
};

// Helper function to map permission type to specific permission ID
const mapPermissionTypeToSpecificId = (permissionType, basePermissionId) => {
  // This creates specific permission IDs based on the base permission ID and type
  // The pattern seems to be: basePermissionId + offset for each permission type
  const typeOffsets = {
    'allowView': 0,    // Base permission ID
    'allowAdd': 1,     // Base + 1
    'allowEdit': 2,    // Base + 2
    'allowDelete': 3   // Base + 3
  };
  
  const offset = typeOffsets[permissionType] || 0;
  return basePermissionId + offset;
};

// Fallback function for default permission ID mapping
const getDefaultPermissionId = (actionKey, permissionType) => {
  // This is a placeholder - you'll need to replace with actual permission IDs
  // from your backend or get them from the API response
  const permissionMap = {
    'users': {
      'allowView': 1,
      'allowAdd': 2,
      'allowEdit': 3,
      'allowDelete': 4
    },
    'roles': {
      'allowView': 5,
      'allowAdd': 6,
      'allowEdit': 7,
      'allowDelete': 8
    },
    'permissions': {
      'allowView': 9,
      'allowAdd': 10,
      'allowEdit': 11,
      'allowDelete': 12
    }
  };
  
  return permissionMap[actionKey]?.[permissionType] || null;
};

// Get all role permissions
export const getAllRolePermissions = async () => {
  try {
    const response = await TenantApiService('GET', 'roles/permissions');
    return response;
  } catch (error) {
    console.error('Error fetching all role permissions:', error);
    throw error;
  }
};


