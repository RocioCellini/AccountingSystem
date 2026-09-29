<?php

namespace App\Rules;

use App\Models\Parametro;
use App\Models\Prospectos\PersonasFisicas\Titular;
use App\Models\Prospectos\ProspectoPersonas;
use App\Models\Tesoreria\CuentasBancarias\CuentaBancaria;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class ValidarFechaIngreso implements Rule
{

    public function __construct()
    {
    }


    public function passes($attribute, $value)
    {
        if($value==""){
            return false;
        }
       if(Carbon::createFromFormat((strlen($value) == 8 ? 'dmY' : 'd/m/Y'),$value)->format("Ymd")<=Carbon::parse(Parametro::whereCodigo('CIERRE')->value('valor_fecha'))->format("Ymd")){
           return false;
       };

       return true;
    }


    public function message()
    {
        return '* Cerrado *';
    }
}
