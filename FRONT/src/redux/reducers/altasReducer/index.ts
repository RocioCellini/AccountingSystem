import {
  FETCH_ALTAS_FAILURE,
  FETCH_ALTAS_SUCCESS,
} from "../../constants/fetchAltas/altas.constants";
import { Alta } from "../../../types/altas/altasTypes";

interface AltasState {
  data: Alta[];
  error: string | null;
  message?: string;
}

interface Action {
  type: string;
  data?: Alta[];
  error?: string;
}

const initialState: AltasState = {
  data: [],
  error: null,
  message: "",
};

const altaReducer = (
  state: AltasState = initialState,
  action: Action
): AltasState => {
  switch (action.type) {
    case FETCH_ALTAS_SUCCESS:
      return {
        ...state,
        data: action.data || [],
      };
    case FETCH_ALTAS_FAILURE:
      return {
        ...state,
        error: action.error || "Unknown error",
      };
    default:
      return state;
  }
};

export default altaReducer;
