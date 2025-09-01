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


