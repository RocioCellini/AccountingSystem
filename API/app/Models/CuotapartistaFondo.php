<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CuotapartistaFondo extends Model
{
    use HasFactory;

    protected $table = "cuotapartista_fondos";

    protected $fillable = ["cuotapartista_id","fondo_id","porcentaje"];

    public function Cuotapartista(){
        return $this->belongsTo(Cuotapartista::class,'cuotapartista_id');
    }

    public function Fondo(){
        return $this->belongsTo(Fondo::class,'fondo_id');
    }

}
