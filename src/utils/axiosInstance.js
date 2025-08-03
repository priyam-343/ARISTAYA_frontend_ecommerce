import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // Add common headers for all requests here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
