<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class EmpleadoOficial extends Model
{
    use HasFactory;

    protected $table = "empleado_oficiales";

    protected $fillable = ["empleado_id","oficial_id","porcentaje","porcentaje_base_calculo"];


    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }

    public function Oficial(){
        return $this->belongsTo(Oficial::class,'oficial_id');
    }
}
