<?php

namespace App\Http\Requests;

use App\Rules\ValidarEdad;
use App\Rules\ValidarFechaIngreso;
use Illuminate\Foundation\Http\FormRequest;

class AltasRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'nombre' => 'required',
            'apellido' => 'required',
            'titulo_puesto' => 'required',
            'plan_osde' => 'required',
            'documento' => 'required|regex:/^[0-9]*$/',
            'sector_id'=>'required|numeric|exists:sectores,id',
            'empresa_id'=>'required|numeric|exists:empresas,id',
            'puesto_id'=>'required|numeric|exists:puestos,id',
            //'padre_id'=>'required|numeric|exists:empleados,id',
            'sueldo_bruto'=>'required|numeric|min:0|max:99999999',
            'bono_semestral'=>'numeric|min:0|max:100',
            'dias_vacaciones'=>'numeric|min:0|max:35',
            'fecha_nacimiento' => ['required',new ValidarEdad()],
            'fecha_ingreso' => ['required',new ValidarFechaIngreso()],
        ];
    }


    public function messages()
    {
        return [
            'nombre.required' => '* Obligatorio *',
            'nombre.regex' => '* Invalido *',
            'apellido.required' => '* Obligatorio *',
            'apellido.regex' => '* Invalido *',
            'titulo_puesto.required' => '* Obligatorio *',
            'titulo_puesto.regex' => '* Invalido *',
            'plan_osde.required' => '* Obligatorio *',
            'plan_osde.regex' => '* Invalido *',
            'documento.required' => '* Obligatorio *',
            'documento.regex' => '* Invalido *',
            'sector_id.required' => '* Obligatorio *',
            'sector_id.numeric' => '* Invalido *',
            'sector_id.exists' => '* Invalido *',
            'empresa_id.required' => '* Obligatorio *',
            'empresa_id.numeric' => '* Invalido *',
            'empresa_id.exists' => '* Invalido *',
            'puesto_id.required' => '* Obligatorio *',
            'puesto_id.numeric' => '* Invalido *',
            'puesto_id.exists' => '* Invalido *',
            'padre_id.required' => '* Obligatorio *',
            'padre_id.numeric' => '* Invalido *',
            'padre_id.exists' => '* Invalido *',
            'sueldo_bruto.required' => '* Obligatorio *',
            'sueldo_bruto.numeric' => '* Invalido *',
            'sueldo_bruto.min' => '* Supera el minimo *',
            'sueldo_bruto.max' => '* Supera el maximo *',
            'dias_vacaciones.required' => '* Obligatorio *',
            'dias_vacaciones.numeric' => '* Invalido *',
            'dias_vacaciones.min' => '* Supera el minimo *',
            'dias_vacaciones.max' => '* Supera el maximo *',
            'bono_semestral.required' => '* Obligatorio *',
            'bono_semestral.numeric' => '* Invalido *',
            'bono_semestral.min' => '* Supera el minimo *',
            'bono_semestral.max' => '* Supera el maximo *',
            'fecha_nacimiento.required' => '* Obligatorio *',
            'fecha_nacimiento.date_format' => '* Invalido *',
            'fecha_ingreso.required' => '* Obligatorio *',
            'fecha_ingreso.date_format' => '* Invalido *',

        ];
    }
}
