import { all, put, call, takeLatest } from "redux-saga/effects";
import * as constants from "../constants/example.constants";
import { getExample } from "../../services/example.services";
import { ExampleErrorAction, ExampleSuccessAction } from "../../interfaces/example/example";


export function* getInfoExample(): Generator {
  try {
    const data = yield call(getExample);
    yield put<ExampleSuccessAction>({ type: constants.EXAMPLE_GET_INFO_SUCCEEDED, data });
  } catch (error) {
    yield put<ExampleErrorAction>({ type: constants.EXAMPLE_GET_INFO_FAILED, error });
  }
}

export function* watchExample() {
  yield all([takeLatest(constants.EXAMPLE_GET_INFO_REQUESTED, getInfoExample)]);
}