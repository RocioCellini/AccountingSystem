<?php

namespace App\Http\Controllers;

use App\Models\CentroCosto;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\LlaveDistribucion;
use App\Models\LlaveDistribucionCentroCosto;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class LlaveDistribucionController extends Controller
{

    public function getAll()
    {
        try{
            $llaves = LlaveDistribucion::orderBy('descripcion','asc')->get();
            $llaves->load('Distribucion','Distribucion.CentroCosto');

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las llaves. '.$ex, 500);
        }

        return $this->successResponse(['llaves'=>$llaves], 200);
    }

    public function getOne($id)
    {
        try{
            $llave = LlaveDistribucion::whereId($id)->first();
            $llave->load(['Distribucion','Distribucion.CentroCosto']);
            
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener la llave. '.$ex, 500);
        }

        return $this->successResponse(['llave'=>$llave], 200);
    }

    public function save(Request $request){

        $llave = LlaveDistribucion::updateOrCreate(['id'=>$request->id],['id'=>$request->id,'descripcion'=>$request->descripcion]);
        LlaveDistribucionCentroCosto::whereLlaveDistribucionId($llave->id)->delete();

        foreach($request->distribucion as $dist){
            if($dist){
                Log::info($dist);
                LlaveDistribucionCentroCosto::create([
                    'llave_distribucion_id'=>$llave->id,
                    'centro_costo_id'=>$dist['centro_costo']['id'],
                    'porcentaje'=>$dist['porcentaje']
                ]);
            }
        }

        return $this->getAll();

    }


    public function attachCentroCosto(Request $request){
        LlaveDistribucionCentroCosto::updateOrCreate([
            'llave_distribucion_id'=>$request->llave_distribucion_id,
            'centro_costo_id'=>$request->centro_costo_id,
        ],[
            'llave_distribucion_id'=>$request->llave_distribucion_id,
            'centro_costo_id'=>$request->centro_costo_id,
            'porcentaje'=>$request->porcentaje
        ]);

        return $this->getOne($request->llave_distribucion_id);
    }

    public function dettachCentroCosto(Request $request){
        LlaveDistribucionCentroCosto::whereLlaveDistribucionId($request->llave_distribucion_id)->whereCentroCostoId($request->centro_costo_id)->delete();
        return $this->getOne($request->llave_distribucion_id);
    }

}
