// Environment Configuration
export const config = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://binbothub.com/backend'),
  
  // Tenant Configuration (if still needed)
  TENANT_API_PORT: process.env.NEXT_PUBLIC_TENANT_API_PORT || (process.env.NODE_ENV === 'development' ? '8000' : '443'),
  CENTRAL_DOMAIN: process.env.NEXT_PUBLIC_CENTRAL_DOMAIN || (process.env.NODE_ENV === 'development' ? 'localhost' : 'binbothub.com'),
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // Development overrides
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint = '') => {
  const baseUrl = config.API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

// Helper function to get tenant-specific API URL
export const getTenantApiUrl = (tenantName, endpoint = '') => {
  if (config.isDevelopment) {
    return `http://${tenantName}.${config.CENTRAL_DOMAIN}:${config.TENANT_API_PORT}/${endpoint}`;
  }
  return `https://${tenantName}.${config.CENTRAL_DOMAIN}/${endpoint}`;
};

export default config;
