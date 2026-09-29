import { API_URL } from "../configs/config";
import { get } from "./api";

export const getAltas = async () => {
  const response = await get(`${API_URL}altas/get`);
  return response;
};
