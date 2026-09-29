<?php

namespace App\Http\Controllers;

use App\Models\CentroCosto;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CentroCostoController extends Controller
{

    public function getAll()
    {
        try{
            $centroCostos = CentroCosto::orderBy('descripcion','asc')->get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los centros. '.$ex, 500);
        }

        return $this->successResponse(['centros'=>$centroCostos], 200);
    }

    public function update(Request $request)
    {
        try{
            $centroCosto = CentroCosto::updateOrCreate([
                'id'=>$request->id
            ],[
                'descripcion'=>$request->descripcion,
                'tipo'=>$request->tipo
            ]);
        } catch(\Exception $ex){
            return $this->errorResponse("Error al editar el centro de costo.", 500);
        }

        return $this->successResponse($centroCosto, 200);
    }

    public function delete(Request $request)
    {
        try{
            $centroCosto = CentroCosto::whereId($request->id)->first();
            if(isset($centroCosto)){
                $centroCosto->delete();
                $mensaje = "Se ha eliminado correctamente.";
            }else{
                $mensaje = "No se ha encontrado el centro de costo a eliminar.";
            }
        } catch(\Exception $ex) {
            return $this->errorResponse("Error al eliminar el centro de costo.", 500);
        }

        return $this->successResponse($mensaje, 200);
    }

}
