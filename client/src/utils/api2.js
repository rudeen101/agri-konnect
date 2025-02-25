import axios from "axios";

const accessToken = localStorage.getItem("accessToken");
console.log("accessToken", accessToken)

const headers = {
    'Authorization': `Bearer ${accessToken}`, //Include api key in the Authorization header
    'Content-Type': 'applicaiton/json'
}

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(import.meta.env.VITE_APP_BASE_URL + url,headers);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const uploadImage = async (url, formData) => {
    try {
        const { data } = await axios.post(import.meta.env.VITE_APP_BASE_URL + url, formData);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const editData = async (url, updatedData) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_APP_BASE_URL}${url}`, updatedData);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}
export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}${url}`, headers);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const postData = async (url, formData) => {
    console.log(headers)
    try {
        const { data } = await axios.post(import.meta.env.VITE_APP_BASE_URL + url, formData, {headers});
        return data;
    } catch (error) {
        // console.log(error);
        return error.response.data;
    }
}

export const deleteImages = async (url, image) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}${url}`, image);
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}