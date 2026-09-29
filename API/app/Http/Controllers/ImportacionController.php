<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\Rol;
use App\Models\User;
use App\Models\Estado;
use App\Models\Puesto;
use App\Models\Sector;
use App\Models\Empresa;
use App\Models\Novedad;
use App\Models\Empleado;
use App\Models\Parametro;
use App\Models\Importacion;
use App\Models\Liquidacion;
use Illuminate\Http\Request;
use App\Imports\ImportNomina;
use App\Models\BonoSemestral;
use App\Models\HonorarioFondo;
use App\Exports\AsientosExport;
use App\Exports\EvolutivoExport;
use App\Imports\ImportComisiones;
use App\Exports\ComparativoExport;
use App\Imports\IndexImportNomina;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\IndexImportLiquidacion;
use App\Exports\NovedadesBejermanExport;
use App\Exports\ReporteComisionesExport;
use Illuminate\Database\Eloquent\Collection;

class ImportacionController extends Controller
{

    public function storeNomina(Request $request)
    {
        try{
            $archivo = date("YmdHis").'.xlsx';
            $importacion = Importacion::create([
                'tipo'=>'Nomina',
                'origen'=>'\importaciones\legajo\\'.$archivo
            ]);

            $data = explode(";",$request->file)[1];
            $data = str_replace('base64,','',$data);
            $filepath = public_path('\importaciones\legajo\\'.$archivo);
            file_put_contents($filepath,base64_decode($data));
            Excel::import(new IndexImportNomina(), $filepath);
            $importacion->save();

        } catch (\Exception $ex){
            return $this->errorResponse('Error al importar la Nómina. '.$ex, 500);
        }
        return $this->successResponse('La Nómina se importó correctamente', 200);
    }


    public function storeComisiones(Request $request)
    {
        try{
            $archivo = date("YmdHis").'.xlsx';
            $importacion = Importacion::create([
                'tipo'=>'Comisiones',
                'origen'=>'\importaciones\comisiones\\'.$archivo
            ]);

            $data = explode(";",$request->file)[1];
            $data = str_replace('base64,','',$data);
            $filepath = public_path('\importaciones\comisiones\\'.$archivo);
            file_put_contents($filepath,base64_decode($data));
            $import = new ImportComisiones();
            Excel::import($import, $filepath);
            $importacion->save();
        } catch (\Exception $ex){
            return $this->errorResponse('Error al importar Comisiones. '.$ex, 500);
        }

        return $this->successResponse('Las Comisiones se importaron correctamente', 200);
    }

    public function storeLiquidacion(Request $request)
    {
        try{
            $periodo = Carbon::parse($request->periodo)->endOfMonth()->format("Ymd");
            $archivo = date("YmdHis").'.xls';
            $importacion = Importacion::create([
                'tipo'=>'Nomina',
                'origen'=>'\importaciones\bejerman\\'.$archivo
            ]);

            $data = explode(";",$request->file)[1];
            $data = str_replace('base64,','',$data);
            $filepath = public_path('\importaciones\bejerman\\'.$archivo);
            file_put_contents($filepath,base64_decode($data));
            Excel::import(new IndexImportLiquidacion($periodo), $filepath);
            $importacion->save();
        } catch (\Exception $ex){
            return $this->errorResponse('Error al importar Liquidación. '.$ex, 500);
        }
        return $this->successResponse('El archivo se importó correctamente', 200);
    }

    public function storeLiquidacionBejerman(Request $request)
    {
        try{
            $periodo = Carbon::parse($request->periodo."01")->endOfMonth()->format("Ymd");
            $empresa = Empresa::whereId($request->empresa)->first();
            $archivo = date("YmdHis").'.xls';
            $importacion = Importacion::create([
                'tipo'=>'Nomina',
                'origen'=>'\importaciones\bejerman\\'.$archivo
            ]);

            $data = explode(";",$request->file)[1];
            $data = str_replace('base64,','',$data);
            $filepath = public_path('\importaciones\bejerman\\'.$archivo);
            file_put_contents($filepath,base64_decode($data));
            Excel::import(new IndexImportLiquidacion($periodo,$empresa), $filepath);
            $importacion->save();
        } catch (\Exception $ex){
            return $this->errorResponse('Error al importar Liquidación de BJ. '.$ex, 500);
        }

        return $this->successResponse('El archivo se importó correctamente', 200);
    }

    public function export(Request $request){
        try{
            $periodo = Carbon::parse($request->periodo)->startOfMonth()->format("Ymd");
            $filename = date("YmdHis") . ".xls";

            $fechaDesde = Carbon::parse($periodo)->startOfMonth()->format("Ymd");
            $fechaHasta = Carbon::parse($periodo)->endOfMonth()->format("Ymd");

            if(Novedad::whereBetween('fecha',[$fechaDesde,$fechaHasta])->where('variacion','!=',0)->whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->exists()){
                return response()->json(['status'=>false, 'mensaje' => 'Existen Novedades de Incrementos Salariales aun no aprobadas para el periodo solicitado'], 200);
            }

            if(Novedad::whereBetween('fecha',[$fechaDesde,$fechaHasta])->whereRaw('horas_extras_50 + horas_extras_100 != 0')->whereHorasExtrasEstadoId(Estado::whereCodigo('PEN')->value('id'))->exists()){
                return response()->json(['status'=>false, 'mensaje' => 'Existen Novedades de Horas Extras aun no aprobadas para el periodo solicitado'], 200);
            }

            /*
            if(!Novedad::whereBetween('fecha',[$fechaDesde,$fechaHasta])->exists()){
                return response()->json(['status'=>false, 'mensaje' => 'No hay ninguna novedad para el periodo seleccionado'], 200);
            }
            */

            if(BonoSemestral::whereBetween('fecha',[$fechaDesde,$fechaHasta])->whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->exists()){
                return response()->json(['status'=>false, 'mensaje' => 'Existen Bonos Semestrales aun no aprobados para el periodo solicitado'], 200);
            }


            Excel::store(new NovedadesBejermanExport($periodo), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        } catch (\Exception $ex){
            return $this->errorResponse('Error al exportar las Novedades. '.$ex, 500);
        }

        return $this->successResponse(['ruta' => $ruta], 200);
    }


    public function exportEvolutivo(Request $request){
        try{
            $fechaDesde = Carbon::parse($request->fechaDesde)->startOfMonth()->format("Ymd");
            $fechaHasta = Carbon::parse($request->fechaHasta)->endOfMonth()->format("Ymd");

            if($fechaDesde>$fechaHasta){
                return $this->errorResponse('Ha ingresado como Fecha Desde una fecha mayor a la Fecha Hasta', 404);
            }

            $empleado = $request->empleado;
            $detalleAprobador = $request->detalleAprobadores;
            $empleadosActivos = $request->empleadosActivos;
            $empleadosMultinomina = $request->empleadosMultinomina;

            $filename = date("YmdHis") . ".xls";

            Excel::store(new EvolutivoExport($fechaDesde,$fechaHasta,$empleado,$detalleAprobador,$empleadosActivos,$empleadosMultinomina), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        } catch (\Exception $ex){
            return $this->errorResponse('Error al exportar Evolutivo. '.$ex, 500);
        }

        return $this->successResponse(['ruta' => $ruta], 200);
    }


    public function exportComparativo(Request $request){
        try{
            $empleados = $request->empleados;
            $filename = date("YmdHis") . ".xls";
            Excel::store(new ComparativoExport($empleados), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        } catch (\Exception $ex){
            return $this->errorResponse('Error al exportar Comparativo. '.$ex, 500);
        }

        return $this->successResponse(['ruta' => $ruta], 200);
    }

    public function exportReporteComisiones(Request $request){
        try{
            $filename = date("YmdHis") . ".xls";
            $periodo = $request->periodo;
            $fechaDesde = Carbon::parse($periodo."01")->startOfMonth()->format("Y-m-d");
            $fechaHasta = Carbon::parse($periodo."01")->endOfMonth()->format("Y-m-d");

            $sql = "SET NOCOUNT ON; EXEC SP_exportReporteComisiones '$fechaDesde','$fechaHasta'";
            $data = DB::select($sql);

            // arreglo para guardar los registros que no se repiten
            $registros = [];

            foreach($data as $elem){
                // Si la comision es mayor a 0 se muestra en el excel
                if($elem->comision > 0){
                    // * Elimino los registros repetidos
                    // ? Si tienen el mismo numero de fondo, numero de cuotapartista, legajo, descripcion oficial son registros repetidos
                    // ? Salvo que tengan distinto importe comision. En ese caso deben figurar los registros que no repitan Importe Comision
                    if( ! in_array($elem, $registros)){
                        array_push($registros, $elem);
                    }
                }
            }

            Excel::store(new ReporteComisionesExport($registros,[],[]), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        } catch (\Exception $ex){
            return $this->errorResponse('Error al exportar Comisiones. '.$ex, 500);
        }

        return $this->successResponse(['ruta' => $ruta], 200);
    }



    public function exportAsientosContables(Request $request){
        try{
            $filename = date("YmdHis") . ".xls";
            $periodo = $request->periodo;
            $empresa = Empresa::whereId($request->empresa)->first();
            if(!Liquidacion::whereEmpresaId($empresa->id)->whereDate('fecha',Carbon::parse($request->periodo."01")->endOfMonth()->format("Ymd"))->exists()){
                return response()->json(['status'=>false, 'mensaje' => "No hay liquidaciones cargadas para ese periodo"], 200);
            }


            Excel::store(new AsientosExport($periodo,$empresa ), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        } catch (\Exception $ex){
            return $this->errorResponse('Error al exportar el Asiento. '.$ex, 500);
        }

        return $this->successResponse(['ruta' => $ruta], 200);
    }

}
