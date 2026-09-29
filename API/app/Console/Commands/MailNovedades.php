<?php

namespace App\Console\Commands;

use App\Mail\MailInvitacion;
use App\Mail\MailNotificaciones;
use App\Mail\MailNuevaAltaPendienteAprobacion;
use App\Models\Alta;
use App\Models\BonoSemestral;
use App\Models\BonoTrimestralDistribucion;
use App\Models\Estado;
use App\Models\Fondo;
use App\Models\GratificacionEspecial;
use App\Models\Novedad;
use App\Models\Comision;
use App\Models\Oficial;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\Rol;

class MailNovedades extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:novedades';

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

        $altas = Alta::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('updated_at','desc')->get();

        $incrementos = Novedad::whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->where('variacion','!=',0)->orderBy('empleado_id','asc')->get();
        $incrementos->load(['PropuestoPor','Empleado','Empleado.Sector']);

        $horasExtras = Novedad::whereRaw('(horas_extras_50 + horas_extras_100) != 0')->whereHorasExtrasEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
        $horasExtras->load(['PropuestoPor','Empleado','Empleado.Sector']);

        $bonoSemestral = BonoSemestral::where('importe','>',0)->whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
        $bonoSemestral->load(['User','Empleado','Empleado.Sector']);

        $bonoTrimestral = BonoTrimestralDistribucion::where('importe','>',0)->whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
        $bonoTrimestral->load(['User','Empleado','Empleado.Sector']);

        $gratificaciones = GratificacionEspecial::where('importe','>',0)->whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
        $gratificaciones->load(['User','Empleado','Empleado.Sector']);

        $comisiones = Comision::where('importe','>',0)->whereEstadoId(Estado::whereCodigo('PEN')->value('id'))->orderBy('empleado_id','asc')->get();
        $comisiones->load([ 'Empleado', 'Empleado.Sector' ]);

        if(!Carbon::now()->isSaturday() && !Carbon::now()->isSunday()){
            if(count($altas)>0 || count($incrementos)>0 || count($horasExtras)>0 || count($bonoSemestral)>0 || count($bonoTrimestral)>0 || count($gratificaciones)>0 || count($comisiones)>0){
                $aprobadores = User::where('rol_id', Rol::where('codigo','APR')->first()->id)->get();
                
                if(isset($aprobadores)){
                    foreach( $aprobadores as $aprobador){
                        Mail::to( $aprobador->email )->send( new MailNotificaciones( $altas, $incrementos, $horasExtras, $bonoSemestral, $bonoTrimestral, $gratificaciones, $comisiones ) );

                        Log::info("existe aprobador: ".$aprobador->email);
                        Log::info("el email se envió correctamente");
                    }
                }else{
                    Log::info("no hay aprobadores");
                }
            }
        }

        return 0;
    }
}
