import tenantApiService from './TenantApiService';

export const getCurrencies = async () => {
  try {
    const response = await tenantApiService('GET', 'currencies');
    return response;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const response = await tenantApiService('GET', 'subscription/status');
    return response;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
}; 