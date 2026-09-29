<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCuotapartistaFondosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuotapartista_fondos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cuotapartista_id');
            $table->unsignedInteger('fondo_id');
            $table->decimal('porcentaje',10,4);
            $table->timestamps();

            $table->foreign('fondo_id')->references('id')->on('fondos');
            $table->foreign('cuotapartista_id')->references('id')->on('cuotapartistas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cuotapartista_fondos');
    }
}
