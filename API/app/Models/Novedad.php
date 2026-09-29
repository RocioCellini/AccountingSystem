<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Novedad extends Model
{
    use HasFactory;

    protected  $table = "novedades";

    protected $fillable = ["empleado_id","estado_id","fecha","sueldo_bruto","horas_extras_50","horas_extras_100","plan_osde","bono_semestral","user_propuesta_id","variacion","user_aprobacion_incrementos_id","horas_extras_estado_id","horas_extras_user_aprobacion_incrementos_id","incremento_fecha_aprobacion","horas_extras_fecha_aprobacion"];

    protected $appends = ['periodo',"horas_extras_fecha_aprobacion_formatted","incrementos_fecha_aprobacion_formatted"];

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

    public function EstadoHorasExtras(){
        return $this->belongsTo(Estado::class,'horas_extras_estado_id');
    }

    public function PropuestoPor(){
        return $this->belongsTo(User::class,'user_propuesta_id');
    }

    public function IncrementoAprobadoPor(){
        return $this->belongsTo(User::class,'user_aprobacion_incrementos_id');
    }

    public function HorasExtrasAprobadoPor(){
        return $this->belongsTo(User::class,'horas_extras_user_aprobacion_incrementos_id');
    }

    public function getPeriodoAttribute(){
        return Carbon::parse($this->fecha)->format("Y/m");
    }

    public function getIncrementosFechaAprobacionFormattedAttribute(){
        return Carbon::parse($this->incrementos_fecha_aprobacion)->format("d/m/Y H:i:s");
    }

    public function getHorasExtrasFechaAprobacionFormattedAttribute(){
        return Carbon::parse($this->horas_extras_fecha_aprobacion)->format("d/m/Y H:i:s");
    }

}
