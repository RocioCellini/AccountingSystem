<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCargaMasivaCuotapartistasOficialesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carga_masiva_cuotapartistas_oficiales', function (Blueprint $table) {
            $table->increments('id');
            $table->string('numero_cuotapartista');
            $table->string('numero_fondo');
            $table->string('codigo_oficial');

            $table->decimal('porcentaje_oficial')->nullable();
            $table->decimal('porcentaje_comision')->nullable();
            $table->decimal('porcentaje_agente')->nullable();
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
        Schema::dropIfExists('carga_masiva_cuotapartistas_oficiales');
    }
}
