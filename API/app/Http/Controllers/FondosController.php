<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\EmpleadoOficial;
use App\Models\Empresa;
use App\Models\Fondo;
use App\Models\FondoOficial;
use App\Models\Oficial;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class FondosController extends Controller
{

    public function getAll()
    {
        try{
            $fondos = Fondo::orderBy('descripcion','asc')->get();
        }catch(\Excepcion $ex){
            return $this->errorResponse('Error al obtener los fondos. '.$ex, 500);
        }

        return $this->successResponse(['fondos'=>$fondos], 200);
    }

    public function getOne($id)
    {
        try{
            $fondo = Fondo::whereId($id)->first();
            $fondo->load(['Oficiales','Oficiales.Oficial']);
            //return response()->json(['fondo'=>$fondo], 200);
        }catch(\Excepcion $ex){
            $this->errorResponse('Error al obtener el fondo. '.$ex, 500);
        }

        return $this->successResponse(['fondo'=>$fondo], 200);
    }

    public function save(Request $request)
    {
        $fondo = Fondo::whereId($request->id)->first();
        $fondo->porcentaje=$request->porcentaje;
        $fondo->save();
        return $this->getOne($fondo->id);
    }

    public function setEsDedicado(Request $request)
    {
        $fondo = Fondo::whereId($request->id)->first();
        $fondo->es_dedicado=$request->es_dedicado;
        $fondo->save();
        if(!$fondo->es_dedicado){
            FondoOficial::whereFondoId($fondo->id)->delete();
        }
        return $this->getOne($fondo->id);
    }

    public function attach(Request $request){
        $fondo = Fondo::whereId($request->fondo_id)->first();
        $oficial = Oficial::whereId($request->oficial_id)->first();
        $porcentaje = $request->porcentaje;

        FondoOficial::updateOrCreate([
            'fondo_id'=>$fondo->id,
            'oficial_id'=>$oficial->id,
        ],[
            'fondo_id'=>$fondo->id,
            'oficial_id'=>$oficial->id,
            'porcentaje'=>$porcentaje,
        ]);

        return $this->getOne($fondo->id);
    }

    public function dettach(Request $request){

        $fondo = Fondo::whereId($request->fondo_id)->first();
        $oficial = Oficial::whereId($request->oficial_id)->first();
        $fondoOficial = FondoOficial::whereFondoId($fondo->id)->whereOficialId($oficial->id)->delete();

        return $this->getOne($fondo->id);
    }
}
