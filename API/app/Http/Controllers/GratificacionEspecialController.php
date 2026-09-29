<?php

namespace App\Http\Controllers;

use App\Mail\MailNuevaGratificacion;
use App\Mail\MailNuevoIncremento;
use App\Models\BonoSemestral;
use App\Models\CalendarioBono;
use App\Models\Comision;
use App\Models\Empleado;
use App\Models\Estado;
use App\Models\GratificacionEspecial;
use App\Models\Notificacion;
use App\Models\Novedad;
use App\Models\Parametro;
use App\Models\Rol;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use PhpParser\Node\Param;

class GratificacionEspecialController extends Controller
{
    public function getAll($include = false)
    {
        try{
            $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();
            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU"){
                $empleados = Empleado::whereNull('fecha_baja')->orderBy('nombre_apellido','asc')->get();

            } else {

                $empleados = Empleado::wherePadreId($user->empleado_id)->whereNull('fecha_baja');
                if($include){
                    $empleados = $empleados->orWhere('id',$user->empleado_id);
                }

                $empleados = Empleado::wherePadreId($user->empleado_id);
                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            }

            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

            $periodo = Parametro::whereCodigo('CIERRE')->value('valor_fecha');
            $bonos = CalendarioBono::whereMes(Carbon::parse($periodo)->addMonth()->month)->value('porcentaje_sueldos');
            $fecha = Carbon::parse($periodo)->startOfMonth()->addMonth()->format("Ymd");
            foreach($empleados as $key => $empleado){
                $bono = GratificacionEspecial::whereEmpleadoId($empleado->id)->whereDate('fecha',$fecha)->first();
                $empleados[$key]->gratificacion_especial_importe = $bono->importe ?? 0;
                $empleados[$key]->gratificacion_especial_estado = $bono->Estado ?? null;
            }
            $periodo = Carbon::parse($fecha)->format("Y-m");

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las gratificaciones. '.$ex, 500);
        }

        return $this->successResponse(['empleados'=>$empleados,"periodo"=>$periodo,"fecha"=>$fecha,"bonos"=>$bonos], 200);
    }

    public function save(Request $request){
        $periodo = $request->fecha;
        foreach($request->empleados as $empleado){
            $empleado = (object) $empleado;
            $bono = GratificacionEspecial::whereEmpleadoId($empleado->id)->whereDate('fecha',$periodo)->first();
            if((!isset($bono) && $empleado->gratificacion_especial_importe!=0) || ($bono->importe ?? 0) != $empleado->gratificacion_especial_importe ){
                $gratificacion = GratificacionEspecial::updateOrCreate([
                    "empleado_id"=>$empleado->id,
                    "fecha"=>$periodo,
                ],[
                    "empleado_id"=>$empleado->id,
                    "fecha"=>$periodo,
                    "importe"=>$empleado->gratificacion_especial_importe,
                    "estado_id"=>Estado::whereCodigo("PEN")->value('id'),
                    "user_id"=>Auth::id(),
                    "aprobador_id"=>null,
                    "fecha_aprobacion"=>null
                ]);

                $users = User::whereRolId(Rol::whereCodigo('APR')->value('id'))->get();
                foreach($users as $user){
                    Notificacion::create([
                        'user_id' => $user->id,
                        'texto' => 'Se han cargado  una gratificacion especial para ' . $gratificacion->Empleado->nombre_apellido . ' en el periodo ' . Carbon::parse($gratificacion->fecha)->format("m-Y"),
                        'tipo' => 'warning'
                    ]);
                }

                //Mail::to(env('MAIL_APROBADOR'))->send(new MailNuevaGratificacion($empleado, $gratificacion));
            }
        }


        return $this->getAll();

    }

    public function getBonosPendientesDeAprobacion()
    {
        try{
            $bonos = GratificacionEspecial::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
            $bonos->load(['User','Empleado','Empleado.Sector']);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los bonos. '.$ex, 500);
        }

        return $this->successResponse(['bonos'=>$bonos], 200);
    }

    public function aprobarRechazar(Request $request)
    {
        $bono = GratificacionEspecial::whereId($request->id)->first();
        $bono->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
        $bono->aprobador_id = Auth::id();
        $bono->fecha_aprobacion = Carbon::now()->format("Ymd");
        $bono->save();

        return $this->getBonosPendientesDeAprobacion();
    }

    public function aprobarRechazarMasivo(Request $request)
    {
        foreach($request->rows as $row){
            $bono = GratificacionEspecial::whereId($row['id'])->first();
            $bono->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
            $bono->aprobador_id = Auth::id();
            $bono->fecha_aprobacion = Carbon::now()->format("Ymd");
            $bono->save();
        }
        return $this->getBonosPendientesDeAprobacion();
    }


}
