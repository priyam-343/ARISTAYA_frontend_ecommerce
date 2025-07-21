// src/utils/axiosInstance.js
import axios from 'axios';

// Create an Axios instance with a base URL from your environment variable
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // You can add other default configurations here if needed, e.g.:
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  // timeout: 10000, // 10 seconds timeout
});

export default axiosInstance;
