export const login = (state = { userRole: "Administrador" }, action) => {
  switch (action.type) {
    case "LOGIN": {
      return { ...state, user: action.user };
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole };
    }
    case "LOGOUT": {
      return { ...state, user: null };
    }
    default: {
      return state;
    }
  }
};
