<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CuotapartistaDistribucion extends Model
{
    use HasFactory;

    protected $table = "cuotapartista_distribucion";

    protected $fillable = ["cuotapartista_id","oficial_id","fondo_id","base_calculo","porcentaje"];

    public function Cuotapartista(){
        return $this->belongsTo(Cuotapartista::class,'cuotapartista_id');
    }

    public function Oficial(){
        return $this->belongsTo(Oficial::class,'oficial_id');
    }

    public function Fondo(){
        return $this->belongsTo(Fondo::class,'fondo_id');
    }

}
