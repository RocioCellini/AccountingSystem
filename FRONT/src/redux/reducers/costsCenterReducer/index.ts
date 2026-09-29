import {
  DELETE_CENTER_FAILURE,
  DELETE_CENTER_SUCCESS,
  FETCH_CENTER_FAILURE,
  FETCH_CENTER_SUCCESS,
  UPDATE_COST_CENTER_FAILURE,
  UPDATE_COST_CENTER_SUCCESS,
  CREATE_COST_CENTER_SUCCESS,
  CREATE_COST_CENTER_FAILURE,
} from "../../constants/fetchCostsCenter/costsCenter.constants";

interface CostCenter {
  id: number;
  descripcion: string;
  tipo: string;
}

interface CostsCenterState {
  data: CostCenter[];
  error: string | null;
}

interface Action {
  type: string;
  data?: CostCenter[];
  newData?: CostCenter;
  updatedData?: CostCenter;
  id?: number;
  error?: string;
}

const initialState: CostsCenterState = {
  data: [],
  error: null,
};

const costsCenterReducer = (state: CostsCenterState = initialState, action: Action): CostsCenterState => {
  switch (action.type) {
    case FETCH_CENTER_SUCCESS:
      return {
        ...state,
        data: action.data || [],
      };
    case UPDATE_COST_CENTER_SUCCESS:
      const updatedDataList = state.data.map(item =>
        item.id === action.updatedData?.id ? { ...item, ...action.updatedData } : item
      );
      return {
        ...state,
        data: updatedDataList,
      };
    case CREATE_COST_CENTER_SUCCESS:
      if (!action.newData) {
        console.error('Received undefined newData in CREATE_COST_CENTER_SUCCESS');
        return state;
      }
      return {
        ...state,
        data: [...state.data, action.newData],
      };
    case DELETE_CENTER_SUCCESS:
      const newData = state.data.filter(item => item.id !== action.id);
      return {
        ...state,
        data: newData,
      };
    case FETCH_CENTER_FAILURE:
    case DELETE_CENTER_FAILURE:
    case UPDATE_COST_CENTER_FAILURE:
    case CREATE_COST_CENTER_FAILURE:
      return {
        ...state,
        error: action.error || 'Unknown error',
      };
    default:
      return state;
  }
};

export default costsCenterReducer;
