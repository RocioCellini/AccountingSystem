<?php

namespace App\Console\Commands;

use App\Models\Comitente;
use App\Models\Comitentes;
use App\Models\Cuotapartista;
use App\Models\Fondo;
use App\Models\Oficial;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrarComitentes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrar:comitentes';

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
        $data = DB::connection('vbolsa')->select("
                                                                    SELECT
                                                                    *,
                                                                    (SELECT TOP 1 CodOperativo FROM OPERATIVOSROLCMT WHERE OPERATIVOSROLCMT.CodComitente=COMITENTES.CodComitente AND OPERATIVOSROLCMT.CodRol='OC') CodOficialCta
                                                                    FROM COMITENTES
                                                                    WHERE EstaAnulado=0
                                                              ");


        foreach($data as $k => $dt){

            echo "Procesando Registro #" . $k . ' de ' . count($data) . "\r\n";

            $comitente= Comitente::whereNumeroComitente($dt->NumComitente)->first();
            if(Oficial::whereIdEsco($dt->CodOficialCta)->whereOrigen('VBOLSA')->exists()){
                if(!isset($comitente)){
                    Comitente::create([
                        'numero_comitente'=>$dt->NumComitente,
                        'descripcion'=>$dt->Descripcion,
                        'oficial_id'=>Oficial::whereIdEsco($dt->CodOficialCta)->whereOrigen('VBOLSA')->value('id')
                    ]);
                } else {
                    $comitente->descripcion=$dt->Descripcion;
                    $comitente->save();
                }
            }


        }




        return 0;
    }
}
