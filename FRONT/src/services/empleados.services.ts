
import API from '../api'

export const getInfoEmpleados = async (include: boolean, soloActivos: boolean) => {
    const response = await API.getEmpleados(include, soloActivos);
    return response.data.empleados;
}


export const addFavoriteEmpleado = async (id: number) => {
    const response = await API.addFavorito(id);
    return response.data.empleados;
}

export const removeFavoriteEmpleado = async (id: number) => {
    const response = await API.removeFavorito(id);
    return response.data.empleados;
}
