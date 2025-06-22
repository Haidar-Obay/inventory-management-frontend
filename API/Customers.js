import tenantApiService from './TenantApiService';

// Customer Groups API Functions
export const getCustomerGroups = async () => {
  try {
    const response = await tenantApiService('GET', 'customer-groups');
    return response;
  } catch (error) {
    console.error('Error fetching customer groups:', error);
    throw error;
  }
};

export const createCustomerGroup = async (data) => {
  try {
    const response = await tenantApiService('POST', 'customer-groups', data);
    return response;
  } catch (error) {
    console.error('Error creating customer group:', error);
    throw error;
  }
};

export const editCustomerGroup = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `customer-groups/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating customer group:', error);
    throw error;
  }
};

export const deleteCustomerGroup = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `customer-groups/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting customer group:', error);
    throw error;
  }
};

export const exportCustomerGroupsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/customer-groups', null, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error('Error exporting customer groups to Excel:', error);
    throw error;
  }
};

export const exportCustomerGroupsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/customer-groups', null, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error('Error exporting customer groups to PDF:', error);
    throw error;
  }
};

export const importCustomerGroupsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await tenantApiService('POST', 'importFromExcel/customer-groups', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return response;
  } catch (error) {
    console.error('Error importing customer groups from Excel:', error);
    throw error;
  }
};

// Salesmen API Functions
export const getSalesmen = async () => {
  try {
    const response = await tenantApiService('GET', 'salesmen');
    return response;
  } catch (error) {
    console.error('Error fetching salesmen:', error);
    throw error;
  }
};

export const createSalesman = async (data) => {
  try {
    const response = await tenantApiService('POST', 'salesmen', data);
    return response;
  } catch (error) {
    console.error('Error creating salesman:', error);
    throw error;
  }
};

export const editSalesman = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `salesmen/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating salesman:', error);
    throw error;
  }
};

export const deleteSalesman = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `salesmen/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting salesman:', error);
    throw error;
  }
};

export const exportSalesmenToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/salesmen', null, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error('Error exporting salesmen to Excel:', error);
    throw error;
  }
};

export const exportSalesmenToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/salesmen', null, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error('Error exporting salesmen to PDF:', error);
    throw error;
  }
};

export const importSalesmenFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await tenantApiService('POST', 'importFromExcel/salesmen', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return response;
  } catch (error) {
    console.error('Error importing salesmen from Excel:', error);
    throw error;
  }
};

// Customers API Functions
export const getCustomers = async () => {
  try {
    const response = await tenantApiService('GET', 'customers');
    return response;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const createCustomer = async (data) => {
  try {
    const response = await tenantApiService('POST', 'customers', data);
    return response;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const editCustomer = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `customers/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `customers/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const exportCustomersToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/customers', null, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error('Error exporting customers to Excel:', error);
    throw error;
  }
};

export const exportCustomersToPdf = async () => {
  try {
      const response = await tenantApiService('GET', 'exportPdf/customers', null, { responseType: 'blob' });
    return response;
  } catch (error) {
    console.error('Error exporting customers to PDF:', error);
    throw error;
  }
};

export const importCustomersFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
      const response = await tenantApiService('POST', 'importFromExcel/customers', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return response;
  } catch (error) {
    console.error('Error importing customers from Excel:', error);
    throw error;
  }
};

// Function to get customer by ID
export const getCustomerById = async (id) => {
  try {
    const response = await tenantApiService('GET', `customers/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

// Function to get only customer names for dropdowns
export const getCustomerNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/customers');
    return response;
  } catch (error) {
    console.error('Error fetching customer names:', error);
    throw error;
  }
};

// Function to get customer group names for dropdowns
export const getCustomerGroupNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/customer-groups');
    return response;
  } catch (error) {
    console.error('Error fetching customer group names:', error);
    throw error;
  }
};

// Function to get salesman names for dropdowns
export const getSalesmanNames = async () => {
  try {
    const response = await tenantApiService('GET', 'names/salesmen');
    return response;
  } catch (error) {
    console.error('Error fetching salesman names:', error);
    throw error;
  }
}; 