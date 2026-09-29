<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;


class MailNuevoIncremento extends Mailable
{
    use Queueable, SerializesModels;

    private $empleado;
    private $novedad;

    public function __construct($empleado,$novedad)
    {
        $this->empleado = $empleado;
        $this->novedad = $novedad;
    }

    public function build()
    {

        return $this->subject('Nuevo Incremento pendiente de Aprobacion')
            ->view('email.nuevo_incremento')
            ->with(['empleado' => $this->empleado, 'novedad'=>$this->novedad]);
    }
}
