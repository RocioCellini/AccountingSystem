<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ArancelesBolsa extends Model
{
    use HasFactory;

    protected $table = "aranceles_bolsa";

    protected $fillable = ["fecha_concertacion","fecha_liquidacion","tipo_operacion","moneda","comitente_id","moneda","bruto","neto","arancel","id_esco"];

    public function Comitente(){
        return $this->belongsTo(Comitentes::class,'comitente_id');
    }


}
