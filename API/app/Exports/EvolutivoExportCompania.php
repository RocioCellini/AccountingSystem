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

class EvolutivoExportCompania implements FromView,WithTitle
{
    private $fechaDesde;
    private $fechaHasta;
    private $compania;
    private $empleado;
    protected $detalleAprobadores;
    protected $empleadosActivos;

    public function __construct($fechaDesde, $fechaHasta,$empleado,$detalleAprobadores,$empleadosActivos)
    {
        $this->fechaDesde = $fechaDesde;
        $this->fechaHasta = $fechaHasta;
        //$this->compania = $compania;
        $this->empleado = $empleado;
        $this->detalleAprobadores = $detalleAprobadores;
        $this->empleadosActivos = $empleadosActivos;

    }

    public function view(): View
    {
        $fechaDesde = Carbon::parse($this->fechaDesde)->format("Ymd");
        $fechaHasta = Carbon::parse($this->fechaHasta)->format("Ymd");
        $empleado = $this->empleado['empleado'] ?? null;
        $empleadosActivos = $this->empleadosActivos;

        $user = User::whereId(Auth::id())->orderBy('updated_at','desc')->first();
        if($user->Rol->codigo=="RRHH" || $user->Rol->codigo=="APR" || $user->Rol->codigo=="SU"){
            $empleados = Empleado::orderBy('nombre_apellido','asc');
        } else {
            $empleados = Empleado::whereRaw("(padre_id = '" .  $user->empleado_id . "' or id='" .  $user->empleado_id . "') ");
            $empleados = $empleados->orderBy('nombre_apellido','asc');
        }

        if($empleadosActivos){
            $empleados = $empleados->whereNull('fecha_baja');
        }

        if(isset($empleado) && $empleado!=[]){
            $empleados = $empleados->whereId($empleado['id']);
        }

        $empleados = $empleados->get();

        $arr = [];

        foreach($empleados as $key => $empleado){
            $fecha_ingreso = Carbon::parse($empleado->fecha_ingreso)->format("Ymd");

            if($fechaDesde>=$fecha_ingreso){
               $fechaProceso = $fechaDesde;
            }else{
                $fechaProceso = $fecha_ingreso;
            }

            while($fechaProceso <= $fechaHasta){

                if(Carbon::parse($fechaProceso)->startOfMonth()->format("Ym")<="202109"){
                    $fechaProceso = Carbon::parse($fechaProceso)->addMonth()->format("Ymd");
                    continue;
                }

                $periodoDesde = Carbon::parse($fechaProceso)->startOfMonth()->format("Ymd");
                $periodoHasta = Carbon::parse($fechaProceso)->endOfMonth()->format("Ymd");

                $fechaBaja = Carbon::parse(($empleado->fecha_baja) ? $empleado->fecha_baja : $periodoHasta)->format("Ymd");

                if(($fecha_ingreso<=$periodoHasta) && ($fechaBaja>=$periodoHasta)){

                    $tipoCambio = TipoCambio::wherePeriodo(Carbon::parse($periodoHasta)->format("Ym"))->value('cotizacion');

                    $ultimoSueldo = Novedad::whereEmpleadoId($empleado->id)->whereDate('fecha','<=',$periodoHasta)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->orderBy('fecha','desc')->first();
                    $horasExtras = Novedad::whereEmpleadoId($empleado->id)->whereBetween('fecha',[$periodoDesde,$periodoHasta])->whereRaw('(horas_extras_50 + horas_extras_100)<>0')->whereHorasExtrasEstadoId(Estado::whereCodigo('APR')->value('id'))->first();
                    $novedadDeEstePeriodo = false;

                    $bonoTrimestral = BonoTrimestralDistribucion::whereEmpleadoId($empleado->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$periodoDesde,$periodoHasta])->first();
                    $bonoSemestral = BonoSemestral::whereEmpleadoId($empleado->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$periodoDesde,$periodoHasta])->first();
                    $comision = Comision::whereEmpleadoId($empleado->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$periodoDesde,$periodoHasta])->first();
                    $gratificacion = GratificacionEspecial::whereEmpleadoId($empleado->id)->whereEstadoId(Estado::whereCodigo('APR')->value('id'))->whereBetween('fecha',[$periodoDesde,$periodoHasta])->first();

                    if($ultimoSueldo){
                        $novedadDeEstePeriodo = Carbon::parse($ultimoSueldo->fecha)->between($periodoDesde,$periodoHasta);
                    }

                    $arr[] = [
                        'empleado_legajo'=>$empleado->legajo_bejerman,
                        'empleado_nombre'=>$empleado->nombre_apellido,
                        'empleado_documento'=>$empleado->documento,
                        'empleado_fecha_ingreso'=>Carbon::parse($empleado->fecha_ingreso)->format("d/m/Y"),
                        'empleado_sector'=>($empleado->Sector) ? $empleado->Sector->toArray() : [],
                        'empleado_empresa'=>($empleado->Empresa) ? $empleado->Empresa->toArray() : [],
                        'empleado_padre'=>($empleado->Padre) ? $empleado->Padre->toArray() : [],
                        'empleado_puesto'=>($empleado->Puesto) ? $empleado->Puesto->toArray() : [],
                        'fecha_desde' => $periodoDesde,
                        'fecha_hasta' => $periodoHasta,
                        'sueldo_bruto' => $ultimoSueldo->sueldo_bruto ?? $empleado->sueldo_bruto,
                        'sueldo_bruto_aprobacion' => ($ultimoSueldo && $ultimoSueldo->IncrementoAprobadoPor && $novedadDeEstePeriodo ) ? $ultimoSueldo->IncrementoAprobadoPor->toArray() : [],
                        'sueldo_bruto_aprobacion_fecha' => ($ultimoSueldo && $ultimoSueldo->IncrementoAprobadoPor && $novedadDeEstePeriodo ) ? $ultimoSueldo->toArray() : [],
                        'horas_extras_50' => $horasExtras->horas_extras_50 ?? 0,
                        'horas_extras_100' => $horasExtras->horas_extras_100 ?? 0,
                        'horas_extras_aprobacion' => ($horasExtras && $horasExtras->HorasExtrasAprobadoPor ) ? $horasExtras->HorasExtrasAprobadoPor->toArray() : [],
                        'horas_extras_aprobacion_fecha' => ($horasExtras && $horasExtras->HorasExtrasAprobadoPor ) ? $horasExtras->toArray() : [],
                        'comision_obj'=>$comision,
                        'comision'=>$comision ? $comision->importe : 0,
                        'comision_aprobacion'=>($comision && $comision->Aprobador) ? $comision->Aprobador->toArray() : [],
                        'comision_aprobacion_fecha'=>($comision && $comision->Aprobador) ? $comision->toArray() : [],
                        'bono_trimestral_obj'=>$bonoTrimestral,
                        'bono_trimestral_dolares'=>$bonoTrimestral ? (($bonoTrimestral->importe)) : 0  ,
                        'bono_trimestral_pesos'=>$bonoTrimestral ? (($bonoTrimestral->importe) * ($tipoCambio ?? 1)) : 0  ,
                        'bono_trimestral_aprobacion'=>($bonoTrimestral && $bonoTrimestral->Aprobador) ? $bonoTrimestral->Aprobador->toArray() : [],
                        'bono_trimestral_aprobacion_fecha'=>($bonoTrimestral && $bonoTrimestral->Aprobador) ? $bonoTrimestral->toArray() : [],
                        'gratificacion_obj'=>$gratificacion,
                        'gratificacion'=>$gratificacion ? ($gratificacion->importe) : 0  ,
                        'gratificacion_aprobacion'=>($gratificacion && $gratificacion->Aprobador) ? $gratificacion->Aprobador->toArray() : [],
                        'gratificacion_fecha'=>($gratificacion && $gratificacion->Aprobador) ? $gratificacion->toArray() : [],
                        'bono_semestral'=>$bonoSemestral ? ($bonoSemestral->importe) : 0  ,
                        'bono_semestral_aprobacion'=>($bonoSemestral && $bonoSemestral->Aprobador) ? $bonoSemestral->Aprobador->toArray() : [],
                        'bono_semestral_aprobacion_fecha'=>($bonoSemestral && $bonoSemestral->Aprobador) ? $bonoSemestral->toArray() : [],
                    ];
                }
                $fechaProceso = Carbon::parse($fechaProceso)->addMonth()->format("Ymd");
            }
        }
        Log::info($this->detalleAprobadores);
        $html = view('exports.evolutivo', ['data'=>$arr,'detalleAprobadores'=>$this->detalleAprobadores]);
        return $html;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        //return $this->compania->descripcion;
        return "Detalle";
    }
}

