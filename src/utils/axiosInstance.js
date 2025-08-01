import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // You might want to add headers here that are common for all requests,
  // e.g., 'Content-Type': 'application/json'
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

export default axiosInstance;
