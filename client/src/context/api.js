import axios from "axios";

// Axios instance — proxy in vite.config.js routes /api → http://localhost:5000
const API = axios.create({ baseURL: "/api" });

// Auto-attach JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
