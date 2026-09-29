<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;


class MailInvitacion extends Mailable
{
    use Queueable, SerializesModels;

    private $user;
    private $password;

    public function __construct($user,$password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function build()
    {

        return $this->subject('Bienvenido a AccountingSystem')
            ->view('email.bienvenida')
            ->with(['user' => $this->user, 'password'=>$this->password]);
    }
}
