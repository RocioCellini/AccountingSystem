<?php

namespace App\Http\Requests;

use App\Rules\ValidarEdad;
use App\Rules\ValidarFechaIngreso;
use App\Rules\ValidarLegajoSunUnique;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmpleadoRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'id' => 'required|exists:empleados,id',
            'subsegmento_id' => 'nullable|exists:subsegmentos,id',
            'es_comercial' => 'required|boolean',
            //'legajo_sun' => ['nullable',new ValidarLegajoSunUnique($this->get('id'))],
        ];
    }


    public function messages()
    {
        return [
            'id.required' => '* Obligatorio *',
            'id.exists' => '* Invalido *',
            'subsegmento_id.exists' => '* Obligatorio *',
            'apellido.regex' => '* Invalido *',
        ];
    }
}
