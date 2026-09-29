<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFondosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fondos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('numero_fondo');
            $table->string('descripcion');
            $table->string('id_esco');
            $table->string('abreviatura')->nullable();
            $table->string('moneda')->nullable();
            $table->decimal('porcentaje',32,4)->nullable();
            $table->boolean('es_dedicado')->default(0);
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
        Schema::dropIfExists('fondos');
    }
}
