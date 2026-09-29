import { START_LOADING, STOP_LOADING, STOP_LOADING_WITH_ERROR } from "../../constants/loading.constants";


interface LoadingState {
  isLoading: boolean;
  error: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
  error: false,
};

const loadingReducer = (state = initialState, action: any): LoadingState => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true, error: false };
    case STOP_LOADING:
      return { ...state, isLoading: false, error: false };
    case STOP_LOADING_WITH_ERROR:
      return { ...state, isLoading: false, error: true };
    default:
      return state;
  }
};

export default loadingReducer;
