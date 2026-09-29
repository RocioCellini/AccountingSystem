<?php

namespace App\Http\Controllers;

use App\Exports\BonoSemestralExport;
use App\Exports\NovedadesBejermanExport;
use App\Models\BonoSemestral;
use App\Models\CalendarioBono;
use App\Models\Comision;
use App\Models\Empleado;
use App\Models\Estado;
use App\Models\Notificacion;
use App\Models\Novedad;
use App\Models\Parametro;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use PhpParser\Node\Param;

class BonoSemestralController extends Controller
{
    public function getAll($periodo=null, $include = false)
    {
        try{
            $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();
            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU"){
                $empleados = Empleado::whereNull('fecha_baja')->orderBy('nombre_apellido','asc')->get();
            } else {
                $empleados = Empleado::wherePadreId($user->empleado_id)->whereNull('fecha_baja');
                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            }

            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

            $parametrc = Parametro::whereCodigo('CIERRE')->value('valor_fecha');
            $bonos = CalendarioBono::whereMes(Carbon::parse($parametrc)->startOfMonth()->addMonth()->format("m"))->value('porcentaje_sueldos');

            $fecha = Carbon::parse($periodo)->startOfMonth()->format("Ymd");
            foreach($empleados as $key => $empleado){
                $bono = BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha',$fecha)->first();
                $empleados[$key]->bonos_semestrales_cantidad =$bonos;
                $empleados[$key]->bonos_semestrales_sugerencia =$empleado->ultimo_sueldo * $bonos * $empleado->bono_semestral;
                $empleados[$key]->bonos_semestrales_importe = $bono->importe ?? ($empleado->ultimo_sueldo * $bonos * $empleado->bono_semestral);
                $empleados[$key]->bonos_semestrales_estado = $bono->Estado ?? null;
                $empleados[$key]->bonos_semestrales_fecha = $fecha ?? null;
            }

            $periodo = Carbon::parse($periodo)->startOfMonth()->format("Y-m");

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los bonos semestrales. '.$ex, 500);
        }

        return $this->successResponse(['empleados'=>$empleados,"periodo"=>$periodo,"fecha"=>$fecha,"bonos"=>$bonos], 200);
    }

    public function download($periodo=null, $include = false)
    {
        try{
            $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();
            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU"){
                $empleados = Empleado::whereNull('fecha_baja')->orderBy('nombre_apellido','asc')->get();
            } else {
                $empleados = Empleado::wherePadreId($user->empleado_id)->whereNull('fecha_baja');
                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            }

            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

            $parametrc = Parametro::whereCodigo('CIERRE')->value('valor_fecha');
            $bonos = CalendarioBono::whereMes(Carbon::parse($parametrc)->startOfMonth()->addMonth()->format("m"))->value('porcentaje_sueldos');

            $fecha = Carbon::parse($periodo)->startOfMonth()->addMonth()->format("Ymd");
            foreach($empleados as $key => $empleado){
                $bono = BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha',$fecha)->first();
                $empleados[$key]->bonos_semestrales_cantidad =$bonos;
                $empleados[$key]->bonos_semestrales_sugerencia =$empleado->ultimo_sueldo * $bonos * $empleado->bono_semestral;
                $empleados[$key]->bonos_semestrales_importe = $bono->importe ?? ($empleado->ultimo_sueldo * $bonos * $empleado->bono_semestral);
                $empleados[$key]->bonos_semestrales_estado = $bono->Estado ?? null;
                $empleados[$key]->bonos_semestrales_estado_descripcion = $bono->Estado->descripcion ?? null;
                $empleados[$key]->bonos_semestrales_fecha = $fecha ?? null;
            }

            $filename = date("YmdHis") . ".xls";
            Excel::store(new BonoSemestralExport($empleados), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al descargar los bonos semestrales. '.$ex, 500);
        }

        return $this->successResponse(['ruta' => $ruta], 200);
    }

    public function save(Request $request){
        $periodo = Carbon::now()->startOfMonth()->format("Ymd");
        foreach($request->empleados as $empleado){
            $empleado = (object) $empleado;
            $bono = BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha',$periodo)->first();
            if($empleado->bonos_semestrales_importe!=0 && (!isset($bono) || $bono->importe != $empleado->bonos_semestrales_importe || $bono->estado_id != Estado::whereCodigo($request->estado ? 'PEN' : "DRAFT")->value('id'))){
                BonoSemestral::updateOrCreate([
                    "empleado_id"=>$empleado->id,
                    "fecha"=>$periodo,
                ],[
                    "empleado_id"=>$empleado->id,
                    "fecha"=>$periodo,
                    "importe"=>$empleado->bonos_semestrales_importe,
                    "estado_id"=>Estado::whereCodigo($request->estado ? 'PEN' : "DRAFT")->value('id'),
                    "user_id"=>Auth::id(),
                    "aprobador_id"=>null,
                    "fecha_aprobacion"=>null
                ]);
            }
        }
        return $this->getAll();

    }

    public function confirm(Request $request){

        foreach($request->rows as $row){
            $estado = Estado::whereCodigo("PEN")->value('id');
            $bono = BonoSemestral::whereEmpleadoId($row['id'])->whereDate('fecha',$row['bonos_semestrales_fecha'])->first();
            $bono->estado_id=$estado;
            $bono->save();
        }

        return $this->getAll();
    }

    public function getBonosPendientesDeAprobacion()
    {
        try{
            $bonos = BonoSemestral::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
            $bonos->load(['User','Empleado','Empleado.Sector']);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los Bonos. '.$ex, 500);
        }

        return $this->successResponse(['bonos'=>$bonos], 200);
    }

    public function aprobarRechazar(Request $request)
    {
        $bono = BonoSemestral::whereId($request->id)->first();
        $bono->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
        $bono->aprobador_id = Auth::id();
        $bono->fecha_aprobacion = Carbon::now()->format("Ymd");
        $bono->save();

        return $this->getBonosPendientesDeAprobacion();
    }

    public function aprobarRechazarMasivo(Request $request)
    {
        foreach($request->rows as $row){
            $bono = BonoSemestral::whereId($row['id'])->first();
            $bono->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
            $bono->aprobador_id = Auth::id();
            $bono->fecha_aprobacion = Carbon::now()->format("Ymd");
            $bono->save();
        }
        return $this->getBonosPendientesDeAprobacion();
    }


}
