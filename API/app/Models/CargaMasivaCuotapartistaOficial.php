<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CargaMasivaCuotapartistaOficial extends Model
{
    use HasFactory;

    protected $table = "carga_masiva_cuotapartistas_oficiales";

    protected $fillable = ["numero_cuotapartista","numero_fondo","codigo_oficial","porcentaje_oficial","porcentaje_comision","porcentaje_agente"];

}
