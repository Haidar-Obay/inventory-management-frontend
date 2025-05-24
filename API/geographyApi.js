import tenantApiService from './TenantApiService';

// Function to get all countries
export const getCountries = async () => {
  try {
    const response = await tenantApiService('GET', 'countries');
    return response;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

// Function to get provinces by country ID
export const getProvinces = async (countryId) => {
  try {
    const response = await tenantApiService('GET', `provinces`);
    return response;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
};

// Function to get cities by province ID
export const getCities = async (provinceId) => {
  try {
    const response = await tenantApiService('GET', `cities`);
    return response;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

// Function to get districts by city ID
export const getDistricts = async (cityId) => {
  try {
    const response = await tenantApiService('GET', `districts`);
    return response;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
}; 

// Delete functions
export const deleteCountry = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `countries/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting country:', error);
    throw error;
  }
};

export const deleteCity = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `cities/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error;
  }
};

export const deleteProvince = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `provinces/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting province:', error);
    throw error;
  }
};

export const deleteDistrict = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `districts/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting district:', error);
    throw error;
  }
};

// Edit functions
export const editCountry = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `countries/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing country:', error);
    throw error;
  }
};

export const editCity = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `cities/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing city:', error);
    throw error;
  }
};

export const editProvince = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `provinces/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing province:', error);
    throw error;
  }
}; 

export const editDistrict = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `districts/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing district:', error);
    throw error;
  }
};

// Create functions
export const createCountry = async (data) => {
  try {
    const response = await tenantApiService('POST', 'countries', data);
    return response;
  } catch (error) {
    console.error('Error creating country:', error);
    throw error;
  }
};

export const createProvince = async (data) => {
  try {
    const response = await tenantApiService('POST', 'provinces', data);
    return response;
  } catch (error) {
    console.error('Error creating province:', error);
    throw error;
  }
};

export const createCity = async (data) => {
  try {
    const response = await tenantApiService('POST', 'cities', data);
    return response;
  } catch (error) {
    console.error('Error creating city:', error);
    throw error;
  }
};

export const createDistrict = async (data) => {
  try {
    const response = await tenantApiService('POST', 'districts', data);
    return response;
  } catch (error) {
    console.error('Error creating district:', error);
    throw error;
  }
};