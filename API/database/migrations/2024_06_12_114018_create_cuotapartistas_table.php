<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCuotapartistasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuotapartistas', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('oficial_id');
            $table->unsignedInteger('numero_cuotapartista');
            $table->string('descripcion');
            $table->decimal('porcentaje',10,4);
            $table->boolean('solo_excepciones')->nullable();
            $table->decimal('agentes_externos_porcentaje',32,4)->nullable();
            $table->decimal('agentes_internos_porcentaje',32,4)->nullable();
            $table->json('agentes_externos')->nullable();
            $table->json('agentes_internos')->nullable();
            $table->json('asociaciones')->nullable();
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
        Schema::dropIfExists('cuotapartistas');
    }
}
