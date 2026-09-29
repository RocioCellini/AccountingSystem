<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmpleadoSistema extends Model
{
    use HasFactory;

    protected $table = "empleado_sistema";

    protected $fillable = ["empleado_id","sistema_id","legajo"];

    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }

    public function Sistema(){
        return $this->belongsTo(Sistema::class,'sistema_id');
    }
}
