<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHonorariosArrowTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('honorarios_arrow', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('comitente_id');
            $table->date('fecha_creacion');
            $table->date('fecha_concertacion');
            $table->date('fecha_liquidacion');
            $table->string('tipo_operacion');
            $table->string('tipo_liquidacion');
            $table->string('estado');
            $table->string('estado_codigo');
            $table->decimal('cantidad',32,4);
            $table->decimal('precio',32,4);
            $table->decimal('precio_mesa',32,4);
            $table->decimal('comision',32,4);
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
        Schema::dropIfExists('honorarios_arrow');
    }
}
