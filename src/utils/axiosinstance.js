import axios from "axios";
import { BASE_URL } from "./apiPaths.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error("Unauthorized. Please login again.");
      } else if (status === 403) {
        console.error("You are not allowed to perform this action.");
      } else if (status === 404) {
        console.error("Requested resource was not found.");
      } else if (status >= 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else {
      console.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
