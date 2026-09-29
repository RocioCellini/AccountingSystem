<?php
/**
 * Created by PhpStorm.
 * User: yosbel.fonseca
 * Date: 27/3/2019
 * Time: 12:03
 */

namespace App\Exports;

use App\Models\Empresa;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;


class ReporteComisionesExport implements  WithMultipleSheets
{
    protected $dataFondos;
    protected $dataArrow;
    protected $dataBolsa;


    public function __construct($dataFondos,$dataBolsa,$dataArrow)
    {
        $this->dataFondos = $dataFondos;
        $this->dataBolsa = $dataBolsa;
        $this->dataArrow = $dataArrow;
    }


    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new ReporteComisionesExportSheet($this->dataFondos,"exports.comisiones-fondos","Comisiones Fondos");
        $sheets[] = new ReporteComisionesExportSheet($this->dataBolsa,"exports.comisiones-bolsa","Comisiones Bolsa");
        $sheets[] = new ReporteComisionesExportSheet($this->dataArrow,"exports.comisiones-arrow","Comisiones Arrow");



        return $sheets;
    }

}
