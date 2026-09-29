<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Fondo extends Model
{
    use HasFactory;

    protected $table = "fondos";

    protected $fillable = ["numero_fondo","descripcion","id_esco","abreviatura","moneda","porcentaje","es_dedicado"];

    protected $casts = [
        'es_dedicado'=>'boolean'
    ];

    public function Oficiales(){
        return $this->hasMany(FondoOficial::class,'fondo_id');
    }

}
