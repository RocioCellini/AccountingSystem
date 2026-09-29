import {DELETE_CENTER_REQUESTED, FETCH_CENTER_REQUESTED, UPDATE_COST_CENTER_REQUESTED, CREATE_COST_CENTER_REQUESTED} from "../../constants/fetchCostsCenter/costsCenter.constants";

export const getAllCenter = () => ({
  type: FETCH_CENTER_REQUESTED,
});

export const deleteCenter = (id: number, meta?: { resolve: () => void; reject: (reason?: any) => void; }) => ({
  type: DELETE_CENTER_REQUESTED,
  payload: { id },
  meta
});
export const updateCenter = (values: any, meta?: { resolve: () => void; reject: (reason?: any) => void; }) => ({
  type: UPDATE_COST_CENTER_REQUESTED,
  payload: values,
  meta
});
export const createCenter = (values : any, meta : any) => ({
  type: CREATE_COST_CENTER_REQUESTED,
  payload: values,
  meta
});