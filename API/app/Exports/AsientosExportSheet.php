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
use App\Models\CuentaContable;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\GratificacionEspecial;
use App\Models\Liquidacion;
use App\Models\Novedad;
use App\Models\TipoCambio;
use App\Models\User;
use App\Models\AsientoContable;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;


class AsientosExportSheet implements FromView,WithTitle
{
    private $periodo;
    private $empresa;
    private $concepto;

    public function __construct($periodo, $empresa, $concepto)
    {
        $this->periodo = $periodo;
        $this->empresa = $empresa;
        $this->concepto = $concepto;
    }

    public function view(): View
    {

        $empresa = $this->empresa;
        $fechaDesde = Carbon::parse($this->periodo."01")->startOfMonth()->format("Ymd");
        $fechaHasta = Carbon::parse($this->periodo."01")->endOfMonth()->format("Ymd");
        $empleados = Empleado::whereEmpresaId($empresa->id)->get();
        $data = $dataContraparte = $array_sac = [];
        $sac_acum = 0;
        $total_sac_acum = 0;
        $porcentajeCargasSociales = 0;

        $fechaSegundos = strtotime($fechaDesde);
        $mes = date("n", $fechaSegundos);

        if($mes<7){
            //Primer semestre
            $diferenciaMensual = $mes-1;
        }else{
            //Segundo semestre
            $diferenciaMensual = $mes-7;
        }

        $fechaInicial = strtotime('-'.$diferenciaMensual.' months', $fechaSegundos);
        $fechaInicial = date('Ymd', $fechaInicial);

        $fechaHastaSeg = strtotime($fechaHasta);
        $fechaHastaParse = Carbon::parse($fechaHastaSeg)->startOfMonth();
        $fechaHastaAnterior = $fechaHastaParse->subMonth()->endOfMonth()->format("Ymd");

        $total = [];
        $array_sac = [];
        $total["SUELDO"] = $total["CARGAS"] = $total["GRATIF_ESP"] = $total["SAC"] = $total["REMUNERACIONES"] =$total["REDONDEO"] = $total["APORTES"] = $total["GANANCIAS"] = 0;
        $subConceptos = ["SUELDO","CARGAS","GRATIF_ESP","SAC","REMUNERACIONES","REDONDEO","APORTES","GANANCIAS"];

        $contraparte = [];
        $contrapartes["REMUNERAC"] = $contrapartes["CARGAS"] = $contrapartes["GANANCIAS"] = 0;

        $arrConceptosSueldos = ["0201","9999","0401","0404","0405","0415","0993","0501","0502","0503","0504","0505","0515","0525","0535","0540","0401","0405","0404","0415","0993",];

        if($this->concepto=="SUELDOS"){
            foreach($empleados as $empleado){


                foreach($subConceptos as $subConcepto){
                    if($empleado->fecha_ingreso<=$fechaDesde && (!isset($empleado->fecha_baja) || $empleado->fecha_baja>=$fechaHasta)){

                        if($subConcepto=="SUELDO"){
                            $arrConceptos = ["0199","0201","0209","0213","0216","0217","0221","0222","0232","0240","0250"];
                            } elseif($subConcepto=="CARGAS"){
                                $arrConceptos = ["0501","0502","0503","0504","0505","0515","0525","0535","0540",];
                            } elseif($subConcepto=="GRATIF_ESP"){
                                $arrConceptos = ["0203","0204","0205","0209","0218","0219","0271","0280","T500",];
                            } elseif($subConcepto=="SAC"){
                                //SAC PAGADO
                                $arrConceptos = ["0207","0235","0236","0251","0252","0254","0255",];
                            } elseif($subConcepto=="REMUNERACIONES"){
                                //conceptos que no estan en sueldo y son parte de la sumatoria de remuneraciones a pagar
                                //por ej: casos donde hay adicionales pluriempleo (0218, 0219)
                                $arrConceptos = ["0203","0205","0218","0219",];
                            } elseif($subConcepto=="REDONDEO"){
                                $arrConceptos = ["9999",];
                            } elseif($subConcepto=="APORTES"){
                                $arrConceptos = ["0401","0404","0405","0415",];
                            } elseif($subConcepto=="GANANCIAS") {
                                $arrConceptos = ["0700","0701","0702","G991","G992","G993","G994",];
                            } else{
                                continue;
                            }

                            foreach($arrConceptos as $k => $v){
                                $arrConceptos[$k] = $this->empresa->codigo . "_" . $v;
                            }

                            $importe = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaDesde,$fechaHasta])->whereIn('concepto',$arrConceptos)->sum('importe');

                            if(isset($empleado->llave_distribucion_id)){
                                foreach($empleado->LlaveDistribucion->Distribucion as $distribucion) {

                                    $diasVacaciones = $empleado->getDiasVacaciones($this->periodo);
                                    $porcentajeCargasSociales = 0.23;

                                    if($empleado->tipo_empleado=="D"){
                                        $porcentajeCargasSociales=0;     //porcentaje para Directores
                                    }

                                    if($empleado->tipo_empleado=="J"){
                                        $porcentajeCargasSociales=0.13;  //porcentaje para Jubilados
                                    }

                                    $cuenta = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto($this->concepto . "_" . $subConcepto)->whereCentroCostoId($distribucion->CentroCosto->id)->first();

                                    if($subConcepto=="REMUNERACIONES" || $subConcepto=="APORTES" || $subConcepto=="GANANCIAS"){
                                    continue;
                                    }

                                    if($subConcepto=="REDONDEO"){
                                        $distribucion->porcentaje = 100;
                                    }

                                    if(!isset($cuenta)){
                                        //Busco la cuenta GENERICA (Sin especificar Centro de costo) para ese concepto
                                        $cuenta = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto($this->concepto . "_" . $subConcepto)->first();
                                    }

                                    //En los meses junio y diciembre calculamos SAC y las CCSS sobre SAC, estas se muestran por empleado
                                    if(($mes==6 || $mes==12) && $subConcepto=="SAC"){
                                        $asiento = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->first();

                                        if(isset($asiento)){
                                            //si existe el asiento buscamos la provision_mensual_sac y ese será el importe a mostrar por cada empleado y centro de costo.
                                            $importe_SAC = $asiento->provision_mensual_sac;

                                            $data[] = [
                                                'empleado_id' => $empleado->legajo_bejerman,
                                                'empleado_nombre' => $empleado->nombre_apellido,
                                                'importe_base' => $importe_SAC,
                                                'centro_costo' => $distribucion->CentroCosto->descripcion,
                                                'porcentaje' => (float)$distribucion->porcentaje,
                                                'cuenta_contable_numero' => $cuenta->numero_cuenta ?? '',
                                                'cuenta_contable_descripcion' => $cuenta->descripcion ?? '',
                                                'partida'=>(($importe_SAC * ((float)$distribucion->porcentaje / 100)>0) ? 'D' : 'C'),
                                                'importe_prorateado' => abs($importe_SAC * ((float)$distribucion->porcentaje / 100))
                                            ];
                                        }
                                    }elseif(($mes==6 || $mes==12) && $subConcepto=="CARGAS"){
                                        //restamos en cada fila de ccss por empleado las ccss_sobre_sac acumuladas
                                        $CCSS_sobreSAC = $array_sac["SAC_acumulado"][$empleado_id] * $porcentajeCargasSociales;

                                        $importe_CCSS_SAC = $importe - $CCSS_sobreSAC;

                                        $dist_importe_CCSS_SAC = $importe_CCSS_SAC * ((float)$distribucion->porcentaje / 100);
                                        $dist_importe_CCSS_SAC = round($dist_importe_CCSS_SAC, 2, PHP_ROUND_HALF_UP);

                                        $data[] = [
                                            'empleado_id' => $empleado->legajo_bejerman,
                                            'empleado_nombre' => $empleado->nombre_apellido,
                                            'importe_base' => $importe,
                                            'centro_costo' => $distribucion->CentroCosto->descripcion,
                                            'porcentaje' => (float)$distribucion->porcentaje,
                                            'cuenta_contable_numero' => $cuenta->numero_cuenta ?? '',
                                            'cuenta_contable_descripcion' => $cuenta->descripcion ?? '',
                                            'partida'=>(($importe_CCSS_SAC * ((float)$distribucion->porcentaje / 100)>0) ? 'D' : 'C'),
                                            'importe_prorateado' => abs($dist_importe_CCSS_SAC)
                                        ];

                                    }elseif(($mes==4) && $subConcepto=="CARGAS"){
                                        //restamos en cada fila de ccss por empleado las ccss_sobre_vac acumuladas
                                        $CCSS_sobreVAC = $array_vac["VAC_acumulado"][$empleado_id] * $porcentajeCargasSociales;

                                        $importe_CCSS_VAC = $importe - $CCSS_sobreVAC;

                                        $dist_importe_CCSS_VAC = $importe_CCSS_VAC * ((float)$distribucion->porcentaje / 100);
                                        $dist_importe_CCSS_VAC = round($dist_importe_CCSS_VAC, 2, PHP_ROUND_HALF_UP);

                                        $data[] = [
                                            'empleado_id' => $empleado->legajo_bejerman,
                                            'empleado_nombre' => $empleado->nombre_apellido,
                                            'importe_base' => $importe,
                                            'centro_costo' => $distribucion->CentroCosto->descripcion,
                                            'porcentaje' => (float)$distribucion->porcentaje,
                                            'cuenta_contable_numero' => $cuenta->numero_cuenta ?? '',
                                            'cuenta_contable_descripcion' => $cuenta->descripcion ?? '',
                                            'partida'=>(($importe_CCSS_VAC * ((float)$distribucion->porcentaje / 100)>0) ? 'D' : 'C'),
                                            'importe_prorateado' => abs($dist_importe_CCSS_VAC)
                                        ];

                                    }elseif(($mes==4) && $subConcepto=="SUELDO"){
                                        //VAC PAGADO
                                        $arrConceptosVACP = ["0240","0250"];

                                        foreach($arrConceptosVACP as $k => $v){
                                        $arrConceptosVACP[$k] = $this->empresa->codigo . "_" . $v;
                                        }

                                        $vac_pagado = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->whereIn('concepto',$arrConceptosVACP)->sum('importe');
                                        $array_vac["VAC_pagado"][$empleado_id]= floatval($vac_pagado);

                                        //VAC ACUMULADO
                                        $vac_acum = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->sum('provision_mensual_vac');
                                        $array_vac["VAC_acumulado"][$empleado_id] = floatval($vac_acum);

                                        //En abril se modifica el sueldo por empleado.
                                        //Le sumamos el plus vacasional (VAC pagado) y al monto resultante le restamos la prov_mensual_vac acumulada (VAC acumulado).
                                        //(Sueldo + VAC_pagado) - VAC_acumulado

                                        $provMensualVAC = $array_vac["VAC_acumulado"][$empleado_id];
                                        $importe_sueldo = ($importe + $array_vac["VAC_pagado"][$empleado_id]) - $provMensualVAC;

                                        if($empleado->id==518){
                                            Log::info("fechaHasta: ".$fechaHasta);
                                            Log::info("provMensualVAC: ".$provMensualVAC);
                                            Log::info("importe_sueldo: ".$importe_sueldo);
                                        }

                                        $data[] = [
                                            'empleado_id' => $empleado->legajo_bejerman,
                                            'empleado_nombre' => $empleado->nombre_apellido,
                                            'importe_base' => $importe,
                                            'centro_costo' => $distribucion->CentroCosto->descripcion,
                                            'porcentaje' => (float)$distribucion->porcentaje,
                                            'cuenta_contable_numero' => $cuenta->numero_cuenta ?? '',
                                            'cuenta_contable_descripcion' => $cuenta->descripcion ?? '',
                                            'partida'=>(($importe_sueldo * ((float)$distribucion->porcentaje / 100)>0) ? 'D' : 'C'),
                                            'importe_prorateado' => abs($importe_sueldo)
                                        ];

                                    }else{
                                        //En el resto de los meses no mostramos el SAC en la pestaña SUELDOS, sino que lo desglozamos en la pestaña SAC.
                                        //Además, las CCSS en la pestaña SUELDOS no se ven afectadas por SAC, ni VAC, por ello se detallan en las pestañas SAC y VAC según corresponda.
                                        $data[] = [
                                            'empleado_id' => $empleado->legajo_bejerman,
                                            'empleado_nombre' => $empleado->nombre_apellido,
                                            'importe_base' => $importe,
                                            'centro_costo' => $distribucion->CentroCosto->descripcion,
                                            'porcentaje' => (float)$distribucion->porcentaje,
                                            'cuenta_contable_numero' => $cuenta->numero_cuenta ?? '',
                                            'cuenta_contable_descripcion' => $cuenta->descripcion ?? '',
                                            'partida'=>(($importe * ((float)$distribucion->porcentaje / 100)>0) ? 'D' : 'C'),
                                            'importe_prorateado' => abs($importe * ((float)$distribucion->porcentaje / 100))
                                        ];
                                    }

                                }

                                $total[$subConcepto] +=  $importe;

                            } //fin foreach llave dist

                            //Buscamos los SAC y VAC acumulados por empresa y empleado.
                            $empleado_id=$empleado->id;
                            $sac_acum = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->sum('provision_mensual_sac');
                            $array_sac["SAC_acumulado"][$empleado_id] = floatval($sac_acum);

                            $vac_acum = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->sum('provision_mensual_vac');
                            $array_vac["VAC_acumulado"][$empleado_id] = floatval($vac_acum);

                    }

                }

                $contrap_por_empleado["REMUNERAC"] = $total["SUELDO"] + $total["SAC"] + $total["REDONDEO"] + $total["REMUNERACIONES"] - $total["APORTES"] - $total["GANANCIAS"];
                $contrap_por_empleado["CARGAS"] = $total["CARGAS"] + $total["APORTES"];
                $contrap_por_empleado["GANANCIAS"] = $total["GANANCIAS"];

                $contrapartes["REMUNERAC"] = $contrapartes["REMUNERAC"] + $contrap_por_empleado["REMUNERAC"];
                $contrapartes["CARGAS"] = $contrapartes["CARGAS"] + $contrap_por_empleado["CARGAS"];
                $contrapartes["GANANCIAS"] = $contrapartes["GANANCIAS"] + $contrap_por_empleado["GANANCIAS"];

                $total["SUELDO"] = $total["CARGAS"] = $total["GRATIF_ESP"] = $total["SAC"] = $total["REMUNERACIONES"] =$total["REDONDEO"] = $total["APORTES"] = $total["GANANCIAS"] = 0;

            } //fin foreach empleado

            //Calculamos los totales de SAC y VAC acumulados para mostrar la Provisión en la pestaña SUELDOS.
            foreach($array_sac as $key => $value) {
                $array_sac = array_sum($value);
            }

            foreach($array_vac as $key => $value) {
                $array_vac = array_sum($value);
            }

            //Al final de la pestaña SUELDOS mostramos los totales sin discriminar por centros de costo.
            //Totales de SAC
            if($mes==6 || $mes==12){
                $cuentas_SAC = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto('SUELDOS_SAC')->whereNull('centro_costo_id')->get();

                foreach($cuentas_SAC as $cuenta){
                    if($cuenta->numero_cuenta=='110101210310006'){

                        $data[] = [
                            'empleado_id' => '',
                            'empleado_nombre' => '',
                            'importe_base' => '',
                            'centro_costo' => '',
                            'porcentaje' => '',
                            'cuenta_contable_numero' => $cuenta->numero_cuenta,
                            'cuenta_contable_descripcion' => $cuenta->descripcion,
                            'partida'=>'D',
                            'importe_prorateado' => abs($array_sac)
                        ];
                    }elseif($cuenta->numero_cuenta=='110101210310007'){
                        $total_ccssSAC = AsientoContable::whereEmpresaId($this->empresa->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->sum('ccss_sobre_sac');

                        $data[] = [
                            'empleado_id' => '',
                            'empleado_nombre' => '',
                            'importe_base' => '',
                            'centro_costo' => '',
                            'porcentaje' => '',
                            'cuenta_contable_numero' => $cuenta->numero_cuenta,
                            'cuenta_contable_descripcion' => $cuenta->descripcion,
                            'partida'=>'D',
                            'importe_prorateado' => $total_ccssSAC
                        ];
                    }
                }
            }

            //Totales de VAC
            /*  if($mes==4){
                $cuentas_VAC = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto('SUELDOS_VAC')->whereNull('centro_costo_id')->get();

                foreach($cuentas_VAC as $cuenta){
                    if($cuenta->numero_cuenta=='110101210310004'){

                        $data[] = [
                            'empleado_id' => '',
                            'empleado_nombre' => '',
                            'importe_base' => '',
                            'centro_costo' => '',
                            'porcentaje' => '',
                            'cuenta_contable_numero' => $cuenta->numero_cuenta,
                            'cuenta_contable_descripcion' => $cuenta->descripcion,
                            'partida'=>'D',
                            'importe_prorateado' => abs($array_vac)
                        ];
                    }elseif($cuenta->numero_cuenta=='110101210310008'){
                        $total_ccssVAC = AsientoContable::whereEmpresaId($this->empresa->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->sum('ccss_sobre_vac');

                        $data[] = [
                            'empleado_id' => '',
                            'empleado_nombre' => '',
                            'importe_base' => '',
                            'centro_costo' => '',
                            'porcentaje' => '',
                            'cuenta_contable_numero' => $cuenta->numero_cuenta,
                            'cuenta_contable_descripcion' => $cuenta->descripcion,
                            'partida'=>'D',
                            'importe_prorateado' => $total_ccssVAC
                        ];
                    }
                }
            } */

            //Buscamos las cuentas y montos de la contraparte (crédito)
            //Hasta ahora son: Remuneraciones a pagar, Cargas sociales a pagar y I.I.G.G. Cuarta Categoría a Pagar

            $array_contrapartes = array_reverse($contrapartes);

            foreach($array_contrapartes as $key => $contraparte){

                $cuentaContrapartida=\App\Models\CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto("CONTRAPARTE_" . $this->concepto . "_" . $key)->first();

                $dataContraparte[] = [
                    'cuenta_contable_numero' => $cuentaContrapartida->numero_cuenta ?? '',
                    'cuenta_contable_descripcion' => $cuentaContrapartida->descripcion ?? '',
                    'partida'=>'D',
                    'importe_prorateado' => abs($contraparte)
                ];

            }


            $html = view('exports.asientos-sueldo', ['data'=>$data,'dataContraparte'=>$dataContraparte]);
            return $html;
        }else if(!in_array(substr($this->concepto,-4),$arrConceptosSueldos)){
            $total = 0;
            $total_CCSS_SAC = 0;
            $total_CCSS_VAC = 0;
            $array_sac = [];
            $array_vac = [];
            $importeCCSS_SAC = 0;
            $importeCCSS_VAC = 0;

            $fechaSegundos = strtotime($fechaDesde);
            $mes = date("n", $fechaSegundos);
            $año =  date("Y", $fechaSegundos);

            $fechaInicialAnual =$año.'-01-01';
            $fechaSegundosAnual = strtotime($fechaInicialAnual);
            $fechaInicialAnual =date('Ymd', $fechaSegundosAnual);

            if($mes<7){
                //Primer semestre
                $diferenciaMensual = $mes-1;
                $semestre=1;
            }else{
                //Segundo semestre
                $diferenciaMensual = $mes-7;
                $semestre=2;
            }

            $fechaInicial = strtotime('-'.$diferenciaMensual.' months', $fechaSegundos);
            $fechaInicial = date('Ymd', $fechaInicial);

            Log::info("fechaInicial: ".$fechaInicial);
            Log::info("fechaHasta: ".$fechaHasta);

            $fechaHastaSeg = strtotime($fechaHasta);
            $fechaHastaParse = Carbon::parse($fechaHastaSeg)->startOfMonth();
            $fechaHastaAnterior = $fechaHastaParse->subMonth()->endOfMonth()->format("Ymd");

            $fechaHastaPosterior = date('Ymd',strtotime($fechaHasta.'+ 1 year'));

            foreach($empleados as $empleado){

                $empleado_id = $empleado->id;

                if(isset($empleado->llave_distribucion_id)){
                    foreach($empleado->LlaveDistribucion->Distribucion as $distribucion){
                        $diasVacaciones = $empleado->getDiasVacaciones($this->periodo);
                        $porcentajeCargasSociales = 0.23;

                        if($empleado->tipo_empleado=="D"){
                            $porcentajeCargasSociales=0.005; //porcentaje para Directores
                        }

                        if($empleado->tipo_empleado=="J"){
                            $porcentajeCargasSociales=0.13;  //porcentaje para Jubilados
                        }


                        if($empleado->fecha_ingreso<=$fechaDesde && (!isset($empleado->fecha_baja) || $empleado->fecha_baja>=$fechaHasta)){
                            $sac = 0;
                            $importe = 0;
                            $vac = 0;
                            $provision_mensual_vac = 0;
                            $cod_empresa = $this->empresa->codigo;
                            $importeCCSS_SAC = 0;

                            switch ($this->concepto){
                                case "SAC":
                                    // SAC = ((mayor remuneración bruta + prom comisiones + (mayor bono trim/3) + (bono sem/6))/2)/6

                                    //MAYOR REMUNERACIÓN BRUTA
                                    //Buscamos los conceptos de la rem bruta

                                    $arrConceptosRem = ["0199","0201","0209","0213","0216","0217","0221","0222","0232","0240","0250"];

                                    foreach($arrConceptosRem as $k => $v){
                                        $arrConceptosRem[$k] =  $cod_empresa."_".$v;
                                    }

                                    $provMensualAcumulada = 0;

                                    if($semestre==1){
                                        $diasAcumSem = $mes * 30;
                                    }else{
                                        $diasAcumSem = ($mes-6) * 30;
                                    }

                                    //Buscamos el asiento del mes seleccionado al exportar
                                    $busq_rem = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->first();

                                    if(isset($busq_rem)){
                                        //si existe el asiento, tomamos el monto de la rem_bruta_sac
                                        if($busq_rem->rem_bruta_sac==0){
                                            //si la rem_bruta_sac es cero es porque no está calculada, por ende sumo los conceptos del mes seleccionado y esa será la máx remuneración del mes.
                                            $remBruta = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->whereIn('concepto',$arrConceptosRem)->sum('importe');

                                            if(isset($remBruta)){
                                                $asiento = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->update(['rem_bruta_sac'=>$remBruta]);
                                            }
                                        }else{
                                            //si la rem_bruta_sac es disinta de cero, busco el monto máximo desde el comienzo del semestre hasta el mes seleccionado
                                            $remBruta = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHasta])->max('rem_bruta_sac');
                                        }
                                    }else{
                                        // si no existe el asiento, tomo la remBruta como la suma los conceptos. Pero la almacenamos en la tabla asientos_contables más adelante junto con el cálculo de la provision_mensual_sac
                                        $remBruta = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->whereIn('concepto',$arrConceptosRem)->sum('importe');
                                    }

                                    //PROMEDIO COMISIONES
                                    //tomamos las comisiones desde el comienzo del semestre hasta el mes seleccionado
                                    //el concepto 0205 en Bejerman es "Remuneración Variable Mensual"
                                    $conceptoComisionRem = $cod_empresa."_"."0205";
                                    $comisionesRem = Liquidacion::whereConcepto($conceptoComisionRem)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHasta])->whereEmpresaId($this->empresa->id)->avg('importe');
                                    if(isset($comisionesRem)){
                                        $comisiones = $comisionesRem;
                                    }else{
                                        $comisionesRem = 0;
                                    }

                                    //el concepto 0218 en Bejerman es "Adicional Pluriempleo"
                                    $conceptoComisionAdic = $cod_empresa."_"."0218";
                                    $comisionesAdic = Liquidacion::whereConcepto($conceptoComisionAdic)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHasta])->whereEmpresaId($this->empresa->id)->avg('importe');
                                    if(isset($comisionesAdic)){
                                        $comisiones = $comisionesAdic;
                                    }else{
                                        $comisionesAdic = 0;
                                    }

                                    //sumamos los dos promedios que hicimos por cada concepto
                                    $comisiones = $comisionesRem + $comisionesAdic;

                                    //BONOS
                                    //tomamos los bonos desde el comienzo del semestre hasta el mes seleccionado
                                    //tenemos dos conceptos de bonos trimestrales, entre los cuáles tomamos el mayor
                                    $arrConceptosBonoTrm = ["0203","0219"];

                                    foreach($arrConceptosBonoTrm as $k => $v){
                                    $arrConceptosBonoTrm[$k] = $cod_empresa . "_" . $v;
                                    }

                                    $bonoTrim = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHasta])->whereIn('concepto',$arrConceptosBonoTrm)->max('importe');

                                    //tenemos un solo concepto para el bono semestral
                                    $conceptoBonoSem = $cod_empresa."_"."0204";
                                    $bonoSem = Liquidacion::whereConcepto($conceptoBonoSem)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHasta])->whereEmpresaId($this->empresa->id)->sum('importe');

                                    //la sig es la cuenta de SAC para el mes seleccionado
                                    $sac = ($remBruta + $comisiones + ($bonoTrim/3) + ($bonoSem/6))/2;

                                    //HAY DOS MANERAS DE CALCULAR SAC, ACTUALMENTE USAMOS EL SEGUNDO PLANTEO

                                    //PRIMER PLANTEO
                                    /*  $importe_sin_redondeo = ($sac/6);
                                    $importe = round($importe_sin_redondeo, 2, PHP_ROUND_HALF_UP);
                                    */

                                    //SEGUNDO PLANTEO
                                    // en la base de datos la provision_mensual_sac es igual a: ($sac/180)*$diasAcumSem)-$provMensualAcumulada
                                    // por eso calculamos previamente la provMensualAcumulada que va desde el comienzo del semestre hasta el mes anterior al seleccionado.
                                    // por ejemplo, en junio tendremos la sumatoria de la provision_mensual_sac desde enero a mayo y eso es la provMensualAcumulada.
                                    $provMensualAcumulada = AsientoContable::whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->whereEmpresaId($this->empresa->id)->sum('provision_mensual_sac');

                                    $importe_sin_redondeo_sac = (($sac/180)*$diasAcumSem)-$provMensualAcumulada;
                                    $provision_mensual_sac = round($importe_sin_redondeo_sac, 2, PHP_ROUND_HALF_UP);

                                    //Pasamos a ver como impactan las CCSS(cargas sociales) sobre SAC
                                    $importe_sin_redondeo_CCSS_SAC = $importe_sin_redondeo_sac * $porcentajeCargasSociales;
                                    $importeCCSS_SAC = round($importe_sin_redondeo_CCSS_SAC, 2, PHP_ROUND_HALF_UP);

                                    //Almacenamos los montos (sac, provision_mensual_sac, rem_bruta_sac y ccss_sobre_sac) en la tabla asientos_contables
                                    $busq_asiento = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->first();

                                    if(!isset($busq_asiento)){
                                        $asiento = AsientoContable::create([
                                            'empresa_id'=>$this->empresa->id,
                                            'empleado_id'=>$empleado->id,
                                            'fecha'=>$fechaHasta,
                                            'sac'=>$sac,
                                            'provision_mensual_sac'=>$provision_mensual_sac,
                                            'vac'=>$vac,
                                            'provision_mensual_vac'=>$provision_mensual_vac,
                                            'rem_bruta_sac'=>$remBruta,
                                            'ccss_sobre_sac'=>$importeCCSS_SAC,
                                            'ccss_sobre_vac'=>$importeCCSS_VAC
                                        ]);
                                    }else {
                                        $asiento = AsientoContable::where(['empresa_id'=>$this->empresa->id, 'empleado_id'=>$empleado->id,'fecha'=>$fechaHasta])->update(['sac' =>$sac,'provision_mensual_sac'=>$provision_mensual_sac,'rem_bruta_sac'=>$remBruta,'ccss_sobre_sac'=>$importeCCSS_SAC]);
                                    }

                                    $importe = $provision_mensual_sac;

                                    //Los totales de SAC se calculan en junio y diciembre que es cuando se paga el aguinaldo.

                                    if($mes==6 || $mes==12){

                                        //SAC ACUMULADO
                                        //se calcula sumando la provMensualAcumulada desde el comienzo del semestre hasta el mes anterior al seleccionado.
                                        /* $sac_acum = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->sum('provision_mensual_sac');
                                        $array_sac["SAC_acumulado"][$empleado_id] = floatval($sac_acum); */

                                        $array_sac["SAC_acumulado"][$empleado_id] = floatval($provMensualAcumulada);

                                        //SAC PAGADO
                                        //se calcula sumando los conceptos de bejerman que se mencionan a continuación para el mes seleccionado.
                                        $arrConceptosSAC = ["0207","0235","0236","0251","0252","0254","0255"];

                                        foreach($arrConceptosSAC as $k => $v){
                                        $arrConceptosSAC[$k] = $cod_empresa . "_" . $v;
                                        }

                                        $sac_pagado = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->whereIn('concepto',$arrConceptosSAC)->sum('importe');
                                        $array_sac["SAC_pagado"][$empleado_id] = floatval($sac_pagado);

                                        // AJUSTE SAC
                                        // Se calcula haciendo SAC_pagado menos SAC_acumulado. Es la diferencia que luego se vuelca a la pestaña SUELDOS.
                                        $array_sac["ajuste_SAC"][$empleado_id] = $array_sac["SAC_pagado"][$empleado_id] - $array_sac["SAC_acumulado"][$empleado_id];

                                    }

                                    break;
                                case "VAC":
                                    // VAC = (mayor remuneración bruta / 25 días) * cant de días por empleado

                                    //Buscamos los conceptos de la rem bruta
                                    $arrConceptosRemVAC = ["0199","0201","0209","0213","0216","0217","0221","0222","0232","0240","0250"];

                                    foreach($arrConceptosRemVAC as $k => $v){
                                        $arrConceptosRemVAC[$k] = $cod_empresa . "_" . $v;
                                    }

                                    $remBruta_max = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicialAnual,$fechaHasta])->whereIn('concepto',$arrConceptosRemVAC)->max('importe');

                                    $diasVacaciones = $empleado->dias_vacaciones;

                                    $vac = (($remBruta_max / 25) * $diasVacaciones);

                                    $provision_mensual_vac = ($vac / 12);
                                    $provision_mensual_vac = round($provision_mensual_vac, 2, PHP_ROUND_HALF_UP);

                                    //Calculamos las CCSS sobre VAC
                                    $importe_sin_redondeo_CCSS_VAC = $provision_mensual_vac * $porcentajeCargasSociales;
                                    $importeCCSS_VAC = round($importe_sin_redondeo_CCSS_VAC, 2, PHP_ROUND_HALF_UP);

                                    $busq_asiento = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->first();

                                    if(!isset($busq_asiento)){
                                        $asiento = AsientoContable::create([
                                            'empresa_id'=>$this->empresa->id,
                                            'empleado_id'=>$empleado->id,
                                            'fecha'=>$fechaHasta,
                                            'sac'=>$sac,
                                            'provision_mensual_sac'=>$provision_mensual_sac,
                                            'vac'=>$vac,
                                            'provision_mensual_vac'=>$provision_mensual_vac,
                                            'rem_bruta_sac'=>$remBruta,
                                            'ccss_sobre_sac'=>$total_CCSS_SAC,
                                            'ccss_sobre_vac'=>$importeCCSS_VAC
                                        ]);
                                    }else {
                                        $asiento = AsientoContable::where(['empresa_id'=>$this->empresa->id, 'empleado_id'=>$empleado->id,'fecha'=>$fechaHasta])->update(['vac' => $vac,'provision_mensual_vac'=>$provision_mensual_vac,'ccss_sobre_vac'=>$importeCCSS_VAC]);
                                    }

                                    $importe = $provision_mensual_vac;

                                    if($mes==4){

                                        //VAC ACUMULADO
                                        $vac_acum = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereBetween('fecha',[$fechaInicial,$fechaHastaAnterior])->sum('provision_mensual_vac');
                                        $array_vac["VAC_acumulado"][$empleado_id] = floatval($vac_acum);

                                        //VAC PAGADO
                                        $arrConceptosVACP = ["0240","0250"];

                                        foreach($arrConceptosVACP as $k => $v){
                                        $arrConceptosVACP[$k] = $cod_empresa . "_" . $v;
                                        }

                                        $vac_pagado = Liquidacion::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHastaPosterior)->whereIn('concepto',$arrConceptosVACP)->sum('importe');
                                        $array_vac["VAC_pagado"][$empleado_id]= floatval($vac_pagado);

                                        //AJUSTE VAC
                                        $array_vac["ajuste_VAC"][$empleado_id]=$array_vac["VAC_pagado"][$empleado_id]-$array_vac["VAC_acumulado"][$empleado_id];

                                    }

                                    break;
                                case "CCSS":

                                    $asiento = AsientoContable::whereEmpresaId($this->empresa->id)->whereEmpleadoId($empleado->id)->whereFecha($fechaHasta)->first();

                                    if(isset($asiento)){
                                        $importeSac = $asiento->provision_mensual_sac;
                                        $importe = $importeSac * $porcentajeCargasSociales;
                                    }

                                    break;

                                default:
                                    $fecha = Carbon::parse($this->periodo."01")->endOfMonth()->format("Ymd");
                                    $importe = Liquidacion::whereConcepto($this->concepto)->whereEmpleadoId($empleado->id)->whereDate('fecha',$fecha)->whereEmpresaId($this->empresa->id)->sum("importe");
                                    break;
                            }//fin switch

                            $cuenta = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto($this->concepto)->whereCentroCostoId($distribucion->CentroCosto->id)->first();

                            if(!isset($cuenta)){
                                //Busco la cuenta GENERICA (Sin especificar Centro de costo) para ese concepto
                                $cuenta = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto($this->concepto)->first();
                            }

                            $total += $importe * ((float) $distribucion->porcentaje / 100);
                            $importe_prorateado = round($importe * ((float) $distribucion->porcentaje / 100), 2, PHP_ROUND_HALF_UP);

                            $data[]=[
                                'empleado_id'=>$empleado->legajo_bejerman,
                                'empleado_nombre'=>$empleado->nombre_apellido,
                                'importe_base'=>$importe,
                                'centro_costo'=>$distribucion->CentroCosto->descripcion,
                                'porcentaje'=>(float) $distribucion->porcentaje,
                                'cuenta_contable_numero'=>$cuenta->numero_cuenta ?? '',
                                'cuenta_contable_descripcion'=>$cuenta->descripcion ?? '',
                                'partida'=>($importe * ((float) $distribucion->porcentaje / 100)>0) ? 'D' : 'C',
                                'importe_prorateado'=>abs($importe_prorateado)
                            ];

                            //En SAC y VAC agregamos las cuentas para CCSS aplicado las mismas.
                            //De esta manera, nos queda por ejemplo en la pestaña SAC las cuentas de sac seguidas de ccss para cada empleado y su llave
                            if($this->concepto=='SAC'){
                                $cuenta = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto('CCSS')->whereCentroCostoId($distribucion->CentroCosto->id)->first();

                                //totales de CCSS según distribución por empleado
                                $total_CCSS_SAC += $importeCCSS_SAC * ((float) $distribucion->porcentaje / 100);
                                $importe_prorateado = round($importeCCSS_SAC * ((float) $distribucion->porcentaje / 100), 2, PHP_ROUND_HALF_UP);

                                $data[]=[
                                    'empleado_id'=>$empleado->legajo_bejerman,
                                    'empleado_nombre'=>$empleado->nombre_apellido,
                                    'importe_base'=>$importeCCSS_SAC,
                                    'centro_costo'=>$distribucion->CentroCosto->descripcion,
                                    'porcentaje'=>(float) $distribucion->porcentaje,
                                    'cuenta_contable_numero'=>$cuenta->numero_cuenta ?? '',
                                    'cuenta_contable_descripcion'=>$cuenta->descripcion ?? '',
                                    'partida'=>($importeCCSS_SAC * ((float) $distribucion->porcentaje / 100)>0) ? 'D' : 'C',
                                    'importe_prorateado'=>abs($importe_prorateado)
                                ];

                            }

                            if($this->concepto=='VAC'){
                                $cuenta = CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto('CCSS')->whereCentroCostoId($distribucion->CentroCosto->id)->first();

                                //totales de CCSS según distribución por empleado
                                $total_CCSS_VAC += $importeCCSS_VAC * ((float) $distribucion->porcentaje / 100);
                                $importe_prorateado = round($importeCCSS_VAC * ((float) $distribucion->porcentaje / 100), 2, PHP_ROUND_HALF_UP);

                                $data[]=[
                                    'empleado_id'=>$empleado->legajo_bejerman,
                                    'empleado_nombre'=>$empleado->nombre_apellido,
                                    'importe_base'=>$importeCCSS_VAC,
                                    'centro_costo'=>$distribucion->CentroCosto->descripcion,
                                    'porcentaje'=>(float) $distribucion->porcentaje,
                                    'cuenta_contable_numero'=>$cuenta->numero_cuenta ?? '',
                                    'cuenta_contable_descripcion'=>$cuenta->descripcion ?? '',
                                    'partida'=>($importeCCSS_VAC * ((float) $distribucion->porcentaje / 100)>0) ? 'D' : 'C',
                                    'importe_prorateado'=>abs($importe_prorateado)
                                ];

                            }
                        }
                    }//fin foreach llave de dist
                }//fin isset llave de dist
            }//fin foreach empleado

            foreach($array_sac as $key => $value) {
                $array_sac[$key] = array_sum($value);

            }

            foreach($array_vac as $key => $value) {
                $array_vac[$key] = array_sum($value);
            }

            $cuentaContrapartida=\App\Models\CuentaContable::whereEmpresaId($this->empresa->id)->whereConcepto("CONTRAPARTE_" . $this->concepto)->get();

            $dataContraparte = [];

            foreach($cuentaContrapartida as $item){
                $descripcion = $item->descripcion;
                $rta = strpos($descripcion, 'Cargas Soc.');

                if($this->concepto=='SAC' && $rta!==false){
                    $total = round($total_CCSS_SAC, 2, PHP_ROUND_HALF_UP);
                }

                $dataContraparte[]=[
                    'empleado_id'=>'',
                    'empleado_nombre'=>'',
                    'importe_base'=>$total,
                    'centro_costo'=>'',
                    'porcentaje'=>100,
                    'cuenta_contable_numero'=>$item->numero_cuenta ?? '',
                    'cuenta_contable_descripcion'=>$item->descripcion ?? '',
                    'partida'=>$total>0 ? 'C' : 'D',
                    'importe_prorateado'=>abs($total)
                ];
            }

            $html = view('exports.asientos-sueldo', ['data'=>$data,'dataContraparte'=>$dataContraparte]);
            return $html;

        } else {
            $html = view('exports.asientos', ['data'=>[],'concepto'=>$this->concepto]);

            return $html;
        }

    }

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->concepto;

    }

}

