<?php

namespace Database\Seeders;

use App\Models\Empresa;
use Illuminate\Database\Seeder;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $empresas =[
            ['descripcion'=>'Capital','codigo'=>'GCI','conexion'=>'CIBSA'],
            ['descripcion'=>'FondosNew','codigo'=>'GAS','conexion'=>'GAINVEST'],
            ['descripcion'=>'TusFondos','codigo'=>'GIF','conexion'=>'FCSTONE'],
            ['descripcion'=>'Reservas','codigo'=>'GAA','conexion'=>'CAPITAL']
        ];

        Empresa::insert($empresas);
    }
}
