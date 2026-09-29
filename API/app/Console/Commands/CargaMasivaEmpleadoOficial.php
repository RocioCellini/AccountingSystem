<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CargaMasivaEmpleadoOficial extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cargar:empleadoOficial {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Carga masiva de tabla empleado_oficial';

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
        $controller = app()->make('App\Http\Controllers\ComisionesController');       
        app()->call([$controller, 'cargaEmpleadoOficial'], ['file' => $file]);   
       
        return;
    }
}
