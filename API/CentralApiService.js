const CENTRAL_HOSTNAME = "app.localhost";
const CENTRAL_API_PORT = 8000;
const CENTRAL_TOKEN_KEY = "central_token";

const centralApiService = async (method, endpoint, data = null) => {
  if (typeof window === "undefined") return;

  let hostname = window.location.hostname;

  // Normalize "localhost" to "app.localhost"
  if (hostname === "localhost") {
    hostname = CENTRAL_HOSTNAME;
  }

  if (hostname !== CENTRAL_HOSTNAME) {
    console.warn(`[centralApiService] Invalid domain: ${hostname}`);
    return;
  }

  const url = `http://${CENTRAL_HOSTNAME}:${CENTRAL_API_PORT}/api/${endpoint}`;

  const token = localStorage.getItem(CENTRAL_TOKEN_KEY);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      ...(data && { body: JSON.stringify(data) }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.message || response.statusText);
    }

    return responseData;
  } catch (error) {
    console.error(`[centralApiService] Error calling ${endpoint}:`, error);
    throw error;
  }
};

export default centralApiService;