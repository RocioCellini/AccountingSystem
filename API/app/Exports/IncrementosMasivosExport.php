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


class IncrementosMasivosExport implements  WithMultipleSheets
{
    protected $data;

    public function __construct($data)
    {
        $this->data = $data;
    }


    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

            $sheets[] = new IncrementosMasivosExportSheet($this->data);



        return $sheets;
    }

}
