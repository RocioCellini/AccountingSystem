<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CuentaContable extends Model
{
    use HasFactory;

    protected $table = "cuentas_contables";

    protected $fillable = ["empresa_id","centro_costo_id","concepto","numero_cuenta","descripcion","updated_by","created_by"];


    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function Empresa(){
        return $this->belongsTo(Empresa::class,'empresa_id');
    }

    public function CentroCosto(){
        return $this->belongsTo(CentroCosto::class,'centro_costo_id');
    }

}
