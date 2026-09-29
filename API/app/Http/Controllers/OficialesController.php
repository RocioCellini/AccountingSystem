<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\EmpleadoOficial;
use App\Models\Empresa;
use App\Models\Oficial;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class OficialesController extends Controller
{

    public function getAll($origen = "VFONDOS")
    {
        try{
            $oficiales = Cache::remember('oficiales',120,function(){
                return $oficiales = Oficial::orderBy('descripcion','asc')->where('anulado',false)->get();;
            });

        }catch(\Exception $ex){
            $this->errorResponse('Error al obtener los fondos. '.$ex, 500);
        }

        return $this->successResponse(['oficiales'=>$oficiales], 200);
    }


    public function getOne($id)
    {
        try{
            $oficial = Oficial::whereId($id)->first();
            $oficial->load(['Empleados','Empleados.Empleado','Cuotapartistas']);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener el oficial. '.$ex, 500);
        }

        return $this->successResponse(['oficial'=>$oficial], 200);
    }


    public function attach(Request $request){
        try{
            $empleado = Empleado::whereId($request->empleado_id)->first();
            $oficial = Oficial::whereId($request->oficial_id)->first();
            $porcentaje = $request->porcentaje_base_calculo;
            $porcentajeBaseCalculo = $request->porcentaje;

            EmpleadoOficial::updateOrCreate([
                'empleado_id'=>$empleado->id,
                'oficial_id'=>$oficial->id,
            ],[
                'empleado_id'=>$empleado->id,
                'oficial_id'=>$oficial->id,
                'porcentaje'=>$porcentaje,
                'porcentaje_base_calculo'=>$porcentajeBaseCalculo,
            ]);

            if(isset($request->origen) && $request->origen=="oficial"){
                $controler = new OficialesController();
                $data = $controler->getOne($oficial->id);
            }
            $controler = new EmpleadosController();
            $data = $controler->getOne($empleado->id);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al guardar el oficial. '.$ex, 500);
        }

        return $this->successResponse($data->original, 200);
    }

    public function dettach(Request $request){
        try{
            $empleado = Empleado::whereId($request->empleado_id)->first();
            $oficial = Oficial::whereId($request->oficial_id)->first();
            $empleadoOficial = EmpleadoOficial::whereEmpleadoId($empleado->id)->whereOficialId($oficial->id)->delete();

            if(isset($request->origen) && $request->origen=="oficial"){
                $controler = new OficialesController();
                $data = $controler->getOne($oficial->id);
            }

            $controler = new EmpleadosController();
            $data = $controler->getOne($empleado->id);
            
        }catch(\Exception $ex){
            return $this->errorResponse('Error al guardar el oficial. '.$ex, 500);
        }

        return $this->successResponse($data->original, 200);
    }

    public function sync(Request $request){
        $empleadoDesde = Empleado::whereId($request->empleado_desde_id)->first();
        $empleadoHasta = Empleado::whereId($request->empleado_hasta_id)->first();

        EmpleadoOficial::whereEmpleadoId($empleadoHasta->id)->delete();
        $oficiales = EmpleadoOficial::whereEmpleadoId($empleadoDesde->id)->get();
        foreach($oficiales as $oficial){
            EmpleadoOficial::create([
                'empleado_id'=>$empleadoHasta->id,
                'oficial_id'=>$oficial->oficial_id,
                'porcentaje'=>$oficial->porcentaje,
                'porcentaje_base_calculo'=>$oficial->porcentaje_base_calculo,
            ]);
        }

        $controler = new EmpleadosController();
        return $controler->getOne($empleadoHasta->id);
    }
}
