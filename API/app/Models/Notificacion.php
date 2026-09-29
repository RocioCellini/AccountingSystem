<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = "notificaciones";

    protected $fillable = ["user_id","texto","leido","tipo"];

    protected $appends = ["created_at_formatted"];

    public function getCreatedAtFormattedAttribute(){
        return Carbon::parse($this->created_at)->format("d/m/Y H:i:s");
    }
}
