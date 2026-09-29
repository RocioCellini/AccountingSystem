<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class LlaveDistribucion extends Model
{
    use HasFactory;

    protected $table = "llaves_distribucion";

    protected $fillable = ["descripcion","updated_by","created_by"];


    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function Distribucion(){
        return $this->hasMany(LlaveDistribucionCentroCosto::class,'llave_distribucion_id');
    }

}
