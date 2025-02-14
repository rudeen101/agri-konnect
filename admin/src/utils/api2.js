import axios from "axios";

// const API = axios.create({
//     baseURL: import.meta.env.VITE_APP_BASE_URL,
//     headers: {
//         'Authorization': `Bearer ${accessToken}`, //Include api key in the Authorization header
//         'Content-Type': 'application/json'
//     }
// });

const accessToken = localStorage.getItem("accessToken");

const headers = {
    'Authorization': `Bearer ${accessToken}`, //Include api key in the Authorization header
    'Content-Type': 'application/json'
}


// console.log("token",params)

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(import.meta.env.VITE_APP_BASE_URL + url, {headers});
        // const { data } = await API.axios.get(url, {headers});
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const uploadImage = async (url, formData) => {
    try {
        const { data } = await axios.post(import.meta.env.VITE_APP_BASE_URL + url, formData);
        // const { data } = await API.axios.post(url, formData);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const editData = async (url, updatedData) => {
    try {
        // const { data } = await API.axios.put(`${import.meta.env.VITE_APP_BASE_URL}${url}`, updatedData, {headers});
        const { data } = await API.axios.put(url, updatedData, {headers});
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}${url}`, {headers});
        // const { data } = await API.axios.delete(url, {headers});
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const postData = async (url, formData) => {
    try {
        const { data } = await axios.post(import.meta.env.VITE_APP_BASE_URL + url, formData, {headers});
        // const { data } = await API.axios.post(url, formData, {headers});
        return data;
    } catch (error) {
        return error || { error: "Something went wrong" };
    }
}

export const deleteImages = async (url, image) => {
    try {
        // const { data } = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}${url}`, image);
        const { data } = await API.axios.delete(url, image);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//Automatically refresh expired tokens
// API.interceptors.response.use(
//     response => response,
//     async error => {
//         alert()
//         console.log("refresh");

//         if (error.response?.status === 403 && error.response.data.error === "Token expired") {
//             try {
//                 const { data } = await axios.post("/api/auth/refresh", {
//                     refreshToken: localStorage.getItem("refreshToken")
//                 });

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

// handle errors globally in every request
// API.interceptors.response.use(
//     (response) => response, 
//     (error) => {
//         if (error.response) {
//             console.error("API Error:", error.response.data || "Something went wrong!");
//             // alert(error.response.data.message || "Something went wrong!");
//         }
//         return Promise.reject(error);
//     }
// );

// export default API;
