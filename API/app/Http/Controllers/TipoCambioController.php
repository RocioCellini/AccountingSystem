<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Liquidacion;
use App\Models\Novedad;
use App\Models\Parametro;
use App\Models\Rol;
use App\Models\TipoCambio;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class TipoCambioController extends Controller
{

    public function getAll()
    {
        try{
            $fecha = Carbon::now()->subMonths(5);
            $arr = [];
            while($fecha<=Carbon::now()){
                $arr[] = [
                    'periodo'=>$fecha->format("Ym"),
                    'cotizacion'=>TipoCambio::wherePeriodo($fecha->format("Ym"))->value('cotizacion')
                ];

                $fecha->startOfMonth()->addMonth();
            }

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los tipos de cambio. '.$ex, 500);
        }

        return $this->successResponse(['cotizaciones'=>$arr], 200);
    }

    public function save(Request $request)
    {
        try{
            foreach($request->data as $tipoCambio){
                $cotizacion = str_replace(",",".",$tipoCambio['cotizacion'] ?? 0);

                TipoCambio::updateOrCreate([
                    'periodo'=>$tipoCambio['periodo']
                ],[
                    'periodo'=>$tipoCambio['periodo'],
                    'cotizacion'=>$cotizacion,
                ]);
            }
            
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los tipos de cambio. '.$ex, 500);
        }

        return $this->successResponse('Se ha guardado correctamente. ', 200);
    }

}
