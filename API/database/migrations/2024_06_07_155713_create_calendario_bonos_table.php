<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalendarioBonosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendario_bonos', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('mes');
            $table->decimal('porcentaje_sueldos',32,4)->default(0);
            $table->timestamps();
        });

        Artisan::call('db:seed',[
            '--class'=>'CalendarioBonoSeeder'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendario_bonos');
    }
}
