
export const changeRole = role => {
    return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
};

export const login = (user) => {
    return dispatch => dispatch({type: "LOGIN", user})
};
