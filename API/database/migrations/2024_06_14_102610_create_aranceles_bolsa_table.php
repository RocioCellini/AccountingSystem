<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArancelesBolsaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('aranceles_bolsa', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_esco');
            $table->date('fecha_concertacion');
            $table->date('fecha_liquidacion');
            $table->string('tipo_operacion');
            $table->string('moneda');
            $table->decimal('bruto',32,4);
            $table->decimal('neto',32,4);

            $table->decimal('arancel',32,4);
            $table->unsignedInteger('comitente_id');
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
        Schema::dropIfExists('aranceles_bolsa');
    }
}
