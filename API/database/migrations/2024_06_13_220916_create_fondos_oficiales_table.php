<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFondosOficialesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fondos_oficiales', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('fondo_id');
            $table->unsignedInteger('oficial_id');
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
        Schema::dropIfExists('fondos_oficiales');
    }
}
