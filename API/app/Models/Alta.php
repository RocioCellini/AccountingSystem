<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Alta extends Model
{
    use HasFactory;

    protected $table = "altas";

    protected $fillable = ["nombre","apellido","fecha_nacimiento","documento","plan_osde","titulo_puesto","fecha_ingreso","sueldo_bruto","dias_vacaciones","bono_semestral","puesto_id","empresa_id","sector_id","padre_id","user_id","estado_id","aprobador_id","subsegmento_id","consultora"];

    protected $appends = ['updated_at_formatted','fecha_ingreso_formatted','fecha_ingreso_string','fecha_nacimiento_string'];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_by = Auth::id();
        });

        static::updating(function ($model) {
            $model->updated_by = Auth::id();
        });
    }

    public function getUpdatedAtFormattedAttribute(){
        return Carbon::parse($this->updated_at)->format("d/m/Y H:i:s");
    }


    public function getFechaIngresoFormattedAttribute(){
        return Carbon::parse($this->fecha_ingreso)->format("d/m/Y");
    }

    public function getFechaIngresoStringAttribute(){
        return Carbon::parse($this->fecha_ingreso)->format("dmY");
    }

    public function getFechaNacimientoStringAttribute(){
        return Carbon::parse($this->fecha_nacimiento)->format("dmY");
    }

    public function Puesto(){
        return $this->belongsTo(Puesto::class,'puesto_id');
    }

    public function Empresa(){
        return $this->belongsTo(Empresa::class,'empresa_id');
    }

    public function Sector(){
        return $this->belongsTo(Sector::class,'sector_id');
    }

    public function Padre(){
        return $this->belongsTo(Empleado::class,'padre_id');
    }

    public function Estado(){
        return $this->belongsTo(Estado::class,'estado_id');
    }

    public function Subsegmento(){
        return $this->belongsTo(SubSegmento::class,'subsegmento_id');
    }


    public function Aprobador(){
        return $this->belongsTo(Estado::class,'aprobador');
    }

    public function Creador(){
        return $this->belongsTo(User::class,'created_by');
    }

    public function Archivos(){
        return $this->hasMany(Archivo::class,'alta_id');
    }


}
