const TENANT_API_PORT = process.env.NEXT_PUBLIC_TENANT_API_PORT || 8000;
const TENANT_TOKEN_KEY = process.env.NEXT_PUBLIC_TENANT_TOKEN_KEY || "tenant_token";
const CENTRAL_DOMAIN = process.env.NEXT_PUBLIC_CENTRAL_DOMAIN || "app.localhost";

const tenantApiService = async (method, endpoint, data = null) => {
  if (typeof window === "undefined") return;

  const hostname = window.location.hostname;

  // Extract tenant name from subdomain (part before .localhost)
  const tenantName = hostname.split(".")[0];

  // Construct the URL with tenant name and app.localhost
  const url = `http://${tenantName}.${CENTRAL_DOMAIN}:${TENANT_API_PORT}/${endpoint}`;


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
