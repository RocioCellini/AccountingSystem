<?php

namespace App\Http\Controllers;

use App\Imports\ImportEmpleadoOficial;
use App\Models\Comision;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Liquidacion;
use App\Models\Notificacion;
use App\Models\Novedad;
use App\Models\Parametro;
use App\Models\Rol;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ComisionesController extends Controller
{

    public function getAll($periodo)
    {
        try{
            $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();
            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU"){
                //whereEsComercial(true)
                $empleados = Empleado::whereNull('fecha_baja')->orderBy('nombre_apellido','asc')->get();
            } else {
                $empleados = Empleado::whereNull('fecha_baja')->wherePadreId($user->empleado_id)->orWhere('id',$user->empleado_id);
                $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
            }

            $empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

            $fecha = Carbon::parse($periodo."01")->format("Ymd");
            foreach($empleados as $key => $empleado){
                $comisionDb = Comision::whereDate('fecha',$fecha)->whereEmpleadoId($empleado->id)->first();
                if($comisionDb){
                    $comisionDb->load(['Estado']);
                }
                $empleados[$key]->comision = $comisionDb;
            }

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las comisiones. '.$ex, 500);
        }

        return $this->successResponse(['empleados'=>$empleados], 200);
    }


    public function getPendientes($include = false)
    {
        try{
            $user = User::whereId(Auth::id())->first();

            if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU" || $user->Rol->codigo=="APR"){
                $comisiones = Comision::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->where('importe','!=',0)->get();
            } else {
                $empleados = Empleado::wherePadreId($user->empleado_id);
                if($include){
                    $empleados = $empleados->orWhere('id',Auth::id());
                }
                $empleados = $empleados->pluck('id');
                $comisiones = Comision::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->where('importe','!=',0)->whereIn('empleado_id',$empleados)->get();

            }

            $comisiones->load(['Empleado','Estado']);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los empleados. '.$ex, 500);
        }

        return $this->successResponse(['comisiones'=>$comisiones], 200);
    }

    public function save(Request $request)
    {
        $periodo = $request->periodo;
        $fecha = $periodo."01";

        if(Carbon::parse($fecha)->endOfMonth()->format("Ymd") < Carbon::parse(Parametro::whereCodigo('CIERRE')->value('valor_fecha'))->format("Ymd")){
            return response()->json(['status'=>false], 200);
        }

        foreach($request->comisiones as $c){

            $comision = Comision::whereDate('fecha',$fecha)->whereEmpleadoId($c['id'])->first();
            $fondos = $c['comision']['fondos'] ?? 0;
            $capitalMarkets = $c['comision']['capital_markets'] ?? 0;
            $rofex = $c['comision']['rofex'] ?? 0;
            $cibsa = $c['comision']['cibsa'] ?? 0;
            $otros = $c['comision']['otros'] ?? 0;
            $total = $fondos + $capitalMarkets + $rofex + $cibsa + $otros;
            if($comision){
                if($comision->importe!=$total){
                    $comision->aprobado_por = null;
                    $comision->estado_id=Estado::whereCodigo('PEN')->value('id');
                    $comision->importe=$total;
                    $comision->fondos=$fondos;
                    $comision->capital_markets=$capitalMarkets;
                    $comision->rofex=$rofex;
                    $comision->cibsa=$cibsa;
                    $comision->otros=$otros;
                    $comision->save();

                }
            } else {
                Comision::create([
                    'fecha'=>$fecha,
                    'empleado_id'=>$c['id'],
                    'estado_id'=>Estado::whereCodigo('PEN')->value('id'),
                    'importe'=>$total,
                    'fondos'=>$fondos,
                    'capital_markets'=>$capitalMarkets,
                    'rofex'=>$rofex,
                    'cibsa'=>$cibsa,
                    'otros'=>$otros,
                ]);

                $empleado = Empleado::whereId($c['id'])->first();
                if(isset($empleado->Padre)){
                    $userPadre = User::whereEmpleadoId($empleado->Padre->id)->get();
                    foreach($userPadre as $user){
                        if($total<>0){
                            Notificacion::create([
                                'user_id' => $user->id,
                                'texto' => 'Se cargaron comisiones para el empleado #' . $empleado->legajo_bejerman . ' por ' . number_format($total,0,",",".") . " para el Periodo " . $fecha,
                                'tipo' => 'success'
                            ]);
                        }
                    }
                }
            }

        }



        return $this->getAll($periodo);
    }

    public function aprobarRechazar(Request $request)
    {
        $comision = Comision::whereId($request->id)->first();
        $comision->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
        $comision->aprobado_por = Auth::id();
        $comision->save();

        return $this->getPendientes();
    }

    public function aprobarRechazarMasivo(Request $request)
    {
        foreach($request->rows as $row){
            $comision = Comision::whereId($row['id'])->first();
            $comision->estado_id=Estado::whereCodigo(($request->estado ? 'APR' : 'REC'))->value('id');
            $comision->aprobado_por = Auth::id();
            $comision->save();
        }
        return $this->getPendientes();
    }

    public function cargaEmpleadoOficial($file){

        try{

            Excel::import(new ImportEmpleadoOficial, $file, 'public');

            $mensaje = "Se procesó correctamente";

            } catch(Exception $ex) {
                $mensaje = "ERROR: " . $ex->getMessage();
            }

            return response()->json([
                'mensaje' => $mensaje
            ]);
    }


}
