<?php

namespace Database\Seeders;

use App\Models\SubSegmento;
use Illuminate\Database\Seeder;

class SubsegmentoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subsegmentos =[
            ['codigo'=>'DTR','descripcion'=>'DTR']
        ];

        SubSegmento::insert($subsegmentos);
    }
}
