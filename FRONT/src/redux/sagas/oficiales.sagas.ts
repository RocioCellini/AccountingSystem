import { all, put, call, takeLatest } from "redux-saga/effects";
import * as constants from "../constants/app.constants";
import { Action } from 'redux';
import { getInfoOficiales } from "../../services/oficiales.services";


interface OficialesSuccessAction extends Action<string> {
  data: any;
}
interface OficialesErrorAction extends Action<string> {
  error: any;
}

export function* getOficiales(): Generator {
  try {
    const data = yield call(getInfoOficiales);
    yield put<OficialesSuccessAction>({ type: constants.OFICIALES_GET_INFO_SUCCEEDED, data});

  } catch (error) {
    yield put<OficialesErrorAction>({ type: constants.OFICIALES_GET_INFO_FAILED, error });
  }
}

export function* watchOficiales() {
  yield all([
    takeLatest(constants.OFICIALES_GET_INFO_REQUESTED, getOficiales),
  ]);
}