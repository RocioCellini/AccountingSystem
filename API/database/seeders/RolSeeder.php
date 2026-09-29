<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles =[['codigo'=>'APR','descripcion'=>'Aprobador'],
            ['codigo'=>'SU','descripcion'=>'Super User'],
            ['codigo'=>'ADM','descripcion'=>'Admin'],
            ['codigo'=>'GTE','descripcion'=>'Gerente'],
            ['codigo'=>'RRHH','descripcion'=>'Recursos Humanos'],
            ['codigo'=>'GTEF','descripcion'=>'Head de Fondos']
        ];

        Rol::insert($roles);
    }
}
