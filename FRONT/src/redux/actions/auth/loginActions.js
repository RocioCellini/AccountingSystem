import axios from "axios";

export const changeRole = role => {
  return dispatch =>
    dispatch({ type: "CHANGE_ROLE", userRole: role, isLoggedIn: true });
};

export const login = data => {
  return async dispatch => {
    await axios
      .post("https://teregalo.credi-up.com.ar/api/login", { data })
      .then(response => {
        dispatch({ type: "LOGIN", response });
      })
      .catch(err => {});
  };
};
