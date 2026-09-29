import { Middleware } from 'redux';
import * as constants from "../constants/app.constants";
import { history } from "../../history";
const redirectMiddleware: Middleware = () => (next) => (action) => {
  const { error, pathname, type } = action;
  switch (type) {
    case constants.USER_LOGOUT_REQUESTED:
      history.push(pathname || '/');
      break;
    /* case constants.USER_LOGIN_OKTA_SUCCEEDED:
      setTimeout(() => history.push(pathname || '/'), 0);
      break; */  //editado para sacar OKTA
    default:
      if (error?.response?.status === 401) setTimeout(() => history.push('/'), 0);
      break;
  }
  return next(action);
};

export default redirectMiddleware;


