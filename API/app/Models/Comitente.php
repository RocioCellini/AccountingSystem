<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Comitente extends Model
{
    use HasFactory;

    protected $table = "comitentes";

    protected $fillable = ["numero_comitente","descripcion","oficial_id","porcentaje"];

    public function Oficial(){
        return $this->belongsTo(Oficial::class,'oficial_id');
    }


}
