import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', 
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request sent:', config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        window.location.href = '/login';
      }
    } else {
      console.error('Network or server error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
