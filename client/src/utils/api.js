import axios from "axios";

// Create Axios Instance
const API = axios.create({
    // baseURL: import.meta.env.VITE_APP_BASE_URL,  
    withCredentials: true, // Ensure cookies are sent with requests
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor (Attach Content-Type)
API.interceptors.request.use(
    (config) => {
        // Check if request contains FormData (for file uploads)
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);


let isRefreshing = false; // Flag to prevent multiple refresh calls
let refreshRequest = null; // Store the refresh token request

API.interceptors.response.use(
    (response) => response, // Return the response normally
    async (error) => {
        const originalRequest = error.config;

        // If Unauthorized (Token Expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark request as retried

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await API.get("/api/auth/refresh"); // Refresh token request
                    isRefreshing = false;
                    refreshRequest = null;
                } catch (refreshError) {
                    isRefreshing = false;
                    // window.location.href = "/login"; // Redirect to login on failure
                    return Promise.reject(refreshError);
                }
            } else {
                // Wait for the refresh request to finish before retrying
                await refreshRequest;
            }

            return API(originalRequest); // Retry original request after token refresh
        }

        return Promise.reject(error); // Return other errors normally
    }
);

export default API;

