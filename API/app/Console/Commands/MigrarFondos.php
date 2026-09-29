<?php

namespace App\Console\Commands;

use App\Models\Cuotapartista;
use App\Models\CuotapartistaDistribucion;
use App\Models\Fondo;
use App\Models\Oficial;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrarFondos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrar:fondos';

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
                                                                    SELECT
                                                                                   *
                                                                    FROM FONDOS
                                                                    WHERE EstaAnulado=0
                                                              ");

        foreach($data as $dt){
            $fondo = Fondo::updateOrCreate([
                'id_esco'=>$dt->CodFondo
            ],[
                'numero_fondo'=>$dt->NumFondo,
                'descripcion'=>$dt->Nombre,
                'abreviatura'=>$dt->NombreAbreviado,
                'id_esco'=>$dt->CodFondo,
                'moneda'=>($dt->CodMoneda==1 ? 'ARS' : 'USD'),
                'porcentaje'=>100
            ]);

            $cuotapartistasConDistribucion = Cuotapartista::whereIn('id',CuotapartistaDistribucion::where('id','>=',1)->pluck('cuotapartista_id'))->get();

            foreach($cuotapartistasConDistribucion as $cuotapartista){
                if(isset($cuotapartista->agentes_externos)){
                    foreach($cuotapartista->agentes_externos as $oficial){
                        if(!CuotapartistaDistribucion::whereCuotapartistaId($cuotapartista->id)->whereFondoId($fondo->id)->whereOficialId($oficial['oficial']['id'])->exists()){
                            CuotapartistaDistribucion::create([
                               'oficial_id'=>$oficial['oficial']['id'],
                               'cuotapartista_id'=>$cuotapartista->id,
                               'fondo_id'=>$fondo->id,
                               'base_calculo'=>$cuotapartista->agentes_externos_porcentaje,
                               'porcentaje'=>$oficial['porcentaje'],
                            ]);
                        };
                    }
                }
            }

            foreach($cuotapartistasConDistribucion as $cuotapartista){
                if(isset($cuotapartista->agentes_internos)){
                    foreach($cuotapartista->agentes_internos as $oficial){
                        if(!CuotapartistaDistribucion::whereCuotapartistaId($cuotapartista->id)->whereFondoId($fondo->id)->whereOficialId($oficial['oficial']['id'])->exists()){
                            CuotapartistaDistribucion::create([
                                'oficial_id'=>$oficial['oficial']['id'],
                                'cuotapartista_id'=>$cuotapartista->id,
                                'fondo_id'=>$fondo->id,
                                'base_calculo'=>$cuotapartista->agentes_internos_porcentaje,
                                'porcentaje'=>$oficial['porcentaje'],
                            ]);
                        };
                    }
                }
            }
        }




        return 0;
    }
}
