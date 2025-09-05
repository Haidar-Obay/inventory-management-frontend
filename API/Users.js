import TenantApiService from './TenantApiService';

// Get all users
export const getUsers = async () => {
  try {
    const response = await TenantApiService('GET', 'get-all-users');
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get a specific user
export const getUser = async (userId) => {
  try {
    const response = await TenantApiService('GET', `users/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await TenantApiService('POST', 'users', userData);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update a specific user
export const updateUser = async (userId, userData) => {
  try {
    const response = await TenantApiService('PUT', `users/${userId}`, userData);
    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a specific user
export const deleteUser = async (userId) => {
  try {
    const response = await TenantApiService('DELETE', `users/${userId}`);
    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Bulk delete users
export const bulkDeleteUsers = async (userIds) => {
  try {
    const response = await TenantApiService('DELETE', 'users/bulk-delete', { user_ids: userIds });
    return response;
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    throw error;
  }
};

// Update user roles
export const updateUserRoles = async (userId, roleIds) => {
  try {
    const response = await TenantApiService('PUT', `users/${userId}/roles`, { role_ids: roleIds });
    return response;
  } catch (error) {
    console.error('Error updating user roles:', error);
    throw error;
  }
};

// Get user roles
export const getUserRoles = async (userId) => {
  try {
    const response = await TenantApiService('GET', `users/${userId}/roles`);
    return response;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
};

// Toggle user active status
export const toggleUserStatus = async (userId, isActive) => {
  try {
    const response = await TenantApiService('PUT', `users/${userId}/status`, { active: isActive });
    return response;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

// Import users from Excel
export const importUsersFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await TenantApiService('POST', 'users/import/excel', formData);
    return response;
  } catch (error) {
    console.error('Error importing users from Excel:', error);
    throw error;
  }
};

// Export users to Excel
export const exportUsersToExcel = async (filters = {}) => {
  try {
    const response = await TenantApiService('GET', 'users/export/excel', null, {
      params: filters
    });
    return response;
  } catch (error) {
    console.error('Error exporting users to Excel:', error);
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
