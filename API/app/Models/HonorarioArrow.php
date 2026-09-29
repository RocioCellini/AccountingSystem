<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class HonorarioArrow extends Model
{
    use HasFactory;

    protected $table = "honorarios_arrow";

    protected $fillable = ["fecha_creacion","fecha_concertacion","fecha_liquidacion","tipo_operacion","tipo_liquidacion","estado","estado_codigo","cantidad","precio","precio_mesa","comision","comitente_id"];

    public function Comitente(){
        return $this->belongsTo(Comitentes::class,'comitente_id');
    }


}
