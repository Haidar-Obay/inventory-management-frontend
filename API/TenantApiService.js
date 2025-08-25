import { getTenantApiUrl } from '../lib/config.js';

const TENANT_TOKEN_KEY = process.env.NEXT_PUBLIC_TENANT_TOKEN_KEY || "tenant_token";

const tenantApiService = async (method, endpoint, data = null) => {
  if (typeof window === "undefined") return;

  const hostname = window.location.hostname;
  
  // Extract tenant name from subdomain (part before .localhost or .binbothub.com)
  const tenantName = hostname.split(".")[0];
  
  // For development: use app.localhost with tenant in subdomain
  // For production: use tenant-specific URLs
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let url;
  if (isDevelopment) {
    // Use app.localhost structure that backend expects
    const CENTRAL_DOMAIN = process.env.NEXT_PUBLIC_CENTRAL_DOMAIN || "app.localhost";
    const API_PORT = process.env.NEXT_PUBLIC_TENANT_API_PORT || "8000";
    url = `http://${tenantName}.${CENTRAL_DOMAIN}:${API_PORT}/${endpoint}`;
  } else {
    // Production: use centralized or tenant-specific URLs
    url = getTenantApiUrl(tenantName, endpoint);
  }

  // Get token from cookies instead of localStorage
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TENANT_TOKEN_KEY}=`))
    ?.split("=")[1];

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      credentials: "include",
      mode: "cors",
      ...(data && {
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    });

    // Check if the response is a file download (Excel or PDF)
    const contentType = response.headers.get("content-type");
    if (
      contentType &&
      (contentType.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) || // Excel
        contentType.includes("application/pdf") || // PDF
        contentType.includes("application/octet-stream")) // Generic binary
    ) {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return await response.blob();
    }

    // For JSON responses
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      // If we can't parse JSON, it might be HTML (routing issue)
      if (response.headers.get("content-type")?.includes("text/html")) {
        throw new Error(`API routing issue: Received HTML instead of JSON. Check if URL includes /backend path. URL: ${url}`);
      }
      throw new Error(`Failed to parse response: ${parseError.message}`);
    }

    if (!response.ok) {
      throw new Error(responseData?.message || response.statusText);
    }

    return responseData;
  } catch (error) {
    console.error(`[tenantApiService] Error calling ${endpoint}:`, error);
    throw error;
  }
};

export default tenantApiService;
