<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rol_su = Rol::where('descripcion','Super User')->first();
        $rol_su = $rol_su->id;
        $rol_rrhh = Rol::where('descripcion','Recursos Humanos')->first();
        $rol_rrhh = $rol_rrhh->id;

        $usuarios =[
            ['name'=>'Romina Gonzalez','email'=>'romina.gonzalez@gmail.com','email_verified_at'=>null,'password'=>'$2y$10$iQkxsK8aLY22tEhxU0yuyuqRa7oneg2oxmjcpctUwgdazcMOAiiYe','remember_token'=>null,'rol_id'=>$rol_rrhh,'empleado_id'=>null,'created_by'=>null,'updated_by'=>null,'active'=>1],
            ['name'=>'Claudia Perotti','email'=>'claudia.perotti@gmail.com','email_verified_at'=>null,'password'=>'$2y$10$i2tjw2h0lP26rmk6LOtdMug/DVYi.66edXPUYdNXuI8mfoWZNngWe','remember_token'=>null,'rol_id'=>$rol_rrhh,'empleado_id'=>null,'created_by'=>null,'updated_by'=>null,'active'=>1],
            ['name'=>'Martín Fernández','email'=>'martin.fernandez@gmail.com','email_verified_at'=>null,'password'=>'$2y$10$Mg44JBrE/ar.jJ4sxRYKqeRzBBk4DjGdsrOH18QTDPfY8LCv6HfxG','remember_token'=>null,'rol_id'=>$rol_su,'empleado_id'=>null,'created_by'=>null,'updated_by'=>null,'active'=>1],
            ['name'=>'Soledad Rivero','email'=>'soledad.rivero@gmail.com','email_verified_at'=>null,'password'=>'$2y$10$.BONb3ZjwbnoFeybEoKeVuz969IUeCAPAGxI9kPD9TpkQueWbNsSu','remember_token'=>null,'rol_id'=>$rol_su,'empleado_id'=>null,'created_by'=>null,'updated_by'=>null,'active'=>1],
            ['name'=>'Pablo Carnota','email'=>'pablo.carnota@gmail.com','email_verified_at'=>null,'password'=>'$2y$10$.BONb3ZjwbnoFeybEoKeVuz969IUeCAPAGxI9kPD9TpkQueWbNsSu','remember_token'=>null,'rol_id'=>$rol_su,'empleado_id'=>null,'created_by'=>null,'updated_by'=>null,'active'=>1]
        ];

        foreach ($usuarios as $user) {

            $usuario = User::where('email',$user['email'])->first();
            if($usuario == null){
                $usuario = new User();
            }
            $usuario->name = $user['name'];
            $usuario->email = $user['email'];
            $usuario->email_verified_at = $user['email_verified_at'];
            $usuario->password = $user['password'];
            $usuario->remember_token = $user['remember_token'];
            $usuario->created_at = Carbon::now()->toDateTimeString();
            $usuario->updated_at = Carbon::now()->toDateTimeString();
            $usuario->deleted_at = null;
            $usuario->rol_id = $user['rol_id'];
            $usuario->empleado_id = $user['empleado_id'];
            $usuario->created_by = $user['created_by'];
            $usuario->updated_by = $user['updated_by'];
            $usuario->active = $user['active'];
            $usuario->save();
        }
    }
}
