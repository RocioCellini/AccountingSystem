<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOficialesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('oficiales', function (Blueprint $table) {
            $table->increments('id');
            $table->string('origen');
            $table->string('descripcion');
            $table->string('id_esco');
            $table->string('agente_colocador_codigo')->nullable();
            $table->string('agente_colocador_descripcion')->nullable();
            $table->string('sucursal')->nullable();
            $table->boolean('anulado')->default(false);
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
        Schema::dropIfExists('oficiales');
    }
}
