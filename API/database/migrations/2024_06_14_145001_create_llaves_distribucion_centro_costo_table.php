<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLlavesDistribucionCentroCostoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('llaves_distribucion_centro_costo', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('llave_distribucion_id');
            $table->unsignedInteger('centro_costo_id');
            $table->decimal('porcentaje',32,4);
            $table->unsignedInteger('created_by')->nullable();
            $table->unsignedInteger('updated_by')->nullable();
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
        Schema::dropIfExists('llaves_distribucion_centro_costo');
    }
}
