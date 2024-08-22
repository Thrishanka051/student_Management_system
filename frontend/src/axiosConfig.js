// src/axiosConfig.js
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8070', 
  withCredentials: true, // This ensures cookies are sent with every request
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token is expired or user is not authorized
      localStorage.removeItem('user'); // Clear any user data in local storage
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
