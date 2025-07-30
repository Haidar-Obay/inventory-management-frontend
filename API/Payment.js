import tenantApiService from './TenantApiService';

// Payment Terms API functions
export const getPaymentTerms = async () => tenantApiService('GET', 'payment-terms');
export const getPaymentTermById = async (id) => tenantApiService('GET', `payment-terms/${id}`);
export const createPaymentTerm = async (data) => tenantApiService('POST', 'payment-terms', data);
export const editPaymentTerm = async (id, data) => tenantApiService('PUT', `payment-terms/${id}`, data);
export const deletePaymentTerm = async (id) => tenantApiService('DELETE', `payment-terms/${id}`);

// Payment Terms Export functions
export const exportPaymentTermsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/payment-terms');
    return response;
  } catch (error) {
    console.error('Error exporting payment terms to Excel:', error);
    throw error;
  }
};

export const exportPaymentTermsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/payment-terms');
    return response;
  } catch (error) {
    console.error('Error exporting payment terms to PDF:', error);
    throw error;
  }
};

// Payment Methods API functions
export const getPaymentMethods = async () => tenantApiService('GET', 'payment-methods');
export const getPaymentMethodById = async (id) => tenantApiService('GET', `payment-methods/${id}`);
export const createPaymentMethod = async (data) => tenantApiService('POST', 'payment-methods', data);
export const editPaymentMethod = async (id, data) => tenantApiService('PUT', `payment-methods/${id}`, data);
export const deletePaymentMethod = async (id) => tenantApiService('DELETE', `payment-methods/${id}`);

// Payment Methods Export functions
export const exportPaymentMethodsToExcel = async () => {
  try {
    const response = await tenantApiService('GET', 'exportExcell/payment-methods');
    return response;
  } catch (error) {
    console.error('Error exporting payment methods to Excel:', error);
    throw error;
  }
};

export const exportPaymentMethodsToPdf = async () => {
  try {
    const response = await tenantApiService('GET', 'exportPdf/payment-methods');
    return response;
  } catch (error) {
    console.error('Error exporting payment methods to PDF:', error);
    throw error;
  }
}; 