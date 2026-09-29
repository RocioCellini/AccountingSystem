<?php

namespace Database\Seeders;

use App\Models\CalendarioBono;
use Illuminate\Database\Seeder;

class CalendarioBonoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $porcentajes =[
            ['mes'=>1,'porcentaje_sueldos'=>'0'],
            ['mes'=>2,'porcentaje_sueldos'=>'0'],
            ['mes'=>3,'porcentaje_sueldos'=>'0'],
            ['mes'=>4,'porcentaje_sueldos'=>'0.8'],
            ['mes'=>5,'porcentaje_sueldos'=>'0'],
            ['mes'=>6,'porcentaje_sueldos'=>'0'],
            ['mes'=>7,'porcentaje_sueldos'=>'0'],
            ['mes'=>8,'porcentaje_sueldos'=>'0'],
            ['mes'=>9,'porcentaje_sueldos'=>'0'],
            ['mes'=>10,'porcentaje_sueldos'=>'1.2'],
            ['mes'=>11,'porcentaje_sueldos'=>'0'],
            ['mes'=>12,'porcentaje_sueldos'=>'0']
        ];

        CalendarioBono::insert($porcentajes);
    }
}
