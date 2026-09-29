<?php
/**
 * Created by PhpStorm.
 * User: yosbel.fonseca
 * Date: 27/3/2019
 * Time: 12:03
 */

namespace App\Exports;
use App\Models\BonoSemestral;
use App\Models\BonoTrimestralDistribucion;
use App\Models\CalendarioBono;
use App\Models\Comision;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\GratificacionEspecial;
use App\Models\Novedad;
use App\Models\TipoCambio;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;


class BonoSemestralExportSheet implements FromView,WithTitle
{
    private $data;

    public function __construct($data)
    {
        $this->data = $data;

    }

    public function view(): View
    {
        $html = view('exports.bono_semestral', ['data'=>$this->data]);
        return $html;
    }


    /**
     * @return string
     */
    public function title(): string
    {
        return $this->data;

    }


}
