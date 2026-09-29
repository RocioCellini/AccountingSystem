<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmpleadosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empleados', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre_apellido');
            $table->date('fecha_nacimiento');
            $table->string('documento');
            $table->string('plan_osde')->nullable();
            $table->string('titulo_puesto');
            $table->date('fecha_ingreso');
            $table->date('fecha_baja')->nullable();

            $table->unsignedInteger('sueldo_bruto');
            $table->unsignedInteger('dias_vacaciones');
            $table->unsignedInteger('bono_semestral');

            $table->unsignedInteger('created_by')->nullable();
            $table->unsignedInteger('updated_by')->nullable();

            $table->boolean('es_comercial')->default(false);
            $table->string('email')->nullable();
            $table->boolean('repite_bono_semestral')->default(0);
            $table->boolean('nunca_liquido_bonus')->default(true);
            $table->unsignedInteger('meses_reconocidos')->default(0);
            $table->string('tipo_empleado')->nullable();

            $table->unsignedInteger('puesto_id');
            $table->unsignedInteger('empresa_id');
            $table->unsignedInteger('sector_id');
            $table->unsignedInteger('padre_id')->nullable();
            $table->unsignedInteger('subsegmento_id')->nullable();
            $table->unsignedInteger('llave_distribucion_id')->nullable();
            $table->timestamps();

            $table->foreign('puesto_id')->references('id')->on('puestos');
            $table->foreign('empresa_id')->references('id')->on('empresas');
            $table->foreign('sector_id')->references('id')->on('sectores');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empleados');
    }
}
