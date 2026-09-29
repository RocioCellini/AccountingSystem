<?php

namespace App\Imports;

use App\Models\CuotapartistaFondo;
use App\Models\Cuotapartista;
use App\Models\Fondo;

use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ImportCuotapartistaFondos implements ToModel, WithHeadingRow
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
        0 es NumeroCuotapartista
        2 es NumeroFondo
        7 es %comision
        */

        if( isset($result[0]) ){
            $cuotapartista = Cuotapartista::where('numero_cuotapartista', $result[0])->get();
            
            if(count($cuotapartista) > 0 ){
                $row_new['cuotapartista_id'] = $cuotapartista->first()->id;
            }else{
                return;
            }  
        }

        if( isset($result[2]) ){
            $fondo = Fondo::where('numero_fondo', $result[2])->get();
            
            if(count($fondo) > 0 ){
                $row_new['fondo_id'] = $fondo->first()->id;
            }else{
                return;
            }  
        }

        if( isset($result[7]) ){
            $row_new['porcentaje'] = $result[7];
        }else{
            $row_new['porcentaje'] = 0;
        }

        return new CuotapartistaFondo($row_new);

    }
}
