<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = "empresas";

    protected $fillable = ["descripcion","codigo","conexion"];


    public function Empleados(){
        return $this->hasMany(Empleado::class,'empresa_id');
    }
}
