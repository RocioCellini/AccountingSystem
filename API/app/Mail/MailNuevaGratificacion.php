<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;


class MailNuevaGratificacion extends Mailable
{
    use Queueable, SerializesModels;

    private $empleado;
    private $gratificacion;

    public function __construct($empleado,$gratificacion)
    {
        $this->empleado = $empleado;
        $this->gratificacion = $gratificacion;
    }

    public function build()
    {

        return $this->subject('Nuevo Gratificacion Especial pendiente de Aprobacion')
            ->view('email.nueva_gratificacion')
            ->with(['empleado' => $this->empleado, 'gratificacion'=>$this->gratificacion]);
    }
}
