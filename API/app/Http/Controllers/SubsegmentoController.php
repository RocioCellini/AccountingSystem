<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Rol;
use App\Models\SubSegmento;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SubsegmentoController extends Controller
{

    public function getAll()
    {
        try{
            $subsegmentos = SubSegmento::orderBy('descripcion','asc')->get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los subsegmentos. '.$ex, 500);
        }

        return $this->successResponse(['subsegmentos'=>$subsegmentos], 200);
    }

    public function save(Request $request)
    {
        SubSegmento::create([
            'descripcion'=>$request->descripcion,
            'codigo'=>$request->codigo,
        ]);

        return $this->getAll();
    }

    public function delete(Request $request)
    {
        $subsegmento = SubSegmento::whereId($request->id)->first();
        $subsegmento->delete();
        return $this->getAll();
    }


    public function restore(Request $request)
    {
        $subsegmento = SubSegmento::withTrashed()->whereId($request->id)->first();
        $subsegmento->restore();
        return $this->getAll();
    }




}
