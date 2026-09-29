<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorito extends Model
{
    use HasFactory;

    protected $table = "favoritos";

    protected $fillable = ["user_id","empleado_id"];

    public function Empleado(){
        return $this->belongsTo(SubSegmento::class,'empleado_id');
    }

    public function User(){
        return $this->belongsTo(User::class,'user_id');
    }

}
