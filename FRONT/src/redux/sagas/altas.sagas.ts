import { AnyAction } from "redux";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { getAltas } from "../../services/altas.services";
import {
  FETCH_ALTAS_FAILURE,
  FETCH_ALTAS_REQUESTED,
  FETCH_ALTAS_SUCCESS,
} from "../constants/fetchAltas/altas.constants";

export function* getAllAltas(action: AnyAction): Generator {
  try {
    const response: any = yield call(getAltas);
    const { altas } = response.data;

    yield put({ type: FETCH_ALTAS_SUCCESS, data: altas });
  } catch (error: any) {
    yield put({ type: FETCH_ALTAS_FAILURE, error });
  }
}
export function* watchAltas() {
  yield all([takeLatest(FETCH_ALTAS_REQUESTED, getAllAltas)]);
}
