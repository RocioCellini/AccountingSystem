<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAsientosContablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('asientos_contables', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('empleado_id');
            $table->unsignedInteger('empresa_id');
            $table->dateTime('fecha')->nullable();
            $table->float('sac')->default(0);
            $table->float('rem_bruta_sac')->default(0);
            $table->float('ccss_sobre_sac')->default(0);
            $table->float('provision_mensual_sac')->default(0);
            $table->float('vac')->default(0);
            $table->float('rem_bruta_vac')->default(0);
            $table->float('ccss_sobre_vac')->default(0);
            $table->float('provision_mensual_vac')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('empleado_id')->references('id')->on('empleados')->onDelete('cascade');
            $table->foreign('empresa_id')->references('id')->on('empresas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('asientos_contables');
    }
}
