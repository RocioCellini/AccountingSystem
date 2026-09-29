<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class EmpresasController extends Controller
{

    public function getAll()
    {
        try{
            $empresas = Empresa::orderBy('descripcion','asc')->get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las empresas. '.$ex, 500);
        }

        return $this->successResponse(['empresas'=>$empresas], 200);
    }

    public function save(Request $request)
    {
        try{
            Empresa::create([
                'descripcion'=>$request->descripcion,
                'codigo'=>$request->codigo,
            ]);

            $empresas = Empresa::get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al guardar la empresa. '.$ex, 500);
        }

        return $this->successResponse(['empresas'=>$empresas], 200);
    }

    public function delete(Request $request)
    {
        try{
            $empresa = Empresa::whereId($request->id)->first();
            $empresa->delete();
            $empresas = Empresa::get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al borrar la empresa. '.$ex, 500);
        }

        return $this->successResponse(['empresas'=>$empresas], 200);
    }


    public function restore(Request $request)
    {
        $empresa = Empresa::withTrashed()->whereId($request->id)->first();
        $empresa->restore();

        $empresas = Empresa::get();
        return response()->json(['empresas'=>$empresas], 200);
    }




}
