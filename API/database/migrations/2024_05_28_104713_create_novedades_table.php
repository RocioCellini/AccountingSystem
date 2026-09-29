<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNovedadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('novedades', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('empleado_id');
            $table->unsignedInteger('estado_id');
            $table->date('fecha');
            $table->decimal('sueldo_bruto')->nullable();
            $table->decimal('horas_extras_50')->nullable();
            $table->decimal('horas_extras_100')->nullable();
            $table->string('plan_osde')->nullable();
            $table->decimal('bono_semestral')->nullable();
            $table->decimal('variacion',32,4)->default(0);

            $table->unsignedInteger('user_propuesta_id')->nullable();
            $table->unsignedInteger("user_aprobacion_incrementos_id")->nullable();
            $table->unsignedInteger("horas_extras_estado_id")->nullable();
            $table->unsignedInteger("horas_extras_user_aprobacion_incrementos_id")->nullable();

            $table->dateTime("incremento_fecha_aprobacion")->nullable();
            $table->dateTime("horas_extras_fecha_aprobacion")->nullable();

            $table->unsignedInteger("created_by")->nullable();
            $table->unsignedInteger("updated_by")->nullable();
            $table->timestamps();

            $table->foreign('empleado_id')->references('id')->on('empleados');
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
        Schema::dropIfExists('novedades');
    }
}
