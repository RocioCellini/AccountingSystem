<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Cuotapartista extends Model
{
    use HasFactory;

    protected $table = "cuotapartistas";

    protected $fillable = ["numero_cuotapartista","descripcion","oficial_id","porcentaje","solo_excepciones",'asociaciones','agentes_externos_porcentaje','agentes_internos_porcentaje','agentes_externos','agentes_internos','tiene_distribucion'];

    protected $appends = ['tiene_distribucion'];

    protected $casts = [
        'asociaciones'=>'array',
        'agentes_externos'=>'array',
        'agentes_internos'=>'array'
    ];

    public function getTieneDistribucionAttribute(){
        return CuotapartistaDistribucion::whereCuotapartistaId($this->id)->exists();
    }



    public function Oficial(){
        return $this->belongsTo(Oficial::class,'oficial_id');
    }

    public function Fondos(){
        return $this->hasMany(CuotapartistaFondo::class,'cuotapartista_id');
    }

    public function Distribuciones(){
        return $this->hasMany(CuotapartistaDistribucion::class,'cuotapartista_id');
    }

}
