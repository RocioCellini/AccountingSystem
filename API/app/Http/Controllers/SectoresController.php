<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Rol;
use App\Models\Sector;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SectoresController extends Controller
{

    public function getAll()
    {
        try{
            $sectores = Sector::orderBy('descripcion','asc')->get();

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los sectores. '.$ex, 500);
        }

        return $this->successResponse(['sectores'=>$sectores], 200);
    }

    public function save(Request $request)
    {
        try{
            Sector::create([
                'descripcion'=>$request->descripcion,
            ]);
            $sectores = Sector::get();

        }catch(\Exception $ex){
            return $this->errorResponse('Error al guardar el sector. '.$ex, 500);
        }

        return $this->successResponse(['sectores'=>$sectores], 200);
    }

    public function delete(Request $request)
    {
        try{
            $sector = Sector::whereId($request->id)->first();
            $sector->delete();
            $sectores = Sector::get();

        }catch(\Exception $ex){
            return $this->errorResponse('Error al borrar el sector. '.$ex, 500);
        }

        return $this->successResponse(['sectores'=>$sectores], 200);
    }


    public function restore(Request $request)
    {
        $sector = Sector::withTrashed()->whereId($request->id)->first();
        $sector->restore();

        $sectores = Sector::get();
        return response()->json(['sectores'=>$sectores], 200);
    }




}
