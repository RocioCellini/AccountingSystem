<?php

namespace App\Http\Controllers;

use App\Models\CentroCosto;
use App\Models\CuentaContable;
use App\Models\Empleado;
use App\Models\Empresa;
use App\Models\Liquidacion;
use App\Models\LlaveDistribucion;
use App\Models\LlaveDistribucionCentroCosto;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CuentasContablesController extends Controller
{

    public function getAll()
    {
        try{
            $cuentas = CuentaContable::orderBy('descripcion','asc')->get();
            $cuentas->load(['Empresa','CentroCosto']);
        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener las cuentas. '.$ex, 500);
        }

        return $this->successResponse(['cuentas'=>$cuentas], 200);
    }

    public function asignar(Request $request)
    {
        CuentaContable::whereId($request->id)->update(['centro_costo_id'=>$request->centro_costo_id,'concepto'=>$request->concepto]);
        return $this->getAll();
    }

    public function getConceptos()
    {
        try{
            $conceptos = [
                ["codigo"=>'SUELDOS', "descripcion"=>'Sueldos', ],
                ["codigo"=>'SAC', "descripcion"=>'SAC', ],
                ["codigo"=>'VAC', "descripcion"=>'Vacaciones', ],
                ["codigo"=>'CCSS', "descripcion"=>'Cargas Sociales', ],
                ["codigo"=>'GRATIF', "descripcion"=>'Gratificaciones', ],
                ["codigo"=>'CCSS_GRATIF', "descripcion"=>'Cargas Sociales s/Gratificaciones', ],

                ["codigo"=>'CONTRAPARTE_SUELDOS_SUELDO', "descripcion"=>'Contrapartida Sueldos - Sueldo', ],
                ["codigo"=>'CONTRAPARTE_SUELDOS_CARGAS', "descripcion"=>'Contrapartida Sueldos - CCSS', ],
                ["codigo"=>'CONTRAPARTE_SUELDOS_GANANCIAS', "descripcion"=>'Contrapartida Sueldos - Ganancias', ],
                ["codigo"=>'CONTRAPARTE_SAC', "descripcion"=>'Contrapartida SAC', ],
                ["codigo"=>'CONTRAPARTE_VAC', "descripcion"=>'Contrapartida Vacaciones', ],
                ["codigo"=>'CONTRAPARTE_CCSS', "descripcion"=>'Contrapartida Cargas Sociales', ],
                ["codigo"=>'CONTRAPARTE_GRATIF', "descripcion"=>'Contrapartida Gratificaciones', ],
                ["codigo"=>'CONTRAPARTE_CCSS_GRATIF', "descripcion"=>'Contrapartida Cargas Sociales s/Gratificaciones', ],
            ];

            $liquidaciones = Liquidacion::distinct("concepto")->pluck('concepto');
            foreach($liquidaciones as $liq){
                $conceptos[] = [
                    'codigo'=>$liq,
                    'descripcion'=>$liq
                ];
            }

        }catch(\Exception $ex){
            return $this->errorResponse('Error al obtener los conceptos. '.$ex, 500);
        }

        return $this->successResponse(['conceptos'=>$conceptos], 200);
    }


}
