<?php

namespace App\Http\Requests;

use App\Rules\ValidarEdad;
use App\Rules\ValidarFechaIngreso;
use Illuminate\Foundation\Http\FormRequest;

class AltasNominaRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }


    public function rules()
    {
        return [
            'id'=>'required|numeric|exists:altas,id',
            'legajo_bejerman' => 'required|regex:/^[0-9]*$/',
            //'legajo_sun' => 'required|regex:/^[0-9]*$/',
        ];
    }


    public function messages()
    {
        return [
            'id.required' => '* Obligatorio *',
            'id.numeric' => '* Invalido *',
            'id.exists' => '* Invalido *',
            'legajo_bejerman.required' => '* Obligatorio *',
            'legajo_bejerman.regex' => '* Invalido *',
            'legajo_sun.required' => '* Obligatorio *',
            'legajo_sun.regex' => '* Invalido *',

        ];
    }
}
