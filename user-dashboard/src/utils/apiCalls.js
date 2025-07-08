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
export const postDataToApi = async (url, payload) => {
    try {
        const response = await API.post(url, payload);

        if (!response || !response.data) {
            throw new Error("Invalid API response");
        }

        return response.data; // Ensure data exists
    } catch (error) {
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

// export const uploadImages = async (url) => {
//     try {
//         // const { data } = await axios.post(import.meta.env.VITE_APP_BASE_URL + url, formData);
//         const { data } = await API.post(url);
//         return data;
//     } catch (error) {
//         console.error("POST Error:", error);
//         return error.response?.data || { error: "Failed to upload image" };
//     }
// }

// export const deleteImage = async (url) => {
//     try {
//         // const { data } = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}${url}`, image);
//         const { data } = await API.delete(url);
//         return data;
//     } catch (error) {
//         console.error("DELETE Error:", error);
//         return error.response?.data || { error: "Failed to delete images" };
//     }
// }

// export const uploadImages = async (url, formData) => {
//     // const formData = new FormData();
//     // files.forEach(file => formData.append("images", file));


//     for (let pair of formData.entries()) {
//         console.log("********",pair[0], pair[1]); // Should log: "images", File object
//     }

//     console.log("formData", formData);

//     const { data } = await API.post(url, formData, );
//     return data.images;
// };

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

// export const deleteImage = async (public_id) => {
//     return await API.post("/api/imageUpload/delete", { public_id });
// };