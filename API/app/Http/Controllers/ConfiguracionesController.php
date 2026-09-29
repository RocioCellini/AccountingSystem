<?php

namespace App\Http\Controllers;

use App\Models\CalendarioBono;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Parametro;
use App\Models\Puesto;
use App\Models\Rol;
use App\Models\Sector;
use App\Models\TipoCambio;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ConfiguracionesController extends Controller
{

    public function getAll()
    {
        try{
            $fecha_cierre = Carbon::parse(Parametro::whereCodigo('CIERRE')->value('valor_fecha'))->format("Y-m-d");
            //return response()->json(compact('fecha_cierre'), 200);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las configuraciones. '.$ex, 500);
        }

        return $this->successResponse(['fecha_cierre'=>$fecha_cierre], 200);
    }

    public function saveFechaCierre(Request $request)
    {
        try{
            $parametro = Parametro::whereCodigo('CIERRE')->first();
            $parametro->valor_fecha = Carbon::parse($request->fecha_cierre)->format("Y-m-d");
            $parametro->save();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al guardar la fecha de cierre. '.$ex, 500);
        }

        return $this->successResponse('Se ha guardado correctamente. ', 200);
    }

    public function getFechaCierre()
    {
        try{
            $parametro = Parametro::whereCodigo('CIERRE')->first();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener la fecha de cierre. '.$ex, 500);
        }

        return $this->successResponse($parametro, 200);
    }

    public function getCalendarioBono()
    {
        try{
            $calendario = CalendarioBono::get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener el Calendario. '.$ex, 500);
        }

        return $this->successResponse($calendario, 200);
    }

    public function saveCalendarioBono(Request $request)
    {
        try{
            foreach($request->data as $d){
                CalendarioBono::updateOrCreate([
                    'mes'=>$d['mes']
                ],[
                    'mes'=>$d['mes'],
                    'porcentaje_sueldos'=>$d['porcentaje_sueldos'],
                ]);
            }
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener el Calendario. '.$ex, 500);
        }

        return $this->successResponse('Se ha guardado correctamente. ', 200);
    }

}
