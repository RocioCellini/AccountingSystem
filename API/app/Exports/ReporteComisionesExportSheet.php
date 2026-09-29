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
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;


class ReporteComisionesExportSheet implements FromView,WithTitle
{
    private $data;
    private $view;
    private $titulo;

    public function __construct($data,$view,$titulo)
    {
        $this->data = $data;
        $this->view = $view;
        $this->titulo = $titulo;

    }

    public function view(): View
    {
        $html = view($this->view, ['data'=>$this->data]);
        return $html;
    }


    /**
     * @return string
     */
    public function title(): string
    {
        return $this->titulo;

    }


}

