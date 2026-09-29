import { combineReducers } from "redux"
import customizer from "./customizer/"
import auth from "./auth/"
import navbar from "./navbar/Index"
import calenderReducer from "./calendar";
import novedadesReducer from "./novedades";
import costsCenterReducer from "./costsCenterReducer";
import empleadosReducer from "./empleados";
import oficialesReducer from "./oficialesDeCuenta";
import userReducer from "./user";
import loadingReducer from "./loading";
import altasReducer from "./altasReducer";


const rootReducer = combineReducers({
  customizer: customizer,
  auth: auth,
  novedadesReducer: novedadesReducer,
  navbar: navbar,
  calendar: calenderReducer,
  costsCenter:costsCenterReducer,
  empleados: empleadosReducer,
  oficiales: oficialesReducer,
  user: userReducer,
  loading: loadingReducer,
  altas: altasReducer,
})

export default rootReducer
