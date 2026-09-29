<?php

namespace App\Http\Controllers;

use App\Classes\Helpers;
use App\Http\Requests\AltasNominaRequest;
use App\Http\Requests\AltasRequest;
use App\Mail\MailAprobacionRechazo;
use App\Mail\MailNuevaAltaPendienteAprobacion;
use App\Models\Alta;
use App\Models\Archivo;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Notificacion;
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

class AltasController extends Controller
{
    public function getAll()
    {
        try{
            $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();
            if($user->Rol->codigo=="APR"){

                $altas = Alta::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('updated_at','desc')->get();
            } else if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="SU"){
                $altas = Alta::orderBy('updated_at','desc')->get();
            } else {
                $altas = Alta::wherePadreId($user->empleado_id)->orderBy('updated_at','desc')->get();
            }

            $altas->load(['Puesto','Empresa','Sector','Padre','Estado','Subsegmento','Archivos']);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las altas. '.$ex, 500);
        }

        return $this->successResponse(['altas'=>$altas], 200);
    }


    public function save(Request $request)
    {
        try{
            $validation = Helpers::validateWithRequest($request->all(),new AltasRequest());
            if($validation!=[]){ return response()->json(['status'=>422,'data'=>$validation],200); }

            $alta = Alta::updateOrCreate([
                "id"=>$request->id
            ],[
                "id"=>$request->id,
                "nombre"=>strtoupper($request->nombre),
                "apellido"=>strtoupper($request->apellido),
                "fecha_nacimiento"=>Carbon::createFromFormat((strlen($request->fecha_nacimiento) == 8 ? 'dmY' : 'd/m/Y'),  $request->fecha_nacimiento)->format("Ymd"),
                "documento"=>$request->documento,
                "plan_osde"=>$request->plan_osde,
                "titulo_puesto"=>$request->titulo_puesto,
                "fecha_ingreso"=>Carbon::createFromFormat((strlen($request->fecha_ingreso) == 8 ? 'dmY' : 'd/m/Y'),  $request->fecha_ingreso)->format("Ymd"),
                "sueldo_bruto"=>$request->sueldo_bruto,
                "dias_vacaciones"=>$request->dias_vacaciones ?? 0,
                "bono_semestral"=>$request->bono_semestral ?? 0,
                "puesto_id"=>$request->puesto_id,
                "empresa_id"=>$request->empresa_id,
                "sector_id"=>$request->sector_id,
                "padre_id"=>$request->padre_id,
                "subsegmento_id"=>$request->subsegmento_id,
                "estado_id"=>Estado::whereCodigo("PEN")->value("id"),
                "user_id"=>Auth::id(),
                "consultora"=>strtoupper($request->consultora),
            ]);

            if(isset($request->archivos)){
                foreach($request->archivos as $file){
                    $extension = explode(".",$file["name"]);
                    $extension = $extension[count($extension)-1];
                    Log::info($file["name"]);
                    Log::info($extension);
                    $data = explode(";",$file['file'])[1];
                    $data = str_replace('base64,','',$data);
                    $filename =  date("YmdHis").".".$extension;
                    $filepath = public_path('\exportaciones\\'.$filename);
                    file_put_contents($filepath,base64_decode($data));


                    Archivo::create([
                        "nombre"=>$file["name"],
                        "ruta"=>'exportaciones\\'.$filename,
                        "alta_id"=>$alta->id,
                        "empleado_id"=>null
                    ]);
                }
            }

            //Mail::to(env('MAIL_APROBADOR'))->send(new MailNuevaAltaPendienteAprobacion($alta));

            $users = User::whereIn('rol_id',Rol::whereIn('codigo',['APR'])->pluck('id'))->get();
            foreach($users as $user){
                $userCambio = User::whereId(Auth::id())->first();
                Notificacion::create([
                    'user_id' => $user->id,
                    'texto' => 'Se ha ingresado un nuevo alta #' . $alta->id . ' ' . $alta->apellido . ',' . ' ' . $alta->nombre . ' y requiere su revision',
                    'tipo' => 'warning'
                ]);
            }

            $data = $this->getAll();
            
        }catch(\Exception $ex) {
            return $this->errorResponse('Error al guardar el Alta. '.$ex, 500);
        }

        return $this->successResponse($data, 200);
    }


    public function nomina(Request $request)
    {

        $validation = Helpers::validateWithRequest($request->all(),new AltasNominaRequest());
        if($validation!=[]){ return response()->json(['status'=>422,'data'=>$validation],200); }


        $alta = Alta::whereId($request->id)->first();


        if(isset($request->archivos)){
            foreach($request->archivos as $file){
                if(isset($file["name"])){
                    $extension = explode(".",$file["name"]);
                    $extension = $extension[count($extension)-1];
                    Log::info($file["name"]);
                    Log::info($extension);
                    $data = explode(";",$file['file'])[1];
                    $data = str_replace('base64,','',$data);
                    $filename =  date("YmdHis").".".$extension;
                    $filepath = public_path('\importaciones\legajo\\'.$filename);
                    file_put_contents($filepath,base64_decode($data));


                    Archivo::create([
                        "nombre"=>$file["name"],
                        "ruta"=>'\importaciones\legajo\\'.$filename,
                        "alta_id"=>$alta->id,
                        "empleado_id"=>null
                    ]);
                }
            }
        }

        $empleado = Empleado::create([
            "nombre_apellido"=>strtoupper($alta->nombre . ' ' . $alta->apellido),
            "fecha_nacimiento"=>Carbon::parse($alta->fecha_nacimiento)->format("Ymd"),
            "documento"=>$alta->documento,
            "plan_osde"=>$alta->plan_osde,
            "titulo_puesto"=>$alta->titulo_puesto,
            "fecha_ingreso"=>Carbon::parse($alta->fecha_ingreso)->format("Ymd"),
            "sueldo_bruto"=>$alta->sueldo_bruto,
            "dias_vacaciones"=>$alta->dias_vacaciones,
            "bono_semestral"=>$alta->bono_semestral,
            "puesto_id"=>$alta->puesto_id,
            "empresa_id"=>$alta->empresa_id,
            "sector_id"=>$alta->sector_id,
            "subsegmento_id"=>$request->subsegmento_id,
            "padre_id"=>$alta->padre_id,
            "es_comercial"=>$request->es_comercial ?? false,
            "llave_distribucion_id"=>$request->llave_distribucion_id,
        ]);


        Archivo::whereAltaId($alta->id)->update(['empleado_id'=>$empleado->id]);

        $empleado->Legajos()->attach(Sistema::whereCodigo('BJ')->value('id'),['legajo'=>$request->legajo_bejerman]);
        if($request->legajo_sun){
            $empleado->Legajos()->attach(Sistema::whereCodigo('SUN')->value('id'),['legajo'=>$request->legajo_sun]);
        }



        $alta->estado_id=Estado::whereCodigo('ING')->value('id');
        $alta->save();

        $alta = Alta::whereId($alta->id)->first();
        //Mail::to($alta->Creador->email)->send(new MailAprobacionRechazo($alta));
        Mail::to("rociocellini@gmail.com")->send(new MailAprobacionRechazo($alta));
        Notificacion::create([
            'user_id' => $alta->Creador->id,
            'texto' => 'El alta #' . $alta->id . ' ' . $alta->apellido . ',' . ' ' . $alta->nombre . ' fue ingresada en la nomina',
            'tipo' => 'success'
        ]);

        return $this->getAll();
    }


    public function aprobarRechazar(Request $request){
        $alta = Alta::whereId($request->id)->first();
        $alta->estado_id = Estado::whereCodigo($request->estado ? 'APR' : 'REC')->value('id');
        $alta->aprobador_id = Auth::id();
        $alta->save();

        if($request->estado){
            $destinatario = env('MAIL_RRHH');

            $users = User::whereIn('rol_id',Rol::whereIn('codigo',['SU','RRHH'])->pluck('id'))->get();
            foreach($users as $user){
                $userCambio = User::whereId(Auth::id())->first();
                Notificacion::create([
                    'user_id' => $user->id,
                    'texto' => 'El alta #' . $alta->id . ' ' . $alta->apellido . ',' . ' ' . $alta->nombre . ' fue aprobada',
                    'tipo' => 'success'
                ]);
            }

        } else {
            $destinatario = $alta->Creador->email;
            Notificacion::create([
                'user_id' => $alta->Creador->id,
                'texto' => 'El alta #' . $alta->id . ' ' . $alta->apellido . ',' . ' ' . $alta->nombre . ' fue rechazada',
                'tipo' => 'danger'
            ]);
        }


        $alta = Alta::whereId($alta->id)->first();
        //Mail::to($destinatario)->send(new MailAprobacionRechazo($alta));
        Mail::to("rociocellini@gmail.com")->send(new MailAprobacionRechazo($alta));

        return $this->getAll();
    }




}
