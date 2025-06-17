import tenantApiService from './TenantApiService';

// Function to get all customers
export const getCustomers = async () => {
  try {
    const response = await tenantApiService('GET', 'customers');
    return response;
  } catch (error) {
    console.error('Error fetching customers:', error);
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