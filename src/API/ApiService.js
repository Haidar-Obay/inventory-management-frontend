const apiService = (method, endpoint, data = null) => {
    const url = `http://app.localhost:8000/api/${endpoint}`;
    const token = "4|4wTUjhh85nRsrEkEGAi4wv84Zt2joPJwpOIzIy941a7f2e98"
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    };
    
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .catch(error => console.error("Error:", error));
  };
 export default apiService;