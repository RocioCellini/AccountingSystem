<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComisionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comisiones', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('empleado_id');
            $table->unsignedInteger('estado_id');
            $table->unsignedInteger('aprobado_por')->nullable();
            $table->date('fecha');
            $table->decimal('importe',32,4);
            $table->decimal('fondos',32,4)->default(0);
            $table->decimal('capital_markets',32,4)->default(0);
            $table->decimal('rofex',32,4)->default(0);
            $table->decimal('cibsa',32,4)->default(0);
            $table->decimal('otros',32,4)->default(0);
            $table->unsignedInteger('created_by');
            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('empleado_id')->references('id')->on('empleados');
            $table->foreign('estado_id')->references('id')->on('estados');
            $table->foreign('aprobado_por')->references('id')->on('users');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comisiones');
    }
}
