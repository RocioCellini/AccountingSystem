<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCuotapartistaOficialesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cuotapartista_oficiales', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('cuotapartista_id');
            $table->unsignedInteger('oficial_id');
            $table->string('tipo');
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
        Schema::dropIfExists('cuotapartista_oficiales');
    }
}
