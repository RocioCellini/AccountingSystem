<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParametrosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parametros', function (Blueprint $table) {
            $table->increments('id');
            $table->string('codigo')->unique();
            $table->string('valor_texto')->nullable();
            $table->date('valor_fecha')->nullable();
            $table->decimal('valor_numero',32,4)->nullable();
            $table->timestamps();
        });

        Artisan::call('db:seed',[
            '--class'=>'ParametroSeeder'
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('parametros');
    }
}
