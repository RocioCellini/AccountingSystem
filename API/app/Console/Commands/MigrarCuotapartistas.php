<?php

namespace App\Console\Commands;

use App\Models\Cuotapartista;
use App\Models\Fondo;
use App\Models\Oficial;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrarCuotapartistas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrar:cuotapartistas';

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
        $data = DB::connection('vfondos')->select("
                                                                    SELECT         *
                                                                    FROM CUOTAPARTISTAS
                                                                    WHERE EstaAnulado=0
                                                              ");


        foreach($data as $key=>$dt){
            echo $key."\r\n";
            $cuotapartista= Cuotapartista::whereNumeroCuotapartista($dt->NumCuotapartista)->first();
            $oficial_id = Oficial::whereIdEsco($dt->CodOficialCta)->whereOrigen('VFONDOS')->value('id');
            if(isset($oficial_id)){
                if(!isset($cuotapartista)){
                    Cuotapartista::create([
                        'numero_cuotapartista'=>$dt->NumCuotapartista,
                        'descripcion'=>$dt->Nombre,
                        'oficial_id'=>$oficial_id,
                        'porcentaje'=>100
                    ]);
                } else {
                    $cuotapartista->descripcion=$dt->Nombre;
                    $cuotapartista->oficial_id=$oficial_id;
                    $cuotapartista->save();
                }
            }

        }




        return 0;
    }
}
