<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AsientoContable extends Model
{
    use HasFactory, SoftDeletes;

    protected  $table = "asientos_contables";

    protected $fillable = ["empresa_id","empleado_id","fecha","sac",'provision_mensual_sac','vac'];

    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }

    public function Empresa(){
        return $this->belongsTo(Empresa::class,'empresa_id');
    }
}
