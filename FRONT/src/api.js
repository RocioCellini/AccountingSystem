import axios from "axios";
import { API_URL } from "./configs/config";
import Cookies from "js-cookie";

class Api {
  urlBase = () => {
    return API_URL;
  };

  headers = () => {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + Cookies.get("api_token"),
    };
  };

  options = (method) => {
    return {
      method: method,
      headers: this.headers(),
    };
  };

  login = async (data) => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    let url = this.urlBase() + "login";

    let response = await axios.post(url, data, requestOptions);
    return response;
  };

  forgotPassword = async (data) => {
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    let url = this.urlBase() + "recuperar";

    let response = await axios.post(url, data, requestOptions);
    return response.data;
  };

  changePassword = async (nuevaPassword) => {
    let data = {
      password: nuevaPassword,
    };

    let url = this.urlBase() + "users/change-password";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getUsers = async () => {
    let url = this.urlBase() + "users/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getStatics = async () => {
    let url = this.urlBase() + "statics";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getAltas = async () => {
    let url = this.urlBase() + "altas/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getNovedadesPendientesAprobacion = async () => {
    let url = this.urlBase() + "novedades/get-pendientes-aprobacion";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getNovedadesPorPeriodo = async (fecha) => {
    let url = this.urlBase() + "novedades/por-periodo/" + fecha;

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getHorasExtrasPendientesAprobacion = async () => {
    let url = this.urlBase() + "novedades/get-hs-pendientes-aprobacion";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getEmpleados = async (include = false, soloActivos = true) => {
    let url = this.urlBase() + "empleados/get";
    url += "/" + (include ? "1" : "0");
    url += "/" + (soloActivos ? "1" : "0");

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getIncrementosMasivos = async (include = false, soloActivos = true) => {
    let url = this.urlBase() + "empleados/incrementos-masivos/get";
    url += "/" + (include ? "1" : "0");
    url += "/" + (soloActivos ? "1" : "0");

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getCuotapartistas = async () => {
    let url = this.urlBase() + "cuotapartistas/get";
    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getCuotapartista = async (id) => {
    let url = this.urlBase() + "cuotapartistas/getone/" + id;
    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getComitentes = async () => {
    let url = this.urlBase() + "comitentes/get";
    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getComitente = async (id) => {
    let url = this.urlBase() + "comitentes/getone/" + id;
    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getEmpleado = async (id) => {
    let url = this.urlBase() + "empleados/getone/";

    let response = await axios.get(url + id, this.options("GET"));
    return response.data;
  };

  setComercial = async (data) => {
    let url = this.urlBase() + "empleados/set-comercial";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getEstimaciones = async (id) => {
    let url = this.urlBase() + "empleados/estimaciones/" + id;

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getHistorial = async (id) => {
    let url = this.urlBase() + "empleados/historial/" + id;

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveNovedades = async (data) => {
    let url = this.urlBase() + "empleados/save-novedades";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarNovedad = async (data) => {
    let url = this.urlBase() + "novedades/aprobar-rechazar";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarNovedades = async (data) => {
    let url = this.urlBase() + "novedades/aprobar-rechazar-masivo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarHorasExtras = async (data) => {
    let url = this.urlBase() + "novedades/aprobar-rechazar-hs";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarHorasExtrasMasivas = async (data) => {
    let url = this.urlBase() + "novedades/aprobar-rechazar-hs-masivo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  saveUser = async (user) => {
    let data = user;
    let url = this.urlBase() + "users/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  deleteUser = async (id) => {
    let data = {
      user_id: id,
    };
    let url = this.urlBase() + "users/delete";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  restoreUser = async (id) => {
    let data = {
      user_id: id,
    };
    let url = this.urlBase() + "users/restore";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getEmpresas = async () => {
    let url = this.urlBase() + "empresas/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };
  getGerente = async () => {
    let url = this.urlBase() + "empleados/gerentes";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getOficiales = async () => {
    let url = this.urlBase() + "oficiales/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getOficial = async (id) => {
    let url = this.urlBase() + "oficiales/getOne/" + id;

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getFondos = async () => {
    let url = this.urlBase() + "fondos/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getFondo = async (id) => {
    let url = this.urlBase() + "fondos/getOne/" + id;

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveFondo = async (data) => {
    let url = this.urlBase() + "fondos/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  setEsDedicado = async (data) => {
    let url = this.urlBase() + "fondos/set-es-dedicado";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  attachFondoOficial = async (data) => {
    let url = this.urlBase() + "fondos/attach-oficial";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  dettachFondoOficial = async (data) => {
    let url = this.urlBase() + "fondos/dettach-oficial";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  attachOficial = async (data) => {
    let url = this.urlBase() + "oficiales/attach";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  dettachOficial = async (data) => {
    let url = this.urlBase() + "oficiales/dettach";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  syncOficial = async (data) => {
    let url = this.urlBase() + "oficiales/sync";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  attachFondo = async (data) => {
    let url = this.urlBase() + "empleados/attach-fondo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  dettachFondo = async (data) => {
    let url = this.urlBase() + "empleados/dettach-fondo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  attachCuotapartista = async (data) => {
    let url = this.urlBase() + "empleados/attach-cuotapartista";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  dettachCuotapartista = async (data) => {
    let url = this.urlBase() + "empleados/dettach-cuotapartista";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getPuestos = async () => {
    let url = this.urlBase() + "puestos/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getSectores = async () => {
    let url = this.urlBase() + "sectores/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getLlavesDistribucion = async () => {
    let url = this.urlBase() + "llaves/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getCuentasContables = async () => {
    let url = this.urlBase() + "cuentas/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getCentrosCosto = async () => {
    let url = this.urlBase() + "centros/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getConceptosLiquidacion = async () => {
    let url = this.urlBase() + "conceptos/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveLlaveDistribucion = async (data) => {
    let url = this.urlBase() + "llaves/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  saveCuentaContable = async (data) => {
    let url = this.urlBase() + "cuentas/asignar";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getSubsegmentos = async () => {
    let url = this.urlBase() + "subsegmentos/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveAlta = async (data) => {
    let url = this.urlBase() + "altas/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  saveEmpleado = async (data) => {
    let url = this.urlBase() + "empleados/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  saveCuotapartista = async (data) => {
    let url = this.urlBase() + "cuotapartistas/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  saveComitente = async (data) => {
    let url = this.urlBase() + "comitentes/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  attachFondoCuotapartista = async (data) => {
    let url = this.urlBase() + "cuotapartistas/fondos/attach";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  dettachFondoCuotapartista = async (data) => {
    let url = this.urlBase() + "cuotapartistas/fondos/dettach";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  pasarANomina = async (data) => {
    let url = this.urlBase() + "altas/nomina";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarAlta = async (data) => {
    let url = this.urlBase() + "altas/aprobar_rechazar";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getInfo = async () => {
    let url = this.urlBase() + "users/my-info";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getConfiguraciones = async () => {
    let url = this.urlBase() + "configuraciones/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveFechaCierre = async (data) => {
    let url = this.urlBase() + "configuraciones/save-fecha-cierre";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  uploadLiquidacion = async (data) => {
    let url = this.urlBase() + "importaciones/store-liquidacion";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  uploadNomina = async (data) => {
    let url = this.urlBase() + "importaciones/store-nomina";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  uploadComisiones = async (data) => {
    let url = this.urlBase() + "importaciones/store-comisiones";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  uploadLiquidacionBejerman = async (data) => {
    let url = this.urlBase() + "importaciones/store-liquidacion-bejerman";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  downloadNovedades = async (data) => {
    let url = this.urlBase() + "exportaciones/novedades";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  downloadComisionesSeeker = async (data) => {
    let url = this.urlBase() + "exportaciones/comisiones";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  downloadAsientosContables = async (data) => {
    let url = this.urlBase() + "exportaciones/asientos-contables";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  downloadComparativo = async (data) => {
    let url = this.urlBase() + "exportaciones/comparativo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getTipoCambio = async () => {
    let url = this.urlBase() + "tiposcambio/get";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveTipoCambio = async (data) => {
    let url = this.urlBase() + "tiposcambio/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getComisiones = async (periodo) => {
    let url = this.urlBase() + "comisiones/get/" + periodo;

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getComisionesPendientes = async () => {
    let url = this.urlBase() + "comisiones/get-pendientes";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveComisiones = async (data) => {
    let url = this.urlBase() + "comisiones/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarComision = async (data) => {
    let url = this.urlBase() + "comisiones/aprobar_rechazar";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarComisiones = async (data) => {
    let url = this.urlBase() + "comisiones/aprobar_rechazar_masivo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getBonosSemestrales = async (periodo) => {
    let url = this.urlBase() + "bonos_semestrales/get";
    if (periodo) {
      url += "/" + periodo;
    }

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveBonosSemestrales = async (data) => {
    let url = this.urlBase() + "bonos_semestrales/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  saveIncrementosMasivos = async (data) => {
    let url = this.urlBase() + "empleados/incrementos-masivos/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  someterAprobacion = async (data) => {
    let url = this.urlBase() + "bonos_semestrales/confirm";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  downloadBonosSemestrales = async (periodo) => {
    let url = this.urlBase() + "bonos_semestrales/download";
    if (periodo) {
      url += "/" + periodo;
    }

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  downloadIncrementosMasivos = async () => {
    let url = this.urlBase() + "empleados/incrementos-masivos/download";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getBonosPendientesDeAprobacion = async () => {
    let url = this.urlBase() + "bonos_semestrales/get-pendientes-aprobacion";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  aprobarRechazarBono = async (data) => {
    let url = this.urlBase() + "bonos_semestrales/aprobar_rechazar";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarBonoMasivo = async (data) => {
    let url = this.urlBase() + "bonos_semestrales/aprobar_rechazar_masivo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getCalendarioBonos = async () => {
    let url = this.urlBase() + "configuraciones/get-calendario-bonos";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveCalendarioBonos = async (data) => {
    let url = this.urlBase() + "configuraciones/save-calendario-bonos";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getBonosTrimestrales = async (periodo) => {
    let url = this.urlBase() + "bonos_trimestrales/get-sugerencias";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveBonosTrimestralesSugerencias = async (data) => {
    let url = this.urlBase() + "bonos_trimestrales/save-sugerencias";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getBonosTrimestralesMyPool = async () => {
    let url = this.urlBase() + "bonos_trimestrales/get-pool";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  getBonosAprobadosParaAjustar = async () => {
    let url = this.urlBase() + "bonos_trimestrales/get-aprobados-para-ajustes";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveBonosTrimestralesDistribucion = async (data) => {
    let url = this.urlBase() + "bonos_trimestrales/save-pool";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getBonosTrimestralesPendientesDeAprobacion = async () => {
    let url = this.urlBase() + "bonos_trimestrales/get-pendientes-aprobacion";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  aprobarRechazarBonoTrimestral = async (data) => {
    let url = this.urlBase() + "bonos_trimestrales/aprobar_rechazar";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarBonoTrimestralMasivo = async (data) => {
    let url = this.urlBase() + "bonos_trimestrales/aprobar_rechazar_masivo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  saveBonosTrimestralesDistribucionAjustes = async (data) => {
    let url = this.urlBase() + "bonos_trimestrales/save-aprobados-para-ajustes";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getGratificacionesEspeciales = async (periodo) => {
    let url = this.urlBase() + "gratificaciones_especiales/get/" + periodo;

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  saveGratificacionesEspeciales = async (data) => {
    let url = this.urlBase() + "gratificaciones_especiales/save";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getGratificacionesEspecialesDeAprobacion = async () => {
    let url =
      this.urlBase() + "gratificaciones_especiales/get-pendientes-aprobacion";

    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  aprobarRechazarGratificacion = async (data) => {
    let url = this.urlBase() + "gratificaciones_especiales/aprobar_rechazar";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  aprobarRechazarGratificacionMasivo = async (data) => {
    let url =
      this.urlBase() + "gratificaciones_especiales/aprobar_rechazar_masivo";

    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getEvolutivos = async (
    fechaDesde,
    fechaHasta,
    empleado,
    detalleAprobadores,
    empleadosActivos
  ) => {
    let url = this.urlBase() + "exportaciones/historial";
    let data = {
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
      empleado: empleado,
      detalleAprobadores: detalleAprobadores,
      empleadosActivos: empleadosActivos,
    };
    let response = await axios.post(url, data, this.options("POST"));
    return response.data;
  };

  getNotificaciones = async () => {
    let url = this.urlBase() + "notificaciones/get";
    let response = await axios.get(url, this.options("GET"));
    return response.data;
  };

  leerNotificaciones = async () => {
    let url = this.urlBase() + "notificaciones/marcar-leido";
    let response = await axios.post(url, {}, this.options("POST"));
    return response.data;
  };

  addFavorito = async (empleadoId) => {
    let url = this.urlBase() + "empleados/favoritos/add";
    let response = await axios.post(
      url,
      { empleado_id: empleadoId },
      this.options("POST")
    );
    return response.data;
  };

  removeFavorito = async (empleadoId) => {
    let url = this.urlBase() + "empleados/favoritos/remove";
    let response = await axios.post(
      url,
      { empleado_id: empleadoId },
      this.options("POST")
    );
    return response.data;
  };
}

export default new Api();
