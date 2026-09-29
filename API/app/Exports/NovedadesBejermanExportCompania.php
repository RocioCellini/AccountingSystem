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


class NovedadesBejermanExportCompania implements FromView,WithTitle
{
    private $periodo;
    private $compania;

    public function __construct($periodo,$compania)
    {
        $this->periodo = $periodo;
        $this->compania = $compania;

    }

    public function view(): View
    {
        $empresa = Empresa::whereCodigo($this->compania)->first();
        $empleados = Empleado::whereEmpresaId($empresa->id)->get();
        $fechaDesde = Carbon::parse($this->periodo)->startOfMonth()->format("Ymd");
        $fechaHasta = Carbon::parse($this->periodo)->endOfMonth()->format("Ymd");
        $esMesBono = CalendarioBono::whereMes(Carbon::parse($this->periodo)->endOfMonth()->month)->value('porcentaje_sueldos') != 0;
        $tipoCambio = TipoCambio::wherePeriodo(Carbon::parse($this->periodo)->format("Ym"))->value('cotizacion');

        foreach($empleados as $key => $empleado){
            $fechaBaja = Carbon::parse(($empleado->fecha_baja) ? $empleado->fecha_baja : $fechaHasta)->format("Ymd");

            if(Carbon::parse($empleado->fecha_ingreso)<=$fechaHasta && ($fechaBaja>=$fechaHasta)){

                $novedad = Novedad::whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaDesde,$fechaHasta])->first();
                $empleados[$key]->sueldo_bruto = (isset($novedad) && isset($novedad->Estado) && $novedad->Estado->codigo=="APR") ? $novedad->sueldo_bruto : $empleado->ultimo_sueldo;
                $empleados[$key]->horas_extras_50 = (isset($novedad) && isset($novedad->EstadoHorasExtras) && $novedad->EstadoHorasExtras->codigo=="APR") ? $novedad->horas_extras_50 : 0;
                $empleados[$key]->horas_extras_100 = (isset($novedad) && isset($novedad->EstadoHorasExtras) && $novedad->EstadoHorasExtras->codigo=="APR") ? $novedad->horas_extras_100 : 0;


                $comision = Comision::whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaDesde,$fechaHasta])->first();
                $gratificacionEspecial = GratificacionEspecial::whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaDesde,$fechaHasta])->first();

                $empleados[$key]->comisiones = (isset($comision) && $comision->Estado->codigo=="APR") ? $comision->importe : 0;


                $bonoTrimestral = BonoTrimestralDistribucion::whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaDesde,$fechaHasta])->first();

                $empleados[$key]->bono_trimestral = (isset($bonoTrimestral) && $bonoTrimestral->Estado->codigo=="APR") ? (($bonoTrimestral->importe * $tipoCambio) + $bonoTrimestral->ajuste) : 0;

                $empleados[$key]->gratificacion_especial = (isset($gratificacionEspecial) && $gratificacionEspecial->Estado->codigo=="APR") ? $gratificacionEspecial->importe : 0;

                if($empleado->repite_bono_semestral){
                    $empleados[$key]->bono_mensual = round(BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha','<=',$fechaDesde)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->orderBy('fecha','desc')->value('importe') ?? 0,0);
                    $empleados[$key]->bono_semestral = 0;
                } else {
                    //Anteriormente se habia definido que el primer sueldo se debia exportar en "No Remunerativo" pero cambio por definicion de Elizabeth
                    //$cobroOtroBonusEnBP = BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha','<',$fechaDesde)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->exists();

                    /*
                    if($empleado->nunca_liquido_bonus && !$cobroOtroBonusEnBP){
                        $empleados[$key]->bono_semestral = 0;
                        $empleados[$key]->bono_mensual = 0;
                        $empleados[$key]->no_remunerativo = round(BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha',$fechaDesde)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->value('importe') ?? 0,0);
                    } else {
                        $empleados[$key]->bono_semestral = round(BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha',$fechaDesde)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->value('importe') ?? 0,0);
                        $empleados[$key]->bono_mensual = 0;
                        $empleados[$key]->no_remunerativo = 0;
                    }
                    */
                    $empleados[$key]->bono_semestral = round(BonoSemestral::whereEmpleadoId($empleado->id)->whereDate('fecha',$fechaDesde)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->value('importe') ?? 0,0);
                    $empleados[$key]->bono_mensual = 0;
                    $empleados[$key]->no_remunerativo = 0;



                }
            } else {
                unset($empleados[$key]);
            }
        }



        $html = view('exports.novedades', ['tipoCambio'=>$tipoCambio,'empleados'=>$empleados,'empresa'=>$empresa,'periodo'=> Carbon::parse($this->periodo)->format("m-Y")]);
        return $html;
    }


    /**
     * @return string
     */
    public function title(): string
    {
        return $this->compania;

    }


}
