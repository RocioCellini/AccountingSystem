<?php

namespace App\Imports;

use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Liquidacion;
use App\Models\Puesto;
use App\Models\Sector;
use App\Models\Sistema;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Row;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Carbon\Carbon;
use Illuminate\Container\Container;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Illuminate\Support\Collection;

class ImportLiquidacion implements ToCollection,WithCalculatedFormulas {

    protected $periodo;
    protected $empresa;

    public function __construct($periodo,$empresa)
    {
        $this->empresa = $empresa;
        $this->periodo = $periodo;
    }

    public function collection(Collection $collection)
    {


        Liquidacion::whereEmpresaId($this->empresa->id)->wherefecha($this->periodo)->delete();
        Log::info("A Cargar");
        Log::info($collection);

        $validaciones =[];
        foreach ($collection as $keyRow => $row) {
            //se ignoran las dos primeras filas que son de header(ver porq en el video son 3)
            if($keyRow<=2){
                continue;
            }


            $legajo = $row[1];
            if (strpos($legajo, 'A') !== false) {
                $legajo = str_replace("A","",$legajo);
                $legajo = 9000 + ((int) $legajo);
            }

            $empleadoId = DB::table('empleado_sistema')->whereLegajo($legajo)->whereSistemaId(Sistema::whereCodigo('BJ')->value('id'))->value('empleado_id');
            $empleado = Empleado::whereId($empleadoId)->first();
            if(!isset($empleado)){
                $validaciones[] = "El empleado " . $row[1] . " " . $row[2] . " No pudo ser identificado";
            }

        }

        if($validaciones!=[]){
            $mensaje = "Se produjeron los siguientes errores antes de procesar el archivo: ";
            foreach($validaciones as $val){
                $mensaje .= " " . $val . ";       ";
            }

            throw new Exception($mensaje, 1);
        }


        foreach ($collection as $keyRow => $row) {

            if($keyRow<=2){
                continue;
            }


            $legajo = $row[1];
            if (strpos($legajo, 'A') !== false) {
                $legajo = str_replace("A","",$legajo);
                $legajo = 9000 + ((int) $legajo);
            }

            $empleadoId = DB::table('empleado_sistema')->whereLegajo($legajo)->whereSistemaId(Sistema::whereCodigo('BJ')->value('id'))->value('empleado_id');
            $empleado = Empleado::whereId($empleadoId)->first();
            Log::info($empleado);

            if($empleado){
                //Cada columna representa un concepto y se considera que nunca habrá más de 100
                for($keyColumn = 3; $keyColumn<=100;$keyColumn++){
                    if(isset($row[$keyColumn])){
                        /* En el campo concepto de la tabla Liquidaciones, el mismo se arma como codigoEmpresa_codigoConcepto, por ej GAS_0415.
                        El código de la empresa se encuentra en la tabla Empresa. Ver en que tabla esta ahora*/
                        $codigo = $this->empresa->codigo . "_" . $collection[1][$keyColumn];
                        $liquidacion = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleadoId)->whereFecha($this->periodo)->whereConcepto($codigo)->first();

                        if(!isset($liquidacion)){
                            /* El estado_id está harcodeado para que siempre guarde el de código LIQ de la tabla estados, que es 4 en la BD haciendo referencia a Liquidado.
                            El día de la fecha del periodo ingresado por defecto siempre se guarda en la BD como fin de mes. 
                            Osea, si ingresan el 2023-07-20 se guarda como 2023-07-31.
                            El campo liquidación originalmente se agregó por si venía algún número que la identifique, pero por defecto es TEST por ahora.*/
                            $liquidacion = Liquidacion::create([
                                "empresa_id"=>$this->empresa->id,
                                "empleado_id"=>$empleadoId,
                                "estado_id"=>Estado::whereCodigo('LIQ')->value('id'),
                                "fecha"=>$this->periodo,
                                "concepto"=>$codigo,
                                'liquidacion'=>"TEST" ?? '',
                                'importe'=>$row[$keyColumn] ?? 0,
                            ]);
                            
                        } else {
                            $liquidacion->importe = $liquidacion->importe + $row[$keyColumn];
                            $liquidacion->save();
                        }




                    }

                }
            }
        }
    }

}
