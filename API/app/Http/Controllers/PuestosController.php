<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Puesto;
use App\Models\Rol;
use App\Models\Sector;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class PuestosController extends Controller
{

    public function getAll()
    {
        try{
            $puestos = Puesto::orderBy('descripcion','asc')->get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los puestos. '.$ex, 500);
        }

        return $this->successResponse(['puestos'=>$puestos], 200);
    }

    public function save(Request $request)
    {
        try{
            Puesto::create([
                'descripcion'=>$request->descripcion,
            ]);

            $puestos = Puesto::get();

        }  catch(\Exception $ex){
            return $this->errorResponse('Error al guardar el puesto. '.$ex, 500);
        }

        return $this->successResponse(['puestos'=>$puestos], 200);

    }

    public function delete(Request $request)
    {
        try{
            $puesto = Puesto::whereId($request->id)->first();
            $puesto->delete();
            $puestos = Puesto::get();
            
        }catch(\Exception $ex){
            return $this->errorResponse('Error al borrar el puesto. '.$ex, 500);
        }

        return $this->successResponse(['puestos'=>$puestos], 200);
    }


    public function restore(Request $request)
    {
        $puesto = Puesto::withTrashed()->whereId($request->id)->first();
        $puesto->restore();

        $puestos = Puesto::get();
        return response()->json(['puestos'=>$puestos], 200);
    }




}
