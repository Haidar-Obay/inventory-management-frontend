import tenantApiService from './TenantApiService';

// Supplier Group API functions
export const getSupplierGroups = async () => {
  try {
    const response = await tenantApiService('GET', 'supplier-groups');
    return response;
  } catch (error) {
    console.error('Error fetching supplier groups:', error);
    throw error;
  }
};

export const getSupplierGroupById = async (id) => {
  try {
    const response = await tenantApiService('GET', `supplier-groups/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching supplier group:', error);
    throw error;
  }
};

export const createSupplierGroup = async (data) => {
  try {
    const response = await tenantApiService('POST', 'supplier-groups', data);
    return response;
  } catch (error) {
    console.error('Error creating supplier group:', error);
    throw error;
  }
};

export const editSupplierGroup = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `supplier-groups/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing supplier group:', error);
    throw error;
  }
};

export const deleteSupplierGroup = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `supplier-groups/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting supplier group:', error);
    throw error;
  }
};

export const exportSupplierGroupsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/supplier-groups');
    return response;
  } catch (error) {
    console.error('Error exporting supplier groups to Excel:', error);
    throw error;
  }
};

export const exportSupplierGroupsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/supplier-groups');
    return response;
  } catch (error) {
    console.error('Error exporting supplier groups to PDF:', error);
    throw error;
  }
};

export const importSupplierGroupsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/supplier-groups', formData);
    return response;
  } catch (error) {
    console.error('Error importing supplier groups from Excel:', error);
    throw error;
  }
};

// Function to get only supplier group names for dropdowns
export const getSupplierGroupNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/supplier-groups');
    return response;
  } catch (error) {
    console.error('Error fetching supplier group names:', error);
    throw error;
  }
};

// Supplier API functions
export const getSuppliers = async () => {
  try {
    const response = await tenantApiService('GET', 'suppliers');
    return response;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const getSupplierById = async (id) => {
  try {
    const response = await tenantApiService('GET', `suppliers/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching supplier:', error);
    throw error;
  }
};

export const createSupplier = async (data) => {
  try {
    const response = await tenantApiService('POST', 'suppliers', data);
    return response;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

export const editSupplier = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `suppliers/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing supplier:', error);
    throw error;
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `suppliers/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};

export const exportSuppliersToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/suppliers');
    return response;
  } catch (error) {
    console.error('Error exporting suppliers to Excel:', error);
    throw error;
  }
};

export const exportSuppliersToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/suppliers');
    return response;
  } catch (error) {
    console.error('Error exporting suppliers to PDF:', error);
    throw error;
  }
};

export const importSuppliersFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/suppliers', formData);
    return response;
  } catch (error) {
    console.error('Error importing suppliers from Excel:', error);
    throw error;
  }
};
