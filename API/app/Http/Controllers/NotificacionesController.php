<?php

namespace App\Http\Controllers;

use App\Models\BonoSemestral;
use App\Models\BonoTrimestralDistribucion;
use App\Models\BonoTrimestralRecomendacion;
use App\Models\CalendarioBono;
use App\Models\Comision;
use App\Models\Empleado;
use App\Models\Estado;
use App\Models\Notificacion;
use App\Models\Novedad;
use App\Models\Parametro;
use App\Models\TipoCambio;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Param;

class NotificacionesController extends Controller
{
    public function get(){
        try{
            $notificaciones = Notificacion::whereUserId(Auth::id())->orderBy('created_at','desc')->limit(100)->get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las notificaciones. '.$ex, 500);
        }

        return $this->successResponse(['notificaciones'=>$notificaciones], 200);
    }

    public function marcarLeido(Request $request){
        $notificaciones = Notificacion::whereUserId(Auth::id())->orderBy('created_at','desc')->update(['leido'=>true]);
        return $this->get();
    }
}
