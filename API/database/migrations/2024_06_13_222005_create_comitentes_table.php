<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComitentesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comitentes', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('oficial_id');
            $table->unsignedInteger('numero_comitente');
            $table->string('descripcion');
            $table->decimal('porcentaje',32,4)->nullable();
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
        Schema::dropIfExists('comitentes');
    }
}
