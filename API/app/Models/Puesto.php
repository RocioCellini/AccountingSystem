<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Puesto extends Model
{
    use HasFactory;

    protected $table = "puestos";

    protected $fillable = ["descripcion"];

    public function Puesto(){
        return $this->hasMany(Empleado::class,'puesto_id');
    }
}
