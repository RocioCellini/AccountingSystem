<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class BonoSemestral extends Model
{
    use HasFactory;

    protected $table = "bonos_semestrales";

    protected $fillable = ["empleado_id","fecha","importe","estado_id","user_id","aprobador_id","fecha_aprobacion","created_by","updated_by"];

    protected $appends = ["periodo"];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }


    public function getPeriodoAttribute(){
        return Carbon::parse($this->fecha)->format("Y-m");
    }

    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }

    public function Estado(){
        return $this->belongsTo(Estado::class,'estado_id');
    }

    public function User(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function Aprobador(){
        return $this->belongsTo(User::class,'aprobador_id');
    }

    public function CreatedBy(){
        return $this->belongsTo(User::class,'created_by');
    }

    public function UpdatedBy(){
        return $this->belongsTo(User::class,'updated_by');
    }

}
