<?php

namespace App\Http\Controllers;

use App\Classes\Helpers;
use App\Http\Requests\AltasNominaRequest;
use App\Http\Requests\AltasRequest;
use App\Http\Requests\CuotapartistaRequest;
use App\Mail\MailAprobacionRechazo;
use App\Mail\MailNuevaAltaPendienteAprobacion;
use App\Imports\ImportCuotapartistaDist;
use App\Imports\ImportCuotapartistaFondos;
use App\Models\Alta;
use App\Models\Cuotapartista;
use App\Models\CuotapartistaDistribucion;
use App\Models\CuotapartistaFondo;
use App\Models\CuotapartistaOficial;
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
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class CuotapartistasController extends Controller
{


    public function getAll()
    {
        try{
            $cuotapartistas = Cuotapartista::all();
            $cuotapartistas->load(["Oficial"]);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los cuotapartistas. '.$ex, 500);
        }

        return $this->successResponse(['cuotapartistas'=>$cuotapartistas], 200);
    }


    public function getOne($id)
    {
        try{
            ini_set('max_execution_time', 0);
            $oficiales = Oficial::whereOrigen('VFONDOS')->get();
            $fondos = Fondo::all();
            $cuotapartista = Cuotapartista::whereId($id)->first();
            $cuotapartista->solo_excepciones = ($cuotapartista->solo_excepciones=="1");
            $cuotapartista->load(["Oficial","Fondos","Fondos.Fondo",'Distribuciones','Distribuciones.Fondo','Distribuciones.Oficial']);

            $arr = [];
            if(isset($cuotapartista->asociaciones)){
                foreach($cuotapartista->asociaciones as $a){
                    if($a!=$cuotapartista->id){
                        $arr[] = Cuotapartista::whereId($a)->first();
                    }
                }
            }
            $cuotapartista->cuotapartistas_asociados = $arr;

            $data = ['cuotapartista'=>$cuotapartista,'oficiales'=>$oficiales,'fondos'=>$fondos];
            //return response()->json(['cuotapartista'=>$cuotapartista,'oficiales'=>$oficiales,'fondos'=>$fondos], 200);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener el cuotapartista. '.$ex, 500);
        }

        return $this->successResponse($data, 200);
    }


    public function save(Request $request)
    {
        try{
            $validation = Helpers::validateWithRequest($request->all(),new CuotapartistaRequest());
            if($validation!=[]){ return response()->json(['status'=>422,'data'=>$validation],200); }

            $cps = [];
            $cps[] = $request->id;
            if(isset($request->asociaciones)){
                foreach($request->asociaciones as $as){
                    $cps[]=$as['id'];
                }
            }

            foreach($cps as $c){
                $cuotapartista = Cuotapartista::whereId($c)->first();

                $cuotapartista->agentes_externos = $request->oficialesExternos;
                $cuotapartista->agentes_internos = $request->oficialesInternos;
                $cuotapartista->agentes_externos_porcentaje = $request->porcentaje_agentes_externos;
                $cuotapartista->agentes_internos_porcentaje =$request->porcentaje_agentes_externos;

                $cuotapartista->asociaciones = $cps;
                $cuotapartista->save();

                CuotapartistaDistribucion::whereCuotapartistaId($cuotapartista->id)->delete();
                foreach($request->distribucion as $distribucion){
                    CuotapartistaDistribucion::updateOrCreate([
                        'oficial_id'=>$distribucion['oficial']['id'],
                        'fondo_id'=>$distribucion['fondo']['id'],
                        'cuotapartista_id'=>$cuotapartista->id
                    ],[
                        'oficial_id'=>$distribucion['oficial']['id'],
                        'fondo_id'=>$distribucion['fondo']['id'],
                        'cuotapartista_id'=>$cuotapartista->id,
                        'base_calculo'=>$distribucion['base_calculo'],
                        'porcentaje'=>$distribucion['porcentaje'],
                    ]);
                }

            }

        }catch(\Exception $ex){
            return $this->errorResponse('Error al guardar el cuotapartista. '.$ex, 500);
        }

        return $this->successResponse('El cuotapartista se ha guardado correctamente', 200);
    }





    public function attach(Request  $request){
        $cuotapartista=Cuotapartista::whereId($request->cuotapartista_id)->first();
        $fondo=Fondo::whereId($request->fondo_id)->first();
        $porcentaje = $request->porcentaje;

        CuotapartistaFondo::updateOrCreate([
            'cuotapartista_id'=>$cuotapartista->id,
            'fondo_id'=>$fondo->id,
        ],[
            'cuotapartista_id'=>$cuotapartista->id,
            'fondo_id'=>$fondo->id,
            'porcentaje'=>$porcentaje,
        ]);

        return $this->getOne($cuotapartista->id);
    }


    public function dettach(Request  $request){
        $cuotapartista=Cuotapartista::whereId($request->cuotapartista_id)->first();
        $fondo=Fondo::whereId($request->fondo_id)->first();

        CuotapartistaFondo::whereCuotapartistaId($cuotapartista->id)->whereFondoId($fondo->id)->delete();

        return $this->getOne($cuotapartista->id);
    }




    public function attachOficial(Request  $request){
        $cuotapartista=Cuotapartista::whereId($request->cuotapartista_id)->first();
        $oficial=Oficial::whereId($request->oficial_id)->first();
        $porcentaje = $request->porcentaje;
        CuotapartistaOficial::updateOrCreate([
            'cuotapartista_id'=>$cuotapartista->id,
            'oficial_id'=>$oficial->id,
        ],[
            'cuotapartista_id'=>$cuotapartista->id,
            'oficial_id'=>$oficial->id,
            'tipo'=>$request->tipo,
            'porcentaje'=>$porcentaje,
        ]);

        return $this->getOne($cuotapartista->id);
    }


    public function dettachOficial(Request  $request){
        $cuotapartista=Cuotapartista::whereId($request->cuotapartista_id)->first();
        $oficial=Oficial::whereId($request->oficial_id)->first();
        CuotapartistaOficial::whereCuotapartistaId($cuotapartista->id)->whereOficialId($oficial->id)->delete();
        return $this->getOne($cuotapartista->id);
    }


    public function cargaCuotapartistaDist($file){

        try{

            Excel::import(new ImportCuotapartistaDist, $file, 'public');

            $mensaje = "Se procesó correctamente";

            } catch(Exception $ex) {
                $mensaje = "ERROR: " . $ex->getMessage();
            }

            return response()->json([
                'mensaje' => $mensaje
            ]);
    }

    public function cargaCuotapartistaFondos($file){

        try{

            Excel::import(new ImportCuotapartistaFondos, $file, 'public');

            $mensaje = "Se procesó correctamente";

            } catch(Exception $ex) {
                $mensaje = "ERROR: " . $ex->getMessage();
            }

            return response()->json([
                'mensaje' => $mensaje
            ]);
    }






}
