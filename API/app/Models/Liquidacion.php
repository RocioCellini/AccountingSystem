<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Liquidacion extends Model
{
    use HasFactory;

    protected  $table = "liquidaciones";

    protected $fillable = ["empresa_id","empleado_id","estado_id","fecha","concepto",'importe','liquidacion'];


    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }

    public function Estado(){
        return $this->belongsTo(Estado::class,'estado_id');
    }
}
