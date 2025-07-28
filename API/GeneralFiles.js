import tenantApiService from "./TenantApiService";

// Business Type API functions
export const getBusinessTypes = async () => {
  try {
    const response = await tenantApiService('GET', 'business-types');
    return response;
  } catch (error) {
    console.error('Error fetching business types:', error);
    throw error;
  }
};

export const createBusinessType = async (data) => {
  try {
    const response = await tenantApiService('POST', 'business-types', data);
    return response;
  } catch (error) {
    console.error('Error creating business type:', error);
    throw error;
  }
};

export const editBusinessType = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `business-types/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing business type:', error);
    throw error;
  }
};

export const deleteBusinessType = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `business-types/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting business type:', error);
    throw error;
  }
};

export const exportBusinessTypesToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/business-types');
    return response;
  } catch (error) {
    console.error('Error exporting business types to Excel:', error);
    throw error;
  }
};

export const exportBusinessTypesToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/business-types');
    return response;
  } catch (error) {
    console.error('Error exporting business types to PDF:', error);
    throw error;
  }
};

export const importBusinessTypesFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/business-types', formData);
    return response;
  } catch (error) {
    console.error('Error importing business types from Excel:', error);
    throw error;
  }
};

// Sales Channel API functions
export const getSalesChannels = async () => {
  try {
    const response = await tenantApiService('GET', 'sales-channels');
    return response;
  } catch (error) {
    console.error('Error fetching sales channels:', error);
    throw error;
  }
};

export const createSalesChannel = async (data) => {
  try {
    const response = await tenantApiService('POST', 'sales-channels', data);
    return response;
  } catch (error) {
    console.error('Error creating sales channel:', error);
    throw error;
  }
};

export const editSalesChannel = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `sales-channels/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing sales channel:', error);
    throw error;
  }
};

export const deleteSalesChannel = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `sales-channels/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting sales channel:', error);
    throw error;
  }
};

export const exportSalesChannelsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/sales-channels');
    return response;
  } catch (error) {
    console.error('Error exporting sales channels to Excel:', error);
    throw error;
  }
};

export const exportSalesChannelsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/sales-channels');
    return response;
  } catch (error) {
    console.error('Error exporting sales channels to PDF:', error);
    throw error;
  }
};

export const importSalesChannelsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/sales-channels', formData);
    return response;
  } catch (error) {
    console.error('Error importing sales channels from Excel:', error);
    throw error;
  }
};

// Distribution Channel API functions
export const getDistributionChannels = async () => {
  try {
    const response = await tenantApiService('GET', 'distribution-channels');
    return response;
  } catch (error) {
    console.error('Error fetching distribution channels:', error);
    throw error;
  }
};

export const createDistributionChannel = async (data) => {
  try {
    const response = await tenantApiService('POST', 'distribution-channels', data);
    return response;
  } catch (error) {
    console.error('Error creating distribution channel:', error);
    throw error;
  }
};

export const editDistributionChannel = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `distribution-channels/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing distribution channel:', error);
    throw error;
  }
};

export const deleteDistributionChannel = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `distribution-channels/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting distribution channel:', error);
    throw error;
  }
};

export const exportDistributionChannelsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/distribution-channels');
    return response;
  } catch (error) {
    console.error('Error exporting distribution channels to Excel:', error);
    throw error;
  }
};

export const exportDistributionChannelsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/distribution-channels');
    return response;
  } catch (error) {
    console.error('Error exporting distribution channels to PDF:', error);
    throw error;
  }
};

export const importDistributionChannelsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/distribution-channels', formData);
    return response;
  } catch (error) {
    console.error('Error importing distribution channels from Excel:', error);
    throw error;
  }
};

// Media Channel API functions
export const getMediaChannels = async () => {
  try {
    const response = await tenantApiService('GET', 'media-channels');
    return response;
  } catch (error) {
    console.error('Error fetching media channels:', error);
    throw error;
  }
};

export const createMediaChannel = async (data) => {
  try {
    const response = await tenantApiService('POST', 'media-channels', data);
    return response;
  } catch (error) {
    console.error('Error creating media channel:', error);
    throw error;
  }
};

export const editMediaChannel = async (id, data) => {
  try {
    const response = await tenantApiService('PUT', `media-channels/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error editing media channel:', error);
    throw error;
  }
};

export const deleteMediaChannel = async (id) => {
  try {
    const response = await tenantApiService('DELETE', `media-channels/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting media channel:', error);
    throw error;
  }
};

export const exportMediaChannelsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/media-channels');
    return response;
  } catch (error) {
    console.error('Error exporting media channels to Excel:', error);
    throw error;
  }
};

export const exportMediaChannelsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/media-channels');
    return response;
  } catch (error) {
    console.error('Error exporting media channels to PDF:', error);
    throw error;
  }
};

export const importMediaChannelsFromExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await tenantApiService('POST', 'importFromExcel/media-channels', formData);
    return response;
  } catch (error) {
    console.error('Error importing media channels from Excel:', error);
    throw error;
  }
};
  