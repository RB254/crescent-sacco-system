import axios from 'axios';

// Dynamically use the Render environment variable in production, fallback to localhost in dev
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

export default API;