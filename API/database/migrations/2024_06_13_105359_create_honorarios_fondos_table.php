<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHonorariosFondosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('honorarios_fondos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('fondo_id');
            $table->unsignedInteger('cuotapartista_id');
            $table->date('fecha');
            $table->decimal('importe',32,4);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('honorarios_fondos');
    }
}
