import API from "./api";
import axios from "axios";


// GET Request
export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await API.get(url);
        return data;
    } catch (error) {
        console.error("GET Error:", error);
        return error.response?.data || { error: "Failed to fetch data" };
    }
};

// POST Request
export const postDataToApi = async (url, payload) => {
    try {
        const { data } = await API.post(url, payload);
        return data;
    } catch (error) {
        console.error("POST Error:", error);
        return error.response?.data || { error: "Failed to create data" };
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
        const { data } = await API.delete(url);
        return data;
    } catch (error) {
        console.error("DELETE Error:", error);
        return error.response?.data || { error: "Failed to delete data" };
    }
};



