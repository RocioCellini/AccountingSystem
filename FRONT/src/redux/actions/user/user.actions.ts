import * as constants from '../../constants/app.constants';

export const getInfo = () => ({
  type: constants.USER_GET_INFO_REQUESTED,
});

export const login = (formData: any) => ({
  type: constants.USER_LOGIN_REQUESTED,
  formData,
});

/* export const loginOKTA = (formData: any) => ({
  type: constants.USER_LOGIN_OKTA_REQUESTED,
  formData,
}); */  //editado para sacar OKTA

export const changeStatus = (status: boolean) => {
  return {
    type: constants.USER_CHANGE_STATUS_REQUESTED,
    status,
  };
};
export const logout = () => ({
  type: constants.USER_LOGOUT_REQUESTED,
  pathname: "/login"
});

export const changeRole = (role: string) => ({
  type: constants.USER_CHANGE_ROLE_REQUESTED,
  role,
});

