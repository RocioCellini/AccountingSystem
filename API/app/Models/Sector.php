<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    use HasFactory;

    protected $table = "sectores";

    protected $fillable = ["descripcion"];

    public function Empleados(){
        return $this->hasMany(Empleado::class,'sector_id');
    }
}
