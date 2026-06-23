import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Services
export const fetchServices = (category) =>
  API.get("/services", { params: category ? { category } : {} });

// Appointments
export const bookAppointment = (data) => API.post("/appointments", data);
export const fetchAvailableSlots = (date) =>
  API.get(`/appointments/slots/${date}`);

// Feedback
export const submitFeedback = (data) => API.post("/feedback", data);
export const fetchPublicFeedback = () => API.get("/feedback/public");

export default API;
