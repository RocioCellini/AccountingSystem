<?php

namespace App\Http\Controllers;

use App\Classes\Helpers;
use App\Exports\BonoSemestralExport;
use App\Exports\IncrementosMasivosExport;
use App\Http\Requests\UpdateEmpleadoRequest;
use App\Mail\MailAprobacionRechazo;
use App\Mail\MailNuevoIncremento;
use App\Models\BonoSemestral;
use App\Models\CalendarioBono;
use App\Models\Cuotapartista;
use App\Models\Empleado;
use App\Models\EmpleadoCuotapartista;
use App\Models\EmpleadoFondo;
use App\Models\Estado;
use App\Models\Favorito;
use App\Models\Fondo;
use App\Models\Liquidacion;
use App\Models\Notificacion;
use App\Models\Novedad;
use App\Models\Parametro;
use App\Models\Rol;
use App\Models\Sistema;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;

class EmpleadosController extends Controller
{

    public function getAll($include = false, $soloActivos=true)
    {
        try{
            $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();

            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="APR" || $user->Rol->codigo=="SU"){
                if($soloActivos){
                    $empleados = Empleado::where('fecha_baja',null)->orderBy('nombre_apellido','asc')->get();
                } else {
                    $empleados = Empleado::orderBy('nombre_apellido','asc')->get();
                }
            } else if($user->Rol->codigo=="GTEF") {
                if($soloActivos){
                    $empleados = Empleado::where('fecha_baja',null)->wherePadreId($user->empleado_id);
                } else {
                    $empleados = Empleado::wherePadreId($user->empleado_id);
                }

                $empleados = $empleados->orWhere('es_comercial',true);
                if($include){
                    $empleados = $empleados->orWhere('id',$user->empleado_id);
                }

                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            } else {

                if($soloActivos){
                    $empleados = Empleado::where('fecha_baja',null)->wherePadreId($user->empleado_id);
                } else {
                    $empleados = Empleado::wherePadreId($user->empleado_id);
                }

                if($include){
                    $empleados = $empleados->orWhere('id',$user->empleado_id);
                }
                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            }

            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

            $empleados = array_values($empleados->toArray());

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los empleados. '.$ex, 500);
        }

        return $this->successResponse(['empleados'=>$empleados], 200);
    }

    public function getOne($id)
    {
        try{
            $empleado = Empleado::where('id',$id)->first();

            if(isset($empleado)){
                $empleado->load(['Empresa','Sector','Puesto','Padre','Subsegmento','Oficiales','Oficiales.Oficial','Fondos','Fondos.Fondo','Cuotapartistas','Cuotapartistas.Cuotapartista']);
            }else{
                return $this->errorResponse('El empleado no existe.', 400);
            }

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener el empleado. '.$ex, 500);
        }
        return $this->successResponse($empleado, 200);
    }

    public function getEstimacion($id)
    {
        try{
            $empleado = Empleado::whereId($id)->first();
            $fechaCierre = Carbon::parse(Parametro::whereCodigo('CIERRE')->value('valor_fecha'))->format("Ymd");
            $arr = [];

            for($i=1; $i<=6; $i++){
                $fecha = Carbon::parse($fechaCierre)->firstOfMonth()->addMonth($i)->endOfMonth();
                $novedad = Novedad::whereEmpleadoId($empleado->id)->whereDate('fecha',$fecha->format("Ymd"))->where('estado_id','!=',3)->first();
                if(isset($novedad)){
                    $novedad->load(['Estado','EstadoHorasExtras']);
                }
                $arr[] = [
                    'periodo'=>$fecha->format("m/Y"),
                    'novedad'=>$novedad,
                ];
            }

            $rechazos = Novedad::whereEmpleadoId($empleado->id)->where('estado_id',3)->get();

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los datos. '.$ex, 500);
        }

        return $this->successResponse(['novedades'=>$arr, 'empleado'=>$empleado,'rechazos'=>$rechazos], 200);
    }

    public function getHistorial($id)
    {
        try{
            $historial = Liquidacion::whereEmpleadoId($id)->orderBy('fecha','asc')->get();

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las liquidaciones. '.$ex, 500);
        }

        return $this->successResponse($historial, 200);
    }

    public function getGerentes()
    {
        try{
            $users=[];

            $usersGerentes = User::select('users.id','users.name','users.rol_id','users.empleado_id','users.active')
                                ->join('roles','users.rol_id','=','roles.id')
                                ->where('roles.codigo', 'GTE')
                                ->where('users.active', 1)
                                ->get();

            if(isset($usersGerentes)){
                foreach($usersGerentes as $user){
                    $users[]=[
                        'id'=>$user->id,
                        'descripcion'=>$user->name
                    ];
                }
            }

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los gerentes. '.$ex, 500);
        }
        return $this->successResponse($users, 200);
    }



    public function saveNovedades(Request $request)
    {
        try{
            $empleado = Empleado::whereId($request['empleado']['id'])->first();

            foreach($request['estimaciones'] as $periodo){
                $fecha = Carbon::parse(substr($periodo['periodo'],3,4).substr($periodo['periodo'],0,2)."01")->endOfMonth()->format("Ymd");
                $novedad = Novedad::whereEmpleadoId($empleado->id)->whereFecha($fecha)->first();

                $variacion = str_replace(",",".",$periodo['novedad']['variacion'] ?? 0);
                $sueldoBruto = $periodo['novedad']['sueldo_bruto'] ?? $empleado->ultimo_sueldo;
                $horasAl100 = str_replace(",",".",($periodo['novedad']['horas_extras_100'] ?? 0));
                $horasAl50 = str_replace(",",".",($periodo['novedad']['horas_extras_50']  ?? 0));


                if(!isset($novedad) && ($horasAl100 || $horasAl50 || $variacion)){
                    $novedad = Novedad::create([
                        'fecha'=>$fecha,
                        'empleado_id'=>$empleado->id,
                        'estado_id'=>Estado::whereCodigo('PEN')->value('id'),
                        'horas_extras_estado_id'=>Estado::whereCodigo('PEN')->value('id'),
                        'variacion'=>$variacion,
                        'sueldo_bruto'=>$sueldoBruto,
                        'horas_extras_100'=>$horasAl100,
                        'horas_extras_50'=>$horasAl50,
                        'user_propuesta_id'=>Auth::id()
                    ]);

                } else {
                    if(($horasAl100 || $horasAl50 || $variacion)){
                        if($sueldoBruto!=$novedad->sueldo_bruto){
                            $novedad->sueldo_bruto=$sueldoBruto;
                            $novedad->variacion=$variacion;
                            $novedad->estado_id=Estado::whereCodigo('PEN')->value('id');
                            $novedad->user_propuesta_id=Auth::id();
                            $novedad->save();
                        }

                        if($novedad->horas_extras_100!=$horasAl100 || $novedad->horas_extras_50!=$horasAl50){
                            $novedad->horas_extras_100=$horasAl100;
                            $novedad->horas_extras_50=$horasAl50;
                            $novedad->horas_extras_estado_id=Estado::whereCodigo('PEN')->value('id');
                            $novedad->user_propuesta_id=Auth::id();
                            $novedad->save();
                        }
                    }
                }

                if($horasAl100 || $horasAl50) {
                    $users = User::whereRolId(Rol::whereCodigo('APR')->value('id'))->get();
                    foreach($users as $user){
                        Notificacion::create([
                            'user_id' => $user->id,
                            'texto' => 'Se han cargado  horas extras de ' . $novedad->Empleado->nombre_apellido . ' para ' . Carbon::parse($novedad->fecha)->format("m-Y"),
                            'tipo' => 'warning'
                        ]);

                    }
                }

                if($variacion) {
                    $users = User::whereRolId(Rol::whereCodigo('APR')->value('id'))->get();
                    foreach($users as $user){
                        Notificacion::create([
                            'user_id' => $user->id,
                            'texto' => 'Se han cargado  un Incremento Salarial para  ' . $novedad->Empleado->nombre_apellido . ' en el mes de ' . Carbon::parse($novedad->fecha)->format("m-Y"),
                            'tipo' => 'warning'
                        ]);
                    }
                    //Mail::to(env('MAIL_APROBADOR'))->send(new MailNuevoIncremento($empleado, $novedad));
                }

            }
        }catch(\Exception $ex) {
            return $this->errorResponse('Error al guardar la Novedad. '.$ex, 500);
        }

        return $this->successResponse(true, 200);
    }

    public function setearComercial(Request $request){
        try{
            $empleado = Empleado::whereId($request->id)->first();
            $empleado->es_comercial = $request->value;
            $empleado->save();

        }catch(\Exception $ex){
            return $this->errorResponse('Error al modificar el empleado. '.$ex, 500);
        }

        return $this->successResponse("El empleado ha sido modificado correctamente", 200);
    }


    public function save(Request $request){
        try{
            $validation = Helpers::validateWithRequest($request->all(),new UpdateEmpleadoRequest());
            if($validation!=[]){ return response()->json(['status'=>422,'data'=>$validation],200); }

            //Buscamos el empleado
            $empleado = Empleado::whereId($request->id)->first();

            //Buscamos los días de vac que ya tiene asignados
            if(isset($empleado->dias_vacaciones)){
                $dias_vac_asignados = $empleado->dias_vacaciones;
            }else{
                $dias_vac_asignados = 0;
            }

            //Calculamos los meses reconocidos para posteriormente saber los días de vacaciones que le corresponden al empleado.
            $fecha_ingreso = Carbon::parse($empleado->fecha_ingreso);

            if(isset($request->ant_reconocida)){
                //la ant existe y no es null
                $ant_reconocida = Carbon::parse($request->ant_reconocida);
                $meses_reconocidos = $ant_reconocida->diffInMonths($fecha_ingreso);
            }else{
                //la ant no fue enviada
                $meses_reconocidos = "0";
            }

            //Calculamos la antiguedad en años
            $antiguedad = $meses_reconocidos/12;

            if($antiguedad==0){
                $dias_vac_reconocidos = 0;
            }elseif($antiguedad<=5){
                $dias_vac_reconocidos = 14;
            }elseif($antiguedad<=10){
                $dias_vac_reconocidos = 21;
            }elseif($antiguedad<=20){
                $dias_vac_reconocidos = 28;
            }elseif($antiguedad>20){
                $dias_vac_reconocidos = 35;
            }

            //Guardamos los datos del empleado.
            $empleado->nombre_apellido = $request->nombre_apellido;
            $empleado->plan_osde = $request->plan_osde;
            $empleado->titulo_puesto = $request->titulo_puesto;
            $empleado->dias_vacaciones = $dias_vac_asignados + $dias_vac_reconocidos;
            $empleado->empresa_id = $request->empresa_id;
            $empleado->puesto_id = $request->puesto_id;
            $empleado->sector_id = $request->sector_id;
            $empleado->padre_id = $request->padre_id;
            $empleado->bono_semestral = $request->bono_semestral;
            $empleado->es_comercial = ($request->es_comercial=="0" || $request->es_comercial==false) ? false : true;
            $empleado->repite_bono_semestral = ($request->repite_bono_semestral=="0" || $request->repite_bono_semestral==false) ? false : true ;
            $empleado->fecha_baja = ($request->es_baja=="0" || $request->es_baja==false) ? null :Carbon::createFromFormat((strlen($request->fecha_baja) == 8 ? 'dmY' : 'd/m/Y'),  $request->fecha_baja)->format("Ymd");
            $empleado->meses_reconocidos = $meses_reconocidos;
            $empleado->ant_reconocida = $request->ant_reconocida;
            $empleado->save();

            $users = User::whereIn('rol_id',Rol::whereIn('codigo',['SU','RRHH'])->pluck('id'))->get();
            foreach($users as $user){
                $userCambio = User::whereId(Auth::id())->first();
                Notificacion::create([
                    'user_id' => $user->id,
                    'texto' => 'El usuario  ' . $userCambio->email . ' ha realizado cambios para el empleado ' . $empleado->nombre_apellido,
                    'tipo' => 'info'
                ]);
            }


            if($request->legajo_sun){
                if($empleado->Legajos()->whereSistemaId(Sistema::whereCodigo('SUN')->value('id'))->exists()){
                    $empleado->Legajos()->detach(Sistema::whereCodigo('SUN')->value('id'));
                }

                $empleado->Legajos()->attach(Sistema::whereCodigo('SUN')->value('id'),['legajo'=>$request->legajo_sun]);
            }

        }catch(\Exception $ex){
            return $this->errorResponse('Error al guardar el empleado. '.$ex, 500);
        }

        return $this->successResponse("El empleado se ha guardado correctamente", 200);
    }


    public function addFavorito(Request $request)
    {
        try{
            Favorito::updateOrCreate([
                'empleado_id'=>$request->empleado_id,
                'user_id'=>Auth::id()
            ]);

        }catch(\Exception $ex) {
            return $this->errorResponse('Error al intentar agregar favorito. '.$ex, 500);
        }

        return $this->successResponse("Se ha agregado a favoritos", 200);
    }


    public function removeFavorito(Request $request)
    {
        try{
            Favorito::whereEmpleadoId($request->empleado_id)->whereUserId(Auth::id())->delete();
        }catch(\Exception $ex) {
            return $this->errorResponse('Error al remover favorito. '.$ex, 500);
        }

        return $this->successResponse("Se ha removido de favoritos", 200);
    }



    public function attachFondo(Request $request){
        try{
            $empleado = Empleado::whereId($request->empleado_id)->first();
            $fondo = Fondo::whereId($request->fondo_id)->first();
            $porcentaje = $request->porcentaje;

            EmpleadoFondo::updateOrCreate([
                'empleado_id'=>$empleado->id,
                'fondo_id'=>$fondo->id,
            ],[
                'empleado_id'=>$empleado->id,
                'fondo_id'=>$fondo->id,
                'porcentaje'=>$porcentaje,
            ]);

            $controler = new EmpleadosController();
            $data = $controler->getOne($empleado->id);

        }catch(\Exception $ex) {
            return $this->errorResponse('Error al adjuntar fondo. '.$ex, 500);
        }

        return $this->successResponse($data, 200);
    }

    public function dettachFondo(Request $request){
        try{
            $empleado = Empleado::whereId($request->empleado_id)->first();
            $fondo = Fondo::whereId($request->fondo_id)->first();
            $empleadoFondo = EmpleadoFondo::whereEmpleadoId($empleado->id)->whereFondoId($fondo->id)->delete();

            $controler = new EmpleadosController();
            $data = $controler->getOne($empleado->id);

        }catch(\Exception $ex) {
            return $this->errorResponse('Error al separar fondo. '.$ex, 500);
        }

        return $this->successResponse($data, 200);
    }



    public function attachCuotapartista(Request $request){
        $empleado = Empleado::whereId($request->empleado_id)->first();
        $cuotapartista = Cuotapartista::whereId($request->cuotapartista_id)->first();
        $porcentaje = $request->porcentaje;

        EmpleadoCuotapartista::updateOrCreate([
            'empleado_id'=>$empleado->id,
            'cuotapartista_id'=>$cuotapartista->id,
        ],[
            'empleado_id'=>$empleado->id,
            'cuotapartista_id'=>$cuotapartista->id,
            'porcentaje'=>$porcentaje,
        ]);

        $controler = new EmpleadosController();
        return $controler->getOne($empleado->id);
    }

    public function dettachCuotapartista(Request $request){

        $empleado = Empleado::whereId($request->empleado_id)->first();
        $cuotapartista = Cuotapartista::whereId($request->cuotapartista_id)->first();
        $empleadoCuotapartista = EmpleadoCuotapartista::whereEmpleadoId($empleado->id)->whereCuotapartistaId($cuotapartista->id)->delete();

        $controler = new EmpleadosController();
        return $controler->getOne($empleado->id);
    }


    public function getIncrementosMasivos($include = false, $soloActivos=true)
    {
        try{
            $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();

            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="APR" || $user->Rol->codigo=="SU"){
                if($soloActivos){
                    $empleados = Empleado::where('fecha_baja',null)->orderBy('nombre_apellido','asc')->get();
                } else {
                    $empleados = Empleado::orderBy('nombre_apellido','asc')->get();
                }
            } else if($user->Rol->codigo=="GTEF") {
                if($soloActivos){
                    $empleados = Empleado::where('fecha_baja',null)->wherePadreId($user->empleado_id);
                } else {
                    $empleados = Empleado::wherePadreId($user->empleado_id);
                }

                $empleados = $empleados->orWhere('es_comercial',true);
                if($include){
                    $empleados = $empleados->orWhere('id',$user->empleado_id);
                }

                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            } else {
                if($soloActivos){
                    $empleados = Empleado::where('fecha_baja',null)->wherePadreId($user->empleado_id);
                } else {
                    $empleados = Empleado::wherePadreId($user->empleado_id);
                }

                if($include){
                    $empleados = $empleados->orWhere('id',$user->empleado_id);
                }
                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            }


            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);
            $fechaCierre = Carbon::parse(Parametro::whereCodigo('CIERRE')->value('valor_fecha'))->format("Ymd");

            foreach($empleados as $key => $empleado){
                $arr = [];
                for($i=1; $i<=6; $i++){
                    $fecha = Carbon::parse($fechaCierre)->firstOfMonth()->addMonth($i)->endOfMonth();

                    // * no se deben mostrar las novedades rechazadas
                    $ids_estados_permitidos = Estado::select('id')->where('codigo', '!=', 'REC')->get(); // trae todos ids "rechazado" [{"id":4},{"id":6},{"id":1},{"id":5},{"id":2}]

                    $novedad = Novedad::whereEmpleadoId($empleado->id)
                                    ->whereDate('fecha',$fecha->format("Ymd"))
                                    ->whereIn('estado_id', $ids_estados_permitidos)->first();

                    if(isset($novedad)){
                        $novedad->load(['Estado','EstadoHorasExtras']);
                    }
                    $arr[] = [
                        'periodo'=>$fecha->format("m/Y"),
                        'importe'=>$novedad->sueldo_bruto ?? 0,
                        'estado'=>$novedad->Estado->codigo ?? ''
                    ];
                }
                $empleados[$key]->periodos = $arr;
            }

        }catch(\Exception $ex) {
            return $this->errorResponse('Error al obtener los incrementos masivos. '.$ex, 500);
        }

        return $this->successResponse(['empleados'=>array_values($empleados->toArray())], 200);
    }

    public function saveIncrementosMasivos(Request $request){
        try{
            foreach($request->empleados as $empleado){
                $empleado = (object) $empleado;
                $ultimoSueldo = $empleado->ultimo_sueldo;
                for($i=0;$i<=5;$i++) {
                    $date = $empleado->periodos[$i]['periodo'];
                    $date = Carbon::parse(substr($date, -4) . substr($date, 0, 2) . "01")->endOfMonth()->format("Ymd");
                    if($empleado->periodos[$i]['importe']!=0 && $empleado->periodos[$i]['estado'] != 'APR'){
                        $novedad = Novedad::whereEmpleadoId($empleado->id)->whereDate('fecha', $date)->first();
                        $estado = Estado::whereCodigo($request->estado ? 'PEN': 'DRAFT')->value('id');

                        if(isset($novedad)){
                            if($empleado->periodos[$i]['importe']!=$novedad->sueldo_bruto || $novedad->estado_id!=$estado){
                                $novedad->sueldo_bruto=$empleado->periodos[$i]['importe'];
                                $novedad->variacion=(($empleado->periodos[$i]['importe'] / $ultimoSueldo) - 1) * 100;
                                $novedad->estado_id=$estado;
                                $novedad->user_propuesta_id=Auth::id();
                                $novedad->save();
                            }
                        } else {
                            $novedad = Novedad::create([
                                'fecha'=>$date,
                                'empleado_id'=>$empleado->id,
                                'estado_id'=>$estado,
                                'horas_extras_estado_id'=>$estado,
                                'variacion'=>(($empleado->periodos[$i]['importe'] / $ultimoSueldo) - 1) * 100,
                                'sueldo_bruto'=>$empleado->periodos[$i]['importe'],
                                'horas_extras_100'=>0,
                                'horas_extras_50'=>0,
                                'user_propuesta_id'=>Auth::id()
                            ]);
                        }

                        $ultimoSueldo = $empleado->periodos[$i]['importe'];
                    }
                }
            }

        }catch(\Exception $ex){
            return $this->errorResponse("Error al guardar el incremento. ".$ex, 500);
        }

        return $this->successResponse("Se ha incrementado el sueldo correctamente", 200);
    }



    public function downloadIncrementosMasivos()
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
            $parametro = Parametro::whereCodigo('CIERRE')->value('valor_fecha');
            $fechaInicial = Carbon::parse($parametro)->startOfMonth()->addMonth()->endOfMonth()->format("Ymd");

            foreach($empleados as $key => $empleado){
                $periodos = [];
                for($i=0;$i<=5;$i++){
                    $fecha = Carbon::parse($fechaInicial)->startOfMonth()->addMonths($i)->endOfMonth()->format("Ymd");
                    $novedad = Novedad::whereEmpleadoId($empleado->id)->whereDate('fecha',$fecha)->first();
                    $periodos[] = [
                        'periodo'=>Carbon::parse($fecha)->format("Y/m"),
                        'importe'=>$novedad->sueldo_bruto ?? 0,
                        'estado'=>$novedad->Estado->codigo ?? '',
                    ];

                }
                $empleados[$key]->periodos = $periodos;
            }

            Log::info($empleados);

            $filename = date("YmdHis") . ".xls";
            Excel::store(new IncrementosMasivosExport($empleados), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        }catch(\Exception $ex) {
            return $this->errorResponse("Error al descargar el excel. ".$ex, 500);
        }

        return $this->successResponse($ruta, 200);
    }
}

