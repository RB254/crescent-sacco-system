import axios from 'axios';

// Always route requests to /api on the current domain
const API = axios.create({
  baseURL: '/api',
});

export default API;