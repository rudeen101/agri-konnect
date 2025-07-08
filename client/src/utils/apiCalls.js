import API from "./api";
import axios from "axios";


// GET Request
export const fetchDataFromApi = async (url) => {
    try {
        const response = await API.get(url);

        if (!response || !response.data) {
            throw new Error("Invalid API response");
        }

        return response.data; // Ensure data exists
    } catch (error) {
        console.error("GET Error:", error.response?.data?.message || error.message);
        return null; // Return null so app doesn’t crash
    }
};


// POST Request
// export const postDataToApi = async (url, payload) => {
//     try {
//         const { data } = await API.post(url, payload);
//         return data;
//     } catch (error) {
//         console.error("POST Error:", error);
//         return error.response?.data || { error: "Failed to create data" };
//     }
// };

export const postDataToApi = async (url, payload) => {
    try {
        const response = await API.post(url, payload);

        if (!response || !response.data) {
            throw new Error("Invalid API response");
        }

        return response.data; // Ensure data exists
    } catch (error) {
        console.log("ErrMsg",error)
        console.error("GET Error:", error.response?.data?.message || error.message);
        return null; // Return null so app doesn’t crash
    }
};

// PUT Request (Update Data)
export const updateDataToApi = async (url, payload) => {
    try {
        const { data } = await API.put(url, payload);
        return data;
    } catch (error) {
        console.error("PUT Error:", error);
        return error.response?.data || { error: "Failed to update data" };
    }
};

// DELETE Request
export const deleteDataFromApi = async (url) => {
    try {
        const response = await API.delete(url);

        if (!response || !response.data) {
            throw new Error("Invalid API response");
        }

        return response.data; // Ensure data exists
    } catch (error) {
        console.error("GET Error:", error.response?.data?.message || error.message);
        return null; // Return null so app doesn’t crash
    }
};



