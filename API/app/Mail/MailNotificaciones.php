<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;


class MailNotificaciones extends Mailable
{
    use Queueable, SerializesModels;

    private $altas;
    private $incrementos;
    private $horasExtras;
    private $bonosSemestrales;
    private $bonosTrimestrales;
    private $gratificaciones;
    private $comisiones;

    public function __construct($altas, $incrementos, $horasExtras, $bonosSemestrales, $bonosTrimestrales, $gratificaciones, $comisiones)
    {
        $this->altas=$altas;
        $this->incrementos=$incrementos;
        $this->horasExtras=$horasExtras;
        $this->bonosSemestrales=$bonosSemestrales;
        $this->bonosTrimestrales=$bonosTrimestrales;
        $this->gratificaciones=$gratificaciones;
        $this->comisiones=$comisiones;
    }

    public function build()
    {


        return $this->subject("Novedades pendientes de Revision")
            ->view('email.novedades')
            ->with(['altas' => $this->altas,
                    'incrementos'=>$this->incrementos,
                    'horasExtras'=>$this->horasExtras,
                    'bonosSemestrales'=>$this->bonosSemestrales,
                    'bonosTrimestrales'=>$this->bonosTrimestrales,
                    'gratificaciones'=>$this->gratificaciones,
                    'comisiones'=>$this->comisiones
                ]);
    }
}
