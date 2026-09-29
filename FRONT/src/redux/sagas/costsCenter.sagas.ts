import { all, call, put, takeLatest } from "redux-saga/effects";
import { 
  CREATE_COST_CENTER_FAILURE, 
  CREATE_COST_CENTER_REQUESTED, 
  CREATE_COST_CENTER_SUCCESS, 
  DELETE_CENTER_FAILURE, 
  DELETE_CENTER_REQUESTED, 
  DELETE_CENTER_SUCCESS, 
  FETCH_CENTER_FAILURE, 
  FETCH_CENTER_REQUESTED, 
  FETCH_CENTER_SUCCESS, 
  UPDATE_COST_CENTER_FAILURE, 
  UPDATE_COST_CENTER_REQUESTED, 
  UPDATE_COST_CENTER_SUCCESS 
} from "../constants/fetchCostsCenter/costsCenter.constants";
import { AnyAction } from "redux";
import { deleteCostCenter, getCostCenter, updateCostCenter } from "../../services/costsCenter.services";

export function* getAllCostsCenter(action: AnyAction): Generator {
  try {
    const response: any = yield call(getCostCenter);
    const { centros } = response.data; 

    yield put({ type: FETCH_CENTER_SUCCESS, data: centros });
  } catch (error: any) {
    yield put({ type: FETCH_CENTER_FAILURE, error });
  }
}

export function* deleteRequestedCenter(action: AnyAction): Generator {
  const { payload, meta } = action;
  const { resolve, reject } = meta || {};
  try {
    const { id } = payload;
    const response: any = yield call(deleteCostCenter, id);
    if (response.status === "success") {
      yield put({ type: DELETE_CENTER_SUCCESS, id });
      if (resolve) resolve(response);
    } else {
      throw new Error("Delete failed with status: " + response.status);
    }
  } catch (error: any) {
    yield put({ type: DELETE_CENTER_FAILURE, error: error.message || "Unknown error" });
    if (reject) reject(error);
  }
}

export function* createRequestedCenter(action: AnyAction): Generator {
  const { payload, meta } = action;
  const { resolve, reject } = meta || {};
  try {
    const response: any = yield call(updateCostCenter, payload); 
    if (response.status === "success") {
      yield put({ type: CREATE_COST_CENTER_SUCCESS, newData: response.data });
      if (resolve) resolve(response); 
    } else {
      throw new Error("Creation failed with status: " + response.status);
    }
  } catch (error: any) {
    yield put({ type: CREATE_COST_CENTER_FAILURE, error: error.message || "Unknown error" });
    if (reject) reject(error); 
  }
}

export function* updateRequestedCenter(action: AnyAction): Generator {
  const { payload, meta } = action;
  const { resolve, reject } = meta || {};
  try {
    const response: any = yield call(updateCostCenter, payload);
    if (response.status === "success") {
      yield put({ type: UPDATE_COST_CENTER_SUCCESS, updatedData: response.data });
      if (resolve) resolve(response);
    } else {
      throw new Error("Update failed with status: " + response.status);
    }
  } catch (error: any) {
    yield put({ type: UPDATE_COST_CENTER_FAILURE, error: error.message || "Unknown error" });
    if (reject) reject(error);
  }
}

export function* watchCenter() {
  yield all([
   takeLatest(FETCH_CENTER_REQUESTED, getAllCostsCenter),
   takeLatest(DELETE_CENTER_REQUESTED, deleteRequestedCenter),
   takeLatest(CREATE_COST_CENTER_REQUESTED, createRequestedCenter),
   takeLatest(UPDATE_COST_CENTER_REQUESTED, updateRequestedCenter),
  ])
}
