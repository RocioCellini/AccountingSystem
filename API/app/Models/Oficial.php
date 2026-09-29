<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Oficial extends Model
{
    use HasFactory;

    protected $table = "oficiales";

    protected $fillable = ["origen","descripcion","id_esco","agente_colocador_codigo","agente_colocador_descripcion","sucursal","anulado"];

    protected $appends = ["asignado"];

    public function getAsignadoAttribute(){
        return EmpleadoOficial::whereOficialId($this->id)->sum('porcentaje');;
    }

    public function Cuotapartistas(){
        return $this->hasMany(Cuotapartista::class,'oficial_id');
    }

    public function Empleados(){
        return $this->hasMany(EmpleadoOficial::class,'oficial_id');
    }




}
