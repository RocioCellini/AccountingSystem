import API from '../api';

export const getInfoOficiales = async () => {
    const response = await API.getOficiales();
    return response.data.oficiales;
}