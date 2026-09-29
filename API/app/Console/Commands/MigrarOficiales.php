<?php

namespace App\Console\Commands;

use App\Models\Oficial;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrarOficiales extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrar:oficiales';

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
                                                                CodOficialCta as Id,
                                                                /* CONCAT(OFICIALESCTA.Apellido,' ', OFICIALESCTA.Nombre, ' (Ag: ',AGCOLOCADORES.Descripcion,')') as Descripcion, */
                                                                 CONCAT(OFICIALESCTA.Apellido,' ', OFICIALESCTA.Nombre) as Descripcion,

                                                                AGCOLOCADORES.CodAgColocador,
                                                                AGCOLOCADORES.Descripcion as DescAgColocador,
                                                                SUCURSALES.NumSucursal,
                                                                OFICIALESCTA.EstaAnulado

                                                                FROM OFICIALESCTA
                                                                JOIN AGCOLOCADORES ON AGCOLOCADORES.CodAgColocador=OFICIALESCTA.CodAgColocador
                                                                JOIN SUCURSALES ON OFICIALESCTA.CodSucursal=SUCURSALES.CodSucursal
                                                              ");

        foreach($data as $dt){
            Oficial::updateOrCreate([
                'id_esco'=>$dt->Id
            ],[
                'origen'=>'VFONDOS',
                'descripcion'=>$dt->Descripcion,
                'id_esco'=>$dt->Id,
                "agente_colocador_codigo"=>$dt->CodAgColocador,
                "agente_colocador_descripcion"=>$dt->DescAgColocador,
                "sucursal"=>$dt->NumSucursal,
                "anulado"=>($dt->EstaAnulado=="-1" ? true : false)
            ]);
        }




        return 0;
    }
}
