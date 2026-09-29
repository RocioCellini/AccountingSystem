import { ExampleState } from "../../../interfaces/example/example";
import * as constants from "../../constants/example.constants";



const defaultState: ExampleState = {
  data: {},
  loading: true,
}

const exampleReducer = (state: ExampleState = defaultState, action: any) => {
  const { type, data } = action;
  switch (type) {
    case constants.EXAMPLE_GET_INFO_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case constants.EXAMPLE_GET_INFO_SUCCEEDED:
      return {
        ...state,
        loading: false,
        data: data
      }
    case constants.EXAMPLE_GET_INFO_FAILED:
      return defaultState;
    default:
      return state;
  }
};

export default exampleReducer;