import * as constants from "../../constants/app.constants";

interface Oficiales {
  data: any;
}

const defaultState: Oficiales = {
  data: [],
};

const oficialesReducer = (state: Oficiales = defaultState, action: any) => {
  const { type, data } = action;

  switch (type) {
    case constants.OFICIALES_GET_INFO_REQUESTED:
      return {
        ...state,
        data: [], 
      };

    case constants.OFICIALES_GET_INFO_SUCCEEDED:

      return {
        ...state,
        data: data, 
      };

    case constants.OFICIALES_GET_INFO_FAILED:
      return defaultState; 

    default:
      return state;
  }
};

export default oficialesReducer;
