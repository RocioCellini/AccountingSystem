import { toast, Zoom } from 'react-toastify';
import API from '../api';
import { ApiConfig } from '../configs/config';
import { downloadFile, post , get } from './api';

export const getInfoUser = async () => {
    const response = await API.getInfo();
    return response.data;
}


export const login = async (data: {} | undefined) => {
    console.log(ApiConfig.LOGIN);
    const response = await post(`${ApiConfig.LOGIN}`, data);
    return response;
}

/* export const loginOKTA = async (data: {} | undefined) => {
    const response = await post(`${ApiConfig.LOGIN_VERIFY_OKTA}`, data);
    return response;
} */  //editado para sacar OKTA

export const downloadUsers = async () => {
    try {
        const response = await get(`${process.env.REACT_APP_API_ENDPOINT}users/export-users`);

        if (response.status === "success" && response.data) {
            const link = document.createElement("a");
            link.download = "Comisiones.xls"; 
            link.href = response.data; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); 

            toast.success("¡Listo!", { transition: Zoom });
        } else {
            toast.error("Error al obtener la ruta de exportación de usuarios.", { transition: Zoom });
        }
    } catch (error) {
        console.error('Error al descargar usuarios:', error);
        toast.error("Ocurrió un error al intentar descargar el archivo.", { transition: Zoom });
    }
};