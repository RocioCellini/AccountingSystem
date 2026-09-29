<?php

namespace App\Rules;

use App\Models\Prospectos\PersonasFisicas\Titular;
use App\Models\Prospectos\ProspectoPersonas;
use App\Models\Sistema;
use App\Models\Tesoreria\CuentasBancarias\CuentaBancaria;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ValidarLegajoSunUnique implements Rule
{

    protected $empleadoId;

    public function __construct($empleadoId)
    {
        $this->empleadoId = $empleadoId;
    }


    public function passes($attribute, $value)
    {
        if(!isset($value)){
            return true;
        }

        return !DB::table('empleado_sistema')->where('legajo',$value)->where('empleado_id','!=',$this->empleadoId)->whereSistemaId(Sistema::whereCodigo('SUN')->value('id'))->exists();
    }


    public function message()
    {
        return '* Invalido *';
    }
}
