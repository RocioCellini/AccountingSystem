<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarioBono extends Model
{
    use HasFactory;

    protected $table = 'calendario_bonos';
    protected $fillable = ['mes','porcentaje_sueldos'];
}
