<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    use HasFactory;

    protected $table = "roles";

    protected $fillable = ["codigo","descripcion"];

    public function Users(){
        return $this->hasMany(Empleado::class,'rol_id');
    }
}
