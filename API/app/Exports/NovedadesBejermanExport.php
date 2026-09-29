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


class NovedadesBejermanExport implements  WithMultipleSheets
{
    protected $periodo;

    public function __construct($periodo)
    {
        $this->periodo = $periodo;
    }


    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        foreach(Empresa::all() as $empresa){
            $sheets[] = new NovedadesBejermanExportCompania($this->periodo, $empresa->codigo);
        }


        return $sheets;
    }

}
