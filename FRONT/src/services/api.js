import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_ENDPOINT}`,
});

const getOptions = () => {
    const accessToken = Cookies.get("api_token");
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };
    return options;
};

const errorResponse = (error) => {
    const { data: { message, errors } } = error.response;
    const response = new Error(message);
    response.errors = message.error;
    return message;
};

export const post = async (url, params = {}, headers = {}) => {
    try {
        const options = { ...getOptions(), ...headers };
        const { data } = await api.post(url, params, options);
        return data;
    } catch (error) {
        throw errorResponse(error)
    }
};

export const get = async (url, headers = {}) => {
    try {
        const options = { ...getOptions(), ...headers };
        const { data } = await api.get(url, options);
        return data;
    } catch (error) {
        throw errorResponse(error);
    }
};
export const getWithParam = async (url, params = {}, headers = {}) => {
    try {
        const options = { ...getOptions(), ...headers, params };
        const { data } = await api.get(url, options);
        return data;
    } catch (error) {
        throw errorResponse(error);
    }
};

export const deleteApi = async (url, headers = {}, value) => {
    try {
        const options = { ...getOptions(), ...headers };
        const { data } = await api.delete(url,  options);
        return data;
    } catch (error) {
        throw errorResponse(error);
    }
};

export const put = async (url, params = {}, headers = {}) => {
    try {
        const options = { ...getOptions(), ...headers };
        const { data } = await api.put(url, params, options);
        return data;
    } catch (error) {
        throw errorResponse(error);
    }
};


export const downloadFile = async (extension, urls, headers = {}) => {
    try {
        const options = { ...getOptions(), ...headers, responseType: 'blob' };
        const response = await api.get(urls, options);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.' + extension)
        document.body.appendChild(link);
        link.click();
        return "ok";
    } catch (error) {
        throw errorResponse(error);
    }
};