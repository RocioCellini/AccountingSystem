import * as constants from '../../constants/app.constants';

export const getEmpleados = (include = false, soloActivos = true) => ({
  type: constants.EMPLEADOS_GET_INFO_REQUESTED,
  include,
  soloActivos
});

export const addFavoritoEmpleado = (id: number) => ({
  type: constants.EMPLEADOS_ADD_FAVORITE_REQUESTED,
  message: "Añadiendo a favoritos",
  id,
});

export const removeFavoritoEmpleado = (id: number) => ({
  type: constants.EMPLEADOS_REMOVE_FAVORITE_REQUESTED,
  message: "Eliminando de favoritos",
  id,
});


