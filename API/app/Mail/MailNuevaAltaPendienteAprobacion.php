<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;


class MailNuevaAltaPendienteAprobacion extends Mailable
{
    use Queueable, SerializesModels;

    private $alta;
    private $path;

    public function __construct($alta)
    {
        $this->alta = $alta;
    }

    public function build()
    {

        return $this->subject("Alta Pendiente de Aprobacion")
            ->view('email.alta_pendiente_de_aprobacion')
            ->with(['alta' => $this->alta]);
    }
}
