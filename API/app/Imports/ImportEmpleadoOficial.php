<?php

namespace App\Imports;

use App\Models\EmpleadoOficial;
use App\Models\EmpleadoSistema;
use App\Models\Oficial;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ImportEmpleadoOficial implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {    
        $key = key($row);
        $result = explode(";", $row[$key]);

        /* result
        0 es DescripcionOficial
        1 es codigoOficial
        2 es Legajo
        3 es NombreEmpleado
        4 es %Oficial
        5 es ComisionOficial
        */

        if( isset($result[1]) ){
            $oficial = Oficial::where('id_esco', $result[1])->get();
            if(count($oficial) > 0 ){
                $row_new['oficial_id'] = $oficial->first()->id;
            }else{
                return;
            }  
        }

        if( isset($result[2]) ){
            $empleado = EmpleadoSistema::where('legajo', $result[2])->get();

            if(count($empleado) > 0 ){
                $row_new['empleado_id'] = $empleado->first()->empleado_id;
            }else{
                return;
            }  
        }    
        
        if( isset($result[4]) ){
            $row_new['porcentaje_base_calculo'] = $result[4];
        }else{
            $row_new['porcentaje_base_calculo'] = 0;
        }

        if( isset($result[5]) ){
            $row_new['porcentaje'] = $result[5];
        }else{
            $row_new['porcentaje'] = 0;
        }        

        return new EmpleadoOficial($row_new);

    }
}
