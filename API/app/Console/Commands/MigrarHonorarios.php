<?php

namespace App\Console\Commands;

use App\Models\ArancelesBolsa;
use App\Models\Comitente;
use App\Models\HonorarioArrow;
use App\Models\HonorarioFondo;
use App\Models\Fondo;
use App\Models\Cuotapartista;
use App\Models\Oficial;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MigrarHonorarios extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrar:honorarios';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {



        /************************* ARROW ***********************************/

        $data = DB::connection('vbolsa')->select("
                                                                  SELECT
                                                                    MOVIMIENTOSAR.CodMovimientoAr,
                                                                    CTASCORRIENTES.FechaConcertacion,
                                                                    CTASCORRIENTESMON.FechaLiquidacion,
                                                                    MOVIMIENTOSAR.Origen,
                                                                    CTASCORRIENTES.CodComitente,
                                                                    COMITENTES.NumComitente,
                                                                    MOVIMIENTOSAR.Importe,
                                                                    MONEDAS.Descripcion as DescMoneda,
                                                                    ABS(CTASCORRIENTESMON.Bruto) Bruto,
                                                                    ABS(CTASCORRIENTESMON.Neto) Neto


                                                                FROM MOVIMIENTOSAR
                                                                JOIN CTASCORRIENTES ON CTASCORRIENTES.CodCtaCorriente=MOVIMIENTOSAR.CodCtaCorriente
                                                                JOIN COMITENTES ON COMITENTES.CodComitente=CTASCORRIENTES.CodComitente
                                                                JOIN CTASCORRIENTESMON ON CTASCORRIENTESMON.CodCtaCorrienteMon=MOVIMIENTOSAR.CodCtaCorrienteMon
                                                                JOIN MONEDAS ON CTASCORRIENTESMON.CodMoneda=MONEDAS.CodMoneda
                                                                WHERE CTASCORRIENTES.EstaAnulado=0
                                                                AND FechaConcertacion >='20220101'

                                                              ");


        ArancelesBolsa::where('id','>=',1)->delete();
        foreach($data as $k => $dt){

            $comitente = Comitente::whereNumeroComitente($dt->NumComitente)->value('id');

            if(isset($comitente)){
                echo "Procesando Registro #" . $k . ' de ' . count($data) . "\r\n";
                ArancelesBolsa::create([
                    "fecha_concertacion"=>$dt->FechaConcertacion,
                    "fecha_liquidacion"=>$dt->FechaLiquidacion,
                    "tipo_operacion"=>$dt->Origen,
                    "moneda"=>$dt->DescMoneda,
                    "bruto"=>$dt->Bruto,
                    "neto"=>$dt->Neto,
                    "arancel"=>$dt->Importe,
                    "id_esco"=>$dt->CodMovimientoAr,
                    "comitente_id"=>$comitente
                ]);
            }
        }



        $data = DB::connection('arrow')->select("
                                                                   SELECT
                                                                        date,
                                                                        agreement_date,
                                                                        liquidation_date,
                                                                        operation_types.name as operation_type_name,
                                                                        liquidation_times.name as liquidation_time_name,
                                                                        operation_states.name as operation_states_name,
                                                                        operation_states.code as operation_states_code,
                                                                        qty,
                                                                        price,
                                                                        desk_price,
                                                                        gross_profit,
                                                                        account,
                                                                        esco_currency_description,
                                                                        account_official_name

                                                                    FROM operations
                                                                    join operation_types on operation_types.id=operations.operation_type_id
                                                                    join liquidation_times on liquidation_times.id=operations.liquidation_time_id
                                                                    join operation_states on operation_states.id=operations.operation_state_id
                                                                    where agreement_date>='20220101'

                                                              ");


        HonorarioArrow::where('id','>=',1)->delete();
        foreach($data as $k => $dt){
            $comitente = Comitente::whereNumeroComitente($dt->account)->value('id');

            if(isset($comitente)){
                echo "Procesando Registro #" . $k . ' de ' . count($data) . "\r\n";
                HonorarioArrow::create([
                    "fecha_creacion"=>$dt->date,
                    "fecha_concertacion"=>$dt->agreement_date,
                    "fecha_liquidacion"=>$dt->liquidation_date,
                    "tipo_operacion"=>$dt->operation_type_name,
                    "tipo_liquidacion"=>$dt->liquidation_time_name,
                    "estado"=>$dt->operation_states_name,
                    "estado_codigo"=>$dt->operation_states_code,
                    "cantidad"=>$dt->qty,
                    "precio"=>$dt->price,
                    "precio_mesa"=>$dt->desk_price,
                    "comision"=>$dt->gross_profit,
                    "comitente_id"=>$comitente
                ]);
            }
        }


        /************************* FONDOS ***********************************/
        $data = DB::connection('seeker')->select("
                                                                   select
                                                                        honorarios_agentes.id,
                                                                        honorarios_agentes.periodo,
                                                                        honorarios_agentes_detalle.cuotapartista,
                                                                        honorarios_agentes_detalle.fondo,
                                                                        honorarios_agentes_detalle.importe

                                                                    from honorarios_agentes
                                                                    join honorarios_agentes_detalle on honorarios_agentes.id=honorarios_agentes_detalle.honorario_agente_id
                                                                    where replace(periodo,'-','')>='202201'

                                                              ");

        $tiposCambio = DB::connection('seeker')->select("
                                                                    SELECT
                                                                         configuracion
                                                                    FROM configuracion
                                                                    WHERE nombre='tipo_cambio_sipe'

                                                              ");

        $tiposCambio = Collection::make(json_decode($tiposCambio[0]->configuracion));


        HonorarioFondo::where('id','>=',1)->delete();



        foreach($data as $k => $dt){
            $cuotapartista = Cuotapartista::whereNumeroCuotapartista($dt->cuotapartista)->value('id');
            $fondo = Fondo::whereAbreviatura($dt->fondo)->value('id');
            $moneda = Fondo::whereAbreviatura($dt->fondo)->value('moneda');

            $tipoCambio = $tiposCambio->where('Periodo',str_replace("-","",$dt->periodo))->last()->Importe ?? 1;

            if(isset($cuotapartista) && isset($fondo)){
                echo "Procesando Registro #" . $k . ' de ' . count($data) . "\r\n";
                HonorarioFondo::create([
                    'fecha'=>str_replace('-','',$dt->periodo)."01",
                    'fondo_id'=>$fondo,
                    'cuotapartista_id'=>$cuotapartista,
                    'importe'=>$dt->importe * ($moneda=="ARS" ? 1 : $tipoCambio)
                ]);
            }
        }










        return 0;
    }
}
