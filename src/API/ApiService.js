const apiService = (method, endpoint, data = null) => {
  let hostname =
    typeof window !== "undefined" ? window.location.hostname : "app.localhost";

  // Normalize plain localhost to app.localhost
  if (hostname === "localhost") {
    hostname = "app.localhost";
  }

  const url = `http://${hostname}:8000/api/${endpoint}`;

  // 🔐 Determine token key based on domain
  const isCentral = hostname === "app.localhost";
  const tokenKey = isCentral ? "central_token" : "tenant_token";

  const token =
    typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method: method.toUpperCase(),
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .catch((error) => console.error("Error:", error));
};

export default apiService;
