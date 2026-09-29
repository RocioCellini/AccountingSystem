<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Archivo extends Model
{
    use HasFactory;

    protected $table = "archivos";

    protected $fillable = ["nombre","ruta","alta_id","empleado_id"];

    protected $appends = ["path"];

    public function getPathAttribute(){
        return url($this->ruta);
    }


    public function Alta(){
        return $this->belongsTo(Alta::class,'alta_id');
    }

    public function Empleado(){
        return $this->belongsTo(Empleado::class,'empleado_id');
    }


}
