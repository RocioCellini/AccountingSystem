<?php

namespace App\Console\Commands;

use App\Mail\MailInvitacion;
use App\Mail\MailNuevaAltaPendienteAprobacion;
use App\Models\Fondo;
use App\Models\Oficial;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class MailBienvenida extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:bienvenida';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
       $users = User::whereId(2)->get();

       foreach($users as $user){
           $password = mt_rand(100000,999999);
           $user->password = Hash::make($password);
           $user->save();

           Mail::to($user->email)->send(new MailInvitacion($user,$password));
       }

        return 0;
    }
}
