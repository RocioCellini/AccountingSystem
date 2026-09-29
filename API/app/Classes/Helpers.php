<?php


namespace App\Classes;


use Illuminate\Support\Facades\Validator;

class Helpers
{
    public static function validateWithRequest ($data, $requestModel){
        $rules = $requestModel->rules();
        $message = $requestModel->messages();
        $validation = Validator::make($data,$rules,$message);
        if( $validation->fails()){
            $errors =$validation->errors()->getMessages();
            return $errors;
        }
        return [];
    }
}
