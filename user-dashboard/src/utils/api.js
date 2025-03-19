
import axios from "axios";

// Create Axios Instance
const API = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,  
    withCredentials: true, // Ensure cookies are sent with requests
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

// Response Interceptor (Handle Errors & Token Refresh)
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




// import axios from "axios";

// // Create Axios Instance
// const API = axios.create({
//     baseURL: import.meta.env.VITE_APP_BASE_URL,  
//     // headers: { "Content-Type": "application/json" }
// });

// // Request Interceptor (Attach Token)
// API.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage
//         if (accessToken) {
//             config.headers["Authorization"] = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Request Interceptor to Dynamically Set Headers
// API.interceptors.request.use((config) => {
//     // Check if the request contains FormData (file uploads)
//     if (config.data instanceof FormData) {
//         config.headers["Content-Type"] = "multipart/form-data"; // For file uploads
//     } else {
//         config.headers["Content-Type"] = "application/json"; // Default for JSON data
//     }

//     // Add Authorization header if token exists
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// // Response Interceptor (Handle Errors)
// API.interceptors.response.use(
//     (response) => response, // Return response data
//     async (error) => {
//         // console.error("API Error:", error.response.data.error);

//         // Handle Unauthorized Errors
//         if (error.response && error.response.status === 401) {
//             console.warn("Unauthorized! Redirecting to login...");
//             window.location.href = "/login"; // Redirect to login
//         }

//         if (error.response?.status === 403 && error.response.data.error === "Token expired") {
//             try {

//                 const { data } = await API.post("/api/auth/refresh", {
//                     refreshToken: localStorage.getItem("refreshToken")
//                 });

//                 console.error("Token expired and renewd");

//                 localStorage.setItem("accessToken", data.accessToken);
//                 error.config.headers["Authorization"] = `Bearer ${data.accessToken}`;

//                 return axios(error.config);
//             } catch (refreshError) {
//                 console.error("Session expired. Please login again.");
//                 localStorage.removeItem("accessToken");
//                 localStorage.removeItem("refreshToken");
//                 window.location.href = "/login";
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default API;
