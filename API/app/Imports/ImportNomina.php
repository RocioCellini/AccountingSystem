<?php

namespace App\Imports;

use App\Models\Empleado;
use App\Models\Empresa;
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
use Illuminate\Support\Facades\Log;
class ImportNomina implements ToCollection,WithCalculatedFormulas {


    public function collection(Collection $collection)
    {

        foreach ($collection as $key => $row) {
            if($key !== 0 && $row[5]) {
                $fechaNacimiento = Carbon::parse('19000101')->addDays($row[4])->subDays(2)->format("Ymd");
                $fechaIngreso = Carbon::parse('19000101')->addDays($row[3])->subDays(2)->format("Ymd");

                Log::info($row);
                $empleado  =Empleado::updateOrCreate([
                    "empresa_id"=>Empresa::whereCodigo($row[7])->value('id'),
                    "documento" =>$row[5],
                ],[
                    "nombre_apellido"=>$row[2],
                    "fecha_nacimiento"=>$fechaNacimiento,
                    "documento"=>$row[5],
                    "plan_osde"=>$row[11],
                    "titulo_puesto"=>$row[6],
                    "fecha_ingreso"=>$fechaIngreso,
                    "fecha_baja"=>null,
                    "dias_vacaciones"=>$row[13],
                    "bono_semestral"=>$row[12] ?? 0,
                    "puesto_id"=>Puesto::whereDescripcion($row[8])->value('id'),
                    "empresa_id"=>Empresa::whereCodigo($row[7])->value('id'),
                    "sector_id"=>Sector::whereDescripcion($row[9])->value('id'),
                    "padre_id"=>DB::table('empleado_sistema')->whereLegajo($row[10])->whereSistemaId(Sistema::whereCodigo('BJ')->value('id'))->value('empleado_id') ?? null,
                    "es_comercial"=>strtoupper($row[14])=="SI" ? 1 : 0,
                    "sueldo_bruto"=>$row[15],
                    "nunca_liquido_bonus"=>strtoupper($row[16])=="NO" ? 1 : 0,
                ]);

                if(!DB::table('empleado_sistema')->whereLegajo($row[0])->whereSistemaId(Sistema::whereCodigo('BJ')->value('id'))->exists()){
                    $empleado->Legajos()->attach(Sistema::whereCodigo('BJ')->value('id'),['legajo'=>$row[0]]);
                }

                if(!DB::table('empleado_sistema')->whereLegajo($row[1])->whereSistemaId(Sistema::whereCodigo('SUN')->value('id'))->exists()){
                    $empleado->Legajos()->attach(Sistema::whereCodigo('SUN')->value('id'),['legajo'=>$row[1]]);
                }



            }
        }

    }

}
