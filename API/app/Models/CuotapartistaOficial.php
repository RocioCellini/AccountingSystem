<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CuotapartistaOficial extends Model
{
    use HasFactory;

    protected $table = "cuotapartista_oficiales";

    protected $fillable = ["cuotapartista_id","oficial_id","tipo","porcentaje"];

    public function Oficial(){
        return $this->belongsTo(Oficial::class,'oficial_id');
    }

    public function Cuotapartista(){
        return $this->belongsTo(Cuotapartista::class,'cuotapartista_id');
    }

}
