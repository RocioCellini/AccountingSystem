<?php

namespace App\Http\Requests;

use App\Rules\ValidarEdad;
use App\Rules\ValidarFechaIngreso;
use Illuminate\Foundation\Http\FormRequest;

class CuotapartistaRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'oficial_id'=>'required|numeric|exists:oficiales,id',
            'porcentaje'=>'required|numeric|min:0|max:100',
        ];
    }


    public function messages()
    {
        return [
            'descripcion.required' => '* Obligatorio *',
            'descripcion.regex' => '* Invalido *',
            'oficial_id.required' => '* Obligatorio *',
            'oficial_id.numeric' => '* Obligatorio *',
            'oficial_id.exists' => '* Invalido *',
            'porcentaje.required' => '* Obligatorio *',
            'porcentaje.numeric' => '* Invalido *',
            'porcentaje.min' => '* Supera el minimo *',
            'porcentaje.max' => '* Supera el maximo *',
        ];
    }
}
