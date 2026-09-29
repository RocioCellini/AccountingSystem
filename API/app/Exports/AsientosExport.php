<?php
/**
 * Created by PhpStorm.
 * User: yosbel.fonseca
 * Date: 27/3/2019
 * Time: 12:03
 */

namespace App\Exports;

use App\Models\Empresa;
use App\Models\Liquidacion;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;


class AsientosExport implements  WithMultipleSheets
{
    protected $periodo;
    protected $empresa;

    public function __construct($periodo,$empresa)
    {
        $this->periodo = $periodo;
        $this->empresa = $empresa;
    }


    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        $fechaDesde = Carbon::parse($this->periodo."01")->startOfMonth()->format("Ymd");
        $fechaSegundos = strtotime($fechaDesde);
        $mes = date("n", $fechaSegundos);

        if($mes==6 || $mes==12){
            $sheets[] = new AsientosExportSheet($this->periodo,$this->empresa, "SUELDOS");
            // $sheets[] = new AsientosExportSheet($this->periodo,$this->empresa, "VAC");
        }else{
            $sheets[] = new AsientosExportSheet($this->periodo,$this->empresa, "SUELDOS");
            $sheets[] = new AsientosExportSheet($this->periodo,$this->empresa, "SAC");
            // $sheets[] = new AsientosExportSheet($this->periodo,$this->empresa, "VAC");
        }

        return $sheets;
    }

}
