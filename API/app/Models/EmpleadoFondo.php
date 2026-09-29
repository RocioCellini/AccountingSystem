<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class EmpleadoFondo extends Model
{
    use HasFactory;

    protected $table = "empleado_fondos";

    protected $fillable = ["empleado_id","fondo_id","porcentaje"];


    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }

    public function Fondo(){
        return $this->belongsTo(Fondo::class,'fondo_id');
    }
}
