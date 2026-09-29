<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class EmpleadoCuotapartista extends Model
{
    use HasFactory;

    protected $table = "empleado_cuotapartistas";

    protected $fillable = ["empleado_id","cuotapartista_id","porcentaje"];


    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }

    public function Cuotapartista(){
        return $this->belongsTo(Cuotapartista::class,'cuotapartista_id');
    }
}
