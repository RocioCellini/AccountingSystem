import * as constants from "../../constants/app.constants";
import { ShowAlert } from "../../../components/@vuexy/showAlert/ShowAlert";

interface Empleados {
  data: any;
}

const defaultState: Empleados = {
  data: [],
};

const empleadosReducer = (state: Empleados = defaultState, action: any) => {
  const { type, data, message, id } = action;
  switch (type) {
    case constants.EMPLEADOS_GET_INFO_REQUESTED:
      return {
        ...state,
        data: [], 
      };

    case constants.EMPLEADOS_GET_INFO_SUCCEEDED:
      return {
        ...state,
        data: data, 
      };

    case constants.EMPLEADOS_REMOVE_FAVORITE_REQUESTED: 
    case constants.EMPLEADOS_ADD_FAVORITE_REQUESTED: 
      ShowAlert.loading(message);
      return state;

    case constants.EMPLEADOS_ADD_FAVORITE_SUCCEEDED:
    case constants.EMPLEADOS_REMOVE_FAVORITE_SUCCEEDED:
      const nuevosDatos = state.data.map((item: any) => {
        if (item.id === id) {
          return { ...item, es_favorito: !item.es_favorito }; 
        }
        return item;
      });
      ShowAlert.success(message);
      return {
        ...state,
        data: nuevosDatos,
      };

    case constants.EMPLEADOS_REMOVE_FAVORITE_FAILED:
    case constants.EMPLEADOS_ADD_FAVORITE_FAILED:
    case constants.EMPLEADOS_GET_INFO_FAILED:
      ShowAlert.error(message);
      return state;

    default:
      return state;
  }
};

export default empleadosReducer;
