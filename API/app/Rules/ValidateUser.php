<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class ValidateUser implements Rule
{
    protected $message;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->message = null;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $status = false;
        $pos = strpos($value, '@');
        if($pos!== false){
            $user = User::where('email',strtolower($value))->first();
            if ($user != null){
                if($user->active == 1 || $user->active == null){
                    $status = true;
                }else{
                    $this->message = 'El usuario esta inactivo';
                }
            }else{
                $this->message = 'El usuario no existe la base de datos';
            }
        }else{
            $this->message = 'El valor ingresado no es un email';
        }
        return $status;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->message;
    }
}
