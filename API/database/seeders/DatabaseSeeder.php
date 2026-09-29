<?php

namespace Database\Seeders;

use App\Models\Alta;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Estado;
use App\Models\Puesto;
use App\Models\Rol;
use App\Models\Sector;
use App\Models\Sistema;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        Rol::create([
            'codigo'=>'ADM',
            'descripcion'=>'Admin'
        ]);

        Rol::create([
            'codigo'=>'GTE',
            'descripcion'=>'Gerente'
        ]);

        $rol = Rol::create([
            'codigo'=>'RRHH',
            'descripcion'=>'Recursos Humanos'
        ]);

        $user = User::create([
            'name'=>'Leonel Avila',
            'email'=>'lavila@wf-systems.com',
            'rol_id'=>$rol->id,
            'password'=>Hash::make("Argentina1")
        ]);

        Estado::create([
            'codigo'=>'PEN',
            'descripcion'=>'Pendiente'
        ]);

        Estado::create([
            'codigo'=>'REC',
            'descripcion'=>'Rechazado'
        ]);

        Estado::create([
            'codigo'=>'APR',
            'descripcion'=>'Aprobado'
        ]);

        Estado::create([
            'codigo'=>'LIQ',
            'descripcion'=>'Liquidado'
        ]);


        Empresa::create([
            'codigo'=>'GCI',
            'descripcion'=>'Cibsa'
        ]);

        Empresa::create([
            'codigo'=>'GAA',
            'descripcion'=>'Gainvest'
        ]);

        Puesto::create(['descripcion'=>'Portfolio Manager Semi Senior']);
        Puesto::create(['descripcion'=>'Head Portfolio Mutual Funds']);
        Puesto::create(['descripcion'=>'Portfolio Manager Senior']);
        Puesto::create(['descripcion'=>'Senior Sales Corporate and Institutional Clients']);
        Puesto::create(['descripcion'=>'Senior Research Analyst']);
        Puesto::create(['descripcion'=>'Trader']);
        Puesto::create(['descripcion'=>'Head of Research and Strategy']);
        Puesto::create(['descripcion'=>'Risk Management and Trader']);
        Puesto::create(['descripcion'=>'Assistant Trader']);
        Puesto::create(['descripcion'=>'Assistant Sales ']);
        Puesto::create(['descripcion'=>'Head Trader']);
        Puesto::create(['descripcion'=>'Compliance Analyst']);
        Puesto::create(['descripcion'=>'BO FCI Analyst']);
        Puesto::create(['descripcion'=>'BO Treasury Analyst']);
        Puesto::create(['descripcion'=>'BO Securities Analyst']);
        Puesto::create(['descripcion'=>'Compliance Assistant']);
        Puesto::create(['descripcion'=>'Senior Compliance - 201874']);
        Puesto::create(['descripcion'=>'BO Purchase Analyst']);
        Puesto::create(['descripcion'=>'BO Securities Analyst']);
        Puesto::create(['descripcion'=>'Assistant']);
        Puesto::create(['descripcion'=>'Senior Accountant']);
        Puesto::create(['descripcion'=>'Senior Accounting Analyst ']);
        Puesto::create(['descripcion'=>'Accounting Assistant']);
        Puesto::create(['descripcion'=>'Tax Analyst ']);
        Puesto::create(['descripcion'=>'Assistant ']);
        Puesto::create(['descripcion'=>'HR-Analyst']);
        Puesto::create(['descripcion'=>'Senior Analyst ']);
        Puesto::create(['descripcion'=>'Semi-Senior Analyst ']);
        Puesto::create(['descripcion'=>'Team Leader']);
        Puesto::create(['descripcion'=>'Legal Assistant ']);
        Puesto::create(['descripcion'=>'Assistant General Counsel']);
        Puesto::create(['descripcion'=>'Legal Counsel']);
        Puesto::create(['descripcion'=>'IT Development Team Lead']);
        Puesto::create(['descripcion'=>'IT SSr Developer']);
        Puesto::create(['descripcion'=>'Help Desk&Infra Senior Analyst ']);
        Puesto::create(['descripcion'=>'Help Desk&Infra Team Lead']);
        Puesto::create(['descripcion'=>'IT Development Manager']);
        Puesto::create(['descripcion'=>'Head of IT Argentina']);
        Puesto::create(['descripcion'=>'Manager Accounting']);
        Puesto::create(['descripcion'=>'Director']);
        Puesto::create(['descripcion'=>'Risk Management Consultant']);
        Puesto::create(['descripcion'=>'Gerente de Operaciones & Compliance']);
        Puesto::create(['descripcion'=>'Head of Operations']);
        Puesto::create(['descripcion'=>'Secretary ']);
        Puesto::create(['descripcion'=>'Marketing and Institutional Relation']);
        Sector::create(['descripcion'=>'Back Office Fondos']);
        Sector::create(['descripcion'=>'Back Office Tesorería']);
        Sector::create(['descripcion'=>'Back Office Títulos']);
        Sector::create(['descripcion'=>'Compras y Contrataciones']);
        Sector::create(['descripcion'=>'Compliance']);
        Sector::create(['descripcion'=>'Legales']);
        Sector::create(['descripcion'=>'Accounting']);
        Sector::create(['descripcion'=>'Tax']);
        Sector::create(['descripcion'=>'Human Resources']);
        Sector::create(['descripcion'=>'IT']);
        Sector::create(['descripcion'=>'FO Fondos']);
        Sector::create(['descripcion'=>'FO Securities']);
        Sector::create(['descripcion'=>'Commodities']);
        Sector::create(['descripcion'=>'Director']);

        Sistema::create(['codigo'=>'BJ','descripcion'=>'Bejerman']);
        Sistema::create(['codigo'=>'SUN','descripcion'=>'Sun']);


        $empleado = Empleado::create([
            "nombre_apellido"=>"Leonel Avila",
            "fecha_nacimiento"=>"19900427",
            "documento"=>"35147771",
            "plan_osde"=>"Osde 210",
            "titulo_puesto"=>"IT Developer",
            "fecha_ingreso"=>"20210101",
            "sueldo_bruto"=>125000,
            "dias_vacaciones"=>21,
            "bono_semestral"=>2,
            "puesto_id"=>1,
            "empresa_id"=>1,
            "sector_id"=>1,
        ]);


        $empleado->Legajos()->attach(Sistema::whereCodigo('BJ')->value('id'),['legajo'=>"2100"]);
        $empleado->Legajos()->attach(Sistema::whereCodigo('SUN')->value('id'),['legajo'=>"5110"]);


        $alta = Alta::create([
            "nombre"=>"Leonel",
            "apellido"=>"Avila",

            "fecha_nacimiento"=>"19900427",
            "documento"=>"35147771",
            "plan_osde"=>"Osde 210",
            "titulo_puesto"=>"IT Developer",
            "fecha_ingreso"=>"20210630",
            "sueldo_bruto"=>125000,
            "dias_vacaciones"=>21,
            "bono_semestral"=>2,
            "puesto_id"=>1,
            "empresa_id"=>1,
            "sector_id"=>1,
            "estado_id"=>Estado::whereCodigo("PEN")->value("id"),
            "user_id"=>$user->id,
        ]);

    }
}
