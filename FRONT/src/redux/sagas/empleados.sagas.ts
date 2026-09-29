import { all, put, call, takeLatest } from "redux-saga/effects";
import * as constants from "../constants/app.constants";
import { AnyAction } from "redux";
import { Action } from 'redux';
import { addFavoriteEmpleado, getInfoEmpleados, removeFavoriteEmpleado } from "../../services/empleados.services";
import { startLoading, stopLoading, stopLoadingWithError } from "../actions/loading/loading.actions";


interface EmpleadosSuccessAction extends Action<string> {
  data: any;
}
interface EmpleadosFavoritoSuccessAction extends Action<string> {
  message: String;
  id: number;
}

interface EmpleadosErrorAction extends Action<string> {
  error: any;
}

export function* getEmpleados(action: AnyAction): Generator {
  try {
    yield put(startLoading());  
    const { include, soloActivos } = action;

    const data = yield call(getInfoEmpleados, include, soloActivos);
    yield put<EmpleadosSuccessAction>({ type: constants.EMPLEADOS_GET_INFO_SUCCEEDED, data });
    yield put(stopLoading());  
  } catch (error) {
    yield put<EmpleadosErrorAction>({ type: constants.EMPLEADOS_GET_INFO_FAILED, error });
    yield put(stopLoadingWithError());  
  }
}

export function* addToFavoriteEmpleado(action: AnyAction): Generator {
  try {
    yield put(startLoading()); 
    const { id } = action;
    yield call(addFavoriteEmpleado, id);
    yield put<EmpleadosFavoritoSuccessAction>({ type: constants.EMPLEADOS_ADD_FAVORITE_SUCCEEDED, message: "Se logro añadir como favorito", id });
    yield put(stopLoading());  
  } catch (error) {
    yield put<EmpleadosErrorAction>({ type: constants.EMPLEADOS_ADD_FAVORITE_FAILED, error });
    yield put(stopLoadingWithError()); 
  }
}

export function* removeFromFavoriteEmpleado(action: AnyAction): Generator {
  try {
    yield put(startLoading());  
    const { id } = action;
    yield call(removeFavoriteEmpleado, id);
    yield put<EmpleadosFavoritoSuccessAction>({ type: constants.EMPLEADOS_REMOVE_FAVORITE_SUCCEEDED, message: "Se logro remover como favorito", id });
    yield put(stopLoading());  
  } catch (error) {
    yield put<EmpleadosErrorAction>({ type: constants.EMPLEADOS_REMOVE_FAVORITE_FAILED, error });
    yield put(stopLoadingWithError());  
  }
}

export function* watchEmpleados() {
  yield all([
    takeLatest(constants.EMPLEADOS_GET_INFO_REQUESTED, getEmpleados),
    takeLatest(constants.EMPLEADOS_ADD_FAVORITE_REQUESTED, addToFavoriteEmpleado),
    takeLatest(constants.EMPLEADOS_REMOVE_FAVORITE_REQUESTED, removeFromFavoriteEmpleado),
  ]);
}
