<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubSegmento extends Model
{
    use HasFactory;

    protected $table = 'subsegmentos';

    protected $fillable = ['codigo','descripcion'];
}
