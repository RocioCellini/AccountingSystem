<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Comision extends Model
{
    use HasFactory;

    protected $table = "comisiones";

    protected $fillable = ["empleado_id","estado_id","aprobado_por","fecha","importe","fondos","capital_markets","rofex","cibsa","otros"];

    protected $appends = ['periodo','updated_at_formatted'];

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

    public function Aprobador(){
        return $this->belongsTo(User::class,'aprobado_por');
    }

    public function getPeriodoAttribute(){
        return Carbon::parse($this->fecha)->format("Y/m");
    }

    public function getUpdatedAtFormattedAttribute(){
        return Carbon::parse($this->updated_at)->format("d/m/Y H:i:s") ;
    }


}
