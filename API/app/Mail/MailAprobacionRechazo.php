<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;


class MailAprobacionRechazo extends Mailable
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

        return $this->subject(($this->alta->Estado->codigo=="REC" ? 'Alta Rechazada' : 'Alta Aprobada'))
            ->view('email.alta_aprobada_rechazada')
            ->with(['alta' => $this->alta]);
    }
}
