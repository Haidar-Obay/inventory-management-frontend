const TENANT_API_PORT = 8000;
const TENANT_TOKEN_KEY = "tenant_token";
const CENTRAL_DOMAIN = "app.localhost";

const tenantApiService = async (method, endpoint, data = null) => {
  if (typeof window === "undefined") return;

  const hostname = window.location.hostname;
  
  // Extract tenant name from subdomain (part before .localhost)
  const tenantName = hostname.split('.')[0];
  
  // Construct the URL with tenant name and app.localhost
  const url = `http://${tenantName}.${CENTRAL_DOMAIN}:${TENANT_API_PORT}/${endpoint}`;
  
  const token = localStorage.getItem(TENANT_TOKEN_KEY);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  
  console.log("Tenant Name:", tenantName);
  console.log("Request URL:", url);
  console.log("Token in Storage: ", token);
  console.log("Request Headers: ", headers);
  
  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      credentials: "include",
      mode: "cors",
      ...(data && { body: JSON.stringify(data) }),
    });

    const responseData = await response.json();

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
