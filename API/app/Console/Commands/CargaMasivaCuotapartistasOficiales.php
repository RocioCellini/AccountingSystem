<?php

namespace App\Console\Commands;

use App\Models\CargaMasivaCuotapartistaOficial;
use App\Models\Cuotapartista;
use App\Models\CuotapartistaDistribucion;
use App\Models\CuotapartistaOficial;
use App\Models\Fondo;
use App\Models\Oficial;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CargaMasivaCuotapartistasOficiales extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrar:carga-masiva-cuotapartistas-oficiales';

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
        CuotapartistaOficial::where('id','>=',1)->delete();
        CuotapartistaDistribucion::where('id','>=',1)->delete();

        $cargaMasiva = CargaMasivaCuotapartistaOficial::where('id','>=',1)->pluck('numero_cuotapartista')->unique();
        foreach($cargaMasiva as $comitente){
            $cuotapartista = Cuotapartista::whereNumeroCuotapartista($comitente)->first();
            $oficialesInternos = Oficial::whereOrigen('VFONDOS')->whereIn('agente_colocador_codigo',[2,3])->pluck('id_esco');
            $porcentajeInterno = (float) CargaMasivaCuotapartistaOficial::whereNumeroCuotapartista($comitente)->whereIn('codigo_oficial',$oficialesInternos)->max('porcentaje_oficial');
            $porcentajeExterno = 100 - $porcentajeInterno;


            $arrInternos = CargaMasivaCuotapartistaOficial::whereNumeroCuotapartista($comitente)->whereIn('codigo_oficial',$oficialesInternos)->pluck('codigo_oficial')->unique();
            $arrFinalInternos = $arrFinalExternos = [];
            foreach($arrInternos as $ar){
                $oficial = Oficial::whereIdEsco($ar)->first();

                $arrFinalInternos[] = [
                    'oficial'=>$oficial,
                    'porcentaje'=>CargaMasivaCuotapartistaOficial::whereNumeroCuotapartista($comitente)->where('codigo_oficial',$ar)->max('porcentaje_comision')
                ];
            }

            $arrExternos = CargaMasivaCuotapartistaOficial::whereNumeroCuotapartista($comitente)->whereNotIn('codigo_oficial',$oficialesInternos)->pluck('codigo_oficial')->unique();
            foreach($arrExternos as $ar){
                $oficial = Oficial::whereIdEsco($ar)->first();

                $arrFinalExternos[] = [
                    'oficial'=>$oficial,
                    'porcentaje'=>CargaMasivaCuotapartistaOficial::whereNumeroCuotapartista($comitente)->where('codigo_oficial',$ar)->max('porcentaje_comision')
                ];
            }


            $cuotapartista->agentes_externos_porcentaje = $porcentajeExterno;
            $cuotapartista->agentes_internos_porcentaje = $porcentajeInterno;
            $cuotapartista->agentes_internos = $arrFinalInternos;
            $cuotapartista->agentes_externos = $arrFinalExternos;
            $cuotapartista->save();



            $data = CargaMasivaCuotapartistaOficial::whereNumeroCuotapartista($comitente)->get();
            foreach($data as $dt){
                if(Fondo::whereIdEsco($dt->numero_fondo)->exists()){

                    $dist = CuotapartistaDistribucion::create([
                        "cuotapartista_id"=>$cuotapartista->id,
                        "oficial_id"=>$oficial->id,
                        "fondo_id"=>Fondo::whereIdEsco($dt->numero_fondo)->value('id'),
                        "base_calculo"=>$dt->porcentaje_oficial,
                        "porcentaje"=>$dt->porcentaje_comision
                    ]);

                    
                }

            }

        }

        return "Listo!";
    }
}
