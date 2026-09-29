<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class FondoOficial extends Model
{
    use HasFactory;

    protected $table = "fondos_oficiales";

    protected $fillable = ["fondo_id","oficial_id","porcentaje"];

    public function Fondos(){
        return $this->belongsTo(Fondo::class,'fondo_id');
    }

    public function Oficial(){
        return $this->belongsTo(Oficial::class,'oficial_id');
    }


}
