<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Estado;
use App\Models\Notificacion;
use App\Models\Novedad;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NovedadesController extends Controller
{
    public function getPendienteDeAprobacion()
    {
        try{
            $novedades = Novedad::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->where('variacion','!=',0)->orderBy('empleado_id','asc')->get();
            $novedades->load(['PropuestoPor','Empleado','Empleado.Sector']);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las novedades. '.$ex, 500);
        }

        return $this->successResponse(['novedades'=>$novedades], 200);
    }

    public function getHorasExtrasPendienteDeAprobacion()
    {
        try{
            $novedades = Novedad::whereRaw('(horas_extras_50 + horas_extras_100) != 0')->whereHorasExtrasEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
            $novedades->load(['PropuestoPor','Empleado','Empleado.Sector']);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las novedades. '.$ex, 500);
        }

        return $this->successResponse(['novedades'=>$novedades], 200);
    }

    public function aprobarRechazar(Request $request)
    {
        $novedad = Novedad::whereId($request->id)->first();
        $novedad->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
        $novedad->user_aprobacion_incrementos_id = Auth::id();
        $novedad->incremento_fecha_aprobacion = Carbon::now()->format("Y-m-d H:i:s");
        $novedad->save();

        $padre = $novedad->Empleado->Padre;
        $userPadre = User::whereEmpleadoId($padre->id)->first();

        return $this->getPendienteDeAprobacion();
    }

    public function aprobarRechazarMasivo(Request $request)
    {
        foreach($request->rows as $row){
            $novedad = Novedad::whereId($row['id'])->first();
            $novedad->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
            $novedad->user_aprobacion_incrementos_id = Auth::id();
            $novedad->incremento_fecha_aprobacion = Carbon::now()->format("Y-m-d H:i:s");
            $novedad->save();

            $padre = $novedad->Empleado->Padre;
            $userPadre = User::whereEmpleadoId($padre->id)->first();
            Notificacion::create([
                'user_id'=>$userPadre->id,
                'texto'=>'Se ha ' . ($request->estado ? 'Aprobado' : 'Rechazado') . ' el Incremento Salarial de ' . $novedad->Empleado->nombre_apellido . ' para ' . Carbon::parse($novedad->fecha)->format("m-Y"),
                'tipo'=> ($request->estado ? 'success' : 'danger')
            ]);
        }

        return $this->getPendienteDeAprobacion();
    }


    public function aprobarRechazarHorasExtras(Request $request)
    {
        $novedad = Novedad::whereId($request->id)->first();
        $novedad->horas_extras_estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
        $novedad->horas_extras_user_aprobacion_incrementos_id = Auth::id();
        $novedad->horas_extras_fecha_aprobacion = Carbon::now()->format("Y-m-d H:i:s");
        $novedad->save();

        $padre = $novedad->Empleado->Padre;
        $userPadre = User::whereEmpleadoId($padre->id)->first();
        Notificacion::create([
            'user_id'=>$userPadre->id,
            'texto'=>'Se han ' . ($request->estado ? 'Aprobado' : 'Rechazado') . ' las horas extras de ' . $novedad->Empleado->nombre_apellido . ' para ' . Carbon::parse($novedad->fecha)->format("m-Y"),
            'tipo'=> ($request->estado ? 'success' : 'danger')
        ]);

        return $this->getHorasExtrasPendienteDeAprobacion();


    }

    public function aprobarRechazarHorasExtrasMasivo(Request $request)
    {
        foreach($request->rows as $row){
            $novedad = Novedad::whereId($row['id'])->first();
            $novedad->horas_extras_estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
            $novedad->horas_extras_user_aprobacion_incrementos_id = Auth::id();
            $novedad->horas_extras_fecha_aprobacion = Carbon::now()->format("Y-m-d H:i:s");
            $novedad->save();

            $padre = $novedad->Empleado->Padre;
            $userPadre = User::whereEmpleadoId($padre->id)->first();
            Notificacion::create([
                'user_id'=>$userPadre->id,
                'texto'=>'Se han ' . ($request->estado ? 'Aprobado' : 'Rechazado') . ' las horas extras de ' . $novedad->Empleado->nombre_apellido . ' para ' . Carbon::parse($novedad->fecha)->format("m-Y"),
                'tipo'=> ($request->estado ? 'success' : 'danger')
            ]);
        }
        return $this->getHorasExtrasPendienteDeAprobacion();
    }


    public function getNovedadesPorPeriodo($fecha)
    {
        try{

            $fechaProceso = Carbon::parse($fecha)->format("Ymd");
            $fechaDesde = Carbon::parse($fecha)->startOfMonth()->format("Ymd");
            $fechaHasta = Carbon::parse($fecha)->endOfMonth()->format("Ymd");

            $novedadesIncrementos = Novedad::where('variacion','!=',0)->whereBetween('fecha',[$fechaDesde,$fechaHasta])->orderBy('empleado_id','asc')->get();
            $novedadesHorasExtras = Novedad::whereRaw('(horas_extras_50 + horas_extras_100) != 0')->whereBetween('fecha',[$fechaDesde,$fechaHasta])->orderBy('empleado_id','asc')->get();

            $novedadesIncrementos->load(['PropuestoPor','Empleado','Empleado.Sector','Estado','IncrementoAprobadoPor']);
            $novedadesHorasExtras->load(['PropuestoPor','Empleado','Empleado.Sector','EstadoHorasExtras','HorasExtrasAprobadoPor']);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las novedades. '.$ex, 500);
        }

        return $this->successResponse(['novedades_incrementos'=>$novedadesIncrementos,'novedades_horas_extras'=>$novedadesHorasExtras], 200);
    }


}

