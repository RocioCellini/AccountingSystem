<?php

namespace Database\Seeders;

use App\Models\Puesto;
use Illuminate\Database\Seeder;

class PuestoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $puestos =[
            ['descripcion'=>'Portfolio Manager Semi Senior'],
            ['descripcion'=>'Head Portfolio Mutual Funds'],
            ['descripcion'=>'Portfolio Manager Senior'],
            ['descripcion'=>'Senior Sales Corporate and Institutional Clients'],
            ['descripcion'=>'Senior Research Analyst'],
            ['descripcion'=>'Trader'],
            ['descripcion'=>'Head of Research and Strategy'],
            ['descripcion'=>'Risk Management and Trader'],
            ['descripcion'=>'Assistant Trader'],
            ['descripcion'=>'Assistant Sales '],
            ['descripcion'=>'Head Trader'],
            ['descripcion'=>'Compliance Analyst'],
            ['descripcion'=>'BO FCI Analyst'],
            ['descripcion'=>'BO Treasury Analyst'],
            ['descripcion'=>'BO Securities Analyst'],
            ['descripcion'=>'Compliance Assistant'],
            ['descripcion'=>'Senior Compliance - 201874'],
            ['descripcion'=>'BO Purchase Analyst'],
            ['descripcion'=>'BO Securities Analyst'],
            ['descripcion'=>'Assistant'],
            ['descripcion'=>'Senior Accountant'],
            ['descripcion'=>'Senior Accounting Analyst '],
            ['descripcion'=>'Accounting Assistant'],
            ['descripcion'=>'Tax Analyst '],
            ['descripcion'=>'Assistant '],
            ['descripcion'=>'HR-Analyst'],
            ['descripcion'=>'Senior Analyst '],
            ['descripcion'=>'Semi-Senior Analyst '],
            ['descripcion'=>'Team Leader'],
            ['descripcion'=>'Legal Assistant '],
            ['descripcion'=>'Assistant General Counsel'],
            ['descripcion'=>'Legal Counsel'],
            ['descripcion'=>'IT Development Team Lead'],
            ['descripcion'=>'IT SSr Developer'],
            ['descripcion'=>'Help Desk&Infra Senior Analyst '],
            ['descripcion'=>'Help Desk&Infra Team Lead'],
            ['descripcion'=>'IT Development Manager'],
            ['descripcion'=>'Head of IT Argentina'],
            ['descripcion'=>'Manager Accounting'],
            ['descripcion'=>'Director'],
            ['descripcion'=>'Risk Management Consultant'],
            ['descripcion'=>'Gerente de Operaciones & Compliance'],
            ['descripcion'=>'Head of Operations'],
            ['descripcion'=>'Secretary '],
            ['descripcion'=>'Marketing and Institutional Relation']
        ];

        Puesto::insert($puestos);
    }
}
