<?php

namespace Database\Seeders;

use App\Models\Sector;
use Illuminate\Database\Seeder;

class SectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sectores =[
            ['descripcion'=>'Back Office Fondos'],
            ['descripcion'=>'Back Office Tesorería'],
            ['descripcion'=>'Back Office Títulos'],
            ['descripcion'=>'Compras y Contrataciones'],
            ['descripcion'=>'Compliance'],
            ['descripcion'=>'Legales'],
            ['descripcion'=>'Accounting'],
            ['descripcion'=>'Tax'],
            ['descripcion'=>'Human Resources'],
            ['descripcion'=>'IT'],
            ['descripcion'=>'FO Fondos'],
            ['descripcion'=>'FO Securities'],
            ['descripcion'=>'Commodities'],
            ['descripcion'=>'Director']
        ];

        Sector::insert($sectores);
    }
}
