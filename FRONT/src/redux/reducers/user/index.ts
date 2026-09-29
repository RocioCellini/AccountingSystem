import Cookies from "js-cookie";
import { ShowAlert } from "../../../components/@vuexy/showAlert/ShowAlert";
import * as constants from "../../constants/app.constants";


const defaultState = {
	info: {
		stateToken: "",
		factorId: "",
		token: "",
		statusAccess: false,
		mfa: false,
	},
	user: { data: {}, email: "", role: "", name: "" },
	loading: false,
	message: "",
};

const userReducer = (state = defaultState, action: any) => {
	const { data, type, error, status } = action;

	switch (type) {
		case constants.USER_LOGIN_REQUESTED:
			return {
				...state,
				loading: true,
			};

		case constants.USER_LOGIN_SUCCEEDED:
			Cookies.set("user", JSON.stringify(data.user), {  sameSite: "Strict" });
            Cookies.set("api_token", data.token, {  sameSite: "Strict" });
			const newState = {
				...state,
				loading: false,
				user: {
					data: data.user,
					email: data.user.email,
					role: data.user.Rol?.codigo || "",  //se cambio rol por Rol para sacar okta
					name: data.user.name,
				},
				info: {
					...state.info,
					token: data.token,
					statusAccess: true,
				},
			};
			return newState;

		case constants.USER_LOGIN_FAILED:
			ShowAlert.error(error);
			Cookies.remove("user");
            Cookies.remove("api_token");
			return {
				...state,
				loading: false,
				message: error,
			};

		case constants.USER_GET_INFO_SUCCEEDED:
			return {
				...state,
				user: {
					...state.user,
					data: data,
					email: data.email,
					role: data.Rol?.codigo || "",   //se cambio rol por Rol para sacar okta
					name: data.name,
				},
				info: {
					...state.info,
					statusAccess: true,
				},
			};

		case constants.USER_GET_INFO_FAILED:
			Cookies.remove("user");
			Cookies.remove("api_token");
			return defaultState;

		case constants.USER_LOGOUT_SUCCEEDED:
			Cookies.remove("user");
			Cookies.remove("api_token");
			return defaultState;

		case constants.USER_CHANGE_STATUS_REQUESTED:
			return {
				...state,
				info: {
					...state.info,
					statusAccess: status,
				},
			};

		default:
			return state;
	}
};

export default userReducer;
