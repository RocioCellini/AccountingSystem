<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Estado;
use App\Models\Novedad;
use App\Models\Comision;
use App\Models\Empleado;
use App\Models\Parametro;
use PhpParser\Node\Param;
use App\Models\TipoCambio;
use Illuminate\Http\Request;
use App\Models\BonoSemestral;
use App\Models\CalendarioBono;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\BonoTrimestralDistribucion;
use App\Models\BonoTrimestralRecomendacion;

class BonoTrimestralController extends Controller
{
    public function getSugerencias()
    {
        try{
            $empleadosPadres = Empleado::whereNull('padre_id')->pluck('padre_id')->unique();
            $empleados = Empleado::whereIn('id',$empleadosPadres)->get();
            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

            $periodo = Parametro::whereCodigo('CIERRE')->value('valor_fecha');
            $fecha = Carbon::parse($periodo)->startOfMonth()->addMonth()->format("Ymd");
            foreach($empleados as $key =>$empleado){
                $empleados[$key]->bonos_trimestral_importe = BonoTrimestralRecomendacion::whereDate('fecha',$fecha)->whereEmpleadoId($empleado->id)->value("importe") ?? 0;
            }

            $periodo = Carbon::parse($fecha)->format("Y-m");

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las sugerencias. '.$ex, 500);
        }

        return $this->successResponse(['empleados'=>$empleados,"periodo"=>$periodo,"fecha"=>$fecha], 200);
    }

    public function saveSugerencias(Request $request){
        $periodo = $request->fecha;
        foreach($request->empleados as $empleado){
            $empleado = (object) $empleado;

            BonoTrimestralRecomendacion::updateOrCreate([
                "empleado_id"=>$empleado->id,
                "fecha"=>$periodo,
            ],[
                "empleado_id"=>$empleado->id,
                "fecha"=>$periodo,
                "importe"=>$empleado->bonos_trimestral_importe,
            ]);

        }
        return $this->getSugerencias();

    }

    public function getMyPool()
    {
        try{
            $user = User::whereId(Auth::id())->first();
            $empleado = $user->Empleado;

            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU"){
                $empleados = Empleado::whereNull('fecha_baja')->orderBy('nombre_apellido','asc')->get();
            } else {
                $empleados = Empleado::whereNull('fecha_baja')->wherePadreId($empleado->id)->orWhere('id',$empleado->id);
                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            }


            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

            $periodo = Parametro::whereCodigo('CIERRE')->value('valor_fecha');
            $fecha = Carbon::parse($periodo)->startOfMonth()->addMonth()->format("Ymd");
            foreach($empleados as $key =>$empleado){
                $empleados[$key]->bono_trimestral_distribuido = BonoTrimestralDistribucion::whereDate('fecha',$fecha)->whereEmpleadoId($empleado->id)->value('importe') ?? 0;
                $empleados[$key]->bono_trimestral_estado = BonoTrimestralDistribucion::whereDate('fecha',$fecha)->whereEmpleadoId($empleado->id)->first()->Estado ?? null;
            }
            $periodo = Carbon::parse($fecha)->format("Y-m");

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los bonos. '.$ex, 500);
        }

        return $this->successResponse(['empleados'=>$empleados,"periodo"=>$periodo,"fecha"=>$fecha], 200);
    }


    public function getAprobadosParaAjustar()
    {
        try{
            $user = User::whereId(Auth::id())->first();
            $periodo = Parametro::whereCodigo('CIERRE')->value('valor_fecha');
            $fecha = Carbon::parse($periodo)->startOfMonth()->addMonth()->format("Ymd");

            $bonos = BonoTrimestralDistribucion::whereDate('fecha',$fecha)->get();
            $bonos->load(['Estado','Empleado','Empleado.Empresa','Empleado.Sector','Empleado.Puesto','Empleado.Padre','Empleado.Subsegmento']);

            $tipoCambio = TipoCambio::wherePeriodo(Carbon::parse($fecha)->format("Ym"))->value('cotizacion');
            $periodo = Carbon::parse($fecha)->format("Y-m");

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los bonos aprobados. '.$ex, 500);
        }

        return $this->successResponse(['bonos'=>$bonos,'tipo_cambio'=>$tipoCambio,"periodo"=>$periodo,"fecha"=>$fecha], 200);
    }


    public function savePool(Request $request){
        $periodo = $request->fecha;
        foreach($request->empleados as $empleado){
            $empleado = (object) $empleado;
            if(($empleado->bono_trimestral_distribuido ?? 0) != 0){
                BonoTrimestralDistribucion::updateOrCreate([
                    "empleado_id"=>$empleado->id,
                    "fecha"=>$periodo,
                ],[
                    "empleado_id"=>$empleado->id,
                    "fecha"=>$periodo,
                    "importe"=>$empleado->bono_trimestral_distribuido,
                    "estado_id"=>Estado::whereCodigo("PEN")->value('id'),
                    "user_id"=>Auth::id(),
                    "aprobador_id"=>null,
                    "fecha_aprobacion"=>null
                ]);
            }
        }
        return $this->getMyPool();

    }


    public function getBonosTrimestralesPendientesDeAprobacion()
    {
        try{
            $bonos = BonoTrimestralDistribucion::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
            $bonos->load(['User','Empleado','Empleado.Sector']);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los bonos. '.$ex, 500);
        }

        return $this->successResponse(['bonos'=>$bonos], 200);
    }

    public function saveAjustes(Request $request){
        $periodo = $request->fecha;
        foreach($request->bonos as $bono){
            $bono = (object) $bono;
            $bonoTrimestral = BonoTrimestralDistribucion::whereId($bono->id)->first();
            $bonoTrimestral->ajuste = $bono->ajuste;
            $bonoTrimestral->save();
        }
        return $this->getBonosTrimestralesPendientesDeAprobacion();

    }

    public function aprobarRechazar(Request $request)
    {
        $bono = BonoTrimestralDistribucion::whereId($request->id)->first();
        $bono->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
        $bono->aprobador_id = Auth::id();
        $bono->fecha_aprobacion = Carbon::now()->format("Ymd");
        $bono->save();

        return $this->getBonosTrimestralesPendientesDeAprobacion();
    }

    public function aprobarRechazarMasivo(Request $request)
    {
        foreach($request->rows as $row){
            $bono = BonoTrimestralDistribucion::whereId($row['id'])->first();
            $bono->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
            $bono->aprobador_id = Auth::id();
            $bono->fecha_aprobacion = Carbon::now()->format("Ymd");
            $bono->save();
        }
        return $this->getBonosTrimestralesPendientesDeAprobacion();
    }


}
