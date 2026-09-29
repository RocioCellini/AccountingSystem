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


class ComparativoExport implements  WithMultipleSheets
{
    protected $empleados;

    public function __construct($empleados)
    {
        $this->empleados = $empleados;
    }


    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        $sheets[] = new ComparativoExportEmpleado($this->empleados);



        return $sheets;
    }

}
