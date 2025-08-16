import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(config => {
  console.log('Request:', config.method, config.url);
  return config;
}, error => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      error.message = error.response.data.error || 'Request failed';
    } else if (error.request) {
      error.message = 'No response from server';
    }
    return Promise.reject(error);
  }
);

export default api;