<?php

namespace App\Imports;

use App\Models\Comision;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Parametro;
use App\Models\Puesto;
use App\Models\Sector;
use App\Models\Sistema;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Carbon\Carbon;
use Illuminate\Container\Container;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Illuminate\Support\Collection;

class ImportComisiones implements ToCollection,WithCalculatedFormulas {

    public $status;
    public $mensaje;

    public function collection(Collection $collection)
    {

        foreach ($collection as $key => $row) {
            if($key>=3 && isset($row[1])) {
                $fecha = Carbon::parse($row[3]."01")->endOfMonth()->format("Ymd");
                if($fecha < Carbon::parse(Parametro::whereCodigo('CIERRE')->value('valor_fecha'))->format("Ymd")){
                    $this->status = false;
                    $this->mensaje = "El Periodo se encuentra Cerrado";
                    return true;
                }



                $empleadoLegajo = DB::table('empleado_sistema')->whereSistemaId(Sistema::whereCodigo('BJ')->value('id'))->whereLegajo($row[1])->first();
                if(!isset($empleadoLegajo)){
                    $this->status = false;
                    $this->mensaje = "El Empleado #" . $row[1] . " no existe";
                    return true;
                }

                $empleado  = Empleado::whereId($empleadoLegajo->empleado_id)->first();
                if(!$empleado->es_comercial){
                    $this->status = false;
                    $this->mensaje = "El Empleado #" . $row[1] . " no es Comercial";
                    return true;
                }

            }



            if($key>=3 && isset($row[1])) {
                $fecha = Carbon::parse($row[3]."01")->format("Ymd");
                $empleadoLegajo = DB::table('empleado_sistema')->whereSistemaId(Sistema::whereCodigo('BJ')->value('id'))->whereLegajo($row[1])->first();
                if(isset($empleadoLegajo)){

                    $empleado  = Empleado::whereId($empleadoLegajo->empleado_id)->first();

                    Comision::updateOrCreate([
                        'fecha'=>$fecha,
                        'empleado_id'=>$empleado->id,
                    ],[
                        'fecha'=>$fecha,
                        'empleado_id'=>$empleado->id,
                        'estado_id'=>Estado::whereCodigo('PEN')->value('id'),
                        'aprobado_por'=>null,
                        'importe'=>round($row[9] ?? 0,0),
                        'fondos'=>round($row[4] ?? 0,0),
                        'capital_markets'=>round($row[5] ?? 0,0),
                        'rofex'=>round($row[6] ?? 0,0),
                        'cibsa'=>round($row[7] ?? 0,0),
                        'otros'=>round($row[8] ?? 0,0),
                    ]);
                }
            }
        }

        $this->status=true;
        return true;

    }

}
