<?php

namespace Database\Seeders;

use App\Models\Parametro;
use Illuminate\Database\Seeder;

class ParametroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $parametros =[
            ['codigo'=>"CIERRE",'valor_fecha'=>'20201231']
        ];

        Parametro::insert($parametros);

    }
}
