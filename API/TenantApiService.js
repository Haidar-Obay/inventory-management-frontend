const TENANT_API_PORT = 8000;
const TENANT_TOKEN_KEY = "tenant_token";
const CENTRAL_DOMAIN = "app.localhost";

const tenantApiService = async (method, endpoint, data = null) => {
  if (typeof window === "undefined") return;

  const hostname = window.location.hostname;

  // Reject if not a subdomain of app.localhost
  if (!hostname.endsWith(`.${CENTRAL_DOMAIN}`)) {
    console.warn(`[tenantApiService] Invalid tenant domain: ${hostname}`);
    return;
  }

  const url = `http://${hostname}:${TENANT_API_PORT}/${endpoint}`;
  const token = localStorage.getItem(TENANT_TOKEN_KEY);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
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
