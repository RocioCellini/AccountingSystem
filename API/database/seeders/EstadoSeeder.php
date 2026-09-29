<?php

namespace Database\Seeders;

use App\Models\Estado;
use Illuminate\Database\Seeder;

class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $estados =[
            ['descripcion'=>'Ingresado','codigo'=>'ING'],
            ['descripcion'=>'Pendiente','codigo'=>'PEN'],
            ['descripcion'=>'Rechazado','codigo'=>'REC'],
            ['descripcion'=>'Aprobado','codigo'=>'APR'],
            ['descripcion'=>'Liquidado','codigo'=>'LIQ'],
            ['descripcion'=>'Borrador','codigo'=>'DRAFT']
        ];

        Estado::insert($estados);
    }
}
