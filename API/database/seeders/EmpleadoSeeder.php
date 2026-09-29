<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;

class EmpleadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $empleados =[
            ['nombre_apellido'=>'Roberto Salas','fecha_nacimiento'=>'1980-03-12','documento'=>31245542,'plan_osde'=>'Osde 210','titulo_puesto'=>'Gerente','fecha_ingreso'=>'2020-03-04','fecha_baja'=>'','sueldo_bruto'=>5000000,'dias_vacaciones'=>14,'bono_semestral'=>0,'puesto_id'=>12,'empresa_id'=>1,'sector_id'=>3,'padre_id'=>null,'es_comercial'=>0,'email'=>'roberto@gmail.com','subsegmento_id'=>1,'repite_bono_semestral'=>0,'nunca_liquido_bonus'=>0,'llave_distribucion_id'=>1,'meses_reconocidos'=>0,'tipo_empleado'=>null],
            ['nombre_apellido'=>'Maria Ojeda','fecha_nacimiento'=>'1980-03-12','documento'=>31245542,'plan_osde'=>'Osde 210','titulo_puesto'=>'Empleado','fecha_ingreso'=>'2020-03-04','fecha_baja'=>'','sueldo_bruto'=>5000000,'dias_vacaciones'=>14,'bono_semestral'=>0,'puesto_id'=>13,'empresa_id'=>1,'sector_id'=>3,'padre_id'=>null,'es_comercial'=>0,'email'=>'maria@gmail.com','subsegmento_id'=>1,'repite_bono_semestral'=>0,'nunca_liquido_bonus'=>0,'llave_distribucion_id'=>1,'meses_reconocidos'=>0,'tipo_empleado'=>null],
            ['nombre_apellido'=>'Cristian Perez','fecha_nacimiento'=>'1980-03-12','documento'=>31245542,'plan_osde'=>'Osde 210','titulo_puesto'=>'Empleado','fecha_ingreso'=>'2020-03-04','fecha_baja'=>'','sueldo_bruto'=>5000000,'dias_vacaciones'=>14,'bono_semestral'=>0,'puesto_id'=>14,'empresa_id'=>1,'sector_id'=>3,'padre_id'=>null,'es_comercial'=>0,'email'=>'cristian@gmail.com','subsegmento_id'=>1,'repite_bono_semestral'=>0,'nunca_liquido_bonus'=>0,'llave_distribucion_id'=>1,'meses_reconocidos'=>0,'tipo_empleado'=>null]           
        ];

        Empleado::insert($empleados);
    }
}