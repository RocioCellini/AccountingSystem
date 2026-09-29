<?php

namespace Database\Seeders;

use App\Models\Sistema;
use Illuminate\Database\Seeder;

class SistemaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sistemas =[['descripcion'=>'Bejerman','codigo'=>'BJ'],
            ['descripcion'=>'Sun','codigo'=>'SUN']
        ];

        Sistema::insert($sistemas);
    }
}
