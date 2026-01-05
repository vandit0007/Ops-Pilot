import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// -----------------------------
// REQUEST INTERCEPTOR
// Automatically attach JWT
// -----------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// -----------------------------
// RESPONSE INTERCEPTOR (optional)
// Global error handling
// -----------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: auto-logout on 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login"; // optional
    }

    return Promise.reject(error);
  }
);

export default api;
