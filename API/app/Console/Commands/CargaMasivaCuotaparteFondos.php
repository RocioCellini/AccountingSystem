<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CargaMasivaCuotaparteFondos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cargar:cuotapartistaFondos {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Carga masiva de tabla cuotapartista_fondos';

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
        $file = $this->argument('file');   
        $controller = app()->make('App\Http\Controllers\CuotapartistasController');       
        app()->call([$controller, 'cargaCuotapartistaFondos'], ['file' => $file]);   
       
        return;
    }
}
