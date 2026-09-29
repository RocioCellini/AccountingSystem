<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class LlaveDistribucionCentroCosto extends Model
{
    use HasFactory;

    protected $table = "llaves_distribucion_centro_costo";

    protected $fillable = ["centro_costo_id","llave_distribucion_id","porcentaje","updated_by","created_by"];


    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function CentroCosto(){
        return $this->belongsTo(CentroCosto::class,'centro_costo_id');
    }

    public function LlaveDistribucion(){
        return $this->belongsTo(LlaveDistribucion::class,'llave_distribucion_id');
    }


}
