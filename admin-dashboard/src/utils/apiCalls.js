import API from "./api";

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

export const uploadImage = async (url, formData) => {
    try {
        const { data } = await API.post(import.meta.env.VITE_APP_BASE_URL + url, formData);
        // const { data } = await API.axios.post(url, formData);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const deleteImages = async (url, image) => {
    try {
        const { data } = await API.delete(`${import.meta.env.VITE_APP_BASE_URL}${url}`, image);
        // const { data } = await API.axios.delete(url, image);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

