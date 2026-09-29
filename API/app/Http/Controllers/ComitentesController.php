<?php

namespace App\Http\Controllers;

use App\Classes\Helpers;
use App\Http\Requests\AltasNominaRequest;
use App\Http\Requests\AltasRequest;
use App\Http\Requests\ComitenteRequest;
use App\Http\Requests\CuotapartistaRequest;
use App\Mail\MailAprobacionRechazo;
use App\Mail\MailNuevaAltaPendienteAprobacion;
use App\Models\Alta;
use App\Models\Comitente;
use App\Models\Cuotapartista;
use App\Models\CuotapartistaFondo;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Fondo;
use App\Models\Notificacion;
use App\Models\Oficial;
use App\Models\Puesto;
use App\Models\Rol;
use App\Models\Sector;
use App\Models\Sistema;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ComitentesController extends Controller
{


    public function getAll()
    {
        $comitentes = Comitente::all();
        $comitentes->load(["Oficial"]);
        return response()->json(['comitentes'=>$comitentes], 200);
    }


    public function getOne($id)
    {
        $oficiales = Oficial::whereOrigen('VBOLSA')->get();
        $comitente = Comitente::whereId($id)->first();
        $comitente->load(["Oficial"]);
        return response()->json(['comitente'=>$comitente,'oficiales'=>$oficiales], 200);
    }


    public function save(Request $request)
    {
        $validation = Helpers::validateWithRequest($request->all(),new ComitenteRequest());
        if($validation!=[]){ return response()->json(['status'=>422,'data'=>$validation],200); }
        $comitente = Comitente::whereId($request->id)->first();
        $comitente->oficial_id = $request->oficial_id;
        $comitente->porcentaje = $request->porcentaje;
        $comitente->save();

        $users = User::whereIn('rol_id',Rol::whereIn('codigo',['RRHH',"SU"])->pluck('id'))->get();

        return $this->getOne($comitente->id);
    }







}
