<?php

use App\Http\Controllers\AltasController;
use App\Http\Controllers\BonoSemestralController;
use App\Http\Controllers\BonoTrimestralController;
use App\Http\Controllers\CentroCostoController;
use App\Http\Controllers\ComisionesController;
use App\Http\Controllers\ConfiguracionesController;
use App\Http\Controllers\CuentasContablesController;
use App\Http\Controllers\CuotapartistasController;
use App\Http\Controllers\EmpleadosController;
use App\Http\Controllers\EmpresasController;
use App\Http\Controllers\FondosController;
use App\Http\Controllers\GratificacionEspecialController;
use App\Http\Controllers\ImportacionController;
use App\Http\Controllers\LlaveDistribucionController;
use App\Http\Controllers\NotificacionesController;
use App\Http\Controllers\NovedadesController;
use App\Http\Controllers\OficialesController;
use App\Http\Controllers\PuestosController;
use App\Http\Controllers\SectoresController;
use App\Http\Controllers\StaticController;
use App\Http\Controllers\SubsegmentoController;
use App\Http\Controllers\TipoCambioController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login',[UserController::class, 'login']);
Route::post('recuperar',[UserController::class, 'recuperarContrasena']);

Route::group(['middleware' => ['cors']], function () {
    Route::middleware('auth:api')->group(function () {
        Route::get('statics',[StaticController::class, 'index']);

        Route::get('users/get', [UserController::class, 'getAll']);
        Route::post('users/change-password', [UserController::class, 'changePassword']);
        Route::post('users/save', [UserController::class, 'save']);
        Route::post('users/delete', [UserController::class, 'delete']);
        Route::post('users/restore', [UserController::class, 'restore']);
        Route::get('users/my-info', [UserController::class, 'myInfo']);
        Route::get('users/get-users', [UserController::class, 'getUsers']);
        Route::get('users/export-users', [UserController::class, 'exportUsers']);


        Route::get('altas/get', [AltasController::class, 'getAll']);
        Route::post('altas/save', [AltasController::class, 'save']);
        Route::post('altas/aprobar_rechazar', [AltasController::class, 'aprobarRechazar']);
        Route::post('altas/nomina', [AltasController::class, 'nomina']);


        Route::get('cuotapartistas/get', [CuotapartistasController::class, 'getAll']);
        Route::get('cuotapartistas/getone/{id}', [CuotapartistasController::class, 'getOne']);
        Route::post('cuotapartistas/save', [CuotapartistasController::class, 'save']);

        Route::post('cuotapartistas/fondos/attach', [CuotapartistasController::class, 'attach']);
        Route::post('cuotapartistas/fondos/dettach', [CuotapartistasController::class, 'dettach']);



        Route::get('empleados/get/{include?}/{soloActivos?}', [EmpleadosController::class, 'getAll']);
        Route::get('empleados/getone/{id}', [EmpleadosController::class, 'getOne']);
        Route::get('empleados/estimaciones/{id}', [EmpleadosController::class, 'getEstimacion']);
        Route::get('empleados/historial/{id}', [EmpleadosController::class, 'getHistorial']);
        Route::get('empleados/gerentes', [EmpleadosController::class, 'getGerentes']);
        Route::post('empleados/save-novedades', [EmpleadosController::class, 'saveNovedades']);
        Route::post('empleados/set-comercial', [EmpleadosController::class, 'setearComercial']);
        Route::post('empleados/favoritos/add', [EmpleadosController::class, 'addFavorito']);
        Route::post('empleados/favoritos/remove', [EmpleadosController::class, 'removeFavorito']);
        Route::post('empleados/save', [EmpleadosController::class, 'save']);
        Route::post('empleados/attach-fondo', [EmpleadosController::class, 'attachFondo']);
        Route::post('empleados/dettach-fondo', [EmpleadosController::class, 'dettachFondo']);
        Route::get('empleados/incrementos-masivos/get/{include?}/{soloActivos?}', [EmpleadosController::class, 'getIncrementosMasivos']);
        Route::post('empleados/incrementos-masivos/save', [EmpleadosController::class, 'saveIncrementosMasivos']);
        Route::get('empleados/incrementos-masivos/download', [EmpleadosController::class, 'downloadIncrementosMasivos']);



        Route::post('empleados/attach-cuotapartista', [EmpleadosController::class, 'attachCuotapartista']);
        Route::post('empleados/dettach-cuotapartista', [EmpleadosController::class, 'dettachCuotapartista']);

        Route::get('novedades/get-pendientes-aprobacion', [NovedadesController::class, 'getPendienteDeAprobacion']);
        Route::get('novedades/get-hs-pendientes-aprobacion', [NovedadesController::class, 'getHorasExtrasPendienteDeAprobacion']);
        Route::post('novedades/aprobar-rechazar', [NovedadesController::class, 'aprobarRechazar']);
        Route::post('novedades/aprobar-rechazar-masivo', [NovedadesController::class, 'aprobarRechazarMasivo']);
        Route::post('novedades/aprobar-rechazar-hs', [NovedadesController::class, 'aprobarRechazarHorasExtras']);
        Route::post('novedades/aprobar-rechazar-hs-masivo', [NovedadesController::class, 'aprobarRechazarHorasExtrasMasivo']);
        Route::get('novedades/por-periodo/{fecha?}', [NovedadesController::class, 'getNovedadesPorPeriodo']);


        Route::get('fondos/get', [FondosController::class, 'getAll']);
        Route::get('fondos/getOne/{id?}', [FondosController::class, 'getOne']);
        Route::post('fondos/save', [FondosController::class, 'save']);
        Route::post('fondos/set-es-dedicado', [FondosController::class, 'setEsDedicado']);


        Route::get('oficiales/get', [OficialesController::class, 'getAll']);
        Route::get('oficiales/getOne/{id?}', [OficialesController::class, 'getOne']);
        Route::post('oficiales/attach', [OficialesController::class, 'attach']);
        Route::post('oficiales/dettach', [OficialesController::class, 'dettach']);

        Route::get('empresas/get', [EmpresasController::class, 'getAll']);
        Route::post('empresas/save', [EmpresasController::class, 'save']);
        Route::post('empresas/delete', [EmpresasController::class, 'delete']);
        Route::post('empresas/restore', [EmpresasController::class, 'restore']);

        Route::get('subsegmentos/get', [SubsegmentoController::class, 'getAll']);
        Route::post('subsegmentos/save', [SubsegmentoController::class, 'save']);
        Route::post('subsegmentos/delete', [SubsegmentoController::class, 'delete']);
        Route::post('subsegmentos/restore', [SubsegmentoController::class, 'restore']);

        Route::get('sectores/get', [SectoresController::class, 'getAll']);
        Route::post('sectores/save', [SectoresController::class, 'save']);
        Route::post('sectores/delete', [SectoresController::class, 'delete']);
        Route::post('sectores/restore', [SectoresController::class, 'restore']);

        Route::get('puestos/get', [PuestosController::class, 'getAll']);
        Route::post('puestos/save', [PuestosController::class, 'save']);
        Route::post('puestos/delete', [PuestosController::class, 'delete']);
        Route::post('puestos/restore', [PuestosController::class, 'restore']);

        Route::get('centros/get', [CentroCostoController::class, 'getAll']);
        Route::post('centros/update', [CentroCostoController::class, 'update']);
        Route::delete('centros/delete/{id}', [CentroCostoController::class, 'delete']);

        Route::get('llaves/get', [LlaveDistribucionController::class, 'getAll']);
        Route::get('llaves/getone/{id?}', [LlaveDistribucionController::class, 'getOne']);
        Route::post('llaves/save', [LlaveDistribucionController::class, 'save']);
        Route::post('llaves/attach', [LlaveDistribucionController::class, 'attachCentroCosto']);
        Route::post('llaves/detach', [LlaveDistribucionController::class, 'dettachCentroCosto']);


        Route::get('cuentas/get', [CuentasContablesController::class, 'getAll']);
        Route::post('cuentas/asignar', [CuentasContablesController::class, 'asignar']);
        Route::get('conceptos/get', [CuentasContablesController::class, 'getConceptos']);


        Route::post('importaciones/store-nomina', [ImportacionController::class, 'storeNomina']);
        Route::post('importaciones/store-comisiones', [ImportacionController::class, 'storeComisiones']);
        Route::post('importaciones/store-liquidacion-bejerman', [ImportacionController::class, 'storeLiquidacionBejerman']);
        Route::post('importaciones/store-liquidacion', [ImportacionController::class, 'storeLIquidacion']);
        Route::post('exportaciones/novedades', [ImportacionController::class, 'export']);
        Route::post('exportaciones/historial', [ImportacionController::class, 'exportEvolutivo']);
        Route::post('exportaciones/comparativo', [ImportacionController::class, 'exportComparativo']);
        Route::post('exportaciones/comisiones', [ImportacionController::class, 'exportReporteComisiones']);
        Route::post('exportaciones/asientos-contables', [ImportacionController::class, 'exportAsientosContables']);

        Route::get('configuraciones/get', [ConfiguracionesController::class, 'getAll']);
        Route::get('configuraciones/get-fecha-cierre', [ConfiguracionesController::class, 'getFechaCierre']);
        Route::post('configuraciones/save-fecha-cierre', [ConfiguracionesController::class, 'saveFechaCierre']);
        Route::get('configuraciones/get-calendario-bonos', [ConfiguracionesController::class, 'getCalendarioBono']);
        Route::post('configuraciones/save-calendario-bonos', [ConfiguracionesController::class, 'saveCalendarioBono']);

        Route::get('tiposcambio/get', [TipoCambioController::class, 'getAll']);
        Route::post('tiposcambio/save', [TipoCambioController::class, 'save']);

        Route::get('comisiones/get/{periodo?}', [ComisionesController::class, 'getAll']);
        Route::get('comisiones/get-pendientes/{include?}', [ComisionesController::class, 'getPendientes']);
        Route::post('comisiones/save', [ComisionesController::class, 'save']);
        Route::post('comisiones/aprobar_rechazar', [ComisionesController::class, 'aprobarRechazar']);
        Route::post('comisiones/aprobar_rechazar_masivo', [ComisionesController::class, 'aprobarRechazarMasivo']);


        Route::get('bonos_semestrales/download/{periodo?}/{include?}', [BonoSemestralController::class, 'download']);
        Route::get('bonos_semestrales/get/{periodo?}/{include?}', [BonoSemestralController::class, 'getAll']);
        Route::post('bonos_semestrales/save', [BonoSemestralController::class, 'save']);
        Route::post('bonos_semestrales/confirm', [BonoSemestralController::class, 'confirm']);
        Route::get('bonos_semestrales/get-pendientes-aprobacion', [BonoSemestralController::class, 'getBonosPendientesDeAprobacion']);
        Route::post('bonos_semestrales/aprobar_rechazar', [BonoSemestralController::class, 'aprobarRechazar']);
        Route::post('bonos_semestrales/aprobar_rechazar_masivo', [BonoSemestralController::class, 'aprobarRechazarMasivo']);

        Route::get('gratificaciones_especiales/get/{periodo?}/{include?}', [GratificacionEspecialController::class, 'getAll']);
        Route::post('gratificaciones_especiales/save', [GratificacionEspecialController::class, 'save']);
        Route::get('gratificaciones_especiales/get-pendientes-aprobacion', [GratificacionEspecialController::class, 'getBonosPendientesDeAprobacion']);
        Route::post('gratificaciones_especiales/aprobar_rechazar', [GratificacionEspecialController::class, 'aprobarRechazar']);
        Route::post('gratificaciones_especiales/aprobar_rechazar_masivo', [GratificacionEspecialController::class, 'aprobarRechazarMasivo']);

        Route::get('bonos_trimestrales/get-sugerencias', [BonoTrimestralController::class, 'getSugerencias']);
        Route::post('bonos_trimestrales/save-sugerencias', [BonoTrimestralController::class, 'saveSugerencias']);
        Route::get('bonos_trimestrales/get-pool', [BonoTrimestralController::class, 'getMyPool']);
        Route::post('bonos_trimestrales/save-pool', [BonoTrimestralController::class, 'savePool']);
        Route::get('bonos_trimestrales/get-pendientes-aprobacion', [BonoTrimestralController::class, 'getBonosTrimestralesPendientesDeAprobacion']);
        Route::get('bonos_trimestrales/get-aprobados-para-ajustes', [BonoTrimestralController::class, 'getAprobadosParaAjustar']);
        Route::post('bonos_trimestrales/save-aprobados-para-ajustes', [BonoTrimestralController::class, 'saveAjustes']);
        Route::post('bonos_trimestrales/aprobar_rechazar', [BonoTrimestralController::class, 'aprobarRechazar']);
        Route::post('bonos_trimestrales/aprobar_rechazar_masivo', [BonoTrimestralController::class, 'aprobarRechazarMasivo']);

        Route::get('notificaciones/get', [NotificacionesController::class, 'get']);
        Route::post('notificaciones/marcar-leido', [NotificacionesController::class, 'marcarLeido']);
    });
});
