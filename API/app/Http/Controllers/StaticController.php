<?php

namespace App\Http\Controllers;

use App\Models\Alta;
use App\Models\Empleado;
use App\Models\Estado;
use App\Models\Notificacion;
use App\Models\Rol;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StaticController extends Controller
{
    public function index()
    {
        $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();
        //$user = User::whereEmail("lavila@wf-systems.com")->orderBy('updated_at','desc')->first();

        if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="APR" || $user->Rol->codigo=="SU"){
            $empleados = Empleado::where('fecha_baja',null)->orderBy('nombre_apellido','asc')->get();
        } else {
            $empleados = Empleado::where('fecha_baja',null)->wherePadreId($user->empleado_id);
            $empleados = $empleados->orWhere('id',$user->empleado_id);
            $empleados = $empleados->orderBy('nombre_apellido','asc')->get();
        }

        //$empleados->load(['Empresa','Sector','Puesto','Padre','Subsegmento']);

        $info = [];

        // * si el usuario es de rrhh o superuser ve todas las novedades.
        if( $user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU" ){
            $info['ultimasAltas'] = Alta::whereDate( 'created_at', '>=', Carbon::now()->subDays( 30 )->format( "Ymd" ) )
                ->whereEstadoId( Estado::whereCodigo('ING')->value('id') )
                ->with( ['Puesto','Empresa','Sector','Padre','Estado','Subsegmento'] )->get();
        }else{
            // * ver solo las novedades de su sector y donde figure como padre del empleado
            $info['ultimasAltas'] = Alta::whereDate( 'created_at', '>=', Carbon::now()->subDays( 30 )->format( "Ymd" ) )
                ->whereEstadoId( Estado::whereCodigo('ING')->value('id') )
                //->where( 'sector_id', '=', $user->Empleado->sector_id )
                ->where( 'padre_id', '=', $user->empleado_id )
                ->with( ['Puesto','Empresa','Sector','Padre','Estado','Subsegmento'] )->get();
        }

        if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="APR" || $user->Rol->codigo=="SU"){
            $info['ultimasBajas'] = Empleado::whereDate('fecha_baja','>=',Carbon::now()->subDays(30)->format("Ymd"))->with(['Empresa','Sector','Puesto','Padre','Subsegmento'])->get();
        } else {
            $info['ultimasBajas'] = Empleado::wherePadreId($user->empleado_id)->whereDate('fecha_baja','>=',Carbon::now()->subDays(30)->format("Ymd"))->with(['Empresa','Sector','Puesto','Padre','Subsegmento'])->get();
        }

        $info['empleadosActivos'] = $empleados;

        $grupoEtareo = ['18-20'=>0,'21-30'=>0,'31-40'=>0,'41-50'=>0,'50+'=>0];
        $empresa = [];

        foreach($empleados as $empleado){


            if($empleado->edad<=20){
                $grupoEtareo['18-20'] += 1;
            } elseif($empleado->edad<=30){
                $grupoEtareo['21-30'] += 1;
            } elseif($empleado->edad<=40){
                $grupoEtareo['31-40'] += 1;
            } elseif($empleado->edad<=50){
                $grupoEtareo['41-50'] += 1;
            } else {
                $grupoEtareo['50+'] += 1;
            }

            $empresa[$empleado->Empresa->descripcion] = (($empresa[$empleado->Empresa->descripcion] ?? 0) + 1);
        }


        $info['grupoEtareo']=$grupoEtareo;
        $info['grupoEmpresas']=$empresa;


        return response()->json(['info'=>$info], 200);
    }


}
