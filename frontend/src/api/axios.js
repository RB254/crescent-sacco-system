import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust port if your Express backend runs on a different port
});

export default API;