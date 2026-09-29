<?php

namespace App\Console\Commands;

use App\Models\CuentaContable;
use App\Models\Cuotapartista;
use App\Models\Empresa;
use App\Models\Fondo;
use App\Models\Oficial;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrarCuentasContables extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrar:cuentas-contables';

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
        $empresas = Empresa::all();

        foreach($empresas as $empresa){
            echo "Migrando " . $empresa->descripcion;
            echo "\r\n";

            $data = DB::connection($empresa->conexion)->select("SELECT * FROM CTASCONTABLES");
            foreach($data as $k => $dt){
                if($dt->EsImputable=="-1"){
                    echo "Migrando " . $dt->NumCtaContable;
                    echo "\r\n";

                    $cuentaContable = CuentaContable::whereNumeroCuenta($dt->NumCtaContable)->whereEmpresaId($empresa->id)->first();
                    if($cuentaContable){
                        $cuentaContable->descripcion=$dt->Descripcion;
                        $cuentaContable->save();
                    } else {
                        CuentaContable::create([
                            "empresa_id"=>$empresa->id,
                            "centro_costo_id"=>null,
                            "concepto"=>null,
                            "numero_cuenta"=>$dt->NumCtaContable,
                            "descripcion"=>$dt->Descripcion
                        ]);
                    }
                }

            }
        }



        return 0;
    }
}
