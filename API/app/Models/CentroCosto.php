<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CentroCosto extends Model
{
    use HasFactory;

    protected $table = "centros_costo";

    protected $fillable = ["descripcion","tipo","created_by","updated_by"];


    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function Asignacion(){
        return $this->hasMany(LlaveDistribucionCentroCosto::class,'centro_costo_id');
    }

}
