<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Rol;
use App\Models\User;
use App\Models\Empleado;
use App\Mail\MailInvitacion;
use App\Models\Notificacion;
use Illuminate\Http\Request;
use App\Exports\UsuariosExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function login(Request $request)
    {
        try{
            if (Auth::attempt(['email' => strtolower(request('email')), 'password' => request('password')])) {
                $user = Auth::user();
                $user->load('Rol','Empleado');
                //$user->token = 'TEST_TOKEN';  
                $token = $user->createToken('AccountingSystem')->accessToken;
                
                $user->token = $token;
                $response = $user;
            } else {
                return $this->errorResponse('Usuario o Password Incorrecto.', 401);
            }
        }catch(\Exception $ex){
            Log::info($ex);
            return $this->errorResponse('Error al loguearse. '.$ex, 500);
        }

        return $this->successResponse($response, 200);
    }

    public function changePassword(Request $request)
    {
        try{
            $user = User::whereId(Auth::id())->first();
            $user->password = Hash::make($request->password);
            $user->save();
            $user->load(['Rol','Empleado']);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al cambiar la contraseña. '.$ex, 500);
        }

        return $this->successResponse($user, 200);
    }

    public function myInfo()
    {
        try{
            $user = User::whereId(Auth::id())->first();
            $user->load(['Rol','Empleado']);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener la información. '.$ex, 500);
        }

        return $this->successResponse($user, 200);
    }

    public function getAll()
    {
        try{
            ini_set('max_execution_time', 0);
            $users = User::withTrashed()->get();
            $users->load(['Rol','Empleado']);
            $roles = Rol::get();
            $empleados=Empleado::orderBy('nombre_apellido','asc')->get();
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los usuarios. '.$ex, 500);
        }

        return $this->successResponse(['users'=>$users,'roles'=>$roles,'empleados'=>$empleados], 200);
    }

    public function save(Request $request)
    {
        $user = User::whereId($request->id)->first();
        if(isset($user)){
            $user->name=$request->name;
            $user->email=strtolower($request->email);
            $user->rol_id=$request->rol_id;
            $user->empleado_id=$request->empleado_id;
            if(isset($request->password) && $request->password!=''){
                $user->password=Hash::make($request->password);
            }

            $user->save();
        } else {
            $user = User::create([
                'name'=>$request->name,
                'email'=>strtolower($request->email),
                'rol_id'=>$request->rol_id,
                'password'=>Hash::make($request->password),
                'empleado_id'=>$request->empleado_id,
            ]);


            $users = User::whereIn('rol_id',Rol::whereIn('codigo',['SU','RRHH'])->pluck('id'))->get();
            foreach($users as $us){
                Notificacion::create([
                    'user_id' => $us->id,
                    'texto' => 'Se creo el usuario ' . $user->name . ' con el rol ' . $user->Rol->descripcion,
                    'tipo' => 'success'
                ]);
            }
        }

        return $this->getAll();
    }

    public function delete(Request $request)
    {
        $userCambio = User::whereId($request->user_id)->first();
        $userCambio->delete();

        $users = User::whereIn('rol_id',Rol::whereIn('codigo',['SU','RRHH'])->pluck('id'))->get();
        foreach($users as $user){
            Notificacion::create([
                'user_id' => $user->id,
                'texto' => 'Se inhabilito el usuario ' . $userCambio->name . ' con el rol ' . $userCambio->Rol->descripcion,
                'tipo' => 'danger'
            ]);
        }

        return $this->getAll();
    }


    public function restore(Request $request)
    {
        $userCambio = User::withTrashed()->whereId($request->user_id)->first();
        $userCambio->restore();


        $users = User::whereIn('rol_id',Rol::whereIn('codigo',['SU','RRHH'])->pluck('id'))->get();
        foreach($users as $user){
            Notificacion::create([
                'user_id' => $user->id,
                'texto' => 'Se rehabilito el usuario ' . $userCambio->name . ' con el rol ' . $userCambio->Rol->descripcion,
                'tipo' => 'success'
            ]);
        }

        return $this->getAll();
    }

    public function recuperarContrasena(Request $request){
        $password = mt_rand(100000,999999);

        $user = User::whereEmail($request->email)->first();
        $user->password = Hash::make($password);
        $user->save();

        Mail::to($user->email)->send(new MailInvitacion($user,$password));
    }
    /**
     * Obtiene un listado de los usuarios del aplicativo.
     *
     * Este método retorna un objeto json el cual tiene un listado de usuarios ordenado por nombre. En tal listado
     * se muestra el nombre del usuario, el email, el rol y su estado.
     *
     * @version 1.0 versión inicial
     * @return JsonResponse
     */
    public function getUsers(){

        try{
            $usuarios = $this->listOfUsers();

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener el listado de usuarios. '.$ex, 500);
        }
        return $this->successResponse($usuarios, 200);

    }

    /**
     * Obtiene un path para la descarga de un archivo con los usuarios.
     *
     * Este método retorna un objeto json el cual tiene dos campos. Uno de los campos, indica el path a donde
     * se ha generado el archivo Excel con el listado de usuarios y el otro campo, indica el estado del proceso.
     * El directorio para los archivos es /public/exportaciones/nombre_de_archivo_timestamps.xls
     *
     * @version 1.0 versión inicial
     * @return JsonResponse
     */
    public function exportUsers(){

        try{
            $usuarios = $this->listOfUsers();
            $filename = 'Listado_de_Usuarios_'.Carbon::now()->format('Ymd_his').'.xlsx';
            Excel::store(new UsuariosExport($usuarios), '/exportaciones/' . $filename,'public');
            $ruta = url('/exportaciones/' . $filename);

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener el archivo. '.$ex, 500);
        }
        return $this->successResponse($ruta, 200);

    }

    /**
     * Obtiene un listado de usuarios
     *
     * Este método retorna un arreglo con los usuarios del aplicativo. Para generar el arreglo, se considera el
     * campo status para determinar si esta activo o no y en caso de ser null el valor, se asigna el valor 0. Luego
     * por una cuestión de orden y formato, se convierte la collection de Laravel a un arreglo, personalizando el
     * nombre del campo y ajustando el tipo de datos de cada campo.
     *
     * @version 1.0 versión inicial
     * @return array
     */
    protected function listOfUsers(): array{
        $usuarios = User::query();
        $usuarios = $usuarios->select(
            'name',
            'email',
            DB::raw('ISNULL (users.active,0) AS status'),
            'r.descripcion');
        $usuarios = $usuarios->leftJoin('roles as r','rol_id','r.id');
        $usuarios = $usuarios->orderBy('name','ASC');
        $usuarios = $usuarios->get()->toArray();

        $usuarios = array_map(function($usuario) {
            return [
                'Nombre' => ucwords(strtolower($usuario['name'])),
                'Email' => $usuario['email'],
                'Rol' => ucwords(strtolower($usuario['descripcion'])),
                'Estado' => $usuario['status'] == 1 ? 'Activo' : 'Inactivo',
            ];
        }, $usuarios);

        return $usuarios;
    }

}
