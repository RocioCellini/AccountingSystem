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


class EvolutivoExport implements  WithMultipleSheets
{
    protected $fechaDesde;
    protected $fechaHasta;
    protected $empleado;
    protected $detalleAprobadores;
    protected $empleadosActivos;
    protected $empleadosMultinomina;

    public function __construct($fechaDesde,$fechaHasta,$empleado,$detalleAprobadores,$empleadosActivos,$empleadosMultinomina)
    {
        $this->fechaDesde = $fechaDesde;
        $this->fechaHasta = $fechaHasta;
        $this->empleado = $empleado;
        $this->detalleAprobadores = $detalleAprobadores;
        $this->empleadosActivos = $empleadosActivos;
        $this->empleadosMultinomina = $empleadosMultinomina;
    }


    /**
     * @return array
     */
    public function sheets(): array
    {
        $sheets = [];

        //foreach(Empresa::all() as $empresa){
            $sheets[] = new EvolutivoExportCompania($this->fechaDesde, $this->fechaHasta,$this->empleado,$this->detalleAprobadores, $this->empleadosActivos);
        //}


        return $sheets;
    }

}
