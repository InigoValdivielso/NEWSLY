const BASE_URL = "http://localhost:2000"; // URL del API Gateway

export const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};
