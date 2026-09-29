import { all, put, call, takeLatest } from "redux-saga/effects";
import * as constants from "../constants/app.constants";
import { AnyAction } from "redux";
//import { login, loginOKTA, getInfoUser } from "../../services/user.services";
import { login, getInfoUser } from "../../services/user.services";
import { changeStatus } from "../actions/user/user.actions";
import Cookies from "js-cookie";

export function* userLogin(action: any): Generator<any, void, any> {
	try {
		const { formData } = action; //esto lo deje como estaba
		//lo sig es agregado para sacar OKTA
		const response: any = yield call(login, formData);

        if (response.status === "success" && response.code === 200) {

            yield put({
                type: constants.USER_LOGIN_SUCCEEDED,
                data: {
                    token: response.data.token,
                    user: response.data,
                },
            });

            yield put(changeStatus(true));

        } else {

            yield put({
                type: constants.USER_LOGIN_FAILED,
                error: "Usuario o contraseña incorrectos"
            });

            Cookies.remove("user");
            Cookies.remove("api_token");
        }
		/* const response: any = yield call(login, formData);
		const { data } = response;

		if (response?.status === "ok" && response?.code === 200) {
			if (data.mfa === false) {
				yield put({
					type: constants.USER_LOGIN_SUCCEEDED,
					data: {
						token: data.token,
						user: data.data_user,
					},
				});
				yield put(changeStatus(true));
			} else if (data.mfa === true) {
				yield put({
					type: constants.USER_LOGIN_OKTA_REQUESTED,
					data: {
						stateToken: data.stateToken,
						factorId: data.factorId,
					},
				});
			}
		} else {
			yield put({ type: constants.USER_LOGIN_FAILED, error: "Error inesperado en el login" });
			Cookies.remove("user");
            Cookies.remove("api_token");
		} */
	/* } catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "Error de conexión";
		yield put({ type: constants.USER_LOGIN_FAILED, error: errorMessage });
		Cookies.remove("user");
		Cookies.remove("api_token");
	} */
	} catch (error: any) {

        yield put({
            type: constants.USER_LOGIN_FAILED,
            error
        });

        Cookies.remove("user");
        Cookies.remove("api_token");
    }
}

/* export function* userLoginOKTA(action: AnyAction): Generator {
	try {
		const { formData } = action;
		const response: any = yield call(loginOKTA, formData);
		const { data } = response;

		yield put({ type: constants.USER_LOGIN_OKTA_SUCCEEDED, data });
		yield put(changeStatus(true));
	} catch (error: any) {
		yield put({ type: constants.USER_LOGIN_OKTA_FAILED, error });
	}
} */  //editado para sacar OKTA

export function* getInfo(): Generator {
	try {
		const data = yield call(getInfoUser);
		yield put({ type: constants.USER_GET_INFO_SUCCEEDED, data });
	} catch (error) {
		yield put({ type: constants.USER_GET_INFO_FAILED, error });
		Cookies.remove("user");
        Cookies.remove("api_token");
	}
}

export function* userLogout(): Generator {
	try {
		Cookies.remove("user");
        Cookies.remove("api_token");
		yield put({ type: constants.USER_LOGOUT_SUCCEEDED });
	} catch (error: any) {
		yield put({ type: constants.USER_LOGOUT_FAILED, error });
	}
}

export function* userChangeRol(action: AnyAction): Generator {
	try {
		const { role } = action;
		yield put({ type: constants.USER_CHANGE_ROLE_SUCCEEDED, role });
	} catch (error: any) {
		yield put({ type: constants.USER_CHANGE_ROLE_FAILED, error });
	}
}

export function* watchUser() {
	yield all([
		takeLatest(constants.USER_LOGIN_REQUESTED, userLogin),
		//takeLatest(constants.USER_LOGIN_OKTA_REQUESTED, userLoginOKTA),  //editado para sacar OKTA
		takeLatest(constants.USER_GET_INFO_REQUESTED, getInfo),
		takeLatest(constants.USER_LOGOUT_REQUESTED, userLogout),
		takeLatest(constants.USER_CHANGE_ROLE_REQUESTED, userChangeRol),
	]);
}
