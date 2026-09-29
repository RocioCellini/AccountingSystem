import { API_URL } from "../configs/config";
import { deleteApi, get, post } from "./api";

export const getCostCenter = async () => {
    const response = await get(`${API_URL}centros/get`);
    return response;
  };
  export const deleteCostCenter = async (id: number) => {
    const response = await deleteApi(`${API_URL}centros/delete/${id}`);
    return response;
  };
  
  export const updateCostCenter = async ( payload : any) => {
    const response = await post(`${API_URL}centros/update`, payload);
    return response;
  };