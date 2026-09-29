<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCuotapartistaDistribucionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuotapartista_distribucion', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cuotapartista_id');
            $table->unsignedInteger('oficial_id');
            $table->unsignedInteger('fondo_id');
            $table->decimal('base_calculo',32,4);
            $table->decimal('porcentaje',32,4);
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
        Schema::dropIfExists('cuotapartista_distribucion');
    }
}
