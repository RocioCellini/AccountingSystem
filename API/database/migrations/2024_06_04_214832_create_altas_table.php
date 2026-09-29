<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAltasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('altas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
            $table->string('apellido')->nullable();
            $table->date('fecha_nacimiento');
            $table->string('documento');
            $table->string('plan_osde');
            $table->string('titulo_puesto');
            $table->date('fecha_ingreso');
            $table->string('consultora')->nullable();

            $table->unsignedInteger('sueldo_bruto');
            $table->unsignedInteger('dias_vacaciones');
            $table->unsignedInteger('bono_semestral');

            $table->unsignedInteger('puesto_id');
            $table->unsignedInteger('empresa_id');
            $table->unsignedInteger('sector_id');
            $table->unsignedInteger('subsegmento_id')->nullable();
            $table->unsignedInteger('padre_id')->nullable();
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('aprobador_id')->nullable();
            $table->unsignedInteger('estado_id');
            $table->unsignedInteger('created_by')->nullable();
            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('puesto_id')->references('id')->on('puestos');
            $table->foreign('empresa_id')->references('id')->on('empresas');
            $table->foreign('sector_id')->references('id')->on('sectores');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('aprobador_id')->references('id')->on('users');
            $table->foreign('estado_id')->references('id')->on('estados');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('altas');
    }
}
